import{aw as i,aC as a,e as c,a7 as d,aB as u,o as f,a as e,t,bF as h}from"./index-C8FQwx1l.js";const p={class:"grid h-full w-full place-items-center"},x={class:"relative flex flex-col items-center justify-start gap-8 overflow-hidden"},_={class:"relative flex w-full flex-col gap-4"},g={class:"text-7xl font-bold text-center text-slate-light-11 dark:text-slate-dark-11"},m={class:"left-0 text-2xl text-center text-slate-light-11 dark:text-slate-dark-11 whitespace-pre-line"},w={class:"h-6 w-full flex-shrink-0 flex-grow-0"},v={class:"h-6 w-full"},k={class:"absolute w-full text-base text-center text-slate-light-11 dark:text-slate-dark-11 underline underline-offset-4"},S=i({__name:"Desktop",props:{status:{type:Number,required:!0},message:{type:String,required:!0}},setup(o){const s=o,r=a(()=>({503:"Service Unavailable",500:"Server Error",404:"Page Not Found",403:"Forbidden"})[s.status]),l=a(()=>({503:`Sorry, we are doing some maintenance.
 Please check back soon.`,500:"Whoops, something went wrong on our servers.",404:"Sorry, we were unable to find that page.",403:"Sorry, you are forbidden from accessing this page."})[s.status]);return(n,b)=>(f(),c(u(h),null,{default:d(()=>[e("div",p,[e("div",x,[e("div",_,[e("p",g,t(r.value),1),e("p",m,t(l.value),1)]),e("div",w,[e("div",v,[e("button",k,t(n.$t("Send me back to the home page")),1)])])])])]),_:1}))}});export{S as default};
//# sourceMappingURL=Desktop-D8FmtJ4j.js.map