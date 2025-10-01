import{Ai as p,Bs as n,Fc as y,Ks as b,Ls as l,Mc as u,Nc as o,Rs as d,Tc as v,_c as w,ba as f,oc as s,rc as $,ws as q}from"./index-DO6J_9Tp.js";import{t as g}from"./AppLogoSquare-DsJ0G2n6.js";q();var k={key:0,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"},z=["srcset"],x=["srcset"],B=["srcset"],N=["id","alt","data-id","loading","onfocus","onload","src"],j=b({__name:"CoverImage",props:{data:{type:Object,required:!1},className:{type:String,required:!1,default:""},disableGradient:{type:Boolean,required:!1,default:!1},style:{type:Object,required:!1,default:()=>({})},id:{type:String,required:!1,default:""},loading:{type:String,required:!1,default:"lazy"},onload:{type:Function,required:!1},handleFocus:{type:Function,required:!1},size:{type:Number,required:!1,default:500}},setup(e){const t=e,a=v(null);function c(){if(!t.data?.cover){a.value=null;return}const r=location.hostname.includes("dev")?"-dev":"";if(t.data?.cover?.includes("https://")&&t.data?.cover?.includes("fanart.tv")){a.value=t.data?.cover?.replace("https://",`https://api${r}.nomercy.tv/cors?url=https://`)?.replace("https://",`https://api${r}.nomercy.tv/cors?url=https://`);return}if(t.data?.cover?.includes("https://")){a.value=t.data?.cover;return}if(t.data?.cover?.startsWith("/")){a.value=encodeURI(`${p.value?.serverBaseUrl}${t.data?.cover}`);return}a.value=null}$(()=>{c()}),w(t,()=>{c()});const i=v(!1);function h(r){r.target.onerror=null,i.value=!0}function m(){}return(r,C)=>e.data?.cover&&!i.value?(s(),n("div",{key:0,class:o([e.className,"aspect-square relative z-0 overflow-clip"]),style:y({backgroundImage:`
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
            )`,...e.style})},[a.value?(s(),n("picture",k,[l("source",{srcset:`${a.value}?width=${e.size??500}&type=avif 1x`,type:"image/avif"},null,8,z),l("source",{srcset:`${a.value}?width=${e.size??500}&type=webp 1x`,crossorigin:"anonymous",type:"image/webp"},null,8,x),l("source",{srcset:`${a.value}?width=${e.size??500}&type=jpg 1x`,crossorigin:"anonymous",type:"image/jpeg"},null,8,B),l("img",{id:e.id,alt:`cover image for ${e.data.name??"image"}`,"data-id":e.data?.id,loading:e.loading,onclick:m,onerror:h,onfocus:e.handleFocus,onload:e.onload,src:`${a.value}`,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover",crossorigin:"anonymous",tabindex:"-1"},null,8,N)])):(s(),d(g,{key:1,class:o(u(f)("z-0 overflow-clip bg-black p-[15%] h-full w-full",e.className))},null,8,["class"]))],6)):(s(),d(g,{key:1,class:o(u(f)("z-0 overflow-clip bg-black h-full w-full aspect-square relative p-4",e.className))},null,8,["class"]))}}),I=j;export{I as t};
