import{aw as E,a_ as G,bs as H,q as B,o as S,e as q,a7 as r,v as a,a6 as x,t as u,aB as s,a as t,bw as F,b3 as X,bu as Y,I as c,aW as Z,az as ee,J as A,b1 as C,h as le}from"./index-DTULoChM.js";import{_ as te}from"./DashboardLayout.vue_vue_type_script_setup_true_lang-j8_PO7vS.js";import{_ as oe}from"./Modal.vue_vue_type_script_setup_true_lang-BwNQBanW.js";import{_ as $}from"./Button.vue_vue_type_script_setup_true_lang-DUbAAbMZ.js";import{a as y}from"./index-CsHBUI3A.js";import"./useMounted-6yX7oy7E.js";import"./FloatingBackButton.vue_vue_type_script_setup_true_lang-CWAZZvNA.js";const ae={class:"my-6 text-sm text-auto-10"},se=E({__name:"DeleteSpecialModal",props:{open:{type:Boolean,required:!0},close:{type:Function,required:!0},id:{type:String,required:!0},name:{type:String,required:!0},noRedirect:{type:Boolean,default:!1}},setup(p){const n=p,{t:d}=G(),h=H(),k=()=>{F().delete(`dashboard/specials/${n.id}`).then(({data:o})=>{h.invalidateQueries({queryKey:["dashboard","specials"]}),!n.noRedirect&&window.history.back()}),n.close()};return(o,g)=>{const w=B("Button");return S(),q(oe,{close:p.close,open:p.open,maxWidth:"max-w-xl",params:{special:n.name},title:"Delete special {{special}}"},{actions:r(()=>[a(w,{id:"yes",onclick:k,endIcon:"trash",color:"red",type:"button"},{default:r(()=>[x(u(s(d)("Delete")),1)]),_:1}),a(w,{id:"no",onClick:p.close,type:"button",color:"text-auto-alpha-11",variant:"text"},{default:r(()=>[x(u(s(d)("Cancel")),1)]),_:1},8,["onClick"])]),default:r(()=>[t("div",ae,u(s(d)("Are you sure you want to delete this special?")),1)]),_:1},8,["close","open","params"])}}}),re={class:"flex flex-col gap-5 col-span-5 col-start-1 2xl:col-start-1"},ie={class:"flex flex-col gap-2"},ne={class:"flex flex-col gap-2"},de={class:"flex gap-4 w-full"},ce={class:"flex flex-col gap-4 w-full"},ue={class:"flex flex-col gap-2"},pe={class:"flex flex-col gap-4 w-full"},me={class:"flex flex-col gap-2"},fe={class:"flex flex-col gap-4 col-span-2 row-start-1 col-start-1 2xl:col-start-6"},ve={class:"flex flex-col gap-5"},xe={class:"flex flex-col gap-2"},Ve=E({__name:"Edit",setup(p){var I,U,D,N,R;const n=X(),{data:d,error:h,refetch:k}=Y({path:"dashboard/specials",queryKey:["dashboard","specials"]}),o=c();Z(()=>{k()}),ee(()=>{d.value&&(o.value=d.value.find(e=>e.id==n.params.id))}),A(d,e=>{e&&(o.value=e.find(l=>l.id==n.params.id))});const g=c(!1),w=()=>{g.value=!0},J=()=>{g.value=!1},L=()=>{window.history.back()},_=c(((I=o.value)==null?void 0:I.title)||""),b=c(((U=o.value)==null?void 0:U.overview)||""),m=c(((D=o.value)==null?void 0:D.backdrop)||""),f=c(((N=o.value)==null?void 0:N.poster)||""),v=c(((R=o.value)==null?void 0:R.logo)||"");A(o,e=>{e&&(_.value=e==null?void 0:e.title,b.value=e==null?void 0:e.overview,m.value=e==null?void 0:e.backdrop,f.value=e==null?void 0:e.poster,v.value=e==null?void 0:e.logo)});const P=()=>{var e;F().patch(`/dashboard/specials/${(e=o.value)==null?void 0:e.id}`,{title:_.value,overview:b.value,backdrop:m.value,poster:f.value,logo:v.value}).then(({data:l})=>{console.log(l)})};return(e,l)=>{var T;const j=B("Textarea"),V=B("Image");return S(),q(te,{gridStyle:1,error:s(h),title:"Special: {{title}}",params:{title:(T=o.value)==null?void 0:T.title}},{cta:r(()=>l[5]||(l[5]=[])),actions:r(()=>[a($,{type:"button",id:"remove",variant:"text",startIcon:"folderRemove",class:"children:text-gray-400 children:transition-colors children:duration-100 children:hover:text-red-dark-8",color:"text-auto-alpha-11",onClick:w},{default:r(()=>[x(u(e.$t("Remove")),1)]),_:1}),a($,{type:"button",id:"cancel",variant:"text",color:"white",onClick:L},{default:r(()=>[x(u(e.$t("Cancel")),1)]),_:1}),a($,{type:"button",id:"save",class:"ml-auto",color:"theme",onClick:P},{default:r(()=>[x(u(e.$t("Save")),1)]),_:1})]),default:r(()=>{var M,K,O,Q,W,z;return[t("div",re,[t("div",ie,[l[6]||(l[6]=t("label",{for:"name"},"Name",-1)),a(s(y),{variant:"filled",id:"name",modelValue:_.value,"onUpdate:modelValue":l[0]||(l[0]=i=>_.value=i),class:"w-full"},null,8,["modelValue"])]),t("div",ne,[l[7]||(l[7]=t("label",{for:"overview"},"Overview",-1)),a(j,{variant:"filled",rows:8,id:"overview",modelValue:b.value,"onUpdate:modelValue":l[1]||(l[1]=i=>b.value=i),class:"w-full"},null,8,["modelValue"])]),t("div",de,[t("div",ce,[t("div",ue,[l[8]||(l[8]=t("label",{for:"backdrop"},"Backdrop",-1)),a(s(y),{variant:"filled",id:"backdrop",modelValue:m.value,"onUpdate:modelValue":l[2]||(l[2]=i=>m.value=i),class:"w-full"},null,8,["modelValue"])]),a(V,{src:`${(M=s(C))==null?void 0:M.serverBaseUrl}/images/original${m.value}`,alt:"Image",width:"100%",class:"mx-2",preview:""},null,8,["src"])]),t("div",pe,[t("div",me,[l[9]||(l[9]=t("label",{for:"logo"},"Logo",-1)),a(s(y),{variant:"filled",id:"logo",modelValue:v.value,"onUpdate:modelValue":l[3]||(l[3]=i=>v.value=i),class:"w-full"},null,8,["modelValue"])]),a(V,{src:`${(K=s(C))==null?void 0:K.serverBaseUrl}/images/original${v.value}`,alt:"Image",width:"100%",class:"mx-2",preview:""},null,8,["src"])])])]),t("div",fe,[t("div",ve,[t("div",xe,[l[10]||(l[10]=t("label",{for:"poster"},"Poster",-1)),a(s(y),{variant:"filled",id:"poster",modelValue:f.value,"onUpdate:modelValue":l[4]||(l[4]=i=>f.value=i),class:"w-full"},null,8,["modelValue"])]),a(V,{src:`${(O=s(C))==null?void 0:O.serverBaseUrl}/images/original${f.value}`,alt:"Image",width:"100%",class:"mx-2",preview:""},null,8,["src"])])]),(Q=o.value)!=null&&Q.id?(S(),q(se,{key:0,id:(W=o.value)==null?void 0:W.id,name:(z=o.value)==null?void 0:z.title,close:J,open:g.value},null,8,["id","name","open"])):le("",!0)]}),_:1},8,["error","params"])}}});export{Ve as default};
//# sourceMappingURL=Edit-BlU-wSNg.js.map