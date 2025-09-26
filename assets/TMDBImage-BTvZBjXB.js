import{Er as j,Hs as C,Js as h,Ks as v,Ln as b,Os as N,Rr as B,Rs as y,Ui as D,Yo as L,ec as s,er as M,gs as P,js as c,ls as x,ms as V,os as l,ss as p,us as u}from"./index-zK1-WOQT.js";import{t as E}from"./AppLogoSquare-ClEEG0E7.js";L();var R={key:0,class:"absolute inset-0 h-available w-available bg-black/30 dark:bg-black/50 shadow"},U=["srcset"],A={class:"w-available h-available inset-0 grid place-items-center place-center bg-[rgb(from_var(--color-logo-dark)_r_g_b/20%)]"},O=P({__name:"TMDBImage",props:{path:{type:String,required:!1},colorPalette:{type:Object,required:!1},title:{type:String,required:!1},className:{type:String,required:!1},size:{type:Number,required:!1},aspect:{type:String,required:!1},type:{type:String,required:!1,default:"image"},autoShadow:{type:Boolean,required:!1,default:!1},loading:{type:String,required:!1,default:"lazy"},priority:{type:String,required:!1,default:"low"},shadow:{type:String,required:!1,default:"var(--color-theme-8)"},onload:{type:Function,required:!1}},setup(e){const a=e,o=s(0),d=s(!1),g=s(!1),n=s(!1),m=s(0),i=l(()=>{if(!(!a.path||!j.value))return`https://app.nomercy.tv/tmdb-images${a.path}?width=${a.size?a.size*2:null}`}),w=l(()=>{if(a.path)return`https://media.themoviedb.org/t/p/${M(a?.size??"original")}${a.path}`});l(()=>D.value?0:20);const k=l(()=>({"--c-1":"var(--color-theme-8)","--c-2":"rgb(from var(--color-theme-8) r g b / 3%)","--c-3":"rgb(from var(--color-theme-8) r g b / 14%)","--c-4":"rgb(from var(--color-theme-8) r g b / 1%)",backgroundImage:a.type==="logo"||!B?a.type==="logo"?"":`
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
			`})),f=l(()=>a.aspect==="poster"?3/2:a.aspect==="backdrop"?9/16:null),$=l(()=>a.aspect==="poster"||a.aspect==="backdrop"?"w-available":"w-auto"),S=l(()=>!a.size||!f.value?0:a.size*f.value);N(()=>{a?.type!=="logo"||i.value?.includes("undefined")||b(`${i.value}`,({nonTransparentBrightness:t})=>{m.value=t,g.value=t<20,n.value=t>80})}),C(i,t=>{t&&(a?.type==="logo"||i.value?.includes("undefined")||(b(`${t}`,({nonTransparentBrightness:r})=>{m.value=r,g.value=r<20,n.value=r>80}),d.value=!1))});function q(t){o.value=1,a.onload?.(t)}function z(){o.value=0}function I(t){t.target.onerror=null,d.value=!0,o.value=1}return(t,r)=>(c(),u("div",{class:v([{"aspect-poster":e.aspect==="poster","aspect-backdrop":e.aspect==="backdrop"},"transform-gpu pointer-events-none bottom-0 mx-auto flex select-none place-self-start max-w-available max-h-available w-available h-available"]),style:h(k.value)},[o.value===0&&e.type==="image"?(c(),u("div",R)):x("",!0),!d.value&&e.path&&!e.path?.includes?.("undefined")?(c(),u("picture",{key:1,style:h(`opacity: ${o.value}; float: ${e.type==="logo"?"right":""}`),class:"pointer-events-none absolute inset-0 h-inherit flex select-none flex-col items-end justify-end tv:justify-start self-end transition-all duration-500 max-w-available max-h-available"},[p("source",{srcset:`${i.value} 1x`},null,8,U),r[0]||(y(-1,!0),(r[0]=p("img",{alt:`tmdb image for ${e.title??"image"}`,class:v([{"aspect-poster w-available h-available":e.aspect==="poster","aspect-backdrop w-available h-available":e.aspect==="backdrop","w-auto !h-inherit":e.aspect===null,"object-fit w-auto h-available":e.type==="logo","object-cover object-top":e.type==="image","[filter:drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)]":n.value,[`${$.value}`]:!0,[`${e.className}`]:!0},"pointer-events-auto bg-bottom transition-all duration-500 max-h-available max-w-available"]),fetchpriority:e.priority,height:S.value,loading:e.loading==="eager"?"eager":"lazy",onerror:I,onload:q,onloadstart:z,src:w.value,style:h(`
              float: ${e.type==="logo"?"right":""};
              filter: ${g.value||n.value?`drop-shadow(0px 0px 6px rgb(from ${e.shadow} r g b)) drop-shadow(0px 0px 6px rgb(from ${e.shadow} r g b))`:""}`),width:e.size,crossorigin:"anonymous"},null,14,["alt","fetchpriority","height","loading","src","width"])).cacheIndex=0,y(1),r[0])],4)):e.type==="image"?(c(),u("div",{key:2,class:v([e.type==="image"?"bg-surface-1":"","inset-0 grid aspect-video h-available w-available place-items-center place-center"])},[p("div",A,[V(E,{class:"h-auto w-3/5 max-h-[60%] -translate-y-[5%]"})])],2)):x("",!0)],6))}}),J=O;export{J as t};
