var widgetManager = require('../../managers/widgets'),
    stateManager = require('../../managers/state'),
    cache = require('../../managers/cache'),
    {deepCopy} = require('../../utils'),
    {urlParser} = require('../utils'),
    Vm = require('../vm'),
    toolbar,
    scriptGlobals = {empty:true}


class ScriptVm extends Vm {

    constructor() {

        super()

        this.valueOptions = []
        this.widget = []

    }

    getValueOptions() {

        return this.valueOptions[this.valueOptions.length - 1] || {send: true, sync: true}

    }

    setValueOptions(options) {

        if (!options) this.valueOptions.pop()
        else this.valueOptions.push(options)

    }

    setWidget(widget) {

        if (!widget) this.widget.pop()
        else this.widget.push(widget)

    }

    getWidget() {

        return this.widget[this.widget.length - 1]

    }

    resolveId(id) {

        var widget = this.getWidget()

        if (id === 'this') return [widget]
        else if (id === 'parent' && widget.parent !== widgetManager) return [widget.parent]
        else return widgetManager.getWidgetById(id)

    }

    checkContext(name) {
        if (this.widget.length === 0) throw name + '() cannot be called from outside the script property'
    }

    registerGlobals() {

        super.registerGlobals()

        this.sandbox.contentWindow.set = (id, value, extraOptions = {send: true, sync: true})=>{

            this.checkContext('set')

            var options = deepCopy(this.getValueOptions())
            options.fromScript = true
            if (options.dragged) options.dragged = false

            // if (id === options.id) options.sync = false // loop stop
            // if (this.getWidget() === options.widget) options.sync = false // loop stop

            if (extraOptions.send === false) options.send = false
            if (extraOptions.sync === false) options.sync = false
            if (extraOptions.script === false) options.script = false

            var widgets
            if (id.includes('*')) {
                var widget = this.getWidget()
                widgets = this.resolveId(
                    Object.keys(widgetManager.idRoute).filter(key => key.match(new RegExp('^' + id.replace(/\*/g, '.*') + '$')))
                ).filter(w => w !== widget)
            } else {
                widgets = this.resolveId(id).slice(0, 1)
            }


            for (var i = widgets.length - 1; i >= 0; i--) {

                widgets[i].setValue(value, options)

            }

        }

        this.sandbox.contentWindow.setVar = (id, name, value)=>{

            this.checkContext('setVar')

            var widgets
            if (id.includes('*')) {
                var widget = this.getWidget()
                widgets = this.resolveId(
                    Object.keys(widgetManager.idRoute).filter(key => key.match(new RegExp('^' + id.replace(/\*/g, '.*') + '$')))
                ).filter(w => w !== widget)
            } else {
                widgets = this.resolveId(id)
            }


            for (var i = widgets.length - 1; i >= 0; i--) {


                if (widgets[i].variables[name]) {

                    widgets[i].variables[name].value = value
                    widgets[i].variables[name].updated = 1
                    widgets[i].updateProps(widgets[i].variables[name].propNames)
                    widgets[i].variables[name].updated = 0

                } else {

                    widgets[i].variables[name] = {value: value, propNames: []}

                }

            }

        }

        this.sandbox.contentWindow.send = (target, address, ...args)=>{

            this.checkContext('send')

            var options = this.getValueOptions()

            if (!options.send) return

            if (target && target[0] === '/') {
                args.unshift(address)
                address = target
                target = null
            }

            var overrides = {
                address,
                v: args,
                preArgs: []
            }

            if (target) overrides.target = Array.isArray(target) ? target : [target]

            var widget = this.getWidget()

            widget.sendValue(overrides, {force: true})

        }

        this.sandbox.contentWindow.get = (id)=>{

            this.checkContext('get')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].getValue) {

                    var v = widgets[i].getValue()
                    if (v !== undefined) return v

                }

            }

        }

        this.sandbox.contentWindow.getVar = (id, name)=>{

            this.checkContext('getVar')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].variables[name]) return deepCopy(widgets[i].variables[name].value)

            }

        }

        this.sandbox.contentWindow.getProp = (id, prop)=>{

            this.checkContext('getProp')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                var v = widgets[i].getProp(prop)
                if (v !== undefined) return v

            }

        }

        this.sandbox.contentWindow.updateProp = (id, prop)=>{

            this.checkContext('updateProp')

            var widgets = this.resolveId(id),
                widget = this.getWidget()

            for (var i = widgets.length - 1; i >= 0; i--) {

                widgets[i].updateProps(Array.isArray(prop) ? prop : [prop], widget)

            }

        }

        this.sandbox.contentWindow.updateCanvas = (id)=>{

            this.checkContext('updateCanvas')

            var widgets = this.resolveId(id)
            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].batchDraw) widgets[i].draw()

            }

        }

        this.sandbox.contentWindow.getIndex = (id = 'this')=>{

            this.checkContext('getIndex')

            var widget = this.resolveId(id).pop()
            if (widget) return widget.parent.children.indexOf(widget)

        }

        this.sandbox.contentWindow.getScroll = (id)=>{

            this.checkContext('getScroll')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].getProp('scroll')) return widgets[i].getScroll()

            }

            return []

        }

        this.sandbox.contentWindow.setScroll = (id, x, y)=>{

            this.checkContext('setScroll')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].getProp('scroll')) widgets[i].setScroll(x, y)

            }

        }

        this.sandbox.contentWindow.httpGet = (url, callback)=>{

            this.checkContext('httpGet')

            var parser = urlParser(url),
                err = (e)=>{console.error(e)}

            if (!parser.isLocal()) return err('httpGet error (' + url + '): non-local url')

            var xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.onload = (e)=>{
                if (xhr.readyState === 4 && xhr.status === 200 && callback) {
                    callback(xhr.responseText)
                }
            }
            xhr.onerror = (e)=>err('httpGet error (' + url + '): ' + xhr.statusText)
            xhr.send(null)

        }

        this.sandbox.contentWindow.stateGet = (filter)=>{

            this.checkContext('stateGet')

            if (filter) {

                filter = Array.isArray(filter) ? filter : [filter]

                var containers = filter.map(x=>this.resolveId(x)).reduce((a,b)=>a.concat(b), [])

                if (!containers.length) return
                filter = (widget)=>{
                    return containers.some(x=>x.contains(widget) || x === widget)
                }
            }

            return deepCopy(stateManager.get(filter))

        }

        this.sandbox.contentWindow.stateSet = (state)=>{

            this.checkContext('stateSet')

            var options = this.getValueOptions()
            stateManager.set(state, options.send)

        }


        this.sandbox.contentWindow.storage = {

            setItem: (k, v)=>{
                this.checkContext('storage.setItem')
                cache.set('script.' + k, v)
            },
            getItem: (k)=>{
                this.checkContext('storage.getItem')
                return cache.get('script.' + k)
            },
            removeItem: (k)=>{
                this.checkContext('storage.removeItem')
                cache.remove('script.' + k)
            },
            clear: ()=>{
                this.checkContext('storage.clear')
                cache.clear('script.')
            }

        }

        this.sandbox.contentWindow.setTimeout = (id, callback, timeout)=>{

            this.checkContext('setTimeout')

            if (typeof id === 'function') {
                timeout = callback
                callback = id
                id = undefined
            }

            var widget = this.getWidget(),
                options = this.getValueOptions()


            if (widget.timeouts[id] !== undefined) {
                clearTimeout(widget.timeouts[id])
                delete widget.timeouts[id]
            }
            widget.timeouts[id] = setTimeout(()=>{
                this.setWidget(widget)
                this.setValueOptions(options)
                try {
                    callback()
                } catch(e) {
                    widget.errorProp('script', 'setTimeout', e)
                }
                this.setWidget()
                this.setValueOptions()
            }, timeout)

            return id

        }

        this.sandbox.contentWindow.clearTimeout = (id)=>{

            this.checkContext('clearTimeout')

            var widget = this.getWidget()

            clearTimeout(widget.timeouts[id])
            delete widget.timeouts[id]

        }

        this.sandbox.contentWindow.setInterval = (id, callback, timeout)=>{

            this.checkContext('setInterval')

            if (typeof id === 'function') {
                timeout = callback
                callback = id
                id = undefined
            }

            var widget = this.getWidget(),
                options = this.getValueOptions()


            if (widget.intervals[id] !== undefined) clearTimeout(widget.intervals[id])
            delete widget.intervals[id]

            widget.intervals[id] = setInterval(()=>{
                this.setWidget(widget)
                this.setValueOptions(options)
                try {
                    callback()
                } catch(e) {
                    widget.errorProp('script', 'setInterval', e)
                }
                this.setWidget()
                this.setValueOptions()
            }, timeout)

            return id

        }

        this.sandbox.contentWindow.clearInterval = (id)=>{

            this.checkContext('clearInterval')

            var widget = this.getWidget()

            clearInterval(widget.intervals[id])
            delete widget.intervals[id]

        }


        this.sandbox.contentWindow.setFocus = (id)=>{

            this.checkContext('setFocus')

            if (id) {
                var widgets = this.resolveId(id)

                if (widgets.length) {
                    setTimeout(()=>{

                        widgets[0].widget.focus()
                    })
                }
            }

            // built-in client only: electron will call window.focus()
            console.debug('ELECTRON.FOCUS()')

        }

        this.sandbox.contentWindow.unfocus = ()=>{

            this.checkContext('unfocus')

            window.blur()
            // built-in client only: electron will call window.blur()
            console.debug('ELECTRON.BLUR()')

        }

        this.sandbox.contentWindow.toolbar = (...args)=>{

            this.checkContext('toolbar')

            var options = this.getValueOptions()

            if (!options.send) return

            toolbar = toolbar || require('../../ui/main-menu')

            var action = toolbar.entries.filter(x=>!x.separator)

            for (var i of args) {
                if (action[i]) action = action[i].action
                if (!Array.isArray(action)) break
                action = action.filter(x=>!x.separator)
            }

            if (typeof action === 'function') action()

        }

        this.sandbox.contentWindow.openUrl = (url)=>{

            this.checkContext('openUrl')

            var options = this.getValueOptions()

            if (options.send) window.open(url, '_blank')

        }

        this.sandbox.contentWindow.runAs = (id, callback)=>{

            this.checkContext('runAs')

            var widgets = this.resolveId(id)

            if (widgets.length) {

                this.setWidget(widgets[0])
                try {
                    callback()
                } catch(e) {
                    widget.errorProp('script', 'runAs', e)
                }
                this.setWidget()

            }

        }

        this.sandbox.contentWindow.Image = Image

        for (var imports of ['set', 'get', 'getProp', 'getIndex', 'updateProp', 'send', 'httpGet', 'stateGet', 'stateSet', 'storage',
            'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'setFocus', 'unfocus', 'setScroll', 'getScroll', 'toolbar',
            'openUrl', 'getVar', 'setVar', 'runAs', 'Image', 'updateCanvas']) {
            this.sanitize(this.sandbox.contentWindow[imports])
        }

        if (scriptGlobals.empty){
            delete scriptGlobals.empty
            for (var k in this.sandbox.contentWindow) {
                if (window[k] === undefined) scriptGlobals[k] = true
            }
            ScriptVm.globals = scriptGlobals
        }

    }

}

module.exports = ScriptVm
