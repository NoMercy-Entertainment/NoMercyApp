import{aw as H,c7 as J,e3 as K,aC as L,az as O,bZ as R,aT as $,aE as P,J as U,c8 as Z,I as f,e as u,a7 as v,aB as s,aO as j,o as r,v as S,bw as A,bd as z,c as i,a as G,F as g,u as F,h as I,z as T,ck as h,b6 as y,bE as Q,bF as W}from"./index-16sqk8Bx.js";import{_ as X}from"./MediaCard.vue_vue_type_script_setup_true_lang-DhFDuLs-.js";import{_ as Y}from"./PersonCard.vue_vue_type_script_setup_true_lang-BNYGF1Ur.js";import{_ as ee,a as ae}from"./EmptyCard.vue_vue_type_script_setup_true_lang-bp1m-LXX.js";import"./CardIndicator.vue_vue_type_script_setup_true_lang-xAOK-EHL.js";import"./NoResultImage.vue_vue_type_script_setup_true_lang-DJOxIJwi.js";const se="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 5xl:grid-cols-9 tv:grid-cols-6",ne="grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-10 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6",ie=H({__name:"Desktop",setup(re){var w,m;const b=J(),{data:o,fetchNextPage:k,hasNextPage:C}=K({queryKey:["libraries",((m=(w=b.currentRoute)==null?void 0:w.value)==null?void 0:m.params.id)??b.currentRoute.value.name],limit:20,keepForever:!0}),V=L(()=>{var a,n,t,l,d,p;return j.value&&((t=(n=(a=o.value)==null?void 0:a.pages)==null?void 0:n[0])==null?void 0:t.data[0].media_type)!=="person"&&((p=(d=(l=o.value)==null?void 0:l.pages)==null?void 0:d[0])==null?void 0:p.data[0].media_type)!=="genres"});O(()=>{var a,n;R(),$(null),P(null),C.value&&(((n=(a=o==null?void 0:o.value)==null?void 0:a.pages)==null?void 0:n.length)??0)<50&&k(),document.dispatchEvent(new Event("sidebar")),setTimeout(()=>{document.dispatchEvent(new Event("indexer"))},500)}),U(o,a=>{var n;a&&(C.value&&((n=a==null?void 0:a.pages)==null?void 0:n.length)<50&&k(),setTimeout(()=>{document.dispatchEvent(new Event("indexer"))},500))}),Z(()=>{R(),$(null),P(null)}),f([]);const q=f(),D=f(),_=(a,n)=>{q.value=n,D.value.show(a)};return(a,n)=>(r(),u(s(W),null,{default:v(()=>[S(s(Q),{fullscreen:!0},{default:v(()=>[S(A,{autoHide:!0,static:!0,id:s(z).currentRoute.value.fullPath},{default:v(()=>{var t,l;return[(r(),i("div",{class:T(["z-0 flex flex-col gap-4 rounded-3xl border-0 p-4 w-available scrollbar-none border-auto-3",{"pb-24":s(h)&&!s(y),"pb-40":s(h)&&s(y),"children:pb-4 sm:children:pb-3":!s(h)&&s(y)}]),key:(t=s(z).currentRoute.value.params)==null?void 0:t.id},[G("div",{class:T(`grid w-full gap-4 scroll-smooth music-showing:pb-0 whitespace-pre ${V.value?se:ne}`)},[(r(!0),i(g,null,F(((l=s(o))==null?void 0:l.pages)??[],(d,p)=>{var E,B,M,N;return r(),i(g,{key:p},[d.data.length>0?(r(!0),i(g,{key:0},F(d.data??[],(e,x)=>(r(),i(g,null,[(e==null?void 0:e.media_type)==="tv"||(e==null?void 0:e.media_type)=="movie"||(e==null?void 0:e.media_type)=="collection"||(e==null?void 0:e.media_type)=="specials"?(r(),u(X,{key:e.id,data:e,onContextMenu:c=>_(c,e),index:x},null,8,["data","onContextMenu","index"])):(e==null?void 0:e.media_type)==="person"?(r(),u(Y,{key:e.id+"_person",data:e,onContextMenu:c=>_(c,e),index:x},null,8,["data","onContextMenu","index"])):(e==null?void 0:e.media_type)==="genres"?(r(),u(ee,{key:e.id+"_genres",data:e,onContextMenu:c=>_(c,e),index:x},null,8,["data","onContextMenu","index"])):I("",!0)],64))),256)):((N=(M=(B=(E=s(o))==null?void 0:E.pages)==null?void 0:B[0])==null?void 0:M.data)==null?void 0:N.length)==0?(r(),u(ae,{key:1})):I("",!0)],64)}),128))],2)],2))]}),_:1},8,["id"])]),_:1})]),_:1}))}});export{ie as default};
//# sourceMappingURL=Desktop-BzchEmsQ.js.map