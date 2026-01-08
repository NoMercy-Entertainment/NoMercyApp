import{Ht as s,On as o,Tn as r,_n as t,in as n,rn as a,tn as d}from"./index-04Sh3wNb.js";import{n as i,t as l}from"./basecomponent-Dw-Pzf3B.js";var p=`
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
`,c=i.extend({name:"card",style:p,classes:{root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"}});s();var u={name:"BaseCard",extends:l,style:c,provide:function(){return{$pcCard:this,$parentInstance:this}}},m={name:"Card",extends:u,inheritAttrs:!1};function b(e,f,y,$,v,h){return r(),n("div",t({class:e.cx("root")},e.ptmi("root")),[e.$slots.header?(r(),n("div",t({key:0,class:e.cx("header")},e.ptm("header")),[o(e.$slots,"header")],16)):a("",!0),d("div",t({class:e.cx("body")},e.ptm("body")),[e.$slots.title||e.$slots.subtitle?(r(),n("div",t({key:0,class:e.cx("caption")},e.ptm("caption")),[e.$slots.title?(r(),n("div",t({key:0,class:e.cx("title")},e.ptm("title")),[o(e.$slots,"title")],16)):a("",!0),e.$slots.subtitle?(r(),n("div",t({key:1,class:e.cx("subtitle")},e.ptm("subtitle")),[o(e.$slots,"subtitle")],16)):a("",!0)],16)):a("",!0),d("div",t({class:e.cx("content")},e.ptm("content")),[o(e.$slots,"content")],16),e.$slots.footer?(r(),n("div",t({key:1,class:e.cx("footer")},e.ptm("footer")),[o(e.$slots,"footer")],16)):a("",!0)],16)],16)}m.render=b;export{m as t};
