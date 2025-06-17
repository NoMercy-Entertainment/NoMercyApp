import{l as I,b0 as L,ao as h,ab as P,b1 as k}from"./index-FAKGUJAJ.js";import{A}from"./AppLogoSquare-BQzxVNwo.js";import{Y as D,d as n,C as o,f as M,w as B,h as g,o as f,H as m,t as v,b as $,i as y,y as E}from"./vue-ionic-CB3fsSQu.js";const U={key:0,class:"absolute inset-0 h-full w-full bg-black/50 shadow"},F=["srcset"],H=["src","width","height","fetchpriority","loading","alt"],O={class:"w-full h-full inset-0 grid place-items-center place-center bg-[rgb(var(--color-logo-dark)/20%)]"},J=D({__name:"TMDBImage",props:{path:{type:String,required:!1},colorPalette:{type:Object,required:!1},title:{type:String,required:!1},className:{type:String,required:!1},size:{type:Number,required:!1},aspect:{type:String,required:!1},type:{type:String,required:!1,default:"image"},autoShadow:{type:Boolean,required:!1,default:!1},loading:{type:String,required:!1,default:"lazy"},priority:{type:String,required:!1,default:"low"},shadow:{type:String,required:!1,default:"white"},onload:{type:Function,required:!1}},setup(e){const a=e,s=n(0),p=n(!1),b=n(!1),u=n(!1),w=n(0),i=o(()=>{if(!(!a.path||!I.value))return`https://app.nomercy.tv/tmdb-images${a.path}`}),q=o(()=>{if(a.path)return`https://media.themoviedb.org/t/p/original${a.path}`}),d=o(()=>L.value?0:20),S=o(()=>{var t,l,r,c;return{"--c-1":"rgb(var(--color-focus))","--c-2":"rgb(var(--color-focus) / 3%)","--c-3":"rgb(var(--color-focus) / 14%)","--c-4":"rgb(var(--color-focus) / 1%)",backgroundImage:a.type=="logo"||!P?a.type=="logo"?"":`
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
							${h((t=a.colorPalette)==null?void 0:t.lightVibrant,d.value)??"var(--c-1)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${h((l=a.colorPalette)==null?void 0:l.dominant,d.value)??"var(--c-2)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${h((r=a.colorPalette)==null?void 0:r.darkVibrant,d.value)??"var(--c-3)"},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${h((c=a.colorPalette)==null?void 0:c.dominant,d.value)??"var(--c-4)"},
					hsl(0 0% 100% / 4%) 300px
				)
			`}}),x=o(()=>a.aspect=="poster"?3/2:a.aspect=="backdrop"?9/16:null),z=o(()=>a.aspect=="poster"||a.aspect=="backdrop"?"w-full":"w-auto"),C=o(()=>!a.size||!x.value?0:a.size*x.value);M(()=>{var t;(a==null?void 0:a.type)!="logo"||(t=i.value)!=null&&t.includes("undefined")||k(`${i.value}`,({nonTransparentBrightness:l})=>{w.value=l,b.value=l<20,u.value=l>80})}),B(i,t=>{var l;t&&((a==null?void 0:a.type)=="logo"||(l=i.value)!=null&&l.includes("undefined")||(k(`${t}`,({nonTransparentBrightness:r})=>{w.value=r,b.value=r<20,u.value=r>80}),p.value=!1))});const N=t=>{var l;s.value=1,(l=a.onload)==null||l.call(a,t)},V=()=>{s.value=0},j=t=>{t.target.onerror=null,p.value=!0,s.value=1};return(t,l)=>{var r,c;return f(),g("div",{class:v(["pointer-events-none bottom-0 mx-auto flex w-full select-none place-self-start h-available overflow-clip",{"aspect-poster  w-available h-auto":e.aspect=="poster","aspect-backdrop  w-available h-auto":e.aspect=="backdrop","w-auto h-available":e.aspect==null}]),style:m(S.value)},[s.value==0&&e.type=="image"?(f(),g("div",U)):$("",!0),!p.value&&e.path&&!((c=(r=e.path)==null?void 0:r.includes)!=null&&c.call(r,"undefined"))?(f(),g("picture",{key:1,class:v(["pointer-events-none absolute inset-0 flex select-none flex-col items-end justify-end self-end transition-all duration-500",{"aspect-poster  w-available h-auto":e.aspect=="poster","aspect-backdrop  w-available h-auto":e.aspect=="backdrop","w-auto h-available":e.aspect==null}]),style:m(`opacity: ${s.value}; float: ${e.type=="logo"?"right":""}`)},[y("source",{srcset:`${i.value} 1x`,type:"image/avif"},null,8,F),y("img",{src:q.value,width:e.size,height:C.value,fetchpriority:e.priority,loading:e.loading=="eager"?"eager":"lazy",alt:`tmdb image for ${e.title??"image"}`,onload:N,onloadstart:V,onerror:j,crossorigin:"anonymous",class:v(["pointer-events-auto inset-0 h-auto bg-top transition-all duration-500 max-h-available",{"aspect-poster  w-available h-auto":e.aspect=="poster","aspect-backdrop  w-available h-auto":e.aspect=="backdrop","w-available h-available":e.aspect==null,"object-scale-down !w-auto":e.type=="logo","object-cover object-top":e.type=="image","[filter:drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)]":u.value,[`${z.value}`]:!0,[`${e.className}`]:!0}]),style:m(`
              float: ${e.type=="logo"?"right":""};
              filter: ${b.value||u.value?`drop-shadow(0px 0px 6px rgb(${e.shadow})) drop-shadow(0px 0px 6px rgb(${e.shadow}))`:""}`)},null,14,H)],6)):e.type=="image"?(f(),g("div",{key:2,class:v(["inset-0 grid aspect-video h-full w-full place-items-center place-center",e.type=="image"?"bg-auto-1":""])},[y("div",O,[E(A,{class:"h-auto w-3/5 max-h-[60%] -translate-y-[5%]"})])],2)):$("",!0)],6)}}});export{J as _};
