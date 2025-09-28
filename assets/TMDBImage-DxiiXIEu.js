import{$s as c,Ci as I,Dc as v,Fi as j,Fr as b,Is as C,Ms as u,Os as r,Qr as D,Rs as M,Ta as N,Xs as P,_s as V,js as y,kc as g,ks as p,uc as B,yc as i}from"./index-H5TKJIZK.js";import{t as L}from"./AppLogoSquare-DMiw3kfV.js";V();var F={key:0,class:"absolute inset-0 h-available w-available bg-black/30 dark:bg-black/50 shadow"},A=["srcset"],E=["alt","fetchpriority","height","loading","src","width"],O={class:"w-available h-available inset-0 grid place-items-center place-center bg-[rgb(from_var(--color-logo-dark)_r_g_b/20%)]"},R=M({__name:"TMDBImage",props:{path:{type:String,required:!1},colorPalette:{type:Object,required:!1},title:{type:String,required:!1},className:{type:String,required:!1},size:{type:Number,required:!1},aspect:{type:String,required:!1},type:{type:String,required:!1,default:"image"},autoShadow:{type:Boolean,required:!1,default:!1},loading:{type:String,required:!1,default:"lazy"},priority:{type:String,required:!1,default:"low"},shadow:{type:String,required:!1,default:"var(--color-theme-8)"},onload:{type:Function,required:!1}},setup(e){const a=e,l=i(0),d=i(!1),h=i(!1),s=i(!1),m=i(0),o=r(()=>{if(!(!a.path||!I.value))return`https://app.nomercy.tv/tmdb-images${a.path}?width=${a.size?a.size*2:null}`}),x=r(()=>{if(a.path)return`https://media.themoviedb.org/t/p/${D(a?.size??"original")}${a.path}`});r(()=>N.value?0:20);const w=r(()=>({"--c-1":"var(--color-theme-8)","--c-2":"rgb(from var(--color-theme-8) r g b / 3%)","--c-3":"rgb(from var(--color-theme-8) r g b / 14%)","--c-4":"rgb(from var(--color-theme-8) r g b / 1%)",backgroundImage:a.type==="logo"||!j?a.type==="logo"?"":`
                    radial-gradient(
                        farthest-corner at top left,
                                var(--color-theme-9),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at top right,
                                var(--color-theme-2),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at bottom left,
                                var(--color-theme-6),
                                hsl(0 0% 100% / 4%)
                            ),
                            radial-gradient(
                                farthest-corner at bottom right,
                                var(--color-theme-12),
                        hsl(0 0% 100% / 4%) 300px
                    )
                `:`
				radial-gradient(
					farthest-corner at top left,
							${a.colorPalette?.lightVibrant??"var(--c-1)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${a.colorPalette?.dominant??"var(--c-2)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${a.colorPalette?.darkVibrant??"var(--c-3)"},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${a.colorPalette?.dominant??"var(--c-4)"},
					hsl(0 0% 100% / 4%) 300px
				)
			`})),f=r(()=>a.aspect==="poster"?3/2:a.aspect==="backdrop"?9/16:null),k=r(()=>a.aspect==="poster"||a.aspect==="backdrop"?"w-available":"w-auto"),$=r(()=>!a.size||!f.value?0:a.size*f.value);P(()=>{a?.type!=="logo"||o.value?.includes("undefined")||b(`${o.value}`,({nonTransparentBrightness:t})=>{m.value=t,h.value=t<20,s.value=t>80})}),B(o,t=>{t&&(a?.type==="logo"||o.value?.includes("undefined")||(b(`${t}`,({nonTransparentBrightness:n})=>{m.value=n,h.value=n<20,s.value=n>80}),d.value=!1))});function S(t){l.value=1,a.onload?.(t)}function q(){l.value=0}function z(t){t.target.onerror=null,d.value=!0,l.value=1}return(t,n)=>(c(),u("div",{class:v([{"aspect-poster":e.aspect==="poster","aspect-backdrop":e.aspect==="backdrop"},"transform-gpu pointer-events-none bottom-0 mx-auto flex select-none place-self-start max-w-available max-h-available w-available h-available"]),style:g(w.value)},[l.value===0&&e.type==="image"?(c(),u("div",F)):y("",!0),!d.value&&e.path&&!e.path?.includes?.("undefined")?(c(),u("picture",{key:1,style:g(`opacity: ${l.value}; float: ${e.type==="logo"?"right":""}`),class:"pointer-events-none absolute inset-0 h-inherit flex select-none flex-col items-end justify-end tv:justify-start self-end transition-all duration-500 max-w-available max-h-available"},[p("source",{srcset:`${o.value} 1x`},null,8,A),p("img",{alt:`tmdb image for ${e.title??"image"}`,class:v([{"aspect-poster w-available h-available":e.aspect==="poster","aspect-backdrop w-available h-available":e.aspect==="backdrop","w-auto !h-inherit":e.aspect===null,"object-fit w-auto h-available":e.type==="logo","object-cover object-top":e.type==="image","[filter:drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)]":s.value,[`${k.value}`]:!0,[`${e.className}`]:!0},"pointer-events-auto bg-bottom transition-all duration-500 max-h-available max-w-available"]),fetchpriority:e.priority,height:$.value,loading:e.loading==="eager"?"eager":"lazy",onerror:z,onload:S,onloadstart:q,src:x.value,style:g(`
              float: ${e.type==="logo"?"right":""};
              filter: ${h.value||s.value?`drop-shadow(0px 0px 6px rgb(from ${e.shadow} r g b)) drop-shadow(0px 0px 6px rgb(from ${e.shadow} r g b))`:""}`),width:e.size,crossorigin:"anonymous"},null,14,E)],4)):e.type==="image"?(c(),u("div",{key:2,class:v([e.type==="image"?"bg-surface-1":"","inset-0 grid aspect-video h-available w-available place-items-center place-center"])},[p("div",O,[C(L,{class:"h-auto w-3/5 max-h-[60%] -translate-y-[5%]"})])],2)):y("",!0)],6))}}),T=R;export{T as t};
