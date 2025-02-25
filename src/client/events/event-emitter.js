var customEvents = {}
setTimeout(()=>{
    customEvents['draginit'] = customEvents['drag'] = customEvents['dragend']  = require('./drag')
    customEvents['resize']  = require('./resize')
    customEvents['wheel']  = require('./dom-event')('wheel')
    customEvents['scroll']  = require('./dom-event')('scroll', {capture: true})
    customEvents['click']  = require('./dom-event')('click')
    customEvents['fast-click']  = require('./dom-event')('fast-click')
    customEvents['focus']  = require('./dom-event')('focus', {capture: true})
    customEvents['blur']  = require('./dom-event')('blur', {capture: true})
    customEvents['change']  = require('./dom-event')('change')
})

// micro optimisation from eventemitter3
var has = Object.prototype.hasOwnProperty

module.exports = class EventEmitter {

    constructor() {

        this._customBindings = {}
        this._listeners = {}

        for (var evt in customEvents) {
            this._customBindings[evt] = 0
        }

    }

    trigger(evt, data) {

        if (has.call(this._listeners, evt)) {
            // shallow copy in case a listener gets added/removed while looping
            var listeners = this._listeners[evt].slice(0)
            for (var i = 0, len = listeners.length; i !== len; i++) {
                listeners[i](data)
            }
        }

        // Event bubbling
        // DOM events won't buttle
        // Virtual events will unless data.stopPropagation is set
        if (!data || !data.stopPropagation) {
            if (this.parent) this.parent.trigger(evt, data)
        }

        return this

    }

    on(evt, listener, options) {

        if (options) {

            // Custom event setup
            if (has.call(customEvents, evt)) {
                this._customBindings[evt]
                if (this._customBindings[evt] === 0) {
                    listener._options = options
                    customEvents[evt].setup.call(this, options)
                }
                this._customBindings[evt]++
            }

            // Context storing
            if (options.context) listener._context = options.context

        }

        // Add listener
        if (!has.call(this._listeners, evt)) this._listeners[evt] = []

        var listeners = this._listeners[evt]

        if (listeners.indexOf(listener) === -1) listeners.push(listener)

        return this

    }

    off(evt, listener, context) {

        // Remove listener
        if (evt && has.call(this._listeners, evt)) {

            var listeners = this._listeners[evt]

            if (listener) {

                var index = listeners.indexOf(listener)

                if (index !== -1) {

                    if (context && context !== listener._context) return this

                    listeners.splice(index, 1)

                    // Custom event teardown
                    if (has.call(customEvents, evt)) {

                        if (this._customBindings[evt] !== 0) {
                            this._customBindings[evt]--
                            if (this._customBindings[evt] === 0) {
                                customEvents[evt].teardown.call(this, listener._options)
                                delete listener._options
                            }
                        }

                    }

                }

            } else {

                for (var i = listeners.length - 1; i !== -1; i--) {

                    if (!context || context == listeners[i]._context) {
                        this.off(evt, listeners[i], context)
                    }

                }

            }

        } else if (!evt) {

            for (var k in this._listeners) {
                this.off(k, undefined, context)
            }

        }

        return this

    }

}
