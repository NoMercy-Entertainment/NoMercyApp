import{e as u,T as a,B as s,f as p,m as d,c as f,o as c}from"./index-UW_qnfhh.js";var m={name:"BaseEditableHolder",extends:u,emits:["update:modelValue","value-change"],props:{modelValue:{type:null,default:void 0},defaultValue:{type:null,default:void 0},name:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},disabled:{type:Boolean,default:!1},formControl:{type:Object,default:void 0}},inject:{$parentInstance:{default:void 0},$pcForm:{default:void 0},$pcFormField:{default:void 0}},data:function(){return{d_value:this.defaultValue||this.modelValue}},watch:{modelValue:function(t){this.d_value=t},defaultValue:function(t){this.d_value=t},$formName:{immediate:!0,handler:function(t){var e,n;this.formField=((e=this.$pcForm)===null||e===void 0||(n=e.register)===null||n===void 0?void 0:n.call(e,t,this.$formControl))||{}}},$formControl:{immediate:!0,handler:function(t){var e,n;this.formField=((e=this.$pcForm)===null||e===void 0||(n=e.register)===null||n===void 0?void 0:n.call(e,this.$formName,t))||{}}},$formDefaultValue:{immediate:!0,handler:function(t){this.d_value!==t&&(this.d_value=t)}},$formValue:{immediate:!1,handler:function(t){var e;(e=this.$pcForm)!==null&&e!==void 0&&e.getFieldState(this.$formName)&&t!==this.d_value&&(this.d_value=t)}}},formField:{},methods:{writeValue:function(t,e){var n,l;this.controlled&&(this.d_value=t,this.$emit("update:modelValue",t)),this.$emit("value-change",t),(n=(l=this.formField).onChange)===null||n===void 0||n.call(l,{originalEvent:e,value:t})},findNonEmpty:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.find(a)}},computed:{$filled:function(){return a(this.d_value)},$invalid:function(){var t,e;return!this.$formNovalidate&&this.findNonEmpty(this.invalid,(t=this.$pcFormField)===null||t===void 0||(t=t.$field)===null||t===void 0?void 0:t.invalid,(e=this.$pcForm)===null||e===void 0||(e=e.getFieldState(this.$formName))===null||e===void 0?void 0:e.invalid)},$formName:function(){var t;return this.$formNovalidate?void 0:this.name||((t=this.$formControl)===null||t===void 0?void 0:t.name)},$formControl:function(){var t;return this.formControl||((t=this.$pcFormField)===null||t===void 0?void 0:t.formControl)},$formNovalidate:function(){var t;return(t=this.$formControl)===null||t===void 0?void 0:t.novalidate},$formDefaultValue:function(){var t,e;return this.findNonEmpty(this.d_value,(t=this.$pcFormField)===null||t===void 0?void 0:t.initialValue,(e=this.$pcForm)===null||e===void 0||(e=e.initialValues)===null||e===void 0?void 0:e[this.$formName])},$formValue:function(){var t,e;return this.findNonEmpty((t=this.$pcFormField)===null||t===void 0||(t=t.$field)===null||t===void 0?void 0:t.value,(e=this.$pcForm)===null||e===void 0||(e=e.getFieldState(this.$formName))===null||e===void 0?void 0:e.value)},controlled:function(){return this.$inProps.hasOwnProperty("modelValue")||!this.$inProps.hasOwnProperty("modelValue")&&!this.$inProps.hasOwnProperty("defaultValue")},filled:function(){return this.$filled}}},$={name:"BaseInput",extends:m,props:{size:{type:String,default:null},fluid:{type:Boolean,default:null},variant:{type:String,default:null}},inject:{$parentInstance:{default:void 0},$pcFluid:{default:void 0}},computed:{$variant:function(){var t;return(t=this.variant)!==null&&t!==void 0?t:this.$primevue.config.inputStyle||this.$primevue.config.inputVariant},$fluid:function(){var t;return(t=this.fluid)!==null&&t!==void 0?t:!!this.$pcFluid},hasFluid:function(){return this.$fluid}}},h=({dt:i})=>`
.p-inputtext {
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;
    color: ${i("inputtext.color")};
    background: ${i("inputtext.background")};
    padding-block: ${i("inputtext.padding.y")};
    padding-inline: ${i("inputtext.padding.x")};
    border: 1px solid ${i("inputtext.border.color")};
    transition: background ${i("inputtext.transition.duration")}, color ${i("inputtext.transition.duration")}, border-color ${i("inputtext.transition.duration")}, outline-color ${i("inputtext.transition.duration")}, box-shadow ${i("inputtext.transition.duration")};
    appearance: none;
    border-radius: ${i("inputtext.border.radius")};
    outline-color: transparent;
    box-shadow: ${i("inputtext.shadow")};
}

.p-inputtext:enabled:hover {
    border-color: ${i("inputtext.hover.border.color")};
}

.p-inputtext:enabled:focus {
    border-color: ${i("inputtext.focus.border.color")};
    box-shadow: ${i("inputtext.focus.ring.shadow")};
    outline: ${i("inputtext.focus.ring.width")} ${i("inputtext.focus.ring.style")} ${i("inputtext.focus.ring.color")};
    outline-offset: ${i("inputtext.focus.ring.offset")};
}

.p-inputtext.p-invalid {
    border-color: ${i("inputtext.invalid.border.color")};
}

.p-inputtext.p-variant-filled {
    background: ${i("inputtext.filled.background")};
}

.p-inputtext.p-variant-filled:enabled:hover {
    background: ${i("inputtext.filled.hover.background")};
}

.p-inputtext.p-variant-filled:enabled:focus {
    background: ${i("inputtext.filled.focus.background")};
}

.p-inputtext:disabled {
    opacity: 1;
    background: ${i("inputtext.disabled.background")};
    color: ${i("inputtext.disabled.color")};
}

.p-inputtext::placeholder {
    color: ${i("inputtext.placeholder.color")};
}

.p-inputtext.p-invalid::placeholder {
    color: ${i("inputtext.invalid.placeholder.color")};
}

.p-inputtext-sm {
    font-size: ${i("inputtext.sm.font.size")};
    padding-block: ${i("inputtext.sm.padding.y")};
    padding-inline: ${i("inputtext.sm.padding.x")};
}

.p-inputtext-lg {
    font-size: ${i("inputtext.lg.font.size")};
    padding-block: ${i("inputtext.lg.padding.y")};
    padding-inline: ${i("inputtext.lg.padding.x")};
}

.p-inputtext-fluid {
    width: 100%;
}
`,v={root:function(t){var e=t.instance,n=t.props;return["p-inputtext p-component",{"p-filled":e.$filled,"p-inputtext-sm p-inputfield-sm":n.size==="small","p-inputtext-lg p-inputfield-lg":n.size==="large","p-invalid":e.$invalid,"p-variant-filled":e.$variant==="filled","p-inputtext-fluid":e.$fluid}]}},x=s.extend({name:"inputtext",style:h,classes:v}),g={name:"BaseInputText",extends:$,style:x,provide:function(){return{$pcInputText:this,$parentInstance:this}}};function r(i){"@babel/helpers - typeof";return r=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(i)}function b(i,t,e){return(t=y(t))in i?Object.defineProperty(i,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):i[t]=e,i}function y(i){var t=F(i,"string");return r(t)=="symbol"?t:t+""}function F(i,t){if(r(i)!="object"||!i)return i;var e=i[Symbol.toPrimitive];if(e!==void 0){var n=e.call(i,t);if(r(n)!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(i)}var _={name:"InputText",extends:g,inheritAttrs:!1,methods:{onInput:function(t){this.writeValue(t.target.value,t)}},computed:{attrs:function(){return d(this.ptmi("root",{context:{filled:this.$filled,disabled:this.disabled}}),this.formField)},dataP:function(){return p(b({invalid:this.$invalid,fluid:this.$fluid,filled:this.$variant==="filled"},this.size,this.size))}}},V=["value","name","disabled","aria-invalid","data-p"];function N(i,t,e,n,l,o){return c(),f("input",d({type:"text",class:i.cx("root"),value:i.d_value,name:i.name,disabled:i.disabled,"aria-invalid":i.$invalid||void 0,"data-p":o.dataP,onInput:t[0]||(t[0]=function(){return o.onInput&&o.onInput.apply(o,arguments)})},o.attrs),null,16,V)}_.render=N;export{_ as a,$ as s};
//# sourceMappingURL=index-BTPL1p1C.js.map
