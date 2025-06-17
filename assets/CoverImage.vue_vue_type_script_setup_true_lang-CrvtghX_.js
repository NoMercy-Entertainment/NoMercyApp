import{c as z}from"./index-BtCq0VeX.js";import{A as x}from"./AppLogoSquare-DwFk-Amv.js";import{Y as j,d as B,f as S,w as C,h as w,b as N,o as g,H as F,t as I,c as M,i as v}from"./vue-ionic-Cv2or74p.js";const V={key:0,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"},A=["srcset"],E=["srcset"],O=["srcset"],U=["src","alt","id","loading","data-id","onfocus","onload"],R=j({__name:"CoverImage",props:{data:{type:Object,required:!1},className:{type:String,required:!1,default:""},disableGradient:{type:Boolean,required:!1,default:!1},style:{type:Object,required:!1,default:()=>({})},id:{type:String,required:!1,default:""},loading:{type:String,required:!1,default:"lazy"},onload:{type:Function,required:!1},handleFocus:{type:Function,required:!1},size:{type:Number,required:!1,default:500}},setup(e){const t=e,a=B(null),f=()=>{var m,r,l,o,s,i,c,n,d,u,p,y,b,$;const h=location.hostname.includes("dev")?"-dev":"";if((r=(m=t.data)==null?void 0:m.cover)!=null&&r.includes("https://")&&((o=(l=t.data)==null?void 0:l.cover)!=null&&o.includes("fanart.tv"))){a.value=(c=(i=(s=t.data)==null?void 0:s.cover)==null?void 0:i.replace("https://",`https://api${h}.nomercy.tv/cors?url=https://`))==null?void 0:c.replace("https://",`https://api${h}.nomercy.tv/cors?url=https://`);return}if((d=(n=t.data)==null?void 0:n.cover)!=null&&d.includes("https://")){a.value=(u=t.data)==null?void 0:u.cover;return}if((y=(p=t.data)==null?void 0:p.cover)!=null&&y.startsWith("/")){a.value=encodeURI(`${(b=z.value)==null?void 0:b.serverBaseUrl}${($=t.data)==null?void 0:$.cover}`);return}a.value=null};S(()=>{f()}),C(t,()=>{f()});const q=()=>{f()},k=()=>{};return(h,m)=>{var r,l,o,s,i,c,n,d,u;return e.data?(g(),w("div",{key:0,class:I(`${e.className} aspect-square relative z-0 overflow-clip`),style:F({backgroundImage:`
            radial-gradient(
                farthest-corner at top left,
                    ${(l=(r=e.data.color_palette)==null?void 0:r.cover)==null?void 0:l.lightVibrant},
                    hsl(0 0% 100% / 4%) 300px
                ),
                radial-gradient(
                    farthest-corner at top right,
                    ${(s=(o=e.data.color_palette)==null?void 0:o.cover)==null?void 0:s.lightMuted},
                    hsl(0 0% 100% / 4%) 300px
                ),
                radial-gradient(
                    farthest-corner at bottom left,
                    ${(c=(i=e.data.color_palette)==null?void 0:i.cover)==null?void 0:c.primary},
                    hsl(0 0% 100% / 4%)
                ),
                radial-gradient(
                    farthest-corner at bottom right,
                    ${(d=(n=e.data.color_palette)==null?void 0:n.cover)==null?void 0:d.darkMuted},
                hsl(0 0% 100% / 4%) 300px
            )`,...e.style})},[a.value?(g(),w("picture",V,[v("source",{srcset:`${a.value}?width=${e.size??500}&type=avif 1x`,type:"image/avif"},null,8,A),v("source",{srcset:`${a.value}?width=${e.size??500}&type=webp 1x`,type:"image/webp",crossorigin:"anonymous"},null,8,E),v("source",{srcset:`${a.value}?width=${e.size??500}&type=jpg 1x`,type:"image/jpeg",crossorigin:"anonymous"},null,8,O),v("img",{src:`${a.value}`,alt:`tmdb image for ${e.data.name??"image"}`,id:e.id,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover",loading:e.loading,tabindex:"-1",crossorigin:"anonymous","data-id":(u=e.data)==null?void 0:u.id,onclick:k,onfocus:e.handleFocus,onload:e.onload,onerror:q},null,8,U)])):(g(),M(x,{key:1,class:"z-0 overflow-clip bg-black p-[15%] h-available w-available"}))],6)):N("",!0)}}});export{R as _};
