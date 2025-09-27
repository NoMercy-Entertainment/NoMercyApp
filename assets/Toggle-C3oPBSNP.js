import{Gc as g,Gs as d,Js as h,Ks as u,Ns as s,Tc as p,ec as w,hc as r,sc as l,vc as b}from"./index-DwyZWiM0.js";import{n as k}from"./basecomponent-D7I3Pq8e.js";import{t as f}from"./classnames-ai0DVBar.js";import{t as v}from"./baseeditableholder-CB85HFvz.js";var m=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`,y=k.extend({name:"toggleswitch",style:m,classes:{root:function(t){var i=t.instance,o=t.props;return["p-toggleswitch p-component",{"p-toggleswitch-checked":i.checked,"p-disabled":o.disabled,"p-invalid":i.$invalid}]},input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},inlineStyles:{root:{position:"relative"}}});s();var B={name:"BaseToggleSwitch",extends:v,props:{trueValue:{type:null,default:!0},falseValue:{type:null,default:!1},readonly:{type:Boolean,default:!1},tabindex:{type:Number,default:null},inputId:{type:String,default:null},inputClass:{type:[String,Object],default:null},inputStyle:{type:Object,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:y,provide:function(){return{$pcToggleSwitch:this,$parentInstance:this}}},c={name:"ToggleSwitch",extends:B,inheritAttrs:!1,emits:["change","focus","blur"],methods:{getPTOptions:function(t){return(t==="root"?this.ptmi:this.ptm)(t,{context:{checked:this.checked,disabled:this.disabled}})},onChange:function(t){if(!this.disabled&&!this.readonly){var i=this.checked?this.falseValue:this.trueValue;this.writeValue(i,t),this.$emit("change",t)}},onFocus:function(t){this.$emit("focus",t)},onBlur:function(t){var i,o;this.$emit("blur",t),(i=(o=this.formField).onBlur)===null||i===void 0||i.call(o,t)}},computed:{checked:function(){return this.d_value===this.trueValue},dataP:function(){return f({checked:this.checked,disabled:this.disabled,invalid:this.$invalid})}}},S=["data-p-checked","data-p-disabled","data-p"],T=["id","checked","tabindex","disabled","readonly","aria-checked","aria-labelledby","aria-label","aria-invalid"],V=["data-p"],P=["data-p"];function C(e,t,i,o,a,n){return r(),h("div",l({class:e.cx("root"),style:e.sx("root")},n.getPTOptions("root"),{"data-p-checked":n.checked,"data-p-disabled":e.disabled,"data-p":n.dataP}),[d("input",l({id:e.inputId,type:"checkbox",role:"switch",class:[e.cx("input"),e.inputClass],style:e.inputStyle,checked:n.checked,tabindex:e.tabindex,disabled:e.disabled,readonly:e.readonly,"aria-checked":n.checked,"aria-labelledby":e.ariaLabelledby,"aria-label":e.ariaLabel,"aria-invalid":e.invalid||void 0,onFocus:t[0]||(t[0]=function(){return n.onFocus&&n.onFocus.apply(n,arguments)}),onBlur:t[1]||(t[1]=function(){return n.onBlur&&n.onBlur.apply(n,arguments)}),onChange:t[2]||(t[2]=function(){return n.onChange&&n.onChange.apply(n,arguments)})},n.getPTOptions("input")),null,16,T),d("div",l({class:e.cx("slider")},n.getPTOptions("slider"),{"data-p":n.dataP}),[d("div",l({class:e.cx("handle")},n.getPTOptions("handle"),{"data-p":n.dataP}),[b(e.$slots,"handle",{checked:n.checked})],16,P)],16,V)],16,S)}c.render=C;s();var F=w({__name:"Toggle",props:{modelValue:{type:Boolean,required:!0},modelModifiers:{}},emits:["update:modelValue"],setup(e){const t=p(e,"modelValue");return(i,o)=>(r(),u(g(c),{modelValue:t.value,"onUpdate:modelValue":o[0]||(o[0]=a=>t.value=a)},null,8,["modelValue"]))}}),L=F;export{L as t};
