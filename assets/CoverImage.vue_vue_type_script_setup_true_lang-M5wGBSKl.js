import{I as d,l as u,E as f,w as v,c as i,b as h,o as s,A as m,n as g,d as p,a as r,R as y}from"./index-H-vD2rqS.js";import{A as b}from"./AppLogoSquare-CvwU0jNv.js";const $={key:0,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"},w=["srcset"],q=["srcset"],k=["srcset"],z=["id","src","alt","loading","data-id","onfocus","onload"],S=d({__name:"CoverImage",props:{data:{type:Object,required:!1},className:{type:String,required:!1,default:""},disableGradient:{type:Boolean,required:!1,default:!1},style:{type:Object,required:!1,default:()=>({})},id:{type:String,required:!1,default:""},loading:{type:String,required:!1,default:"lazy"},onload:{type:Function,required:!1},handleFocus:{type:Function,required:!1},size:{type:Number,required:!1,default:500}},setup(e){const t=e,a=u(null);function l(){const o=location.hostname.includes("dev")?"-dev":"";if(t.data?.cover?.includes("https://")&&t.data?.cover?.includes("fanart.tv")){a.value=t.data?.cover?.replace("https://",`https://api${o}.nomercy.tv/cors?url=https://`)?.replace("https://",`https://api${o}.nomercy.tv/cors?url=https://`);return}if(t.data?.cover?.includes("https://")){a.value=t.data?.cover;return}if(t.data?.cover?.startsWith("/")){a.value=encodeURI(`${y.value?.serverBaseUrl}${t.data?.cover}`);return}a.value=null}f(()=>{l()}),v(t,()=>{l()});function c(){l()}function n(){}return(o,x)=>e.data?(s(),i("div",{key:0,class:g(`${e.className} aspect-square relative z-0 overflow-clip`),style:m({backgroundImage:`
            radial-gradient(
                farthest-corner at top left,
                    ${e.data.color_palette?.cover?.lightVibrant},
                    hsl(0 0% 100% / 4%) 300px
                ),
                radial-gradient(
                    farthest-corner at top right,
                    ${e.data.color_palette?.cover?.lightMuted},
                    hsl(0 0% 100% / 4%) 300px
                ),
                radial-gradient(
                    farthest-corner at bottom left,
                    ${e.data.color_palette?.cover?.primary},
                    hsl(0 0% 100% / 4%)
                ),
                radial-gradient(
                    farthest-corner at bottom right,
                    ${e.data.color_palette?.cover?.darkMuted},
                hsl(0 0% 100% / 4%) 300px
            )`,...e.style})},[a.value?(s(),i("picture",$,[r("source",{srcset:`${a.value}?width=${e.size??500}&type=avif 1x`,type:"image/avif"},null,8,w),r("source",{srcset:`${a.value}?width=${e.size??500}&type=webp 1x`,type:"image/webp",crossorigin:"anonymous"},null,8,q),r("source",{srcset:`${a.value}?width=${e.size??500}&type=jpg 1x`,type:"image/jpeg",crossorigin:"anonymous"},null,8,k),r("img",{id:e.id,src:`${a.value}`,alt:`tmdb image for ${e.data.name??"image"}`,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover",loading:e.loading,tabindex:"-1",crossorigin:"anonymous","data-id":e.data?.id,onclick:n,onfocus:e.handleFocus,onload:e.onload,onerror:c},null,8,z)])):(s(),p(b,{key:1,class:"z-0 overflow-clip bg-black p-[15%] h-available w-available"}))],6)):h("",!0)}});export{S as _};
