import{aw as U,a$ as y,I as S,cb as j,az as ee,F as oe,a_ as ie,cc as se,cd as V,ce as le,cf as H,cg as W,J as ue,e as X,a7 as J,aB as b,ch as ce,bd as de,o as F,v as fe,c as G,a as _,t as I,h as Z,bE as he,bF as ve}from"./index-DY3uukPc.js";/*!
* qrcode.vue v3.6.0
* A Vue.js component to generate QRCode. Both support Vue 2 and Vue 3
* © 2017-PRESENT @scopewu(https://github.com/scopewu)
* MIT License.
*/var P=function(){return P=Object.assign||function(u){for(var c,l=1,f=arguments.length;l<f;l++){c=arguments[l];for(var h in c)Object.prototype.hasOwnProperty.call(c,h)&&(u[h]=c[h])}return u},P.apply(this,arguments)},k;(function(i){var u=function(){function n(e,t,r,a){if(this.version=e,this.errorCorrectionLevel=t,this.modules=[],this.isFunction=[],e<n.MIN_VERSION||e>n.MAX_VERSION)throw new RangeError("Version value out of range");if(a<-1||a>7)throw new RangeError("Mask value out of range");this.size=e*4+17;for(var o=[],s=0;s<this.size;s++)o.push(!1);for(var s=0;s<this.size;s++)this.modules.push(o.slice()),this.isFunction.push(o.slice());this.drawFunctionPatterns();var d=this.addEccAndInterleave(r);if(this.drawCodewords(d),a==-1)for(var v=1e9,s=0;s<8;s++){this.applyMask(s),this.drawFormatBits(s);var p=this.getPenaltyScore();p<v&&(a=s,v=p),this.applyMask(s)}f(0<=a&&a<=7),this.mask=a,this.applyMask(a),this.drawFormatBits(a),this.isFunction=[]}return n.encodeText=function(e,t){var r=i.QrSegment.makeSegments(e);return n.encodeSegments(r,t)},n.encodeBinary=function(e,t){var r=i.QrSegment.makeBytes(e);return n.encodeSegments([r],t)},n.encodeSegments=function(e,t,r,a,o,s){if(r===void 0&&(r=1),a===void 0&&(a=40),o===void 0&&(o=-1),s===void 0&&(s=!0),!(n.MIN_VERSION<=r&&r<=a&&a<=n.MAX_VERSION)||o<-1||o>7)throw new RangeError("Invalid value");var d,v;for(d=r;;d++){var p=n.getNumDataCodewords(d,t)*8,C=h.getTotalBits(e,d);if(C<=p){v=C;break}if(d>=a)throw new RangeError("Data too long")}for(var w=0,M=[n.Ecc.MEDIUM,n.Ecc.QUARTILE,n.Ecc.HIGH];w<M.length;w++){var m=M[w];s&&v<=n.getNumDataCodewords(d,m)*8&&(t=m)}for(var g=[],E=0,N=e;E<N.length;E++){var R=N[E];c(R.mode.modeBits,4,g),c(R.numChars,R.mode.numCharCountBits(d),g);for(var T=0,A=R.getData();T<A.length;T++){var D=A[T];g.push(D)}}f(g.length==v);var B=n.getNumDataCodewords(d,t)*8;f(g.length<=B),c(0,Math.min(4,B-g.length),g),c(0,(8-g.length%8)%8,g),f(g.length%8==0);for(var z=236;g.length<B;z^=253)c(z,8,g);for(var L=[];L.length*8<g.length;)L.push(0);return g.forEach(function(x,Q){return L[Q>>>3]|=x<<7-(Q&7)}),new n(d,t,L,o)},n.prototype.getModule=function(e,t){return 0<=e&&e<this.size&&0<=t&&t<this.size&&this.modules[t][e]},n.prototype.getModules=function(){return this.modules},n.prototype.drawFunctionPatterns=function(){for(var e=0;e<this.size;e++)this.setFunctionModule(6,e,e%2==0),this.setFunctionModule(e,6,e%2==0);this.drawFinderPattern(3,3),this.drawFinderPattern(this.size-4,3),this.drawFinderPattern(3,this.size-4);for(var t=this.getAlignmentPatternPositions(),r=t.length,e=0;e<r;e++)for(var a=0;a<r;a++)e==0&&a==0||e==0&&a==r-1||e==r-1&&a==0||this.drawAlignmentPattern(t[e],t[a]);this.drawFormatBits(0),this.drawVersion()},n.prototype.drawFormatBits=function(e){for(var t=this.errorCorrectionLevel.formatBits<<3|e,r=t,a=0;a<10;a++)r=r<<1^(r>>>9)*1335;var o=(t<<10|r)^21522;f(o>>>15==0);for(var a=0;a<=5;a++)this.setFunctionModule(8,a,l(o,a));this.setFunctionModule(8,7,l(o,6)),this.setFunctionModule(8,8,l(o,7)),this.setFunctionModule(7,8,l(o,8));for(var a=9;a<15;a++)this.setFunctionModule(14-a,8,l(o,a));for(var a=0;a<8;a++)this.setFunctionModule(this.size-1-a,8,l(o,a));for(var a=8;a<15;a++)this.setFunctionModule(8,this.size-15+a,l(o,a));this.setFunctionModule(8,this.size-8,!0)},n.prototype.drawVersion=function(){if(!(this.version<7)){for(var e=this.version,t=0;t<12;t++)e=e<<1^(e>>>11)*7973;var r=this.version<<12|e;f(r>>>18==0);for(var t=0;t<18;t++){var a=l(r,t),o=this.size-11+t%3,s=Math.floor(t/3);this.setFunctionModule(o,s,a),this.setFunctionModule(s,o,a)}}},n.prototype.drawFinderPattern=function(e,t){for(var r=-4;r<=4;r++)for(var a=-4;a<=4;a++){var o=Math.max(Math.abs(a),Math.abs(r)),s=e+a,d=t+r;0<=s&&s<this.size&&0<=d&&d<this.size&&this.setFunctionModule(s,d,o!=2&&o!=4)}},n.prototype.drawAlignmentPattern=function(e,t){for(var r=-2;r<=2;r++)for(var a=-2;a<=2;a++)this.setFunctionModule(e+a,t+r,Math.max(Math.abs(a),Math.abs(r))!=1)},n.prototype.setFunctionModule=function(e,t,r){this.modules[t][e]=r,this.isFunction[t][e]=!0},n.prototype.addEccAndInterleave=function(e){var t=this.version,r=this.errorCorrectionLevel;if(e.length!=n.getNumDataCodewords(t,r))throw new RangeError("Invalid argument");for(var a=n.NUM_ERROR_CORRECTION_BLOCKS[r.ordinal][t],o=n.ECC_CODEWORDS_PER_BLOCK[r.ordinal][t],s=Math.floor(n.getNumRawDataModules(t)/8),d=a-s%a,v=Math.floor(s/a),p=[],C=n.reedSolomonComputeDivisor(o),w=0,M=0;w<a;w++){var m=e.slice(M,M+v-o+(w<d?0:1));M+=m.length;var g=n.reedSolomonComputeRemainder(m,C);w<d&&m.push(0),p.push(m.concat(g))}for(var E=[],N=function(R){p.forEach(function(T,A){(R!=v-o||A>=d)&&E.push(T[R])})},w=0;w<p[0].length;w++)N(w);return f(E.length==s),E},n.prototype.drawCodewords=function(e){if(e.length!=Math.floor(n.getNumRawDataModules(this.version)/8))throw new RangeError("Invalid argument");for(var t=0,r=this.size-1;r>=1;r-=2){r==6&&(r=5);for(var a=0;a<this.size;a++)for(var o=0;o<2;o++){var s=r-o,d=(r+1&2)==0,v=d?this.size-1-a:a;!this.isFunction[v][s]&&t<e.length*8&&(this.modules[v][s]=l(e[t>>>3],7-(t&7)),t++)}}f(t==e.length*8)},n.prototype.applyMask=function(e){if(e<0||e>7)throw new RangeError("Mask value out of range");for(var t=0;t<this.size;t++)for(var r=0;r<this.size;r++){var a=void 0;switch(e){case 0:a=(r+t)%2==0;break;case 1:a=t%2==0;break;case 2:a=r%3==0;break;case 3:a=(r+t)%3==0;break;case 4:a=(Math.floor(r/3)+Math.floor(t/2))%2==0;break;case 5:a=r*t%2+r*t%3==0;break;case 6:a=(r*t%2+r*t%3)%2==0;break;case 7:a=((r+t)%2+r*t%3)%2==0;break;default:throw new Error("Unreachable")}!this.isFunction[t][r]&&a&&(this.modules[t][r]=!this.modules[t][r])}},n.prototype.getPenaltyScore=function(){for(var e=0,t=0;t<this.size;t++){for(var r=!1,a=0,o=[0,0,0,0,0,0,0],s=0;s<this.size;s++)this.modules[t][s]==r?(a++,a==5?e+=n.PENALTY_N1:a>5&&e++):(this.finderPenaltyAddHistory(a,o),r||(e+=this.finderPenaltyCountPatterns(o)*n.PENALTY_N3),r=this.modules[t][s],a=1);e+=this.finderPenaltyTerminateAndCount(r,a,o)*n.PENALTY_N3}for(var s=0;s<this.size;s++){for(var r=!1,d=0,o=[0,0,0,0,0,0,0],t=0;t<this.size;t++)this.modules[t][s]==r?(d++,d==5?e+=n.PENALTY_N1:d>5&&e++):(this.finderPenaltyAddHistory(d,o),r||(e+=this.finderPenaltyCountPatterns(o)*n.PENALTY_N3),r=this.modules[t][s],d=1);e+=this.finderPenaltyTerminateAndCount(r,d,o)*n.PENALTY_N3}for(var t=0;t<this.size-1;t++)for(var s=0;s<this.size-1;s++){var v=this.modules[t][s];v==this.modules[t][s+1]&&v==this.modules[t+1][s]&&v==this.modules[t+1][s+1]&&(e+=n.PENALTY_N2)}for(var p=0,C=0,w=this.modules;C<w.length;C++){var M=w[C];p=M.reduce(function(E,N){return E+(N?1:0)},p)}var m=this.size*this.size,g=Math.ceil(Math.abs(p*20-m*10)/m)-1;return f(0<=g&&g<=9),e+=g*n.PENALTY_N4,f(0<=e&&e<=2568888),e},n.prototype.getAlignmentPatternPositions=function(){if(this.version==1)return[];for(var e=Math.floor(this.version/7)+2,t=Math.floor((this.version*8+e*3+5)/(e*4-4))*2,r=[6],a=this.size-7;r.length<e;a-=t)r.splice(1,0,a);return r},n.getNumRawDataModules=function(e){if(e<n.MIN_VERSION||e>n.MAX_VERSION)throw new RangeError("Version number out of range");var t=(16*e+128)*e+64;if(e>=2){var r=Math.floor(e/7)+2;t-=(25*r-10)*r-55,e>=7&&(t-=36)}return f(208<=t&&t<=29648),t},n.getNumDataCodewords=function(e,t){return Math.floor(n.getNumRawDataModules(e)/8)-n.ECC_CODEWORDS_PER_BLOCK[t.ordinal][e]*n.NUM_ERROR_CORRECTION_BLOCKS[t.ordinal][e]},n.reedSolomonComputeDivisor=function(e){if(e<1||e>255)throw new RangeError("Degree out of range");for(var t=[],r=0;r<e-1;r++)t.push(0);t.push(1);for(var a=1,r=0;r<e;r++){for(var o=0;o<t.length;o++)t[o]=n.reedSolomonMultiply(t[o],a),o+1<t.length&&(t[o]^=t[o+1]);a=n.reedSolomonMultiply(a,2)}return t},n.reedSolomonComputeRemainder=function(e,t){for(var r=t.map(function(v){return 0}),a=function(v){var p=v^r.shift();r.push(0),t.forEach(function(C,w){return r[w]^=n.reedSolomonMultiply(C,p)})},o=0,s=e;o<s.length;o++){var d=s[o];a(d)}return r},n.reedSolomonMultiply=function(e,t){if(e>>>8||t>>>8)throw new RangeError("Byte out of range");for(var r=0,a=7;a>=0;a--)r=r<<1^(r>>>7)*285,r^=(t>>>a&1)*e;return f(r>>>8==0),r},n.prototype.finderPenaltyCountPatterns=function(e){var t=e[1];f(t<=this.size*3);var r=t>0&&e[2]==t&&e[3]==t*3&&e[4]==t&&e[5]==t;return(r&&e[0]>=t*4&&e[6]>=t?1:0)+(r&&e[6]>=t*4&&e[0]>=t?1:0)},n.prototype.finderPenaltyTerminateAndCount=function(e,t,r){return e&&(this.finderPenaltyAddHistory(t,r),t=0),t+=this.size,this.finderPenaltyAddHistory(t,r),this.finderPenaltyCountPatterns(r)},n.prototype.finderPenaltyAddHistory=function(e,t){t[0]==0&&(e+=this.size),t.pop(),t.unshift(e)},n.MIN_VERSION=1,n.MAX_VERSION=40,n.PENALTY_N1=3,n.PENALTY_N2=3,n.PENALTY_N3=40,n.PENALTY_N4=10,n.ECC_CODEWORDS_PER_BLOCK=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]],n.NUM_ERROR_CORRECTION_BLOCKS=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]],n}();i.QrCode=u;function c(n,e,t){if(e<0||e>31||n>>>e)throw new RangeError("Value out of range");for(var r=e-1;r>=0;r--)t.push(n>>>r&1)}function l(n,e){return(n>>>e&1)!=0}function f(n){if(!n)throw new Error("Assertion error")}var h=function(){function n(e,t,r){if(this.mode=e,this.numChars=t,this.bitData=r,t<0)throw new RangeError("Invalid argument");this.bitData=r.slice()}return n.makeBytes=function(e){for(var t=[],r=0,a=e;r<a.length;r++){var o=a[r];c(o,8,t)}return new n(n.Mode.BYTE,e.length,t)},n.makeNumeric=function(e){if(!n.isNumeric(e))throw new RangeError("String contains non-numeric characters");for(var t=[],r=0;r<e.length;){var a=Math.min(e.length-r,3);c(parseInt(e.substring(r,r+a),10),a*3+1,t),r+=a}return new n(n.Mode.NUMERIC,e.length,t)},n.makeAlphanumeric=function(e){if(!n.isAlphanumeric(e))throw new RangeError("String contains unencodable characters in alphanumeric mode");var t=[],r;for(r=0;r+2<=e.length;r+=2){var a=n.ALPHANUMERIC_CHARSET.indexOf(e.charAt(r))*45;a+=n.ALPHANUMERIC_CHARSET.indexOf(e.charAt(r+1)),c(a,11,t)}return r<e.length&&c(n.ALPHANUMERIC_CHARSET.indexOf(e.charAt(r)),6,t),new n(n.Mode.ALPHANUMERIC,e.length,t)},n.makeSegments=function(e){return e==""?[]:n.isNumeric(e)?[n.makeNumeric(e)]:n.isAlphanumeric(e)?[n.makeAlphanumeric(e)]:[n.makeBytes(n.toUtf8ByteArray(e))]},n.makeEci=function(e){var t=[];if(e<0)throw new RangeError("ECI assignment value out of range");if(e<128)c(e,8,t);else if(e<16384)c(2,2,t),c(e,14,t);else if(e<1e6)c(6,3,t),c(e,21,t);else throw new RangeError("ECI assignment value out of range");return new n(n.Mode.ECI,0,t)},n.isNumeric=function(e){return n.NUMERIC_REGEX.test(e)},n.isAlphanumeric=function(e){return n.ALPHANUMERIC_REGEX.test(e)},n.prototype.getData=function(){return this.bitData.slice()},n.getTotalBits=function(e,t){for(var r=0,a=0,o=e;a<o.length;a++){var s=o[a],d=s.mode.numCharCountBits(t);if(s.numChars>=1<<d)return 1/0;r+=4+d+s.bitData.length}return r},n.toUtf8ByteArray=function(e){e=encodeURI(e);for(var t=[],r=0;r<e.length;r++)e.charAt(r)!="%"?t.push(e.charCodeAt(r)):(t.push(parseInt(e.substring(r+1,r+3),16)),r+=2);return t},n.NUMERIC_REGEX=/^[0-9]*$/,n.ALPHANUMERIC_REGEX=/^[A-Z0-9 $%*+.\/:-]*$/,n.ALPHANUMERIC_CHARSET="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:",n}();i.QrSegment=h})(k||(k={}));(function(i){(function(u){var c=function(){function l(f,h){this.ordinal=f,this.formatBits=h}return l.LOW=new l(0,1),l.MEDIUM=new l(1,0),l.QUARTILE=new l(2,3),l.HIGH=new l(3,2),l}();u.Ecc=c})(i.QrCode||(i.QrCode={}))})(k||(k={}));(function(i){(function(u){var c=function(){function l(f,h){this.modeBits=f,this.numBitsCharCount=h}return l.prototype.numCharCountBits=function(f){return this.numBitsCharCount[Math.floor((f+7)/17)]},l.NUMERIC=new l(1,[10,12,14]),l.ALPHANUMERIC=new l(2,[9,11,13]),l.BYTE=new l(4,[8,16,16]),l.KANJI=new l(8,[8,10,12]),l.ECI=new l(7,[0,0,0]),l}();u.Mode=c})(i.QrSegment||(i.QrSegment={}))})(k||(k={}));var O=k,Y="L",q={L:O.QrCode.Ecc.LOW,M:O.QrCode.Ecc.MEDIUM,Q:O.QrCode.Ecc.QUARTILE,H:O.QrCode.Ecc.HIGH},ge=function(){try{new Path2D().addPath(new Path2D)}catch{return!1}return!0}();function K(i){return i in q}function te(i,u){u===void 0&&(u=0);var c=[];return i.forEach(function(l,f){var h=null;l.forEach(function(n,e){if(!n&&h!==null){c.push("M".concat(h+u," ").concat(f+u,"h").concat(e-h,"v1H").concat(h+u,"z")),h=null;return}if(e===l.length-1){if(!n)return;h===null?c.push("M".concat(e+u,",").concat(f+u," h1v1H").concat(e+u,"z")):c.push("M".concat(h+u,",").concat(f+u," h").concat(e+1-h,"v1H").concat(h+u,"z"));return}n&&h===null&&(h=e)})}),c.join("")}function re(i,u,c,l){var f=l.width,h=l.height,n=l.x,e=l.y,t=i.length+c*2,r=Math.floor(u*.1),a=t/u,o=(f||r)*a,s=(h||r)*a,d=n==null?i.length/2-o/2:n*a,v=e==null?i.length/2-s/2:e*a,p=null;if(l.excavate){var C=Math.floor(d),w=Math.floor(v),M=Math.ceil(o+d-C),m=Math.ceil(s+v-w);p={x:C,y:w,w:M,h:m}}return{x:d,y:v,h:s,w:o,excavation:p}}function ae(i,u){return i.slice().map(function(c,l){return l<u.y||l>=u.y+u.h?c:c.map(function(f,h){return h<u.x||h>=u.x+u.w?f:!1})})}var $={value:{type:String,required:!0,default:""},size:{type:Number,default:100},level:{type:String,default:Y,validator:function(i){return K(i)}},background:{type:String,default:"#fff"},foreground:{type:String,default:"#000"},margin:{type:Number,required:!1,default:0},imageSettings:{type:Object,required:!1,default:function(){return{}}},gradient:{type:Boolean,required:!1,default:!1},gradientType:{type:String,required:!1,default:"linear",validator:function(i){return["linear","radial"].indexOf(i)>-1}},gradientStartColor:{type:String,required:!1,default:"#000"},gradientEndColor:{type:String,required:!1,default:"#fff"}},me=P(P({},$),{renderAs:{type:String,required:!1,default:"canvas",validator:function(i){return["canvas","svg"].indexOf(i)>-1}}}),pe=U({name:"QRCodeSvg",props:$,setup:function(i){var u=S(0),c=S(""),l,f=function(){var n=i.value,e=i.level,t=i.margin,r=t>>>0,a=K(e)?e:Y,o=O.QrCode.encodeText(n,q[a]).getModules();if(u.value=o.length+r*2,i.imageSettings.src){var s=re(o,i.size,r,i.imageSettings);l={x:s.x+r,y:s.y+r,width:s.w,height:s.h},s.excavation&&(o=ae(o,s.excavation))}c.value=te(o,r)},h=function(){if(!i.gradient)return null;var n=i.gradientType==="linear"?{x1:"0%",y1:"0%",x2:"100%",y2:"100%"}:{cx:"50%",cy:"50%",r:"50%",fx:"50%",fy:"50%"};return y(i.gradientType==="linear"?"linearGradient":"radialGradient",P({id:"qr-gradient"},n),[y("stop",{offset:"0%",style:{stopColor:i.gradientStartColor}}),y("stop",{offset:"100%",style:{stopColor:i.gradientEndColor}})])};return f(),j(f),function(){return y("svg",{width:i.size,height:i.size,"shape-rendering":"crispEdges",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(u.value," ").concat(u.value)},[y("defs",{},[h()]),y("rect",{width:"100%",height:"100%",fill:i.background}),y("path",{fill:i.gradient?"url(#qr-gradient)":i.foreground,d:c.value}),i.imageSettings.src&&y("image",P({href:i.imageSettings.src},l))])}}}),we=U({name:"QRCodeCanvas",props:$,setup:function(i,u){var c=S(null),l=S(null),f=function(){var n=i.value,e=i.level,t=i.size,r=i.margin,a=i.background,o=i.foreground,s=i.gradient,d=i.gradientType,v=i.gradientStartColor,p=i.gradientEndColor,C=r>>>0,w=K(e)?e:Y,M=c.value;if(M){var m=M.getContext("2d");if(m){var g=O.QrCode.encodeText(n,q[w]).getModules(),E=g.length+C*2,N=l.value,R={x:0,y:0,width:0,height:0},T=i.imageSettings.src&&N!=null&&N.naturalWidth!==0&&N.naturalHeight!==0;if(T){var A=re(g,i.size,C,i.imageSettings);R={x:A.x+C,y:A.y+C,width:A.w,height:A.h},A.excavation&&(g=ae(g,A.excavation))}var D=window.devicePixelRatio||1,B=t/E*D;if(M.height=M.width=t*D,m.scale(B,B),m.fillStyle=a,m.fillRect(0,0,E,E),s){var z=void 0;d==="linear"?z=m.createLinearGradient(0,0,E,E):z=m.createRadialGradient(E/2,E/2,0,E/2,E/2,E/2),z.addColorStop(0,v),z.addColorStop(1,p),m.fillStyle=z}else m.fillStyle=o;ge?m.fill(new Path2D(te(g,C))):g.forEach(function(L,x){L.forEach(function(Q,ne){Q&&m.fillRect(ne+C,x+C,1,1)})}),T&&m.drawImage(N,R.x,R.y,R.width,R.height)}}};ee(f),j(f);var h=u.attrs.style;return function(){return y(oe,[y("canvas",P(P({},u.attrs),{ref:c,style:P(P({},h),{width:"".concat(i.size,"px"),height:"".concat(i.size,"px")})})),i.imageSettings.src&&y("img",{ref:l,src:i.imageSettings.src,style:{display:"none"},onLoad:f})])}}}),Ce=U({name:"Qrcode",render:function(){var i=this.$props,u=i.renderAs,c=i.value,l=i.size,f=i.margin,h=i.level,n=i.background,e=i.foreground,t=i.imageSettings,r=i.gradient,a=i.gradientType,o=i.gradientStartColor,s=i.gradientEndColor;return y(u==="svg"?pe:we,{value:c,size:l,margin:f,level:h,background:n,foreground:e,imageSettings:t,gradient:r,gradientType:a,gradientStartColor:o,gradientEndColor:s})},props:me});const Ee={key:0,class:"flex h-screen w-screen flex-nowrap items-center justify-between gap-4 overflow-hidden p-24 text-slate-light-12 dark:text-slate-dark-12 bg-slate-light-3 dark:bg-slate-dark-1"},Me={class:"flex w-2/3 flex-col gap-4 font-semibold"},_e={class:"text-3xl"},Re={class:"flex items-start gap-4"},ye={class:"whitespace-nowrap rounded-md px-3 leading-8 text-white bg-theme-600"},Ne={class:"flex flex-col gap-2 text-lg"},Ae={class:"text-2xl font-semibold whitespace-break-spaces"},Se={class:"flex items-start gap-4"},Pe={class:"whitespace-nowrap rounded-md px-3 leading-8 text-white bg-theme-600"},be={class:"flex flex-col gap-2 text-lg"},Ie={class:"grid w-1/3 place-items-center gap-4 p-4 font-semibold"},Te=["src"],ze={key:1,class:"grid h-screen w-screen place-items-center"},ke={role:"status"},Le=U({__name:"Tv",setup(i){const{t:u}=ie(),c=S("https://dev.nomercy.tv/tv"),l=S(""),f=S(!1),h=S(!1),n=S("L"),e=S("canvas"),t=S();ee(async()=>{try{await se(),V();const{isAuthenticated:a}=le();a.value=!0}catch{H.post(`https://auth${W}.nomercy.tv/realms/NoMercyTV/protocol/openid-connect/auth/device`,{client_id:"nomercy-ui",scope:"openid profile email",cancelToken:new H.CancelToken(o=>o("Cancel repeated request"))},{headers:{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"}}).then(o=>{t.value=o.data,h.value=!0}).catch(o=>{console.log(o)})}}),ue(t,a=>{a&&(console.log(a),setTimeout(()=>{r()},a.interval*1e3))});const r=()=>{var a;H.post(`https://auth${W}.nomercy.tv/realms/NoMercyTV/protocol/openid-connect/token`,{grant_type:"urn:ietf:params:oauth:grant-type:device_code",client_id:"nomercy-ui",scope:"openid",device_code:(a=t.value)==null?void 0:a.device_code},{headers:{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"}}).then(async o=>{ce(o.data),V(),await de.push(localStorage.getItem("redirectUrl")||"/home")}).catch(()=>{setTimeout(()=>{r()},t.value.interval*1e3)})};return(a,o)=>(F(),X(b(ve),null,{default:J(()=>[fe(b(he),{fullscreen:!0},{default:J(()=>{var s,d,v,p;return[h.value&&((s=t.value)!=null&&s.user_code)&&!f.value?(F(),G("div",Ee,[_("div",Me,[_("h1",_e,I(b(u)("Follow these steps on your computer or mobile device")),1),_("div",Re,[_("span",ye,I(b(u)("Step"))+" 1",1),_("div",Ne,[_("p",null,I(b(u)("Scan the symbol with your phone or go to"))+":",1),_("p",Ae,I(c.value)+"?code="+I((d=t.value)==null?void 0:d.user_code),1)])]),_("div",Se,[_("span",Pe,I(b(u)("Step"))+" 2",1),_("div",be,[_("p",null,I(b(u)("Sign in to NoMercy"))+".",1),_("p",null,I(b(u)("Your tv will be ready to watch"))+".",1)])])]),_("div",Ie,[(v=t.value)!=null&&v.verification_uri_complete?(F(),X(Ce,{key:0,level:n.value,"render-as":e.value,size:250,value:(p=t.value)==null?void 0:p.verification_uri_complete,class:"bg-white p-1"},null,8,["level","render-as","value"])):Z("",!0),l.value?(F(),G("img",{key:1,src:l.value,alt:"",class:"bg-white p-1"},null,8,Te)):Z("",!0)])])):(F(),G("div",ze,[_("div",ke,[_("span",null,I(b(u)("Loading"))+"...",1)])]))]}),_:1})]),_:1}))}});export{Le as default};
//# sourceMappingURL=Tv-CbDgtFRd.js.map