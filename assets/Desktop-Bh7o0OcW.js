import{aw as u,o as a,e as l,a7 as t,a as d,aG as b,c as p,t as f,bu as k,aB as o,q as y,v as c,a6 as C,u as g,F as v,bF as x,bG as w,bw as B,bd as $}from"./index-DTULoChM.js";import{_ as S}from"./DashboardLayout.vue_vue_type_script_setup_true_lang-j8_PO7vS.js";import{_ as j}from"./DashboardCard.vue_vue_type_script_setup_true_lang-Cb14V4JF.js";import"./useMounted-6yX7oy7E.js";import"./FloatingBackButton.vue_vue_type_script_setup_true_lang-CWAZZvNA.js";import"./Button.vue_vue_type_script_setup_true_lang-DUbAAbMZ.js";const q={class:"relative flex flex-shrink-0 flex-grow-0 flex-col items-center justify-center self-stretch overflow-clip rounded-lg bg-theme-8 aspect-poster"},F={key:1,class:"text-xl font-bold"},I=u({__name:"SpecialCard",props:{data:{type:Object,required:!0}},setup(e){return(i,r)=>(a(),l(j,{route:`/dashboard/specials/${e.data.id}`,line1:e.data.title},{image:t(()=>[d("div",q,[r[0]||(r[0]=d("div",{class:"backdropCard-overlay"},null,-1)),e.data.poster?(a(),l(b,{key:0,path:e.data.poster,class:"z-0 h-full","class-name":"h-full object-cover"},null,8,["path"])):(a(),p("span",F,f(e.data.title),1))])]),_:1},8,["route","line1"]))}}),A=u({__name:"Desktop",setup(e){const{data:i,error:r}=k({path:"specials?page=0&take=20",queryKey:["dashboard","specials"]}),m=()=>{B().post("dashboard/specials").then(({data:s})=>{var n;$.push(`/dashboard/special/${((n=s==null?void 0:s.data)==null?void 0:n.id)??"unknown"}`)})};return(s,n)=>{const _=y("Button");return a(),l(o(w),null,{default:t(()=>[c(o(x),{fullscreen:!0},{default:t(()=>[c(S,{error:o(r),gridStyle:1,title:"Specials",description:"Manage your specials and their content here."},{cta:t(()=>[c(_,{id:"newLibrary",color:"theme",startIcon:"collectionAdd",onClick:m},{default:t(()=>[C(f(s.$t("Create special")),1)]),_:1})]),default:t(()=>[(a(!0),p(v,null,g(o(i)??[],h=>(a(),l(I,{data:h},null,8,["data"]))),256))]),_:1},8,["error"])]),_:1})]),_:1})}}});export{A as default};
//# sourceMappingURL=Desktop-Bh7o0OcW.js.map