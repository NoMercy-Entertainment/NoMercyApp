import{aw as X,bu as Y,I as l,J as t,az as Z,aC as ee,bs as re,e as se,a7 as v,aB as u,q as oe,o as V,v as i,a6 as ae,t as A,c as y,a,h as C,b1 as J,aM as le,bv as te,bF as ne,bG as ue,bz as ie,bw as de}from"./index-DTULoChM.js";import{_ as _e}from"./DashboardLayout.vue_vue_type_script_setup_true_lang-j8_PO7vS.js";import{a as me}from"./index-CsHBUI3A.js";import{s as q}from"./index-DdYJLydt.js";import"./useMounted-6yX7oy7E.js";import"./FloatingBackButton.vue_vue_type_script_setup_true_lang-CWAZZvNA.js";import"./Button.vue_vue_type_script_setup_true_lang-DUbAAbMZ.js";const ve={key:0,class:"col-span-2 col-start-1 2xl:col-start-1"},pe={class:"flex flex-col gap-2"},fe={class:"flex flex-col gap-2"},we={class:"flex flex-col gap-2"},ce={key:1,class:"col-span-2 col-start-1 2xl:col-start-3"},ge={class:"flex flex-col gap-2"},ke={class:"flex flex-col gap-2"},xe={class:"flex flex-col gap-2"},be={key:2,class:"col-span-2 col-start-1 2xl:col-start-5"},Ve={class:"flex flex-col gap-2"},qe={class:"flex gap-4"},Be=["href"],he=X({__name:"Desktop",setup(ye){var I,$,N,h,z,O,Q,D,E,F;const{data:s,refetch:K,error:R}=Y({path:"/dashboard/configuration"}),p=l(!1),n=l(s.value??{}),d=(e,r)=>{if(s.value){if(ie(s.value[e])==r){delete n.value[e],n.value={...n.value};return}n.value={...n.value,[e]:r??void 0}}};t(s,e=>{e&&(n.value={},f.value=e==null?void 0:e.server_name,w.value=e==null?void 0:e.external_server_port,c.value=e==null?void 0:e.internal_server_port,g.value=e==null?void 0:e.queue_workers,S.value=e==null?void 0:e.cron_workers,U.value=e==null?void 0:e.data_workers,G.value=e==null?void 0:e.request_workers,x.value=e==null?void 0:e.encoder_workers,k.value=e==null?void 0:e.image_workers,_.value=e==null?void 0:e.swagger,p.value=!0)}),Z(()=>{var e,r,B,m,b,o,M,P,T,j;s.value&&(n.value={},f.value=(e=s.value)==null?void 0:e.server_name,w.value=(r=s.value)==null?void 0:r.external_server_port,c.value=(B=s.value)==null?void 0:B.internal_server_port,g.value=(m=s.value)==null?void 0:m.queue_workers,S.value=(b=s.value)==null?void 0:b.cron_workers,U.value=(o=s.value)==null?void 0:o.data_workers,G.value=(M=s.value)==null?void 0:M.request_workers,x.value=(P=s.value)==null?void 0:P.encoder_workers,k.value=(T=s.value)==null?void 0:T.image_workers,_.value=(j=s.value)==null?void 0:j.swagger,p.value=!0)});const f=l(((I=s.value)==null?void 0:I.server_name)??"");t(f,e=>{d("server_name",e)});const w=l((($=s.value)==null?void 0:$.external_server_port)??0);t(w,e=>{d("external_server_port",e)});const c=l(((N=s.value)==null?void 0:N.internal_server_port)??0);t(c,e=>{d("internal_server_port",e)});const g=l(((h=s.value)==null?void 0:h.queue_workers)??0);t(g,e=>{d("queue_workers",e)});const S=l(((z=s.value)==null?void 0:z.cron_workers)??0);t(S,e=>{d("cron_workers",e)});const U=l(((O=s.value)==null?void 0:O.data_workers)??0);t(U,e=>{d("data_workers",e)});const G=l(((Q=s.value)==null?void 0:Q.request_workers)??0);t(G,e=>{d("request_workers",e)});const k=l(((D=s.value)==null?void 0:D.image_workers)??0);t(k,e=>{d("image_workers",e)});const x=l(((E=s.value)==null?void 0:E.encoder_workers)??0);t(x,e=>{d("encoder_workers",e)});const _=l(((F=s.value)==null?void 0:F.swagger)??!1);t(_,e=>{d("swagger",e)});const H=ee(()=>Object.keys(n.value).length>0);t(n,e=>{console.log(e)});const L=re(),W=()=>{console.raw(n.value),de().patch("/dashboard/configuration",n.value).then(()=>{K(),L.invalidateQueries({queryKey:["serverInfo"]})})};return(e,r)=>{const B=oe("Button");return V(),se(u(ue),null,{default:v(()=>[i(u(ne),{fullscreen:!0},{default:v(()=>[i(_e,{error:u(R),gridStyle:2,title:"General",description:""},{cta:v(()=>r[8]||(r[8]=[])),actions:v(()=>[i(B,{type:"submit",id:"save",disabled:!H.value,color:"theme",class:"ml-auto",form:"myForm",onClick:r[7]||(r[7]=m=>W())},{default:v(()=>[ae(A(e.$t("Save")),1)]),_:1},8,["disabled"])]),default:v(()=>{var m,b;return[p.value?(V(),y("div",ve,[a("div",pe,[r[9]||(r[9]=a("label",{for:"server_name"},"Server name",-1)),i(u(me),{id:"server_name",modelValue:f.value,"onUpdate:modelValue":r[0]||(r[0]=o=>f.value=o),class:"mb-4"},null,8,["modelValue"])]),a("div",fe,[r[10]||(r[10]=a("label",{for:"internal_server_port"},"Secure internal port",-1)),i(u(q),{id:"internal_server_port",modelValue:c.value,"onUpdate:modelValue":r[1]||(r[1]=o=>c.value=o),class:"mb-4",useGrouping:!1,showButtons:"",min:2e3},null,8,["modelValue"])]),a("div",we,[r[11]||(r[11]=a("label",{for:"external_server_port"},"Secure external port",-1)),i(u(q),{id:"external_server_port",modelValue:w.value,"onUpdate:modelValue":r[2]||(r[2]=o=>w.value=o),class:"mb-4",useGrouping:!1,showButtons:"",min:2e3},null,8,["modelValue"])])])):C("",!0),p.value?(V(),y("div",ce,[a("div",ge,[r[12]||(r[12]=a("label",{for:"encoder_workers"},"Encoder workers",-1)),i(u(q),{id:"encoder_workers",modelValue:x.value,"onUpdate:modelValue":r[3]||(r[3]=o=>x.value=o),class:"mb-4",useGrouping:!1,showButtons:"",min:0},null,8,["modelValue"])]),a("div",ke,[r[13]||(r[13]=a("label",{for:"image_workers"},"Image workers",-1)),i(u(q),{id:"image_workers",modelValue:k.value,"onUpdate:modelValue":r[4]||(r[4]=o=>k.value=o),class:"mb-4",useGrouping:!1,showButtons:"",min:0},null,8,["modelValue"])]),a("div",xe,[r[14]||(r[14]=a("label",{for:"queue_workers"},"Queue workers",-1)),i(u(q),{id:"queue_workers",modelValue:g.value,"onUpdate:modelValue":r[5]||(r[5]=o=>g.value=o),class:"mb-4",useGrouping:!1,showButtons:"",min:0},null,8,["modelValue"])])])):C("",!0),p.value?(V(),y("div",be,[a("div",Ve,[a("span",qe,[r[15]||(r[15]=a("label",{for:"swagger"},"Open API / Swagger Ui",-1)),_.value&&((m=u(J))!=null&&m.serverBaseUrl)?(V(),y("a",{key:0,target:"_blank",href:(b=u(J))==null?void 0:b.serverBaseUrl,class:"flex gap-1 items-center underline underline-offset-4 h-4 text-sm"},[a("span",null,A(e.$t("Open")),1),i(le,{icon:"shareSquare",className:"size-4",color:"theme"})],8,Be)):C("",!0)]),i(te,{"model-value":_.value,"onUpdate:modelValue":r[6]||(r[6]=o=>_.value=o)},null,8,["model-value"])])])):C("",!0)]}),_:1},8,["error"])]),_:1})]),_:1})}}});export{he as default};
//# sourceMappingURL=Desktop-BGqmc0c0.js.map