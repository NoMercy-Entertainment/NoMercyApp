import{I as m,az as s,bz as c,c9 as l}from"./index-DTULoChM.js";var a=(e=>(e.Disconnected="Disconnected",e.Connecting="Connecting",e.Connected="Connected",e.Disconnecting="Disconnecting",e.Reconnecting="Reconnecting",e))(a||{});const n=m([]),d=(e,u,r=0)=>{s(()=>{const t=n.value.find(i=>i.mount==e);t!=null&&t.timeout&&(clearTimeout(t.timeout),t.timeout=null),(t==null?void 0:t.mount)!=e&&(e(),n.value=[...c(n.value),{mount:e,unmount:u,timeout:null}])}),l(()=>{if(n.value.length===0){u();return}const t=n.value.find(i=>i.mount==e);if(!t){u();return}t.timeout=setTimeout(()=>{u(),n.value=n.value.filter(i=>i.mount!=e).map(i=>c(i))},r*1e3)})};export{a as H,d as u};
//# sourceMappingURL=useMounted-6yX7oy7E.js.map