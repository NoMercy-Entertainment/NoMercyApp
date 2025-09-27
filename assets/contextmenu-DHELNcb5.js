import{Ac as M,Bs as y,Gs as C,Hs as B,Js as f,Ks as b,Nc as G,Ns as A,Oc as w,Ps as D,Qs as E,_c as N,bc as q,hc as c,kc as U,qs as v,sc as d,vc as S,xc as L,yc as g}from"./index-D3KNwstc.js";import{C as V,F as j,M as H,Q as x,T as p,W as Y,Y as Z,b as W,f as F,h as T,lt as k,n as X,nt as J,ot as Q,t as z,ut as $}from"./basecomponent-BCPizvs3.js";import{i as ee}from"./button-Bdaa_tzF.js";import{t as te}from"./baseicon-304ZxOv8.js";function ne(){let t=[],e=(a,u,m=999)=>{let s=r(a,u,m),l=s.value+(s.key===a?0:m)+1;return t.push({key:a,value:l}),l},n=a=>{t=t.filter(u=>u.value!==a)},o=(a,u)=>r(a,u).value,r=(a,u,m=0)=>[...t].reverse().find(s=>u?!0:s.key===a)||{key:a,value:m},i=a=>a&&parseInt(a.style.zIndex,10)||0;return{get:i,set:(a,u,m)=>{u&&(u.style.zIndex=String(e(a,!0,m)))},clear:a=>{a&&(n(i(a)),a.style.zIndex="")},getCurrent:a=>o(a,!0)}}var P=ne();A();var _={name:"Portal",props:{appendTo:{type:[String,Object],default:"body"},disabled:{type:Boolean,default:!1}},data:function(){return{mounted:!1}},mounted:function(){this.mounted=Q()},computed:{inline:function(){return this.disabled||this.appendTo==="self"}}};function ie(t,e,n,o,r,i){return i.inline?S(t.$slots,"default",{key:0}):r.mounted?(c(),b(B,{key:1,to:n.appendTo},[S(t.$slots,"default")],8,["to"])):v("",!0)}_.render=ie;var oe=`
    .p-contextmenu {
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
        min-width: 12.5rem;
    }

    .p-contextmenu-root-list,
    .p-contextmenu-submenu {
        margin: 0;
        padding: dt('contextmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('contextmenu.list.gap');
    }

    .p-contextmenu-submenu {
        position: absolute;
        display: flex;
        flex-direction: column;
        min-width: 100%;
        z-index: 1;
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
    }

    .p-contextmenu-item {
        position: relative;
    }

    .p-contextmenu-item-content {
        transition:
            background dt('contextmenu.transition.duration'),
            color dt('contextmenu.transition.duration');
        border-radius: dt('contextmenu.item.border.radius');
        color: dt('contextmenu.item.color');
    }

    .p-contextmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('contextmenu.item.padding');
        gap: dt('contextmenu.item.gap');
        user-select: none;
    }

    .p-contextmenu-item-label {
        line-height: 1;
    }

    .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.color');
    }

    .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('contextmenu.submenu.icon.size');
        width: dt('contextmenu.submenu.icon.size');
        height: dt('contextmenu.submenu.icon.size');
    }

    .p-contextmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content {
        color: dt('contextmenu.item.active.color');
        background: dt('contextmenu.item.active.background');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.active.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.active.color');
    }

    .p-contextmenu-separator {
        border-block-start: 1px solid dt('contextmenu.separator.border.color');
    }

    .p-contextmenu-enter-from,
    .p-contextmenu-leave-active {
        opacity: 0;
    }

    .p-contextmenu-enter-active {
        transition: opacity 250ms;
    }

    .p-contextmenu-mobile .p-contextmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .p-contextmenu-mobile .p-contextmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .p-contextmenu-mobile .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`,se=X.extend({name:"contextmenu",style:oe,classes:{root:function(e){var n=e.instance;return["p-contextmenu p-component",{"p-contextmenu-mobile":n.queryMatches}]},rootList:"p-contextmenu-root-list",item:function(e){var n=e.instance,o=e.processedItem;return["p-contextmenu-item",{"p-contextmenu-item-active":n.isItemActive(o),"p-focus":n.isItemFocused(o),"p-disabled":n.isItemDisabled(o)}]},itemContent:"p-contextmenu-item-content",itemLink:"p-contextmenu-item-link",itemIcon:"p-contextmenu-item-icon",itemLabel:"p-contextmenu-item-label",submenuIcon:"p-contextmenu-submenu-icon",submenu:"p-contextmenu-submenu",separator:"p-contextmenu-separator"}});A();var O={name:"AngleRightIcon",extends:te};function re(t){return me(t)||ce(t)||ue(t)||ae()}function ae(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ue(t,e){if(t){if(typeof t=="string")return K(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?K(t,e):void 0}}function ce(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function me(t){if(Array.isArray(t))return K(t)}function K(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,o=Array(e);n<e;n++)o[n]=t[n];return o}function le(t,e,n,o,r,i){return c(),f("svg",d({width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t.pti()),re(e[0]||(e[0]=[C("path",{d:"M5.25 11.1728C5.14929 11.1694 5.05033 11.1455 4.9592 11.1025C4.86806 11.0595 4.78666 10.9984 4.72 10.9228C4.57955 10.7822 4.50066 10.5916 4.50066 10.3928C4.50066 10.1941 4.57955 10.0035 4.72 9.86283L7.72 6.86283L4.72 3.86283C4.66067 3.71882 4.64765 3.55991 4.68275 3.40816C4.71785 3.25642 4.79932 3.11936 4.91585 3.01602C5.03238 2.91268 5.17819 2.84819 5.33305 2.83149C5.4879 2.81479 5.64411 2.84671 5.78 2.92283L9.28 6.42283C9.42045 6.56346 9.49934 6.75408 9.49934 6.95283C9.49934 7.15158 9.42045 7.34221 9.28 7.48283L5.78 10.9228C5.71333 10.9984 5.63193 11.0595 5.5408 11.1025C5.44966 11.1455 5.35071 11.1694 5.25 11.1728Z",fill:"currentColor"},null,-1)])),16)}O.render=le;A();var de={name:"BaseContextMenu",extends:z,props:{model:{type:Array,default:null},appendTo:{type:[String,Object],default:"body"},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},global:{type:Boolean,default:!1},breakpoint:{type:String,default:"960px"},tabindex:{type:Number,default:0},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:se,provide:function(){return{$pcContextMenu:this,$parentInstance:this}}},R={name:"ContextMenuSub",hostName:"ContextMenu",extends:z,emits:["item-click","item-mouseenter","item-mousemove"],props:{items:{type:Array,default:null},menuId:{type:String,default:null},focusedItemId:{type:String,default:null},root:{type:Boolean,default:!1},visible:{type:Boolean,default:!1},level:{type:Number,default:0},templates:{type:Object,default:null},activeItemPath:{type:Object,default:null},tabindex:{type:Number,default:0}},methods:{getItemId:function(e){return"".concat(this.menuId,"_").concat(e.key)},getItemKey:function(e){return this.getItemId(e)},getItemProp:function(e,n,o){return e&&e.item?V(e.item[n],o):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},getItemLabelId:function(e){return"".concat(this.menuId,"_").concat(e.key,"_label")},getPTOptions:function(e,n,o){return this.ptm(e,{context:{item:n.item,active:this.isItemActive(n),focused:this.isItemFocused(n),disabled:this.isItemDisabled(n),index:o}})},isItemActive:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemFocused:function(e){return this.focusedItemId===this.getItemId(e)},isItemGroup:function(e){return p(e.items)},onItemClick:function(e,n){this.getItemProp(n,"command",{originalEvent:e,item:n.item}),this.$emit("item-click",{originalEvent:e,processedItem:n,isFocus:!0})},onItemMouseEnter:function(e,n){this.$emit("item-mouseenter",{originalEvent:e,processedItem:n})},onItemMouseMove:function(e,n){this.$emit("item-mousemove",{originalEvent:e,processedItem:n,isFocus:!0})},getAriaSetSize:function(){var e=this;return this.items.filter(function(n){return e.isItemVisible(n)&&!e.getItemProp(n,"separator")}).length},getAriaPosInset:function(e){var n=this;return e-this.items.slice(0,e).filter(function(o){return n.isItemVisible(o)&&n.getItemProp(o,"separator")}).length+1},onEnter:function(){$(this.$refs.container,this.level)},getMenuItemProps:function(e,n){return{action:d({class:this.cx("itemLink"),tabindex:-1},this.getPTOptions("itemLink",e,n)),icon:d({class:[this.cx("itemIcon"),this.getItemProp(e,"icon")]},this.getPTOptions("itemIcon",e,n)),label:d({class:this.cx("itemLabel")},this.getPTOptions("itemLabel",e,n)),submenuicon:d({class:this.cx("submenuIcon")},this.getPTOptions("submenuicon",e,n))}}},components:{AngleRightIcon:O},directives:{ripple:ee}},he=["tabindex"],fe=["id","aria-label","aria-disabled","aria-expanded","aria-haspopup","aria-level","aria-setsize","aria-posinset","data-p-active","data-p-focused","data-p-disabled"],Ie=["onClick","onMouseenter","onMousemove"],be=["href","target"],ve=["id"],pe=["id"];function xe(t,e,n,o,r,i){var a=g("AngleRightIcon"),u=g("ContextMenuSub",!0),m=q("ripple");return c(),b(D,d({name:"p-contextmenusub",onEnter:i.onEnter},t.ptm("menu.transition")),{default:w(function(){return[n.root||n.visible?(c(),f("ul",d({key:0,ref:"container",tabindex:n.tabindex},t.ptm("rootList")),[(c(!0),f(y,null,N(n.items,function(s,l){return c(),f(y,{key:i.getItemKey(s)},[i.isItemVisible(s)&&!i.getItemProp(s,"separator")?(c(),f("li",d({key:0,id:i.getItemId(s),style:i.getItemProp(s,"style"),class:[t.cx("item",{processedItem:s}),i.getItemProp(s,"class")],role:"menuitem","aria-label":i.getItemLabel(s),"aria-disabled":i.isItemDisabled(s)||void 0,"aria-expanded":i.isItemGroup(s)?i.isItemActive(s):void 0,"aria-haspopup":i.isItemGroup(s)&&!i.getItemProp(s,"to")?"menu":void 0,"aria-level":n.level+1,"aria-setsize":i.getAriaSetSize(),"aria-posinset":i.getAriaPosInset(l)},{ref_for:!0},i.getPTOptions("item",s,l),{"data-p-active":i.isItemActive(s),"data-p-focused":i.isItemFocused(s),"data-p-disabled":i.isItemDisabled(s)}),[C("div",d({class:t.cx("itemContent"),onClick:function(I){return i.onItemClick(I,s)},onMouseenter:function(I){return i.onItemMouseEnter(I,s)},onMousemove:function(I){return i.onItemMouseMove(I,s)}},{ref_for:!0},i.getPTOptions("itemContent",s,l)),[n.templates.item?(c(),b(L(n.templates.item),{key:1,item:s.item,hasSubmenu:i.getItemProp(s,"items"),label:i.getItemLabel(s),props:i.getMenuItemProps(s,l)},null,8,["item","hasSubmenu","label","props"])):U((c(),f("a",d({key:0,href:i.getItemProp(s,"url"),class:t.cx("itemLink"),target:i.getItemProp(s,"target"),tabindex:"-1"},{ref_for:!0},i.getPTOptions("itemLink",s,l)),[n.templates.itemicon?(c(),b(L(n.templates.itemicon),{key:0,item:s.item,class:M(t.cx("itemIcon"))},null,8,["item","class"])):i.getItemProp(s,"icon")?(c(),f("span",d({key:1,class:[t.cx("itemIcon"),i.getItemProp(s,"icon")]},{ref_for:!0},i.getPTOptions("itemIcon",s,l)),null,16)):v("",!0),C("span",d({id:i.getItemLabelId(s),class:t.cx("itemLabel")},{ref_for:!0},i.getPTOptions("itemLabel",s,l)),G(i.getItemLabel(s)),17,ve),i.getItemProp(s,"items")?(c(),f(y,{key:2},[n.templates.submenuicon?(c(),b(L(n.templates.submenuicon),{key:0,active:i.isItemActive(s),class:M(t.cx("submenuIcon"))},null,8,["active","class"])):(c(),b(a,d({key:1,class:t.cx("submenuIcon")},{ref_for:!0},i.getPTOptions("submenuicon",s,l)),null,16,["class"]))],64)):v("",!0)],16,be)),[[m]])],16,Ie),i.isItemVisible(s)&&i.isItemGroup(s)?(c(),b(u,d({key:0,id:i.getItemId(s)+"_list",role:"menu",class:t.cx("submenu"),menuId:n.menuId,focusedItemId:n.focusedItemId,items:s.items,templates:n.templates,activeItemPath:n.activeItemPath,level:n.level+1,visible:i.isItemActive(s)&&i.isItemGroup(s),pt:t.pt,unstyled:t.unstyled,onItemClick:e[0]||(e[0]=function(h){return t.$emit("item-click",h)}),onItemMouseenter:e[1]||(e[1]=function(h){return t.$emit("item-mouseenter",h)}),onItemMousemove:e[2]||(e[2]=function(h){return t.$emit("item-mousemove",h)}),"aria-labelledby":i.getItemLabelId(s)},{ref_for:!0},t.ptm("submenu")),null,16,["id","class","menuId","focusedItemId","items","templates","activeItemPath","level","visible","pt","unstyled","aria-labelledby"])):v("",!0)],16,fe)):v("",!0),i.isItemVisible(s)&&i.getItemProp(s,"separator")?(c(),f("li",d({key:1,id:i.getItemId(s),style:i.getItemProp(s,"style"),class:[t.cx("separator"),i.getItemProp(s,"class")],role:"separator"},{ref_for:!0},t.ptm("separator")),null,16,pe)):v("",!0)],64)}),128))],16,he)):v("",!0)]}),_:1},16,["onEnter"])}R.render=xe;var ge={name:"ContextMenu",extends:de,inheritAttrs:!1,emits:["focus","blur","show","hide","before-show","before-hide"],target:null,outsideClickListener:null,resizeListener:null,documentContextMenuListener:null,matchMediaListener:null,pageX:null,pageY:null,container:null,list:null,data:function(){return{focused:!1,focusedItemInfo:{index:-1,level:0,parentKey:""},activeItemPath:[],visible:!1,submenuVisible:!1,query:null,queryMatches:!1}},watch:{activeItemPath:function(e){p(e)?(this.bindOutsideClickListener(),this.bindResizeListener()):this.visible||(this.unbindOutsideClickListener(),this.unbindResizeListener())}},mounted:function(){this.bindMatchMediaListener(),this.global&&this.bindDocumentContextMenuListener()},beforeUnmount:function(){this.unbindResizeListener(),this.unbindOutsideClickListener(),this.unbindDocumentContextMenuListener(),this.unbindMatchMediaListener(),this.container&&this.autoZIndex&&P.clear(this.container),this.target=null,this.container=null},methods:{getItemProp:function(e,n){return e?V(e[n]):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemGroup:function(e){return p(this.getItemProp(e,"items"))},isItemSeparator:function(e){return this.getItemProp(e,"separator")},getProccessedItemLabel:function(e){return e?this.getItemLabel(e.item):void 0},isProccessedItemGroup:function(e){return e&&p(e.items)},toggle:function(e){this.visible?this.hide():this.show(e)},show:function(e){this.$emit("before-show"),this.activeItemPath=[],this.focusedItemInfo={index:-1,level:0,parentKey:""},x(this.list),this.pageX=e.pageX,this.pageY=e.pageY,this.visible?this.position():this.visible=!0,e.stopPropagation(),e.preventDefault()},hide:function(){this.$emit("before-hide"),this.visible=!1,this.activeItemPath=[],this.focusedItemInfo={index:-1,level:0,parentKey:""}},onFocus:function(e){this.focused=!0,this.focusedItemInfo=this.focusedItemInfo.index!==-1?this.focusedItemInfo:{index:-1,level:0,parentKey:""},this.$emit("focus",e)},onBlur:function(e){this.focused=!1,this.focusedItemInfo={index:-1,level:0,parentKey:""},this.searchValue="",this.$emit("blur",e)},onKeyDown:function(e){var n=e.metaKey||e.ctrlKey;switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Space":this.onSpaceKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"PageDown":case"PageUp":case"Backspace":case"ShiftLeft":case"ShiftRight":break;default:!n&&W(e.key)&&this.searchItems(e,e.key);break}},onItemChange:function(e,n){var o=e.processedItem,r=e.isFocus;if(!T(o)){var i=o.index,a=o.key,u=o.level,m=o.parentKey,s=o.items,l=p(s),h=this.activeItemPath.filter(function(I){return I.parentKey!==m&&I.parentKey!==a});l&&(h.push(o),this.submenuVisible=!0),this.focusedItemInfo={index:i,level:u,parentKey:m},r&&x(this.list),!(n==="hover"&&this.queryMatches)&&(this.activeItemPath=h)}},onItemClick:function(e){var n=e.processedItem,o=this.isProccessedItemGroup(n);if(this.isSelected(n)){var r=n.index,i=n.key,a=n.level,u=n.parentKey;this.activeItemPath=this.activeItemPath.filter(function(m){return i!==m.key&&i.startsWith(m.key)}),this.focusedItemInfo={index:r,level:a,parentKey:u},x(this.list)}else o?this.onItemChange(e):this.hide()},onItemMouseEnter:function(e){this.onItemChange(e,"hover")},onItemMouseMove:function(e){this.focused&&this.changeFocusedItemIndex(e,e.processedItem.index)},onArrowDownKey:function(e){var n=this.focusedItemInfo.index!==-1?this.findNextItemIndex(this.focusedItemInfo.index):this.findFirstFocusedItemIndex();this.changeFocusedItemIndex(e,n),e.preventDefault()},onArrowUpKey:function(e){if(e.altKey){if(this.focusedItemInfo.index!==-1){var n=this.visibleItems[this.focusedItemInfo.index];!this.isProccessedItemGroup(n)&&this.onItemChange({originalEvent:e,processedItem:n})}this.popup&&this.hide(),e.preventDefault()}else{var o=this.focusedItemInfo.index!==-1?this.findPrevItemIndex(this.focusedItemInfo.index):this.findLastFocusedItemIndex();this.changeFocusedItemIndex(e,o),e.preventDefault()}},onArrowLeftKey:function(e){var n=this,o=this.visibleItems[this.focusedItemInfo.index],r=this.activeItemPath.find(function(i){return i.key===o.parentKey});T(o.parent)||(this.focusedItemInfo={index:-1,parentKey:r?r.parentKey:""},this.searchValue="",this.onArrowDownKey(e)),this.activeItemPath=this.activeItemPath.filter(function(i){return i.parentKey!==n.focusedItemInfo.parentKey}),e.preventDefault()},onArrowRightKey:function(e){var n=this.visibleItems[this.focusedItemInfo.index];this.isProccessedItemGroup(n)&&(this.onItemChange({originalEvent:e,processedItem:n}),this.focusedItemInfo={index:-1,parentKey:n.key},this.searchValue="",this.onArrowDownKey(e)),e.preventDefault()},onHomeKey:function(e){this.changeFocusedItemIndex(e,this.findFirstItemIndex()),e.preventDefault()},onEndKey:function(e){this.changeFocusedItemIndex(e,this.findLastItemIndex()),e.preventDefault()},onEnterKey:function(e){if(this.focusedItemInfo.index!==-1){var n=k(this.list,'li[id="'.concat("".concat(this.focusedItemIdx),'"]')),o=n&&k(n,'[data-pc-section="itemlink"]');o?o.click():n&&n.click();var r=this.visibleItems[this.focusedItemInfo.index];!this.isProccessedItemGroup(r)&&(this.focusedItemInfo.index=this.findFirstFocusedItemIndex())}e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},onEscapeKey:function(e){this.hide(),!this.popup&&(this.focusedItemInfo.index=this.findFirstFocusedItemIndex()),e.preventDefault()},onTabKey:function(e){if(this.focusedItemInfo.index!==-1){var n=this.visibleItems[this.focusedItemInfo.index];!this.isProccessedItemGroup(n)&&this.onItemChange({originalEvent:e,processedItem:n})}this.hide()},onEnter:function(e){Y(e,{position:"absolute"}),this.position(),this.autoZIndex&&P.set("menu",e,this.baseZIndex+this.$primevue.config.zIndex.menu)},onAfterEnter:function(){this.bindOutsideClickListener(),this.bindResizeListener(),this.$emit("show"),x(this.list)},onLeave:function(){this.$emit("hide"),this.container=null},onAfterLeave:function(e){this.autoZIndex&&P.clear(e),this.unbindOutsideClickListener(),this.unbindResizeListener()},position:function(){var e=this.pageX+1,n=this.pageY+1,o=this.container.offsetParent?this.container.offsetWidth:j(this.container),r=this.container.offsetParent?this.container.offsetHeight:H(this.container),i=J(),a=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,u=window.scrollX||document.documentElement.scrollLeft||document.body.scrollLeft||0;e+o-u>i.width&&(e-=o),n+r-a>i.height&&(n-=r),e<u&&(e=u),n<a&&(n=a),this.container.style.left=e+"px",this.container.style.top=n+"px"},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(n){var o=e.container&&!e.container.contains(n.target),r=e.visible?!(e.target&&(e.target===n.target||e.target.contains(n.target))):!0;o&&r&&e.hide()},document.addEventListener("click",this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener,!0),this.outsideClickListener=null)},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.visible&&!Z()&&e.hide()},window.addEventListener("resize",this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},bindDocumentContextMenuListener:function(){var e=this;this.documentContextMenuListener||(this.documentContextMenuListener=function(n){n.button===2&&e.show(n)},document.addEventListener("contextmenu",this.documentContextMenuListener))},unbindDocumentContextMenuListener:function(){this.documentContextMenuListener&&(document.removeEventListener("contextmenu",this.documentContextMenuListener),this.documentContextMenuListener=null)},bindMatchMediaListener:function(){var e=this;if(!this.matchMediaListener){var n=matchMedia("(max-width: ".concat(this.breakpoint,")"));this.query=n,this.queryMatches=n.matches,this.matchMediaListener=function(){e.queryMatches=n.matches},this.query.addEventListener("change",this.matchMediaListener)}},unbindMatchMediaListener:function(){this.matchMediaListener&&(this.query.removeEventListener("change",this.matchMediaListener),this.matchMediaListener=null)},isItemMatched:function(e){var n;return this.isValidItem(e)&&((n=this.getProccessedItemLabel(e))===null||n===void 0?void 0:n.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase()))},isValidItem:function(e){return!!e&&!this.isItemDisabled(e.item)&&!this.isItemSeparator(e.item)&&this.isItemVisible(e.item)},isValidSelectedItem:function(e){return this.isValidItem(e)&&this.isSelected(e)},isSelected:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},findFirstItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidItem(n)})},findLastItemIndex:function(){var e=this;return F(this.visibleItems,function(n){return e.isValidItem(n)})},findNextItemIndex:function(e){var n=this,o=e<this.visibleItems.length-1?this.visibleItems.slice(e+1).findIndex(function(r){return n.isValidItem(r)}):-1;return o>-1?o+e+1:e},findPrevItemIndex:function(e){var n=this,o=e>0?F(this.visibleItems.slice(0,e),function(r){return n.isValidItem(r)}):-1;return o>-1?o:e},findSelectedItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidSelectedItem(n)})},findFirstFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findFirstItemIndex():e},findLastFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findLastItemIndex():e},searchItems:function(e,n){var o=this;this.searchValue=(this.searchValue||"")+n;var r=-1,i=!1;return this.focusedItemInfo.index!==-1?(r=this.visibleItems.slice(this.focusedItemInfo.index).findIndex(function(a){return o.isItemMatched(a)}),r=r===-1?this.visibleItems.slice(0,this.focusedItemInfo.index).findIndex(function(a){return o.isItemMatched(a)}):r+this.focusedItemInfo.index):r=this.visibleItems.findIndex(function(a){return o.isItemMatched(a)}),r!==-1&&(i=!0),r===-1&&this.focusedItemInfo.index===-1&&(r=this.findFirstFocusedItemIndex()),r!==-1&&this.changeFocusedItemIndex(e,r),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(function(){o.searchValue="",o.searchTimeout=null},500),i},changeFocusedItemIndex:function(e,n){this.focusedItemInfo.index!==n&&(this.focusedItemInfo.index=n,this.scrollInView())},scrollInView:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:-1,n=e!==-1?"".concat(this.$id,"_").concat(e):this.focusedItemIdx,o=k(this.list,'li[id="'.concat(n,'"]'));o&&o.scrollIntoView&&o.scrollIntoView({block:"nearest",inline:"start"})},createProcessedItems:function(e){var n=this,o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"",a=[];return e&&e.forEach(function(u,m){var s=(i!==""?i+"_":"")+m,l={item:u,index:m,level:o,key:s,parent:r,parentKey:i};l.items=n.createProcessedItems(u.items,o+1,l,s),a.push(l)}),a},containerRef:function(e){this.container=e},listRef:function(e){this.list=e?e.$el:void 0}},computed:{processedItems:function(){return this.createProcessedItems(this.model||[])},visibleItems:function(){var e=this,n=this.activeItemPath.find(function(o){return o.key===e.focusedItemInfo.parentKey});return n?n.items:this.processedItems},focusedItemIdx:function(){return this.focusedItemInfo.index!==-1?"".concat(this.$id).concat(p(this.focusedItemInfo.parentKey)?"_"+this.focusedItemInfo.parentKey:"","_").concat(this.focusedItemInfo.index):null}},components:{ContextMenuSub:R,Portal:_}};function ye(t,e,n,o,r,i){var a=g("ContextMenuSub"),u=g("Portal");return c(),b(u,{appendTo:t.appendTo},{default:w(function(){return[E(D,d({name:"p-contextmenu",onEnter:i.onEnter,onAfterEnter:i.onAfterEnter,onLeave:i.onLeave,onAfterLeave:i.onAfterLeave},t.ptm("transition")),{default:w(function(){return[r.visible?(c(),f("div",d({key:0,ref:i.containerRef,class:t.cx("root")},t.ptmi("root")),[E(a,{ref:i.listRef,id:t.$id+"_list",class:M(t.cx("rootList")),role:"menubar",root:!0,tabindex:t.tabindex,"aria-orientation":"vertical","aria-activedescendant":r.focused?i.focusedItemIdx:void 0,menuId:t.$id,focusedItemId:r.focused?i.focusedItemIdx:void 0,items:i.processedItems,templates:t.$slots,activeItemPath:r.activeItemPath,"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel,level:0,visible:r.submenuVisible,pt:t.pt,unstyled:t.unstyled,onFocus:i.onFocus,onBlur:i.onBlur,onKeydown:i.onKeyDown,onItemClick:i.onItemClick,onItemMouseenter:i.onItemMouseEnter,onItemMousemove:i.onItemMouseMove},null,8,["id","class","tabindex","aria-activedescendant","menuId","focusedItemId","items","templates","activeItemPath","aria-labelledby","aria-label","visible","pt","unstyled","onFocus","onBlur","onKeydown","onItemClick","onItemMouseenter","onItemMousemove"])],16)):v("",!0)]}),_:1},16,["onEnter","onAfterEnter","onLeave","onAfterLeave"])]}),_:1},8,["appendTo"])}ge.render=ye;export{_ as n,P as r,ge as t};
