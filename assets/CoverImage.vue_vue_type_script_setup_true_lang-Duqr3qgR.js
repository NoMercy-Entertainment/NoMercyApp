import{I as k,l as x,D as j,w as B,c as w,b as S,o as g,z as C,n as N,d as F,a as f,R as I}from"./index-DkQngsHe.js";import{A as M}from"./AppLogoSquare-BLQmk_bo.js";const V={key:0,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"},A=["srcset"],E=["srcset"],O=["srcset"],R=["id","src","alt","loading","data-id","onfocus","onload"],G=k({__name:"CoverImage",props:{data:{type:Object,required:!1},className:{type:String,required:!1,default:""},disableGradient:{type:Boolean,required:!1,default:!1},style:{type:Object,required:!1,default:()=>({})},id:{type:String,required:!1,default:""},loading:{type:String,required:!1,default:"lazy"},onload:{type:Function,required:!1},handleFocus:{type:Function,required:!1},size:{type:Number,required:!1,default:500}},setup(e){const t=e,a=x(null);function v(){var m,r,l,o,s,i,c,n,d,u,p,y,b,$;const h=location.hostname.includes("dev")?"-dev":"";if((r=(m=t.data)==null?void 0:m.cover)!=null&&r.includes("https://")&&((o=(l=t.data)==null?void 0:l.cover)!=null&&o.includes("fanart.tv"))){a.value=(c=(i=(s=t.data)==null?void 0:s.cover)==null?void 0:i.replace("https://",`https://api${h}.nomercy.tv/cors?url=https://`))==null?void 0:c.replace("https://",`https://api${h}.nomercy.tv/cors?url=https://`);return}if((d=(n=t.data)==null?void 0:n.cover)!=null&&d.includes("https://")){a.value=(u=t.data)==null?void 0:u.cover;return}if((y=(p=t.data)==null?void 0:p.cover)!=null&&y.startsWith("/")){a.value=encodeURI(`${(b=I.value)==null?void 0:b.serverBaseUrl}${($=t.data)==null?void 0:$.cover}`);return}a.value=null}j(()=>{v()}),B(t,()=>{v()});function q(){v()}function z(){}return(h,m)=>{var r,l,o,s,i,c,n,d,u;return e.data?(g(),w("div",{key:0,class:N(`${e.className} aspect-square relative z-0 overflow-clip`),style:C({backgroundImage:`
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
            )`,...e.style})},[a.value?(g(),w("picture",V,[f("source",{srcset:`${a.value}?width=${e.size??500}&type=avif 1x`,type:"image/avif"},null,8,A),f("source",{srcset:`${a.value}?width=${e.size??500}&type=webp 1x`,type:"image/webp",crossorigin:"anonymous"},null,8,E),f("source",{srcset:`${a.value}?width=${e.size??500}&type=jpg 1x`,type:"image/jpeg",crossorigin:"anonymous"},null,8,O),f("img",{id:e.id,src:`${a.value}`,alt:`tmdb image for ${e.data.name??"image"}`,class:"aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover",loading:e.loading,tabindex:"-1",crossorigin:"anonymous","data-id":(u=e.data)==null?void 0:u.id,onclick:z,onfocus:e.handleFocus,onload:e.onload,onerror:q},null,8,R)])):(g(),F(M,{key:1,class:"z-0 overflow-clip bg-black p-[15%] h-available w-available"}))],6)):S("",!0)}}});export{G as _};
