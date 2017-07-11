var _pads_base = require('./_pads_base'),
    Fader = require('./_fake_fader'),
    {clip, hsbToRgb, rgbToHsb} = require('../utils'),
    Input = require('../inputs/input')

var faderDefaults = Fader.defaults()

module.exports = class Rgb extends _pads_base {

    static defaults() {

        return {
            type:'rgb',
            id:'auto',
            linkId:'',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            input: true,
            css:'',

            _behaviour:'behaviour',

            snap:false,

            _osc:'osc',

            value:'',
            precision:0,
            address:'auto',
            touchAddress:'',
            preArgs:[],
            split:false,
            target:[]
        }

    }

    constructor(options) {

        super(options)

        this.split = this.getProp('split')?
                        typeof this.getProp('split') == 'object' && this.getProp('split').length == 3 ?
                            this.getProp('split')
                            : [this.getProp('address') + '/r', this.getProp('address') + '/g', this.getProp('address') + '/b']
                        : false

        this.hueWrapper = $(`<div class="hue-wrapper"></div>`).appendTo(this.widget)

        this.faders = {
            h: new Fader({props:{
                ...faderDefaults,
                id:'h',
                compact:true,
                pips:false,
                horizontal:true,
                snap:this.getProp('snap'),
                range:{min:0,max:360},
                precision:2
            }, cancelDraw: false}),
            s: new Fader({props:{
                ...faderDefaults,
                id:'s',
                compact:true,
                pips:false,
                horizontal:true,
                snap:this.getProp('snap'),
                range:{min:0,max:100},
                precision:2
            }, cancelDraw: true}),
            b: new Fader({props:{
                ...faderDefaults,
                id:'b',
                compact:true,
                pips:false,
                horizontal:false,
                snap:this.getProp('snap'),
                range:{min:0,max:100},
                precision:2
            }, cancelDraw: true})
        }

        this.value = []
        this.hsb = {h:0,s:0,b:0}

        this.wrapper.append(this.faders.s.widget)
        this.wrapper.append(this.faders.b.widget)

        this.hueWrapper.append(this.faders.h.widget)

        this.wrapper.on('change',(e)=>{
            e.stopPropagation()
        })

        this.faders.h.widget.on('change',(e)=>{
            e.stopPropagation()
            this.dragHandle(true)
        })

        this.wrapper.on('draginit',(e, data, traversing)=>{
            this.faders.s.draginitHandleProxy(e, data, traversing)
            this.faders.b.draginitHandleProxy(e, data, traversing)
            this.dragHandle()
        })
        this.wrapper.on('drag',(e, data, traversing)=>{
            this.faders.s.dragHandleProxy(e, data, traversing)
            this.faders.b.dragHandleProxy(e, data, traversing)
            this.dragHandle()
        })

        if (this.getProp('input')) {

            this.input = new Input({
                props:{...Input.defaults(), precision:this.getProp('precision'), unit:this.getProp('unit')},
                parent:this, parentNode:this.widget
            })
            this.widget.append(this.input.widget)
            this.input.widget.on('change', (e)=>{
                e.stopPropagation()
                this.setValue(this.input.getValue(), {sync:true, send:true})
                this.showValue()
            })

        }

        this.setValue([0,0,0])

    }

    dragHandle(hue) {
        var h =this.faders.h.value,
        s = this.faders.s.value,
        b = this.faders.b.value

        if (h != this.hsb.h ||s != this.hsb.s || b != this.hsb.b) {

            this.hsb.h = this.faders.h.value
            this.hsb.s = this.faders.s.value
            this.hsb.b = this.faders.b.value

            this.update({nohue:!hue})

            var rgb = hsbToRgb(this.hsb)
            if (rgb.r != this.value[0] || rgb.g != this.value[1] || rgb.b != this.value[2]) {
                this.setValue([rgb.r, rgb.g, rgb.b],{send:true,sync:true,dragged:true,nohue:!hue})
            }
        }

    }

    setValue(v, options={}) {

        if (!v || !v.length || v.length!=3) return

        for (let i in [0,1,2]) {
            v[i] = clip(v[i],[0,255])
        }

        var hsb = rgbToHsb({r:v[0],g:v[1],b:v[2]})

        if (!options.dragged) {
            this.faders.s.setValue(hsb.s, {sync: false, send:false, dragged:false})
            this.faders.b.setValue(hsb.b, {sync: false, send:false, dragged:false})
        }

        this.hsb = hsb
        this.value = v

        if (options.send) this.sendValue()
        if (options.sync) this.widget.trigger({type:'change', id:this.getProp('id'),widget:this.widget, linkId:this.getProp('linkId'), options:options})

        this.update({dragged:options.dragged, nohue:options.nohue || (v[0]==v[1]&&v[1]==v[2])})

    }

    update(options={}) {

        if (!options.nohue && !options.dragged) {
            var hue = hsbToRgb({h:this.hsb.h,s:100,b:100})
            this.hue = `rgb(${Math.round(hue.r)},${Math.round(hue.g)},${Math.round(hue.b)})`
            this.wrapper[0].setAttribute('style',`background-color:${this.hue}`)
            this.faders.h.setValue(this.hsb.h, {sync: false, send:false, dragged:false})
        }


        this.draw()

        this.showValue()

    }

    draw() {

        var x = clip(this.faders.s.percent / 100 * this.width,[0,this.width]),
            y = clip((1 - this.faders.b.percent / 100) * this.height,[0,this.height]),
            color = this.hsb.b > 70 && this.hsb.s < 30 ? '#555' : 'white'

        this.clear()

        this.ctx.fillStyle = color
        this.ctx.strokeStyle = color
        this.ctx.lineWidth = PXSCALE

        this.ctx.globalAlpha = 0.3

        this.ctx.beginPath()
        this.ctx.arc(x, y, 10 * PXSCALE, Math.PI * 2, false)
        this.ctx.fill()

        this.ctx.globalAlpha = 0.1

        this.ctx.beginPath()
        this.ctx.moveTo(0,y)
        this.ctx.lineTo(this.width,y)
        this.ctx.moveTo(x,0)
        this.ctx.lineTo(x,this.height)
        this.ctx.stroke()

        this.ctx.globalAlpha = 1

        this.ctx.beginPath()
        this.ctx.arc(x, y, 4 * PXSCALE, Math.PI * 2, false)
        this.ctx.fill()


        this.clearRect = [
            [x - 10 * PXSCALE,0, 20 * PXSCALE, this.height],
            [0, y - 10 * PXSCALE, this.width, 20 * PXSCALE]
        ]
    }

    showValue() {

        if (this.getProp('input')) this.input.setValue(this.value)

    }

}
