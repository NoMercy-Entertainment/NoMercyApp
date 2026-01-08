import{Ht as p,In as y,Qn as o,Sn as b,Tn as l,Wn as c,Zn as u,er as $,in as d,nn as v,tn as s,un as w}from"./index-04Sh3wNb.js";import{t as q}from"./currentServer-B7-kbkE-.js";import{t as f}from"./bundle-mjs-Xm_uQvzT.js";import{t as m}from"./AppLogoSquare-DJq6h5gt.js";p();var k={key:0,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"},z=["srcset"],x=["srcset"],S=["srcset"],j=["id","alt","data-id","loading","onfocus","onload","src"],B=w({__name:"CoverImage",props:{data:{type:Object,required:!1},className:{type:String,required:!1,default:""},disableGradient:{type:Boolean,required:!1,default:!1},style:{type:Object,required:!1,default:()=>({})},id:{type:String,required:!1,default:""},loading:{type:String,required:!1,default:"lazy"},onload:{type:Function,required:!1},handleFocus:{type:Function,required:!1},size:{type:Number,required:!1,default:500}},setup(e){const t=e,a=c(null);function i(){if(!t.data?.cover){a.value=null;return}const r=location.hostname.includes("dev")?"-dev":"";if(t.data?.cover?.includes("https://")&&t.data?.cover?.includes("fanart.tv")){a.value=t.data?.cover?.replace("https://",`https://api${r}.nomercy.tv/cors?url=https://`)?.replace("https://",`https://api${r}.nomercy.tv/cors?url=https://`);return}if(t.data?.cover?.includes("https://")){a.value=t.data?.cover;return}if(t.data?.cover?.startsWith("/")){a.value=encodeURI(`${q.value?.serverBaseUrl.replace(/\/$/,"")}${t.data?.cover}`);return}a.value=null}b(()=>{i()}),y(t,()=>{i()});const n=c(!1);function g(r){r.target.onerror=null,n.value=!0}function h(){}return(r,C)=>e.data?.cover&&!n.value?(l(),d("div",{key:0,class:o([e.className,"aspect-square relative z-0 overflow-clip"]),style:$({backgroundImage:`
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
            )`,...e.style})},[a.value?(l(),d("picture",k,[s("source",{srcset:`${a.value}?width=${e.size??500}&type=avif 1x`,type:"image/avif"},null,8,z),s("source",{srcset:`${a.value}?width=${e.size??500}&type=webp 1x`,crossorigin:"anonymous",type:"image/webp"},null,8,x),s("source",{srcset:`${a.value}?width=${e.size??500}&type=jpg 1x`,crossorigin:"anonymous",type:"image/jpeg"},null,8,S),s("img",{id:e.id,alt:`cover image for ${e.data.name??"image"}`,"data-id":e.data?.id,loading:e.loading,onclick:h,onerror:g,onfocus:e.handleFocus,onload:e.onload,src:`${a.value}`,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover",crossorigin:"anonymous",tabindex:"-1"},null,8,j)])):(l(),v(m,{key:1,class:o(u(f)("z-0 overflow-clip bg-black p-[15%] h-full w-full",e.className))},null,8,["class"]))],6)):(l(),v(m,{key:1,class:o(u(f)("z-0 overflow-clip bg-black h-full w-full aspect-square relative p-4",e.className))},null,8,["class"]))}}),E=B;export{E as t};
