import{An as u,Bn as i,Hn as b,Rt as l,Tt as $,Vt as d,an as q,bn as k,cn as s,qt as w,zn as v,zt as f}from"./index-CymNhKD_.js";import{t as z}from"./currentServer-DzE7mepP.js";import{t as m}from"./bundle-mjs-CKr78mlm.js";import{t as h}from"./AppLogoSquare-yoQIEFk_.js";$();var x={key:0,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"},j=["srcset"],B=["srcset"],W=["srcset"],C=["id","alt","data-id","loading","onfocus","onload","src"],N=w({__name:"CoverImage",props:{data:{type:Object,required:!1},className:{type:String,required:!1,default:""},disableGradient:{type:Boolean,required:!1,default:!1},style:{type:Object,required:!1,default:()=>({})},id:{type:String,required:!1,default:""},loading:{type:String,required:!1,default:"lazy"},onload:{type:Function,required:!1},handleFocus:{type:Function,required:!1},size:{type:Number,required:!1,default:500},imageRef:{type:Object,required:!1,default:null}},setup(e){const a=e,t=u(null);function c(){if(!a.data?.cover){t.value=null;return}const r=location.hostname.includes("dev")?"-dev":"";if(a.data?.cover?.startsWith("blob:")){t.value=a.data?.cover;return}if(a.data?.cover?.startsWith("data:")){t.value=a.data?.cover;return}if(a.data?.cover?.startsWith("https://")&&a.data?.cover?.includes("fanart.tv")){t.value=a.data?.cover?.replace("https://",`https://api${r}.nomercy.tv/cors?url=https://`)?.replace("https://",`https://api${r}.nomercy.tv/cors?url=https://`);return}if(a.data?.cover?.startsWith("https://")){t.value=a.data?.cover;return}if(a.data?.cover?.startsWith("/")){t.value=encodeURI(`${z.value?.serverBaseUrl.replace(/\/$/,"")}${a.data?.cover}`);return}t.value=null}q(()=>{c()}),k(a,()=>{c()});const g=u(!1);function p(r){}function y(){}function o(r,n){return a.data?.cover?.startsWith("blob:")||a.data?.cover?.startsWith("data:")?"":`?width=${n}&type=${r} 1x`}return(r,n)=>e.data?.cover&&!g.value?(s(),d("div",{key:0,class:i([e.className,"aspect-square relative z-0 overflow-clip"]),style:b({backgroundImage:`
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
            )`,...e.style})},[t.value?(s(),d("picture",x,[l("source",{srcset:`${t.value}${o("avif",e.size??500)}`,type:"image/avif"},null,8,j),l("source",{srcset:`${t.value}${o("webp",e.size??500)}`,crossorigin:"anonymous",type:"image/webp"},null,8,B),l("source",{srcset:`${t.value}${o("jpeg",e.size??500)}`,crossorigin:"anonymous",type:"image/jpeg"},null,8,W),l("img",{id:e.id,ref:e.imageRef,alt:`cover image for ${e.data.name??"image"}`,"data-id":e.data?.id,loading:e.loading,onclick:y,onerror:p,onfocus:e.handleFocus,onload:e.onload,src:`${t.value}`,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover",crossorigin:"anonymous",tabindex:"-1"},null,8,C)])):(s(),f(h,{key:1,class:i(v(m)("z-0 overflow-clip bg-black p-[15%] h-full w-full",e.className))},null,8,["class"]))],6)):(s(),f(h,{key:1,class:i(v(m)("z-0 overflow-clip bg-black h-full w-full aspect-square relative p-4",e.className))},null,8,["class"]))}}),R=N;export{R as t};
