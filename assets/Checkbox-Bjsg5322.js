import{At as u,Q as f,S as l,T as a,Y as o,c as p,j as x,w as k,x as s}from"./i18n-DXLa9EKW.js";p();var w=["id","checked"],y=["id","height","width"],g=["innerHTML"],m={key:0,class:"relative flex flex-grow items-center justify-center gap-2 px-2"},v={class:"w-full flex-grow text-sm font-medium"},_=x({__name:"Checkbox",props:{id:{type:String,required:!1},modelValue:{type:Boolean,required:!1,default:null},label:{type:String,required:!1},width:{type:String,required:!1,default:"18"},height:{type:String,required:!1,default:"18"},color:{type:String,required:!1,default:"hsl(from var(--color-theme-8) h s 20%)"},onclick:{type:Function,required:!1}},emits:["update:modelValue"],setup(t,{emit:n}){const e=t,d=n;function c(){if(e.onclick){e.onclick?.();return}let r;e.modelValue===null||e.modelValue===!1?r=!0:e.modelValue===!0&&(r=!1),d("update:modelValue",r)}const i=s(()=>`
      <defs>
        <linearGradient id="paint0_linear_4922_9259" x1="9" y1="0" x2="9" y2="18" gradientUnits="userSpaceOnUse" >
          <stop stop-color="white" stop-opacity="0.4" offset="0"></stop>
          <stop offset="1" stop-color="white" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
	`),h=s(()=>e.modelValue===null?`
      <rect x="0.25" y="0.25" width="17.5" height="17.5" rx="3.75" fill="${e.color}" fill-opacity="0.29" ></rect>
      <rect x="0.25" y="0.25" width="17.5" height="17.5" rx="3.75" stroke="#6F52FF" stroke-opacity="0.73" stroke-width="0.5" ></rect>
      <rect x="0.25" y="0.25" width="17.5" height="17.5" rx="3.75" stroke="url(#paint0_linear_4922_9259)" stroke-width="0.5" ></rect>
      <path d="M4.91675 9H13.0834" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path>
      ${i.value}
    `:e.modelValue?`
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" fill="${e.color}"></rect>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="#E2F0FD" stroke-opacity="0.08" ></rect>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="url(#paint0_linear_4922_9259)" ></rect>
      <path d="M13.6666 5.5L7.24992 11.9167L4.33325 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path>
      ${i.value}
    `:`
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" class="fill-surface-1" fill-opacity="1"/>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" fill="#DFEFFE" fill-opacity="0.14"/>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="#E5F2FE" stroke-opacity="0.26"/>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="url(#paint0_linear_4922_9259)"/>
      ${i.value}
    `);return(r,V)=>(o(),a("div",{class:"relative flex select-none items-center justify-start gap-2 self-stretch border border-transparent bg-transparent",onClick:c},[l("input",{id:t.id,checked:!!t.modelValue,class:"hidden item-selector",type:"checkbox"},null,8,w),(o(),a("svg",{id:t.id,height:t.height,width:t.width,class:"relative w-[18px] h-[18px]",fill:"none",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 18 18",xmlns:"http://www.w3.org/2000/svg"},[l("g",{innerHTML:h.value},null,8,g)],8,y)),t.label?(o(),a("div",m,[l("p",v,u(r.$t(t.label)),1)])):k("",!0),f(r.$slots,"default")]))}}),F=_;export{F as t};
