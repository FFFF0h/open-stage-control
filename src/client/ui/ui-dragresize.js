var UiWidget = require('./ui-widget'),
    keyboardJS = require('keyboardjs/dist/keyboard.min.js'),
    html = require('nanohtml'),
    Tab, Root

class UiDragResize extends UiWidget {

    constructor(options) {

        Tab = require('../widgets/containers/tab')
        Root = require('../widgets/containers/root')

        super(options)

        this.container = html`
            <div id="drag-resize">
                <div class="helper"></div>
                <div class="no-widget-select handle nw" data-action="left,top"></div>
                <div class="no-widget-select handle e" data-action="width"></div>
                <div class="no-widget-select handle s" data-action="height"></div>
                <div class="no-widget-select handle se" data-action="width,height"></div>
            </div>
        `


        this.initLeft = 0
        this.initTop = 0
        this.initWidth = 0
        this.initHeight = 0

        this.left = 0
        this.top = 0
        this.width = 0
        this.height = 0

        this.widgets = []
        this.mounted = false

        this.handles = DOM.get(this.container, '.handle')
        this.dragging = null

        this.on('draginit', (event)=>{

            var node = event.firstTarget
            if (event.shiftKey || !this.handles.includes(node)) return

            this.initLeft = this.left
            this.initTop = this.top
            this.initWidth = this.width
            this.initHeight = this.height
            this.matrix = ''

            this.container.classList.add('dragging')
            this.dragging = node.getAttribute('data-action').split(',')
            delete event.traversingStack
            delete event.traversing

        }, {element: this.container})

        this.on('drag', (event)=>{

            if (!this.dragging) return

            for (var k of this.dragging) {

                switch (k) {
                    case 'left':
                    case 'width':
                        this[k] += event.movementX / PXSCALE
                        break
                    case 'top':
                    case 'height':
                        this[k] += event.movementY / PXSCALE
                        break

                }

            }

            this.updateCss(true)


        }, {element: this.container})


        this.on('dragend', (event)=>{

            var node = event.firstTarget
            if (!this.handles.includes(node)) return

            this.container.classList.remove('dragging')
            this.left = Math.max(0, this.left)
            this.top = Math.max(0, this.top)
            this.trigger(this.dragging.indexOf('left') > -1 ? 'move' : 'drag-resize', this)
            this.dragging = null

        }, {element: this.container})

        window.addEventListener('resize', ()=>{
            if (this.mounted) this.updateRectangle()
        })

        // this.handles[0]._ignore_css_transforms = true

        keyboardJS.withContext('editing', ()=>{
            keyboardJS.bind('alt', (e)=>{
                this.handles[0].classList.add('full')
            }, (e)=>{
                this.handles[0].classList.remove('full')
            })
        })

    }

    clear() {

        if (!this.mounted) return

        this.container.parentNode.removeChild(this.container)
        this.mounted = false
        this.widgets = []


    }

    create(widgets) {

        this.clear()

        this.widgets = widgets.slice().filter(w=>w.getProp('visible') && !(w instanceof Tab) && !(w instanceof Root))

        if (!this.widgets.length) return

        this.updateRectangle()

        this.widgets[0].parentNode.appendChild(this.container)
        this.mounted = true


    }

    updateRectangle() {

        var widgets = this.widgets,
            widget = widgets[0]

        var handlesVisibility = [
            widget.parent.getProp('layout') === 'default', // nw
            widget.parent.getProp('layout').match(/horizontal|default/),                            // e
            widget.parent.getProp('layout').match(/vertical|default/),                          // s
        ]
        handlesVisibility.push(handlesVisibility[1] && handlesVisibility[2])           // se

        for (var i in handlesVisibility) {
            this.handles[i].style.display = handlesVisibility[i] ? '' : 'none'
        }

        var lefts = widgets.map(w => w.container.offsetLeft),
            tops = widgets.map(w => w.container.offsetTop),
            rights = widgets.map(w => w.container.offsetLeft + w.container.offsetWidth),
            bottoms = widgets.map(w => w.container.offsetTop + w.container.offsetHeight)

        this.left = Math.min(...lefts) / PXSCALE
        this.top = Math.min(...tops) / PXSCALE
        this.width = (Math.max(...rights) - Math.min(...lefts)) / PXSCALE
        this.height = (Math.max(...bottoms) - Math.min(...tops)) / PXSCALE

        // this.cssTransform = widget.cssTransform || 'none'
        // this.cssTransformOrigin = widget.cssTransformOrigin

        this.updateCss()

    }

    updateCss(grid) {

        for (let k of ['top', 'left', 'width', 'height']) {

            var val = this[k]

            if (k === 'width' || k === 'height') val = Math.max(10 * PXSCALE,  val)
            if (grid && this.dragging.includes(k)) {
                val = Math.round(val / GRIDWIDTH) * GRIDWIDTH
            }

            this.container.style.setProperty('--' + k, val  + 'rem')

            // this.container.style.transform = this.cssTransform
            // this.container.style.transformOrigin = this.cssTransformOrigin

        }

    }

}

module.exports = UiDragResize
