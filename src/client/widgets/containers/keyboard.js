var Panel = require('./panel'),
    Widget = require('../common/widget'),
    parser = require('../../parser')


class Keyboard extends Panel {

    static description() {

        return 'Piano keyboard.'

    }

    static defaults() {

        return Widget.defaults().extend({
            style: {
                _separator_keyboard_style: 'Keyboard style',
                colorWhite: {type: 'string', value: 'auto', help: 'White keys color.'},
                colorBlack: {type: 'string', value: 'auto', help: 'Black keys color.'},
            },
            class_specific: {
                keys: {type: 'number', value: 25, help: 'Defines the number keys'},
                start: {type: 'number', value: 48, help: [
                    'MIDI note number to start with (default is C4)',
                    'Standard keyboards settings are: `[25, 48]`, `[49, 36]`, `[61, 36]`, `[88, 21]`'
                ]},
                traversing: {type: 'boolean', value: true, help: 'Set to `false` to disable traversing gestures'},
                on: {type: '*', value: 1, help: [
                    'Set to `null` to send send no argument in the osc message',
                    'Can be an `object` if the type needs to be specified (see preArgs)'
                ]},
                off: {type: '*', value: 0, help: [
                    'Set to `null` to send send no argument in the osc message',
                    'Can be an `object` if the type needs to be specified (see preArgs)'
                ]},
                mode: {type: 'string', value: 'push', choices: ['push', 'toggle', 'tap'], help: [
                    'Interraction mode:',
                    '- `push` (press & release)',
                    '- `toggle` (on/off switches)',
                    '- `tap` (no release)'
                ]},
            }
        })

    }

    constructor(options) {

        super(options)

        this.childrenType = undefined
        this.value = []

        this.on('change',(e)=>{

            var widget = e.widget

            if (widget === this) return

            this.value[widget._index] = widget.getValue()

            if (e.options.send) {
                var start = parseInt(this.getProp('start'))
                this.sendValue({
                    v: [e.widget._index + start, widget.getValue() ? this.getProp('on') : this.getProp('off')]
                })
            }

            this.changed({
                ...e.options,
                id: widget.getProp('id')
            })


        })

        var start = parseInt(this.getProp('start')),
            keys = parseInt(this.getProp('keys'))

        var pattern = 'wbwbwwbwbwbw',
            whiteKeys = 0, whiteKeys2 = 0, i

        for (i = start; i < keys + start && i < 109; i++) {
            if (pattern[i % 12] == 'w') whiteKeys++
        }

        this.container.style.setProperty('--nkeys', whiteKeys)

        for (i = start; i < keys + start && i < 109; i++) {

            var data = {
                top: 'auto',
                left: 'auto',
                height: 'auto',
                width: 'auto',
                type: 'button',
                mode: this.getProp('mode'),
                id: this.getProp('id') + '/' + i,
                label: false,
                css: '',
                bypass: true,
                on: 1,
                off: 0,
            }

            var key = parser.parse({
                data: data,
                parentNode: this.widget,
                parent: this
            })

            key._index = i - start
            key.container.classList.add('not-editable')
            key.container.classList.add('key')

            if (pattern[i % 12] == 'w') {
                key.container.classList.add('white')
                whiteKeys2++
            } else {
                key.container.classList.add('black')
                key.container.style.setProperty('--rank', whiteKeys2)
            }

            this.value[i - start] = this.getProp('off')

        }

    }

    setValue(v, options={}) {

        if (!Array.isArray(v) || v.length !== 2) return
        if (v[1] !== this.getProp('on') && v[1] !== this.getProp('off')) return

        var start = parseInt(this.getProp('start'))
        this.children[v[0] - start].setValue(v[1] === this.getProp('on') ? 1 : 0, options)

    }

}


Keyboard.dynamicProps = Keyboard.prototype.constructor.dynamicProps.concat(
    'on',
    'off',
)

Keyboard.cssVariables = Keyboard.prototype.constructor.cssVariables.concat(
    {js: 'colorWhite', css: '--color-white-key'},
    {js: 'colorBlack', css: '--color-black-key'}
)

module.exports = Keyboard
