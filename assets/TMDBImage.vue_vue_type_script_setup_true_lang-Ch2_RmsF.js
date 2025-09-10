import{I,l as i,C as r,R as N,cz as V,bi as A,bR as u,bq as L,E as P,cA as w,w as D,c as d,o as h,A as p,n as v,b as x,a as b,j as E}from"./index-DhiqRu-L.js";import{A as M}from"./AppLogoSquare-BTlGgqwW.js";const R={key:0,class:"absolute inset-0 h-full w-full bg-black/30 dark:bg-black/50 shadow"},B=["srcset"],U=["alt","fetchpriority","height","loading","src","width"],F={class:"w-full h-full inset-0 grid place-items-center place-center bg-[rgb(var(--color-logo-dark)/20%)]"},H=I({__name:"TMDBImage",props:{path:{type:String,required:!1},colorPalette:{type:Object,required:!1},title:{type:String,required:!1},className:{type:String,required:!1},size:{type:Number,required:!1},aspect:{type:String,required:!1},type:{type:String,required:!1,default:"image"},autoShadow:{type:Boolean,required:!1,default:!1},loading:{type:String,required:!1,default:"lazy"},priority:{type:String,required:!1,default:"low"},shadow:{type:String,required:!1,default:"white"},onload:{type:Function,required:!1}},setup(e){const t=e,l=i(0),g=i(!1),f=i(!1),s=i(!1),m=i(0),o=r(()=>{if(!(!t.path||!N.value))return`https://app.nomercy.tv/tmdb-images${t.path}?width=${t.size?t.size*2:null}`}),k=r(()=>{if(t.path)return`https://media.themoviedb.org/t/p/${V(t?.size??"original")}${t.path}`}),n=r(()=>A.value?0:20),$=r(()=>({"--c-1":"rgb(var(--color-focus))","--c-2":"rgb(var(--color-focus) / 3%)","--c-3":"rgb(var(--color-focus) / 14%)","--c-4":"rgb(var(--color-focus) / 1%)",backgroundImage:t.type==="logo"||!L?t.type==="logo"?"":`
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
							${u(t.colorPalette?.lightVibrant,n.value)??"var(--c-1)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${u(t.colorPalette?.dominant,n.value)??"var(--c-2)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${u(t.colorPalette?.darkVibrant,n.value)??"var(--c-3)"},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${u(t.colorPalette?.dominant,n.value)??"var(--c-4)"},
					hsl(0 0% 100% / 4%) 300px
				)
			`})),y=r(()=>t.aspect==="poster"?3/2:t.aspect==="backdrop"?9/16:null),q=r(()=>t.aspect==="poster"||t.aspect==="backdrop"?"w-full":"w-auto"),S=r(()=>!t.size||!y.value?0:t.size*y.value);P(()=>{t?.type!=="logo"||o.value?.includes("undefined")||w(`${o.value}`,({nonTransparentBrightness:a})=>{m.value=a,f.value=a<20,s.value=a>80})}),D(o,a=>{a&&(t?.type==="logo"||o.value?.includes("undefined")||(w(`${a}`,({nonTransparentBrightness:c})=>{m.value=c,f.value=c<20,s.value=c>80}),g.value=!1))});function z(a){l.value=1,t.onload?.(a)}function j(){l.value=0}function C(a){a.target.onerror=null,g.value=!0,l.value=1}return(a,c)=>(h(),d("div",{class:v([{"aspect-poster  w-available h-auto":e.aspect==="poster","aspect-backdrop  w-available h-auto":e.aspect==="backdrop","w-auto h-available":e.aspect===null},"pointer-events-none bottom-0 mx-auto flex w-full select-none place-self-start h-available overflow-clip"]),style:p($.value)},[l.value===0&&e.type==="image"?(h(),d("div",R)):x("",!0),!g.value&&e.path&&!e.path?.includes?.("undefined")?(h(),d("picture",{key:1,style:p(`opacity: ${l.value}; float: ${e.type==="logo"?"right":""}`),class:"pointer-events-none absolute inset-0 h-inherit flex select-none flex-col items-end justify-end tv:justify-start self-end transition-all duration-500 max-h-inherit overflow-hidden"},[b("source",{srcset:`${o.value} 1x`},null,8,B),b("img",{alt:`tmdb image for ${e.title??"image"}`,class:v([{"aspect-poster w-available h-auto":e.aspect==="poster","aspect-backdrop w-available h-auto":e.aspect==="backdrop","w-available h-available":e.aspect===null,"object-contain w-auto h-inherit":e.type==="logo","object-cover object-top":e.type==="image","[filter:drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)]":s.value,[`${q.value}`]:!0,[`${e.className}`]:!0},"pointer-events-auto inset-0 bg-top transition-all duration-500 max-h-inherit"]),fetchpriority:e.priority,height:S.value,loading:e.loading==="eager"?"eager":"lazy",onerror:C,onload:z,onloadstart:j,src:k.value,style:p(`
              float: ${e.type==="logo"?"right":""};
              filter: ${f.value||s.value?`drop-shadow(0px 0px 6px rgb(${e.shadow})) drop-shadow(0px 0px 6px rgb(${e.shadow}))`:""}`),width:e.size,crossorigin:"anonymous"},null,14,U)],4)):e.type==="image"?(h(),d("div",{key:2,class:v([e.type==="image"?"bg-auto-1":"","inset-0 grid aspect-video h-full w-full place-items-center place-center"])},[b("div",F,[E(M,{class:"h-auto w-3/5 max-h-[60%] -translate-y-[5%]"})])],2)):x("",!0)],6))}});export{H as _};
