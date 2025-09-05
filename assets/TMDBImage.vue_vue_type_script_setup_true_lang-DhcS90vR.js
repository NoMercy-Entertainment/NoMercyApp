import{c as I,a$ as L,af as P,av as h,al as A,b0 as k}from"./index-BQx8LJO8.js";import{A as B}from"./AppLogoSquare-Cqegs2Qa.js";import{$ as D,d as c,B as o,f as M,w as E,h as f,o as g,G as m,v as b,b as $,j as y,z as U}from"./vue-ionic-DRNtAYzz.js";const F={key:0,class:"absolute inset-0 h-full w-full bg-black/30 dark:bg-black/50 shadow"},G=["srcset"],O=["src","width","height","fetchpriority","loading","alt"],R={class:"w-full h-full inset-0 grid place-items-center place-center bg-[rgb(var(--color-logo-dark)/20%)]"},Q=D({__name:"TMDBImage",props:{path:{type:String,required:!1},colorPalette:{type:Object,required:!1},title:{type:String,required:!1},className:{type:String,required:!1},size:{type:Number,required:!1},aspect:{type:String,required:!1},type:{type:String,required:!1,default:"image"},autoShadow:{type:Boolean,required:!1,default:!1},loading:{type:String,required:!1,default:"lazy"},priority:{type:String,required:!1,default:"low"},shadow:{type:String,required:!1,default:"white"},onload:{type:Function,required:!1}},setup(t){const e=t,i=c(0),v=c(!1),p=c(!1),u=c(!1),w=c(0),s=o(()=>{if(!(!e.path||!I.value))return`https://app.nomercy.tv/tmdb-images${e.path}?width=${e.size?e.size*2:null}`}),S=o(()=>{if(e.path)return`https://media.themoviedb.org/t/p/${L((e==null?void 0:e.size)??"original")}${e.path}`}),d=o(()=>P.value?0:20),q=o(()=>{var a,l,r,n;return{"--c-1":"rgb(var(--color-focus))","--c-2":"rgb(var(--color-focus) / 3%)","--c-3":"rgb(var(--color-focus) / 14%)","--c-4":"rgb(var(--color-focus) / 1%)",backgroundImage:e.type==="logo"||!A?e.type==="logo"?"":`
                    radial-gradient(
                        farthest-corner at top left,
                                rgb(var(--color-theme-9)),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at top right,
                                rgb(var(--color-theme-2)),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at bottom left,
                                rgb(var(--color-theme-6)),
                                hsl(0 0% 100% / 4%)
                            ),
                            radial-gradient(
                                farthest-corner at bottom right,
                                rgb(var(--color-theme-12)),
                        hsl(0 0% 100% / 4%) 300px
                    )
                `:`
				radial-gradient(
					farthest-corner at top left,
							${h((a=e.colorPalette)==null?void 0:a.lightVibrant,d.value)??"var(--c-1)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${h((l=e.colorPalette)==null?void 0:l.dominant,d.value)??"var(--c-2)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${h((r=e.colorPalette)==null?void 0:r.darkVibrant,d.value)??"var(--c-3)"},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${h((n=e.colorPalette)==null?void 0:n.dominant,d.value)??"var(--c-4)"},
					hsl(0 0% 100% / 4%) 300px
				)
			`}}),x=o(()=>e.aspect==="poster"?3/2:e.aspect==="backdrop"?9/16:null),z=o(()=>e.aspect==="poster"||e.aspect==="backdrop"?"w-full":"w-auto"),j=o(()=>!e.size||!x.value?0:e.size*x.value);M(()=>{var a;(e==null?void 0:e.type)!=="logo"||(a=s.value)!=null&&a.includes("undefined")||k(`${s.value}`,({nonTransparentBrightness:l})=>{w.value=l,p.value=l<20,u.value=l>80})}),E(s,a=>{var l;a&&((e==null?void 0:e.type)==="logo"||(l=s.value)!=null&&l.includes("undefined")||(k(`${a}`,({nonTransparentBrightness:r})=>{w.value=r,p.value=r<20,u.value=r>80}),v.value=!1))});function C(a){var l;i.value=1,(l=e.onload)==null||l.call(e,a)}function N(){i.value=0}function V(a){a.target.onerror=null,v.value=!0,i.value=1}return(a,l)=>{var r,n;return g(),f("div",{class:b(["pointer-events-none bottom-0 mx-auto flex w-full select-none place-self-start h-available overflow-clip",{"aspect-poster  w-available h-auto":t.aspect==="poster","aspect-backdrop  w-available h-auto":t.aspect==="backdrop","w-auto h-available":t.aspect===null}]),style:m(q.value)},[i.value===0&&t.type==="image"?(g(),f("div",F)):$("",!0),!v.value&&t.path&&!((n=(r=t.path)==null?void 0:r.includes)!=null&&n.call(r,"undefined"))?(g(),f("picture",{key:1,class:"pointer-events-none absolute inset-0 h-inherit flex select-none flex-col items-end justify-end tv:justify-start self-end transition-all duration-500 max-h-inherit overflow-hidden",style:m(`opacity: ${i.value}; float: ${t.type==="logo"?"right":""}`)},[y("source",{srcset:`${s.value} 1x`},null,8,G),y("img",{src:S.value,width:t.size,height:j.value,fetchpriority:t.priority,loading:t.loading==="eager"?"eager":"lazy",alt:`tmdb image for ${t.title??"image"}`,onload:C,onloadstart:N,onerror:V,crossorigin:"anonymous",class:b(["pointer-events-auto inset-0 bg-top transition-all duration-500 max-h-inherit",{"aspect-poster w-available h-auto":t.aspect==="poster","aspect-backdrop w-available h-auto":t.aspect==="backdrop","w-available h-available":t.aspect===null,"object-contain w-auto h-inherit":t.type==="logo","object-cover object-top":t.type==="image","[filter:drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)]":u.value,[`${z.value}`]:!0,[`${t.className}`]:!0}]),style:m(`
              float: ${t.type==="logo"?"right":""};
              filter: ${p.value||u.value?`drop-shadow(0px 0px 6px rgb(${t.shadow})) drop-shadow(0px 0px 6px rgb(${t.shadow}))`:""}`)},null,14,O)],4)):t.type==="image"?(g(),f("div",{key:2,class:b(["inset-0 grid aspect-video h-full w-full place-items-center place-center",t.type==="image"?"bg-auto-1":""])},[y("div",R,[U(B,{class:"h-auto w-3/5 max-h-[60%] -translate-y-[5%]"})])],2)):$("",!0)],6)}}});export{Q as _};
