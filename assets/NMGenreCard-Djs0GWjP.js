import{C as g,Et as _,J as p,Q as u,S as e,c as m,ct as x,j as v,k as b,kt as o,x as l}from"./i18n-Bgv5p1Yb.js";import"./ionic-B1wlflFe.js";import"./vue-core-Aw6Jkp0Q.js";import{Li as f,b as h}from"./index-CyPt8zMH.js";m();var k={class:"relative flex flex-shrink-0 flex-grow-0 flex-col items-center justify-center h-[75%]"},w={class:"relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center self-stretch px-4 pb-0 text-theme-12/12"},y={class:"flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold w-available line-clamp-1"},C={class:"flex-shrink-0 flex-grow-0 self-stretch text-xs opacity-60 w-available"},j=v({__name:"NMGenreCard",props:{data:{type:Object,required:!0},index:{type:Number,required:!1,default:0},contextMenuItems:{type:Array,required:!1,default:()=>[]}},setup(r){const t=r,n=l(()=>`scroll_${t.data?.titleSort?.[0]?.toUpperCase?.()}`),i=l(()=>({0:"group-hover/card:rotate-[-4deg] group-hover/card:scale-[1.1]",1:"group-hover/card:rotate-[4deg] group-hover/card:scale-[1.1]"})[t.index%2]),a=l(()=>f(t.data.title));return(d,s)=>{const c=u("RouterLink");return p(),g(c,{class:_(`flex flex-col relative justify-start items-center w-full h-auto aspect-poster flex-grow flex-shrink-0 overflow-hidden rounded-lg border-1-light transition-all duration-200 select-none group/card ${a.value.bg} bg-theme-6 hover:bg-theme-8 dark:bg-theme-5 dark:hover:bg-theme-7 hover:shadow-[0px_0px_0_3px_var(--color-theme-9)]`),"data-scroll":n.value,to:r.data.link,style:{}},{default:x(()=>[s[0]||(s[0]=e("div",{class:"backdropCard-overlay"},null,-1)),e("div",k,[e("div",{class:_(`flex items-center justify-center w-auto h-auto aspect-square p-4 object-cover rounded-3xl overflow-clip transition-all duration-200 ${i.value} ${a.value.iconBg}
          bg-theme-5 group-hover/card:bg-theme-7
          dark:bg-theme-8 dark:group-hover/card:bg-theme-8
          rounded-3xl
            shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-9)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-9)_r_g_b/70%)]
            hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-11)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-11)_r_g_b/70%)]
            dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/70%)]
            dark:hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/70%)]`),style:{"background-image":`radial-gradient(
              50% 50% at 50% 100%,
              rgba(255, 255, 255, 0.09) 0%,
              rgba(255, 255, 255, 0.06) 40%,
              rgba(255, 255, 255, 0) 100%
            ),
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.12) 100%
            ),
            rgb(from var(--color-theme-7) r g b / 20%))`,"background-blend-mode":"normal, overlay, normal"}},[b(h,{icon:a.value.icon,"class-name":"w-20"},null,8,["icon"])],2)]),e("div",w,[e("p",y,o(d.$t(r.data.title)),1),e("p",C,o(r.data.have_items)+" "+o(r.data.have_items>1?"items":"item"),1)])]),_:1},8,["class","data-scroll","to"])}}}),B=j;export{B as default};
