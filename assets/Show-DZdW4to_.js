import{aw as b,bt as l,b3 as h,aC as y,e as m,a7 as o,aB as e,o as i,v as u,c as k,u as C,F as g,bE as w,bF as B}from"./index-Cy6EBPTS.js";import{_ as E}from"./DashboardLayout.vue_vue_type_script_setup_true_lang-msYCKxMH.js";import{_ as x}from"./ActivityCard.vue_vue_type_script_setup_true_lang-Dagqr8YD.js";import"./FloatingBackButton.vue_vue_type_script_setup_true_lang-DoNfhQ4s.js";import"./Button.vue_vue_type_script_setup_true_lang-CXyv21Qd.js";import"./index-DHoa3IUj.js";const D=b({__name:"Show",setup(F){const{data:d,error:p}=l({path:"dashboard/devices",queryKey:["dashboard","devices"]}),{data:v,error:_}=l({path:"dashboard/activity",refetchInterval:1e3*20,data:{take:999},queryKey:["server","activity"]}),t=h(),f=y(()=>{var n,r;return(r=(n=d.value)==null?void 0:n.find(s=>s.device_id===(t==null?void 0:t.params.id)))==null?void 0:r.custom_name});return(n,r)=>(i(),m(e(B),null,{default:o(()=>[u(e(w),{fullscreen:!0},{default:o(()=>[u(E,{params:{name:f.value},title:"Device avtivity: {{name}}",error:e(p)||e(_),gridStyle:2},{cta:o(()=>r[0]||(r[0]=[])),default:o(()=>{var s;return[(i(!0),k(g,null,C(((s=e(v))==null?void 0:s.filter(a=>{var c;return a.device_id==((c=e(t))==null?void 0:c.params.id)}))??[],a=>(i(),m(x,{devices:e(d)??[],key:a==null?void 0:a.id,activity:a,class:"col-span-2 gap-3 w-full"},null,8,["devices","activity"]))),128))]}),_:1},8,["params","error"])]),_:1})]),_:1}))}});export{D as default};
//# sourceMappingURL=Show-DZdW4to_.js.map