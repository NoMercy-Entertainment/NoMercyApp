import{aw as j,b3 as P,bu as D,I as B,J as $,aE as O,ei as x,ej as C,aD as S,aF as R,e as m,a7 as I,aB as r,ek as W,b_ as G,el as J,o as n,v,bx as M,c as T,a as E,z as q,cl as F,b6 as H,F as A,u as K,h as Q,bF as U,bG as X}from"./index-BfnbdnLX.js";import{_ as Y,a as Z,S as ee,b as te}from"./TrackRow.vue_vue_type_script_setup_true_lang-lVK-A-1J.js";import{_ as se}from"./NotFound.vue_vue_type_script_setup_true_lang-I-fObtb2.js";import"./BigPlayButton.vue_vue_type_script_setup_true_lang-CEyOeEwg.js";import"./FavoriteImage.vue_vue_type_script_setup_true_lang-CffMS40V.js";import"./BannerButton.vue_vue_type_script_setup_true_lang-CjinJJZK.js";const ae={class:"relative z-0 flex h-auto flex-shrink-0 flex-grow flex-col items-start justify-start self-stretch"},de=j({__name:"Desktop",setup(re){const w=P(),{data:a,isError:V}=D({path:w.fullPath,keepForever:!0}),z=B(null),h=B(),c=B("");$(a,e=>{var s,l;e&&(G((e==null?void 0:e.name)??null),p((e==null?void 0:e.tracks)??[],C.value,x.value,c.value),(s=e==null?void 0:e.color_palette)!=null&&s.cover&&S((l=e==null?void 0:e.color_palette)==null?void 0:l.cover))}),$(x,e=>{var s;p(((s=a.value)==null?void 0:s.tracks)??[],C.value,e,c.value)}),$(C,e=>{var s;p(((s=a.value)==null?void 0:s.tracks)??[],e,x.value,c.value)}),$(c,e=>{var s;p(((s=a.value)==null?void 0:s.tracks)??[],C.value,x.value,e)});const p=(e,s,l,t)=>{const i=W(e??[],s,l,J);t==""?h.value=i:h.value=(i==null?void 0:i.filter(o=>{var f,u,_,b,k,y;return((u=o.name)==null?void 0:u.toLowerCase().includes((f=t==null?void 0:t.toLowerCase)==null?void 0:f.call(t)))||((_=o.artist_track)==null?void 0:_.some(L=>{var g;return L.name.toLowerCase().includes((g=t==null?void 0:t.toLowerCase)==null?void 0:g.call(t))}))||((y=(b=o.album_track)==null?void 0:b[0])==null?void 0:y.name.toLowerCase().includes((k=t==null?void 0:t.toLowerCase)==null?void 0:k.call(t)))}))??[]};O(()=>{var e,s,l,t,i,o;(e=a==null?void 0:a.value)!=null&&e.tracks&&p(((s=a==null?void 0:a.value)==null?void 0:s.tracks)??[],C.value,x.value,c.value),(t=(l=a.value)==null?void 0:l.color_palette)!=null&&t.cover&&S((o=(i=a.value)==null?void 0:i.color_palette)==null?void 0:o.cover)}),R(()=>{document.getElementById("navbar")&&(document.getElementById("navbar").style.display="flex"),S(null)});const d=B(),N=()=>{var s,l,t,i,o,f,u,_,b,k,y,L,g;if(window.CSS.supports("container-type","scroll-state"))return;Math.ceil(((t=(l=(s=d.value)==null?void 0:s.$el)==null?void 0:l.getBoundingClientRect())==null?void 0:t.top)??500)<=67?((o=(i=d.value)==null?void 0:i.$el)==null||o.classList.add("!bg-focus"),(_=(u=(f=d.value)==null?void 0:f.$el)==null?void 0:u.firstChild)==null||_.classList.add("!bg-black/50")):((k=(b=d.value)==null?void 0:b.$el)==null||k.classList.remove("!bg-focus"),(g=(L=(y=d.value)==null?void 0:y.$el)==null?void 0:L.firstChild)==null||g.classList.remove("!bg-black/50"))};return(e,s)=>(n(),m(r(X),null,{default:I(()=>[v(r(U),{fullscreen:!0,class:"flex"},{default:I(()=>[r(V)?(n(),m(se,{key:0})):(n(),m(M,{key:1,autoHide:!0,static:!0,onScroll:N},{default:I(()=>{var l,t,i;return[!r(w).params.id||r(w).params.id&&((l=r(a))==null?void 0:l.id)==r(w).params.id?(n(),T("div",{key:0,ref_key:"main",ref:z,class:"flex flex-col overflow-x-clip w-available h-available sm:rounded-2xl"},[v(Y,{data:r(a)},null,8,["data"]),E("div",ae,[s[1]||(s[1]=E("div",{class:"pointer-events-none absolute z-0 h-96 w-full bg-spotifyBottom bg-focus"},null,-1)),(n(),m(Z,{key:(t=r(a))==null?void 0:t.id,data:r(a),filter:c.value,onFilterChange:s[0]||(s[0]=o=>c.value=o)},null,8,["data","filter"])),E("div",{class:q(["flex flex-1 flex-shrink-0 flex-col items-start justify-start self-stretch bg-slate-light-1 dark:bg-slate-dark-2 flex-grow-1 gap-0.5 sm:p-4",{"pb-24":r(F)&&!r(H),"pb-40":r(F)&&r(H),"pb-4 sm:pb-4":!r(F)&&r(H)}])},[(n(),m(ee,{ref_key:"sortHeader",ref:d,key:(i=r(a))==null?void 0:i.id})),(n(!0),T(A,null,K(h.value,(o,f)=>(n(),m(te,{key:o.id,data:o,displayList:h.value,index:f},null,8,["data","displayList","index"]))),128))],2)])],512)):Q("",!0)]}),_:1}))]),_:1})]),_:1}))}});export{de as default};
//# sourceMappingURL=Desktop-CHLViU59.js.map