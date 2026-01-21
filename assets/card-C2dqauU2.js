import{Bt as a,Rt as d,Tt as s,Vt as r,cn as o,dn as n,en as e}from"./index-BvWvvCYJ.js";import{n as i,t as l}from"./basecomponent-CLBkg3Xa.js";var c=`
    .p-card {
        background: dt('card.background');
        color: dt('card.color');
        box-shadow: dt('card.shadow');
        border-radius: dt('card.border.radius');
        display: flex;
        flex-direction: column;
    }

    .p-card-caption {
        display: flex;
        flex-direction: column;
        gap: dt('card.caption.gap');
    }

    .p-card-body {
        padding: dt('card.body.padding');
        display: flex;
        flex-direction: column;
        gap: dt('card.body.gap');
    }

    .p-card-title {
        font-size: dt('card.title.font.size');
        font-weight: dt('card.title.font.weight');
    }

    .p-card-subtitle {
        color: dt('card.subtitle.color');
    }
`,p=i.extend({name:"card",style:c,classes:{root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"}});s();var u={name:"BaseCard",extends:l,style:p,provide:function(){return{$pcCard:this,$parentInstance:this}}},m={name:"Card",extends:u,inheritAttrs:!1};function b(t,f,y,$,v,h){return o(),r("div",e({class:t.cx("root")},t.ptmi("root")),[t.$slots.header?(o(),r("div",e({key:0,class:t.cx("header")},t.ptm("header")),[n(t.$slots,"header")],16)):a("",!0),d("div",e({class:t.cx("body")},t.ptm("body")),[t.$slots.title||t.$slots.subtitle?(o(),r("div",e({key:0,class:t.cx("caption")},t.ptm("caption")),[t.$slots.title?(o(),r("div",e({key:0,class:t.cx("title")},t.ptm("title")),[n(t.$slots,"title")],16)):a("",!0),t.$slots.subtitle?(o(),r("div",e({key:1,class:t.cx("subtitle")},t.ptm("subtitle")),[n(t.$slots,"subtitle")],16)):a("",!0)],16)):a("",!0),d("div",e({class:t.cx("content")},t.ptm("content")),[n(t.$slots,"content")],16),t.$slots.footer?(o(),r("div",e({key:1,class:t.cx("footer")},t.ptm("footer")),[n(t.$slots,"footer")],16)):a("",!0)],16)],16)}m.render=b;export{m as t};
