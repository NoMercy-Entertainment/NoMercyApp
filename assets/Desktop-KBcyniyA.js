import{B as ve,br as he,d as me,o as f,c as C,a as i,m as K,aw as O,aC as h,eM as X,d1 as Y,t as S,au as I,eN as Z,eO as P,eP as ge,eQ as ee,eR as te,bu as N,b1 as re,I as b,az as R,eb as ye,eS as xe,eT as be,e as x,a7 as m,v as y,u as ae,F as E,h as A,aB as w,eU as J,J as we,bF as Ce,bG as ke}from"./index-DTULoChM.js";import{c as _,d as se,_ as _e}from"./DashboardLayout.vue_vue_type_script_setup_true_lang-j8_PO7vS.js";import{u as Pe}from"./useMounted-6yX7oy7E.js";import{u as Se}from"./useHubListener-BKcrtVRJ.js";import{a as G,S as $e,_ as Oe}from"./ServerTasksCard.vue_vue_type_script_setup_true_lang-4DRPbqqT.js";import{_ as je}from"./ActivityCard.vue_vue_type_script_setup_true_lang-Dpzk65LA.js";import"./FloatingBackButton.vue_vue_type_script_setup_true_lang-CWAZZvNA.js";import"./Button.vue_vue_type_script_setup_true_lang-DUbAAbMZ.js";import"./index-Bvq-E86L.js";var Ae={root:{position:"relative"}},Ie={root:"p-chart"},Ne=ve.extend({name:"chart",classes:Ie,inlineStyles:Ae}),Me={name:"BaseChart",extends:me,props:{type:String,data:null,options:null,plugins:null,width:{type:Number,default:300},height:{type:Number,default:150},canvasProps:{type:null,default:null}},style:Ne,provide:function(){return{$pcChart:this,$parentInstance:this}}},oe={name:"Chart",extends:Me,inheritAttrs:!1,emits:["select","loaded"],chart:null,watch:{data:{handler:function(){this.reinit()},deep:!0},type:function(){this.reinit()},options:function(){this.reinit()}},mounted:function(){this.initChart()},beforeUnmount:function(){this.chart&&(this.chart.destroy(),this.chart=null)},methods:{initChart:function(){var e=this;he(()=>import("./auto-Bax5IhbS.js"),[]).then(function(a){e.chart&&(e.chart.destroy(),e.chart=null),a&&a.default&&(e.chart=new a.default(e.$refs.canvas,{type:e.type,data:e.data,options:e.options,plugins:e.plugins})),e.$emit("loaded",e.chart)})},getCanvas:function(){return this.$canvas},getChart:function(){return this.chart},getBase64Image:function(){return this.chart.toBase64Image()},refresh:function(){this.chart&&this.chart.update()},reinit:function(){this.initChart()},onCanvasClick:function(e){if(this.chart){var a=this.chart.getElementsAtEventForMode(e,"nearest",{intersect:!0},!1),o=this.chart.getElementsAtEventForMode(e,"dataset",{intersect:!0},!1);a&&a[0]&&o&&this.$emit("select",{originalEvent:e,element:a[0],dataset:o})}},generateLegend:function(){if(this.chart)return this.chart.generateLegend()}}};function $(t){"@babel/helpers - typeof";return $=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},$(t)}function Q(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter(function(p){return Object.getOwnPropertyDescriptor(t,p).enumerable})),a.push.apply(a,o)}return a}function W(t){for(var e=1;e<arguments.length;e++){var a=arguments[e]!=null?arguments[e]:{};e%2?Q(Object(a),!0).forEach(function(o){Be(t,o,a[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):Q(Object(a)).forEach(function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(a,o))})}return t}function Be(t,e,a){return(e=De(e))in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function De(t){var e=Ue(t,"string");return $(e)=="symbol"?e:e+""}function Ue(t,e){if($(t)!="object"||!t)return t;var a=t[Symbol.toPrimitive];if(a!==void 0){var o=a.call(t,e||"default");if($(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var ze=["width","height"];function Re(t,e,a,o,p,v){return f(),C("div",K({class:t.cx("root"),style:t.sx("root")},t.ptmi("root")),[i("canvas",K({ref:"canvas",width:t.width,height:t.height,onClick:e[0]||(e[0]=function(u){return v.onCanvasClick(u)})},W(W({},t.canvasProps),t.ptm("canvas"))),null,16,ze)],16)}oe.render=Re;const Ee={class:"flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch text-slate-light-11/80 dark:text-slate-dark-11/80"},Ge={class:"flex flex-grow flex-col items-start justify-start gap-1 text-left"},qe={class:"relative flex flex-shrink-0 flex-grow-0 items-center justify-start self-stretch"},Ve={class:"w-8 flex-shrink-0 flex-grow-0 text-sm"},He={class:"relative h-2 flex-grow rounded-lg"},Le={class:"w-10 flex-shrink-0 flex-grow-0 text-right text-sm"},Te=O({__name:"ResourceBar",props:{cpu:{type:Number,required:!0,default:0},value:{type:Number,required:!0,default:0}},setup(t){const e=t,a=h(()=>X.value?Y(e.value,Z):"rgb(var(--color-focus))");return(o,p)=>(f(),C("div",Ee,[i("div",Ge,[i("div",qe,[i("p",Ve,S(t.cpu),1),i("div",He,[p[0]||(p[0]=i("div",{class:"absolute h-2 w-full rounded left-[-1px] top-[-1px] bg-auto-2 dark:bg-auto-1"},null,-1)),i("div",{class:"absolute h-2 rounded transition-all duration-500 left-[-1px] top-[-1px]",style:I({width:`${t.value}%`,backgroundImage:`linear-gradient(90deg, ${a.value} 0%, ${a.value} 100%)`})},null,4)]),i("p",Le,S(Math.floor(t.value))+"% ",1)])])]))}}),Fe={class:"relative flex aspect-video h-auto w-full flex-1 flex-shrink-0 flex-col items-start justify-center gap-1 flex-grow-1"},Ke={class:"relative h-full flex-1 flex-shrink-0 w-available"},Je={class:"absolute top-2/3 left-1/2 -translate-x-1/2 text-center font-semibold text-[2.5vw] monospace sm:text-[1.5vw] md:text-[2vw] lg:text-[1.2vw] 2xl:text-[1vw] 5xl:text-[0.6vw]"},Qe={class:"flex-shrink-0 flex-grow-0 scale-75 self-stretch text-center text-sm font-semibold w-available text-[2.5vw] sm:text-[1.5vw] md:text-[2vw] lg:text-[1.2vw] 2xl:text-[1vw] 5xl:text-[0.7vw]"},z=O({__name:"ResourceCircle",props:{name:{type:String,required:!0},value:{type:Number,required:!0},size:{type:Number,required:!0}},setup(t){const e=t,a=h(()=>{if(X.value)return Y(e.value,Z);switch(e.name){case"CPU":return P(te,50);case"Memory":return P(ee,50);case"GPU":return P(ge,50)}}),o=h(()=>Math.PI*72),p=h(()=>(1-(e.value==-1?0:e.value)/100)*o.value);return(v,u)=>(f(),C("div",Fe,[i("div",Ke,[(f(),C("svg",{viewBox:"0 0 152 148",fill:"none",xmlns:"http://www.w3.org/2000/svg",class:"absolute inset-2 mx-auto rounded",style:I({width:t.size*2,height:t.size*2}),preserveAspectRatio:"xMidYMid meet"},[u[0]||(u[0]=i("path",{d:"M148 76C148 66.5448 146.138 57.1822 142.519 48.4468C138.901 39.7114 133.598 31.7741 126.912 25.0883C120.226 18.4025 112.289 13.099 103.553 9.48068C94.8178 5.86234 85.4552 4 76 4C66.5448 3.99999 57.1823 5.86232 48.4468 9.48066C39.7114 13.099 31.7742 18.4025 25.0883 25.0883C18.4025 31.7741 13.099 39.7113 9.48069 48.4468C5.86234 57.1822 4 66.5448 4 76",class:"stroke-auto-2 dark:stroke-auto-1","stroke-width":"8","stroke-linecap":"round","stroke-linejoin":"round"},null,-1)),i("path",{class:"absolute -top-1 -left-1 h-2 rounded transition-all duration-500",d:"M4 76C4 56.9044 11.5857 38.5909 25.0883 25.0883C38.5909 11.5857 56.9044 4 76 4C95.0956 4 113.409 11.5857 126.912 25.0883C140.414 38.5909 148 56.9044 148 76",style:I({stroke:a.value,strokeDasharray:o.value,strokeDashoffset:p.value}),"stroke-width":"8","stroke-linecap":"round","stroke-linejoin":"round"},null,4)],4)),i("p",Je,S(t.value==-1?v.$t(""):Math.floor(t.value))+S(t.value==-1?"":"%"),1)]),i("p",Qe,S(t.name),1)]))}}),We={class:"flex items-start justify-between gap-2 overflow-clip w-available text-slate-light-12/80 dark:text-slate-dark-12/80"},Xe={class:"flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch"},j=40,Ye=O({__name:"ServerResourceCard",setup(t){var L;const{data:e}=N({path:"dashboard/server/info",queryKey:["serverInfo",(L=re.value)==null?void 0:L.serverBaseUrl]}),a=b(),o=b("graph"),p=b(Array(j).fill("")),v=b(Array(j).fill(null)),u=b(Array(j).fill(null)),M=b(Array(j).fill([null])),ne=r=>{r&&(a.value=r,v.value=[...v.value.slice(-40),V.value],u.value=[...u.value.slice(-40),H.value],M.value=[...M.value.slice(-40),B.value])};Pe(()=>{var r;return(r=_.value)==null?void 0:r.invoke("StartResources")},()=>{var r;return(r=_.value)==null?void 0:r.invoke("StopResources").catch()}),Se(_,"ResourceUpdate",ne);const le=()=>{var r;(r=_.value)==null||r.invoke("StartResources")};R(()=>{const r=ye();r==null||r.onreconnected(le)});const q=h(()=>{var r,s,n;return((n=(s=(r=a.value)==null?void 0:r.cpu)==null?void 0:s.core)==null?void 0:n.toSorted((l,c)=>l.index-c.index))??[]}),B=h(()=>{var r,s;return((s=(r=a.value)==null?void 0:r.gpu)==null?void 0:s.toSorted((n,l)=>n.index-l.index).map(n=>n.encode))??[]}),V=h(()=>{var r,s,n,l;return(n=(s=(r=a.value)==null?void 0:r.cpu)==null?void 0:s.core)!=null&&n.length?Math.floor(((l=q.value)==null?void 0:l.reduce((c,d)=>c+d.utilization,0))/q.value.length):-1}),H=h(()=>{var r,s,n,l;return((s=(r=a.value)==null?void 0:r.memory)==null?void 0:s.percentage)=="NaN"?-1:((l=(n=a.value)==null?void 0:n.memory)==null?void 0:l.percentage)??-1}),ie=h(()=>{var s,n,l;if(((n=(s=a.value)==null?void 0:s.gpu)==null?void 0:n.length)==0)return-1;const r=Math.floor(((l=B.value)==null?void 0:l.reduce((c,d)=>c+d,0))/B.value.length);return Number.isNaN(r)?-1:r}),D=h(()=>(window.innerWidth-5e3)/3),ue=r=>{if(r.length===1)return[{color:J(r[0]),opacity:50}];const c=50/2,d=[];for(let g=0;g<r.length;g++){const k=25+g%3*c;d.push({color:J(r[g]),opacity:k})}return d},ce=h(()=>{var r,s,n,l;return{labels:p.value,datasets:[...((s=(r=e.value)==null?void 0:r.cpu)==null?void 0:s.map((c,d)=>{var k;const g=te;return{label:`CPU ${((k=e.value)==null?void 0:k.cpu.length)>1?d:""}`,data:v.value,yAxisID:"y",borderColor:P(g,50)}}))??[],{label:"Memory",data:u.value,yAxisID:"y",borderColor:P(ee,50)},...((l=(n=e.value)==null?void 0:n.gpu)==null?void 0:l.map((c,d)=>{var T,F;const g=ue((T=e.value)==null?void 0:T.gpu)[d],k=P(g.color,g.opacity);return{label:`GPU ${((F=e.value)==null?void 0:F.gpu.length)>1?d:""}`,data:M.value.map(fe=>fe[d]),yAxisID:"y",borderColor:k}}))??[]]}}),U=xe("legendPosition","bottom"),de=h(()=>{const r=getComputedStyle(document.documentElement),s=be.value?`rgb(${r.getPropertyValue("--color-slate-12")})`:`rgb(${r.getPropertyValue("--color-slate-1")})`,n=r.getPropertyValue("--p-content-border-color"),l=["left","top","right","bottom"];return{indexAxis:"x",maintainAspectRatio:!1,animation:!1,plugins:{legend:{labels:{color:s},position:U.value,onClick(){U.value=l[(l.indexOf(U.value)+1)%l.length]}}},elements:{line:{tension:.2},point:{pointStyle:!1}},scales:{x:{ticks:{color:"transparent"},grid:{color:"transparent"}},y:{min:0,max:100,beginAtZero:!0,clip:!0,ticks:{color:s},grid:{color:n}}}}}),pe=h(()=>{var c,d;return`${(((d=(c=e.value)==null?void 0:c.gpu)==null?void 0:d.length)??0)*40+120}px`});return(r,s)=>(f(),x(G,{title:"Resources monitor"},{cta:m(()=>s[0]||(s[0]=[])),default:m(()=>{var n,l;return[i("div",We,[y(z,{name:"CPU",value:V.value,size:D.value},null,8,["value","size"]),s[1]||(s[1]=i("div",{class:"w-px flex-shrink-0 flex-grow-0 self-stretch bg-white/10"},null,-1)),y(z,{name:"Memory",value:H.value,size:D.value},null,8,["value","size"]),s[2]||(s[2]=i("div",{class:"w-px flex-shrink-0 flex-grow-0 self-stretch bg-white/10"},null,-1)),y(z,{name:"GPU",value:ie.value,size:D.value},null,8,["value","size"])]),i("div",Xe,[o.value=="bar"?(f(!0),C(E,{key:0},ae(((l=(n=a.value)==null?void 0:n.cpu)==null?void 0:l.core)??[],(c,d)=>(f(),C(E,{key:c.index},[Number.isNaN(c.utilization)?A("",!0):(f(),x(Te,{key:0,cpu:d,value:c.utilization},null,8,["cpu","value"]))],64))),128)):A("",!0),o.value=="graph"?(f(),x(w(oe),{key:1,type:"line",data:ce.value,options:de.value,style:I(`height: ${pe.value}`),class:"w-available"},null,8,["data","options","style"])):A("",!0)])]}),_:1}))}}),Ze=O({__name:"ServerActivityCard",setup(t){const{data:e}=N({path:"dashboard/activity",refetchInterval:1e4,data:{take:999},queryKey:["server","activity"]}),{data:a}=N({path:"dashboard/devices",refetchInterval:1e4,queryKey:["devices"]});return(o,p)=>w(se)?(f(),x(G,{key:0,title:"Activity",background:!1},{cta:m(()=>p[0]||(p[0]=[])),default:m(()=>{var v;return[(f(!0),C(E,null,ae(((v=w(e))==null?void 0:v.slice(0,5))??[],u=>(f(),x(je,{devices:w(a)??[],key:u==null?void 0:u.id,activity:u},null,8,["devices","activity"]))),128))]}),_:1})):A("",!0)}}),et={class:"col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-1 xl:row-start-1"},tt={class:"col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-3 xl:row-start-1"},rt={class:"col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-2 2xl:col-span-2 2xl:col-start-5 2xl:row-start-1 2xl:flex"},pt=O({__name:"Desktop",setup(t){var p;const e=b(!0);we(_,v=>{e.value=!!v}),R(()=>{setTimeout(()=>{e.value=!!_.value},1e3)});const{data:a,error:o}=N({path:"dashboard/server/storage",queryKey:["dashboard","storage",(p=re.value)==null?void 0:p.serverBaseUrl]});return R(()=>{console.raw(a.value)}),(v,u)=>(f(),x(w(ke),null,{default:m(()=>[y(w(Ce),{fullscreen:!0},{default:m(()=>[y(_e,{title:"Dashboard overview",gridStyle:2},{cta:m(()=>u[0]||(u[0]=[])),default:m(()=>[i("div",et,[y($e),w(se)?(f(),x(Ye,{key:0})):(f(),x(G,{key:1,title:"Resources monitor",class:"animate-pulse"},{cta:m(()=>u[1]||(u[1]=[])),default:m(()=>[u[2]||(u[2]=i("div",{class:"min-h-80"},null,-1))]),_:1}))]),i("div",tt,[y(Oe)]),i("div",rt,[y(Ze)])]),_:1})]),_:1})]),_:1}))}});export{pt as default};
//# sourceMappingURL=Desktop-KBcyniyA.js.map