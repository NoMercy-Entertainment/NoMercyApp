import{Bt as s,Lt as g,Rt as _,Tt as V,Un as k,Vt as d,_n as B,cn as o,dn as x,en as w,qt as N,zt as m}from"./index-CymNhKD_.js";import{b as z}from"./utils-D5LXfnop.js";import{t as h}from"./MoooomIcon-D8Onw6Et.js";var C=e=>typeof e=="boolean"?`${e}`:e===0?"0":e;const I=z,A=(e,n)=>a=>{var c;if(n?.variants==null)return I(e,a?.class,a?.className);const{variants:v,defaultVariants:i}=n,b=Object.keys(v).map(t=>{const r=a?.[t],l=i?.[t];if(r===null)return null;const f=C(r)||C(l);return v[t][f]}),u=a&&Object.entries(a).reduce((t,r)=>{let[l,f]=r;return f===void 0||(t[l]=f),t},{});return I(e,b,n==null||(c=n.compoundVariants)===null||c===void 0?void 0:c.reduce((t,r)=>{let{class:l,className:f,...q}=r;return Object.entries(q).every(S=>{let[$,y]=S;return Array.isArray(y)?y.includes({...i,...u}[$]):{...i,...u}[$]===y})?[...t,l,f]:t},[]),a?.class,a?.className)};V();var j=["id","data-variant","for","inert"],F={class:"whitespace-nowrap leading-[100%] empty:hidden"},O={key:0,class:"text-left text-xs font-semibold line-clamp-1 sm:text-sm"},P={key:1},T=["id","data-variant","for","href","inert"],U={class:"whitespace-nowrap leading-[100%] empty:hidden"},D={key:0,class:"text-left text-xs font-semibold line-clamp-1 sm:text-sm"},E={key:1},H=["id","data-variant","disabled","inert"],K={class:"whitespace-nowrap leading-[100%] empty:hidden"},L={key:1},M=N({inheritAttrs:!1,__name:"Button",props:{id:{type:String,required:!0},variant:{type:String,default:"default",required:!1},size:{type:String,default:"md",required:!1},onClick:{type:Function,required:!1},title:{type:String,default:"",required:!1},color:{type:String,default:"gray",required:!1},htmlFor:{type:String,default:"",required:!1},href:{type:String,default:"",required:!1},disabled:{type:Boolean,default:!1,required:!1},startIcon:{type:String,required:!1},endIcon:{type:String,required:!1},component:{type:String,default:"button",required:!1}},setup(e){const n=e,a=A("flex justify-center items-center px-4 py-2 gap-2 rounded-lg text-sm select-none w-auto font-semibold leading-[100%]",{variants:{variant:{default:`
					!bg-gradient-to-b dark:!bg-gradient-to-b
					from-[var(--color-6)] to-[var(--color-7)]
					hover:from-[var(--color-5)] hover:to-[var(--color-6)]
					active:from-[var(--color-7)] active:to-[var(--color-8)]
					button-filled text-[var(--color-1)]
					shadow-lg
					shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--surface-2)_r_g_b/60%)_inset,0_6px_10px_-4px_rgba(from_var(--surface-2)_r_g_b/70%)]
					dark:shadow-none active:!shadow-none active:!dark:shadow-none
				`,contained:`
					!bg-gradient-to-b dark:!bg-gradient-to-b
					from-[var(--color-6)] to-[var(--color-7)]
					hover:from-[var(--color-5)] hover:to-[var(--color-6)]
					active:from-[var(--color-7)] active:to-[var(--color-8)]
					button-filled text-[var(--color-1)]
					shadow-lg
					shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--surface-2)_r_g_b/60%)_inset,0_6px_10px_-4px_rgba(from_var(--surface-2)_r_g_b/70%)]
					dark:shadow-none active:!shadow-none active:!dark:shadow-none
				`,text:`
					outline-transparent hover:outline-[rgb(from_var(--color-5)_r_g_b/80%)]
					hover:outline-1 hover:outline text-[rgb(from_var(--background-contrast-12)_r_g_b/80%)]
				`,outlined:`
					text-[var(--color-7)] border-[var(--color-5)] border-2
					focus-visible:border-[var(--color-6)] hover:border-[var(--color-7)]
					hover:bg-[rgba(var(--color-7),.1)]
					shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--surface-2)_r_g_b/60%)_inset,0_6px_10px_-4px_rgba(from_var(--surface-2)_r_g_b/70%)]
					dark:shadow-none active:!shadow-none active:!dark:shadow-none
				`,primary:`
					!bg-gradient-to-b dark:!bg-gradient-to-b
					from-[var(--color-6)] to-[var(--color-7)]
					hover:from-[var(--color-5)] hover:to-[var(--color-6)]
					active:from-[var(--color-7)] active:to-[var(--color-8)]
					button-filled text-[var(--color-1)]
					shadow-lg
					shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--surface-2)_r_g_b/60%)_inset,0_6px_10px_-4px_rgba(from_var(--surface-2)_r_g_b/70%)]
					dark:shadow-none active:!shadow-none active:!dark:shadow-none
				`},size:{sm:"h-8 text-xs px-3",md:"h-9 text-sm px-4",lg:"h-12 text-base px-6"},disabled:{true:"grayscale !cursor-not-allowed",false:""}},defaultVariants:{variant:"default",size:"md",disabled:!1}}),c=B(),v=g(()=>{const t=`var(--color-${n.color}-8)`;return{"--color-1":`hsl(from ${t} h s 97%)`,"--color-2":`hsl(from ${t} h s 93%)`,"--color-3":`hsl(from ${t} h s 88%)`,"--color-4":`hsl(from ${t} h s 80%)`,"--color-5":`hsl(from ${t} h s 70%)`,"--color-6":`hsl(from ${t} h s 60%)`,"--color-7":`hsl(from ${t} h s 50%)`,"--color-8":t,"--color-9":`hsl(from ${t} h s 35%)`,"--color-10":`hsl(from ${t} h s 25%)`,"--color-11":`hsl(from ${t} h s 15%)`,"--color-12":`hsl(from ${t} h s 5%)`,...c.style||{}}}),i=g(()=>c.class||""),b=g(()=>{const t=/\bh-\d+\b/.test(i.value);return a({variant:n.variant,size:t?void 0:n.size,disabled:n.disabled,className:i.value})}),u=g(()=>{const{class:t,style:r,...l}=c;return l});return(t,r)=>e.component==="label"?(o(),d("label",w({key:0,id:e.id,class:b.value,"data-variant":e.variant,for:e.htmlFor,inert:e.disabled,style:v.value},u.value,{onClick:r[0]||(r[0]=(...l)=>e.onClick&&e.onClick(...l))}),[e.startIcon?(o(),m(h,{key:0,icon:e.startIcon,class:"w-5"},null,8,["icon"])):s("",!0),_("span",F,[t.$slots?(o(),d("p",O,[x(t.$slots,"default")])):e.title?(o(),d("span",P,k(t.$t(e.title)),1)):s("",!0)]),e.endIcon?(o(),m(h,{key:1,icon:e.endIcon,class:"w-5"},null,8,["icon"])):s("",!0)],16,j)):e.component==="link"?(o(),d("a",w({key:1,id:e.id,class:b.value,"data-variant":e.variant,for:e.htmlFor,href:e.href,inert:e.disabled,style:v.value},u.value,{onClick:r[1]||(r[1]=(...l)=>e.onClick&&e.onClick(...l))}),[e.startIcon?(o(),m(h,{key:0,icon:e.startIcon,class:"w-5"},null,8,["icon"])):s("",!0),_("span",U,[t.$slots?(o(),d("p",D,[x(t.$slots,"default")])):e.title?(o(),d("span",E,k(t.$t(e.title)),1)):s("",!0)]),e.endIcon?(o(),m(h,{key:1,icon:e.endIcon,class:"w-5"},null,8,["icon"])):s("",!0)],16,T)):(o(),d("button",w({key:2,id:e.id,class:b.value,"data-variant":e.variant,disabled:e.disabled,inert:e.disabled,style:v.value},u.value,{type:"button",onClick:r[2]||(r[2]=(...l)=>e.onClick&&e.onClick(...l))}),[e.startIcon?(o(),m(h,{key:0,icon:e.startIcon,class:"w-5"},null,8,["icon"])):s("",!0),_("span",K,[t.$slots?x(t.$slots,"default",{key:0}):e.title?(o(),d("span",L,k(t.$t(e.title)),1)):s("",!0)]),e.endIcon?(o(),m(h,{key:1,icon:e.endIcon,class:"w-5"},null,8,["icon"])):s("",!0)],16,H))}}),J=M;export{J as t};
