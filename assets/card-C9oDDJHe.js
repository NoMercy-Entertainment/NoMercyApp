import{Gs as n,Js as r,Ns as d,hc as o,qs as s,sc as t,vc as a}from"./index-CZ45xf6w.js";import{n as i,t as l}from"./basecomponent-Df3pBKU7.js";var c=`
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
`,p=i.extend({name:"card",style:c,classes:{root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"}});d();var u={name:"BaseCard",extends:l,style:p,provide:function(){return{$pcCard:this,$parentInstance:this}}},m={name:"Card",extends:u,inheritAttrs:!1};function b(e,f,y,$,v,h){return o(),r("div",t({class:e.cx("root")},e.ptmi("root")),[e.$slots.header?(o(),r("div",t({key:0,class:e.cx("header")},e.ptm("header")),[a(e.$slots,"header")],16)):s("",!0),n("div",t({class:e.cx("body")},e.ptm("body")),[e.$slots.title||e.$slots.subtitle?(o(),r("div",t({key:0,class:e.cx("caption")},e.ptm("caption")),[e.$slots.title?(o(),r("div",t({key:0,class:e.cx("title")},e.ptm("title")),[a(e.$slots,"title")],16)):s("",!0),e.$slots.subtitle?(o(),r("div",t({key:1,class:e.cx("subtitle")},e.ptm("subtitle")),[a(e.$slots,"subtitle")],16)):s("",!0)],16)):s("",!0),n("div",t({class:e.cx("content")},e.ptm("content")),[a(e.$slots,"content")],16),e.$slots.footer?(o(),r("div",t({key:1,class:e.cx("footer")},e.ptm("footer")),[a(e.$slots,"footer")],16)):s("",!0)],16)],16)}m.render=b;export{m as t};
