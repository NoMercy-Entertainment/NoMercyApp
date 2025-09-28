import{$s as l,As as c,Ci as g,Dc as n,Ms as u,Rs as m,Xs as p,_s as y,kc as b,ks as s,uc as $,yc as d}from"./index-H5TKJIZK.js";import{t as v}from"./AppLogoSquare-DMiw3kfV.js";y();var w={key:0,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"},k=["srcset"],q=["srcset"],z=["srcset"],x=["id","alt","data-id","loading","onfocus","onload","src"],C=m({__name:"CoverImage",props:{data:{type:Object,required:!1},className:{type:String,required:!1,default:""},disableGradient:{type:Boolean,required:!1,default:!1},style:{type:Object,required:!1,default:()=>({})},id:{type:String,required:!1,default:""},loading:{type:String,required:!1,default:"lazy"},onload:{type:Function,required:!1},handleFocus:{type:Function,required:!1},size:{type:Number,required:!1,default:500}},setup(e){const t=e,a=d(null);function o(){if(!t.data?.cover){a.value=null;return}const r=location.hostname.includes("dev")?"-dev":"";if(t.data?.cover?.includes("https://")&&t.data?.cover?.includes("fanart.tv")){a.value=t.data?.cover?.replace("https://",`https://api${r}.nomercy.tv/cors?url=https://`)?.replace("https://",`https://api${r}.nomercy.tv/cors?url=https://`);return}if(t.data?.cover?.includes("https://")){a.value=t.data?.cover;return}if(t.data?.cover?.startsWith("/")){a.value=encodeURI(`${g.value?.serverBaseUrl}${t.data?.cover}`);return}a.value=null}p(()=>{o()}),$(t,()=>{o()});const i=d(!1);function f(r){r.target.onerror=null,i.value=!0}function h(){}return(r,j)=>e.data?.cover&&!i.value?(l(),u("div",{key:0,class:n([e.className,"aspect-square relative z-0 overflow-clip"]),style:b({backgroundImage:`
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
            )`,...e.style})},[a.value?(l(),u("picture",w,[s("source",{srcset:`${a.value}?width=${e.size??500}&type=avif 1x`,type:"image/avif"},null,8,k),s("source",{srcset:`${a.value}?width=${e.size??500}&type=webp 1x`,crossorigin:"anonymous",type:"image/webp"},null,8,q),s("source",{srcset:`${a.value}?width=${e.size??500}&type=jpg 1x`,crossorigin:"anonymous",type:"image/jpeg"},null,8,z),s("img",{id:e.id,alt:`cover image for ${e.data.name??"image"}`,"data-id":e.data?.id,loading:e.loading,onclick:h,onerror:f,onfocus:e.handleFocus,onload:e.onload,src:`${a.value}`,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover",crossorigin:"anonymous",tabindex:"-1"},null,8,x)])):(l(),c(v,{key:1,class:"z-0 overflow-clip bg-black p-[15%] h-available w-available"}))],6)):(l(),c(v,{key:1,class:n([e.className,"z-0 overflow-clip bg-black p-[15%] h-available w-available aspect-square relative z-0 overflow-clip"])},null,8,["class"]))}}),I=C;export{I as t};
