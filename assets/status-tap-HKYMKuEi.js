import{bL as a,bM as i,bN as c,bO as d,bP as l}from"./index-16sqk8Bx.js";/*!
* (C) Ionic http://ionicframework.com - MIT License
*/const m=()=>{const e=window;e.addEventListener("statusTap",()=>{a(()=>{const o=e.innerWidth,s=e.innerHeight,n=document.elementFromPoint(o/2,s/2);if(!n)return;const t=i(n);t&&new Promise(r=>c(t,r)).then(()=>{d(async()=>{t.style.setProperty("--overflow","hidden"),await l(t,300),t.style.removeProperty("--overflow")})})})})};export{m as startStatusTap};
//# sourceMappingURL=status-tap-HKYMKuEi.js.map
