import{aw as m,J as x,az as q,c_ as c,c as r,a as u,t as o,h as d,F as v,u as b,aB as S,q as y,o as n,e as h,a7 as p,ba as L,c$ as B,z as f,r as k}from"./index-16sqk8Bx.js";const C=["id"],z=["data-size"],F={key:0,class:"flex flex-nowrap items-center gap-1 whitespace-nowrap line-clamp-2"},A={class:"flex whitespace-nowrap leading-6"},j=m({__name:"TrackLinks",props:{data:{type:Array,required:!0},type:{type:String,required:!0},onclick:{type:Function,required:!1},onkeyup:{type:Function,required:!1},title:{type:String,required:!1},suffix:{type:String,required:!1}},setup(e){const t=e;x(t,()=>{const a=document.querySelector(`#trackLink-${t.type}-${t.suffix}`);a&&c(a)}),q(()=>{const a=document.querySelector(`#trackLink-${t.type}-${t.suffix}`);a&&c(a)});const s=a=>{var i;a.stopPropagation(),B(),(i=t.onclick)==null||i.call(t,a)};return(a,i)=>{const g=y("RouterLink");return e.data?(n(),r("div",{key:0,"data-marquee":"container",id:`trackLink-${e.type}-${e.suffix}`,onClick:i[1]||(i[1]=l=>l.stopPropagation()),class:"-ml-1 h-auto w-available"},[u("div",{"data-size":S(L),"data-marquee":"scroller",class:"mb-1 ml-1 flex w-fit flex-nowrap items-center gap-1 overflow-clip text-slate-light-12/11 dark:text-slate-dark-12/11 line-clamp-2 whitespace-break-spaces hover-animate-pause w-available sm:my-0.5"},[e.title?(n(),r("span",F,o(e.title?`${e.title} - `:""),1)):d("",!0),(n(!0),r(v,null,b(e.data,(l,$)=>(n(),h(g,{key:l.id,to:l.link,onkeyup:e.onkeyup,tabindex:"0","data-target":"album",onClick:i[0]||(i[0]=w=>s(w)),class:"flex items-center gap-1 whitespace-nowrap font-semibold line-clamp-1 hover:underline focus:underline dark:font-medium pointer-events-auto"},{default:p(()=>[u("span",A,o(l.name)+o($<e.data.length-1?",":""),1)]),_:2},1032,["to","onkeyup"]))),128))],8,z)],8,C)):d("",!0)}}}),R=["id","aria-label","onclick"],M=m({__name:"BannerButton",props:{title:{type:String,required:!0},href:{type:String,required:!1},isActive:{type:Boolean,required:!1,default:!1},onclick:{type:Function,required:!1}},setup(e){return(t,s)=>{const a=y("RouterLink");return e.href?(n(),h(a,{key:0,to:e.href,title:"watch",id:t.$t(e.title),"aria-label":t.$t(e.title),onclick:e.onclick,class:f(`flex justify-center items-center relative gap-2 p-2 rounded-lg hover:bg-auto-5/6 transition-colors duration-300 ${e.isActive?"text-focus":"text-auto-12"}`)},{default:p(()=>[k(t.$slots,"default")]),_:3},8,["to","id","aria-label","onclick","class"])):(n(),r("button",{key:1,id:t.$t(e.title),"aria-label":t.$t(e.title),onclick:e.onclick,class:f(`flex justify-center items-center relative gap-2 p-2 rounded-lg hover:bg-auto-5/6 transition-colors duration-300 ${e.isActive?"text-focus":"text-auto-12"}`)},[k(t.$slots,"default")],10,R))}}});export{M as _,j as a};
//# sourceMappingURL=BannerButton.vue_vue_type_script_setup_true_lang-DfBgVC_D.js.map