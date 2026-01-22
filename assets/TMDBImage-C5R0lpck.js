import{Bn as n,Bt as g,Gt as x,Lt as a,Rn as c,Rt as u,Tt as $,Vt as o,cn as i,kn as h,qt as q,yn as S}from"./index-BVMfOxho.js";import{f as z}from"./client-BaHBQSTJ.js";import{d as B,t as j}from"./currentServer-wKQllb71.js";import{d as C}from"./global-DPeGmG9M.js";import{t as I}from"./AppLogoSquare-DNGtmCzk.js";$();var N={key:0,class:"absolute inset-0 h-available w-available bg-black/30 dark:bg-black/50 shadow"},V=["srcset"],P=["alt","fetchpriority","height","loading","src","width"],T={class:"w-available h-available inset-0 grid place-items-center place-center bg-[rgb(from_var(--color-logo-dark)_r_g_b/20%)]"},D=q({__name:"TMDBImage",props:{path:{type:String,required:!1},colorPalette:{type:Object,required:!1},title:{type:String,required:!1},className:{type:String,required:!1},size:{type:Number,required:!1},aspect:{type:String,required:!1},type:{type:String,required:!1,default:"image"},autoShadow:{type:Boolean,required:!1,default:!1},loading:{type:String,required:!1,default:"lazy"},priority:{type:String,required:!1,default:"low"},onload:{type:Function,required:!1}},setup(e){const t=e,l=h(0),s=h(!1),d=a(()=>{if(!(!t.path||!j.value))return`https://app.nomercy.tv/tmdb-images${t.path}?width=${t.size?t.size*2:null}`}),p=a(()=>{if(t.path)return`https://media.themoviedb.org/t/p/${B(t?.size??"original")}${t.path}`});a(()=>C.value?0:20);const v=a(()=>({"--c-1":"var(--color-theme-8)","--c-2":"rgb(from var(--color-theme-8) r g b / 3%)","--c-3":"rgb(from var(--color-theme-8) r g b / 14%)","--c-4":"rgb(from var(--color-theme-8) r g b / 1%)",backgroundImage:t.type==="logo"||!z?t.type==="logo"?"":`
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
							${t.colorPalette?.lightVibrant??"var(--c-1)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${t.colorPalette?.dominant??"var(--c-2)"},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${t.colorPalette?.darkVibrant??"var(--c-3)"},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${t.colorPalette?.dominant??"var(--c-4)"},
					hsl(0 0% 100% / 4%) 300px
				)
			`})),m=a(()=>t.aspect==="poster"?3/2:t.aspect==="backdrop"?9/16:null),f=a(()=>t.aspect==="poster"||t.aspect==="backdrop"?"w-available":"w-auto"),b=a(()=>!t.size||!m.value?0:t.size*m.value);S(d,r=>{r&&(s.value=!1)});function y(r){l.value=1,t.onload?.(r)}function w(){l.value=0}function k(r){r.target.onerror=null,s.value=!0,l.value=1}return(r,L)=>(i(),o("div",{class:c([{"aspect-poster":e.aspect==="poster","aspect-backdrop":e.aspect==="backdrop"},"transform-gpu pointer-events-none bottom-0 mx-auto flex select-none place-self-start max-w-available w-available h-available"]),style:n(v.value)},[l.value===0&&e.type==="image"?(i(),o("div",N)):g("",!0),!s.value&&e.path&&!e.path?.includes?.("undefined")?(i(),o("picture",{key:1,style:n(`opacity: ${l.value}; float: ${e.type==="logo"?"right":""}`),class:"pointer-events-none absolute inset-0 h-inherit flex select-none flex-col items-end justify-end tv:justify-start self-end transition-all duration-500 max-w-available"},[u("source",{srcset:`${d.value} 1x`},null,8,V),u("img",{alt:`tmdb image for ${e.title??"image"}`,class:c([{"aspect-poster w-available h-available":e.aspect==="poster","aspect-backdrop w-available h-available":e.aspect==="backdrop","w-auto !h-inherit":e.aspect===null,"object-fit w-auto h-available":e.type==="logo","object-cover object-top":e.type==="image",[`${f.value}`]:!0,[`${e.className}`]:!0},"pointer-events-auto bg-bottom transition-all duration-500 max-w-available"]),fetchpriority:e.priority,height:b.value,loading:e.loading==="eager"?"eager":"lazy",onerror:k,onload:y,onloadstart:w,src:p.value,style:n(`
					float: ${e.type==="logo"?"right":""};
					object-position: center;
				`),width:e.size,crossorigin:"anonymous"},null,14,P)],4)):e.type==="image"?(i(),o("div",{key:2,class:c([e.type==="image"?"bg-surface-1":"","inset-0 grid aspect-video h-available w-available place-items-center place-center"])},[u("div",T,[x(I,{class:"h-auto w-3/5 max-h-[60%] -translate-y-[5%]"})])],2)):g("",!0)],6))}}),F=D;export{F as t};
