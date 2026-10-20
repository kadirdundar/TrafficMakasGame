const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./cockpit3d-CuxyRoUw.js","./meshopt_decoder.module-BHUQsZd6.js","./peerA8-Bx9zoBe0.js"])))=>i.map(i=>d[i]);
var Yf=Object.defineProperty;var jf=s=>{throw TypeError(s)};var Zf=(s,e,t)=>e in s?Yf(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var Ao=(s,e,t)=>Zf(s,typeof e!="symbol"?e+"":e,t);var vs=(s,e,t)=>e.has(s)?jf("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t);function Jf(s,e){for(var t=0;t<e.length;t++){const n=e[t];if(typeof n!="string"&&!Array.isArray(n)){for(const i in n)if(i!=="default"&&!(i in s)){const r=Object.getOwnPropertyDescriptor(n,i);r&&Object.defineProperty(s,i,r.get?r:{enumerable:!0,get:()=>n[i]})}}}return Object.freeze(Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Rc="170",Qf=0,rl=1,ed=2,eu=1,td=2,Tn=3,Yn=0,Vt=1,En=2,Xn=0,Zi=1,Sa=2,ol=3,al=4,nd=5,li=100,id=101,sd=102,rd=103,od=104,ad=200,cd=201,ld=202,hd=203,ba=204,Ta=205,ud=206,fd=207,dd=208,pd=209,md=210,gd=211,_d=212,vd=213,yd=214,Ea=0,Ca=1,Aa=2,is=3,Ra=4,wa=5,Pa=6,La=7,tu=0,xd=1,Md=2,$n=0,Sd=1,bd=2,Td=3,nu=4,Ed=5,Cd=6,Ad=7,cl="attached",Rd="detached",iu=300,ss=301,rs=302,to=303,Ia=304,go=306,Ws=1e3,fi=1001,Da=1002,$t=1003,wd=1004,ir=1005,Zt=1006,Ro=1007,di=1008,wn=1009,su=1010,ru=1011,Xs=1012,wc=1013,_i=1014,cn=1015,Zs=1016,Pc=1017,Lc=1018,os=1020,ou=35902,au=1021,cu=1022,Xt=1023,lu=1024,hu=1025,Ji=1026,as=1027,Ic=1028,Dc=1029,uu=1030,Uc=1031,Nc=1033,Vr=33776,Gr=33777,Hr=33778,Wr=33779,Ua=35840,Na=35841,Oa=35842,ka=35843,Fa=36196,Ba=37492,za=37496,Va=37808,Ga=37809,Ha=37810,Wa=37811,Xa=37812,$a=37813,qa=37814,Ka=37815,Ya=37816,ja=37817,Za=37818,Ja=37819,Qa=37820,ec=37821,Xr=36492,tc=36494,nc=36495,fu=36283,ic=36284,sc=36285,rc=36286,no=2300,oc=2301,wo=2302,ll=2400,hl=2401,ul=2402,Pd=2500,Ld=0,Id=1,fl=2,Dd=3200,Ud=3201,du=0,Nd=1,Vn="",Mt="srgb",us="srgb-linear",_o="linear",it="srgb",Ei=7680,dl=519,Od=512,kd=513,Fd=514,pu=515,Bd=516,zd=517,Vd=518,Gd=519,ac=35044,pl="300 es",Cn=2e3,io=2001;class fs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const Ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ml=1234567;const Ns=Math.PI/180,cs=180/Math.PI;function Jt(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ct[s&255]+Ct[s>>8&255]+Ct[s>>16&255]+Ct[s>>24&255]+"-"+Ct[e&255]+Ct[e>>8&255]+"-"+Ct[e>>16&15|64]+Ct[e>>24&255]+"-"+Ct[t&63|128]+Ct[t>>8&255]+"-"+Ct[t>>16&255]+Ct[t>>24&255]+Ct[n&255]+Ct[n>>8&255]+Ct[n>>16&255]+Ct[n>>24&255]).toLowerCase()}function St(s,e,t){return Math.max(e,Math.min(t,s))}function Oc(s,e){return(s%e+e)%e}function Hd(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Wd(s,e,t){return s!==e?(t-s)/(e-s):0}function Os(s,e,t){return(1-t)*s+t*e}function Xd(s,e,t,n){return Os(s,e,1-Math.exp(-t*n))}function $d(s,e=1){return e-Math.abs(Oc(s,e*2)-e)}function qd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Kd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Yd(s,e){return s+Math.floor(Math.random()*(e-s+1))}function jd(s,e){return s+Math.random()*(e-s)}function Zd(s){return s*(.5-Math.random())}function Jd(s){s!==void 0&&(ml=s);let e=ml+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Qd(s){return s*Ns}function ep(s){return s*cs}function tp(s){return(s&s-1)===0&&s!==0}function np(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function ip(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function sp(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),f=o((e-n)/2),d=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*h,c*u,c*f,a*l);break;case"YZY":s.set(c*f,a*h,c*u,a*l);break;case"ZXZ":s.set(c*u,c*f,a*h,a*l);break;case"XZX":s.set(a*h,c*g,c*d,a*l);break;case"YXY":s.set(c*d,a*h,c*g,a*l);break;case"ZYZ":s.set(c*g,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function an(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function nt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const xt={DEG2RAD:Ns,RAD2DEG:cs,generateUUID:Jt,clamp:St,euclideanModulo:Oc,mapLinear:Hd,inverseLerp:Wd,lerp:Os,damp:Xd,pingpong:$d,smoothstep:qd,smootherstep:Kd,randInt:Yd,randFloat:jd,randFloatSpread:Zd,seededRandom:Jd,degToRad:Qd,radToDeg:ep,isPowerOfTwo:tp,ceilPowerOfTwo:np,floorPowerOfTwo:ip,setQuaternionFromProperEuler:sp,normalize:nt,denormalize:an};class pe{constructor(e=0,t=0){pe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(St(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class He{constructor(e,t,n,i,r,o,a,c,l){He.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,l)}set(e,t,n,i,r,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],_=i[0],m=i[3],p=i[6],v=i[1],x=i[4],y=i[7],I=i[2],A=i[5],R=i[8];return r[0]=o*_+a*v+c*I,r[3]=o*m+a*x+c*A,r[6]=o*p+a*y+c*R,r[1]=l*_+h*v+u*I,r[4]=l*m+h*x+u*A,r[7]=l*p+h*y+u*R,r[2]=f*_+d*v+g*I,r[5]=f*m+d*x+g*A,r[8]=f*p+d*y+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+i*r*l-i*o*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,f=a*c-h*r,d=l*r-o*c,g=t*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(i*l-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=f*_,e[4]=(h*t-i*c)*_,e[5]=(i*r-a*t)*_,e[6]=d*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-i*l,i*c,-i*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Po.makeScale(e,t)),this}rotate(e){return this.premultiply(Po.makeRotation(-e)),this}translate(e,t){return this.premultiply(Po.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Po=new He;function mu(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function $s(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function rp(){const s=$s("canvas");return s.style.display="block",s}const gl={};function Is(s){s in gl||(gl[s]=!0,console.warn(s))}function op(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function ap(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function cp(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const je={enabled:!0,workingColorSpace:us,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===it&&(s.r=Rn(s.r),s.g=Rn(s.g),s.b=Rn(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===it&&(s.r=Qi(s.r),s.g=Qi(s.g),s.b=Qi(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Vn?_o:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function Rn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Qi(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const _l=[.64,.33,.3,.6,.15,.06],vl=[.2126,.7152,.0722],yl=[.3127,.329],xl=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ml=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);je.define({[us]:{primaries:_l,whitePoint:yl,transfer:_o,toXYZ:xl,fromXYZ:Ml,luminanceCoefficients:vl,workingColorSpaceConfig:{unpackColorSpace:Mt},outputColorSpaceConfig:{drawingBufferColorSpace:Mt}},[Mt]:{primaries:_l,whitePoint:yl,transfer:it,toXYZ:xl,fromXYZ:Ml,luminanceCoefficients:vl,outputColorSpaceConfig:{drawingBufferColorSpace:Mt}}});let Ci;class lp{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ci===void 0&&(Ci=$s("canvas")),Ci.width=e.width,Ci.height=e.height;const n=Ci.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Ci}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$s("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Rn(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Rn(t[n]/255)*255):t[n]=Rn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let hp=0;class gu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:hp++}),this.uuid=Jt(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Lo(i[o].image)):r.push(Lo(i[o]))}else r=Lo(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Lo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?lp.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let up=0;class Tt extends fs{constructor(e=Tt.DEFAULT_IMAGE,t=Tt.DEFAULT_MAPPING,n=fi,i=fi,r=Zt,o=di,a=Xt,c=wn,l=Tt.DEFAULT_ANISOTROPY,h=Vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=Jt(),this.name="",this.source=new gu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new pe(0,0),this.repeat=new pe(1,1),this.center=new pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==iu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ws:e.x=e.x-Math.floor(e.x);break;case fi:e.x=e.x<0?0:1;break;case Da:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ws:e.y=e.y-Math.floor(e.y);break;case fi:e.y=e.y<0?0:1;break;case Da:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Tt.DEFAULT_IMAGE=null;Tt.DEFAULT_MAPPING=iu;Tt.DEFAULT_ANISOTROPY=1;class Je{constructor(e=0,t=0,n=0,i=1){Je.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(l+1)/2,y=(d+1)/2,I=(p+1)/2,A=(h+f)/4,R=(u+_)/4,w=(g+m)/4;return x>y&&x>I?x<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(x),i=A/n,r=R/n):y>I?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=A/i,r=w/i):I<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(I),n=R/r,i=w/r),this.set(n,i,r,t),this}let v=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-_)/v,this.z=(f-h)/v,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class fp extends fs{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Je(0,0,e,t),this.scissorTest=!1,this.viewport=new Je(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Zt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Tt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new gu(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class jn extends fp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class _u extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=$t,this.minFilter=$t,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class dp extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=$t,this.minFilter=$t,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class xi{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const f=r[o+0],d=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==f||l!==d||h!==g){let m=1-a;const p=c*f+l*d+h*g+u*_,v=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const I=Math.sqrt(x),A=Math.atan2(I,p*v);m=Math.sin(m*A)/I,a=Math.sin(a*A)/I}const y=a*v;if(c=c*m+f*y,l=l*m+d*y,h=h*m+g*y,u=u*m+_*y,m===1-a){const I=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=I,l*=I,h*=I,u*=I}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+h*u+c*d-l*f,e[t+1]=c*g+h*f+l*u-a*d,e[t+2]=l*g+h*d+a*f-c*u,e[t+3]=h*g-a*u-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(r/2),f=c(n/2),d=c(i/2),g=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-i)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(r+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-l)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-i)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(St(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+i*l-r*c,this._y=i*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*i+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,f=Math.sin(t*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,n=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Sl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Sl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=i+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Io.copy(this).projectOnVector(e),this.sub(Io)}reflect(e){return this.sub(Io.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(St(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Io=new L,Sl=new xi;class Jn{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,tn):tn.fromBufferAttribute(r,o),tn.applyMatrix4(e.matrixWorld),this.expandByPoint(tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),sr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),sr.copy(n.boundingBox)),sr.applyMatrix4(e.matrixWorld),this.union(sr)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tn),tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ys),rr.subVectors(this.max,ys),Ai.subVectors(e.a,ys),Ri.subVectors(e.b,ys),wi.subVectors(e.c,ys),Dn.subVectors(Ri,Ai),Un.subVectors(wi,Ri),ti.subVectors(Ai,wi);let t=[0,-Dn.z,Dn.y,0,-Un.z,Un.y,0,-ti.z,ti.y,Dn.z,0,-Dn.x,Un.z,0,-Un.x,ti.z,0,-ti.x,-Dn.y,Dn.x,0,-Un.y,Un.x,0,-ti.y,ti.x,0];return!Do(t,Ai,Ri,wi,rr)||(t=[1,0,0,0,1,0,0,0,1],!Do(t,Ai,Ri,wi,rr))?!1:(or.crossVectors(Dn,Un),t=[or.x,or.y,or.z],Do(t,Ai,Ri,wi,rr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(vn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const vn=[new L,new L,new L,new L,new L,new L,new L,new L],tn=new L,sr=new Jn,Ai=new L,Ri=new L,wi=new L,Dn=new L,Un=new L,ti=new L,ys=new L,rr=new L,or=new L,ni=new L;function Do(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){ni.fromArray(s,r);const a=i.x*Math.abs(ni.x)+i.y*Math.abs(ni.y)+i.z*Math.abs(ni.z),c=e.dot(ni),l=t.dot(ni),h=n.dot(ni);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const pp=new Jn,xs=new L,Uo=new L;class Pn{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):pp.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xs.subVectors(e,this.center);const t=xs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(xs,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Uo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xs.copy(e.center).add(Uo)),this.expandByPoint(xs.copy(e.center).sub(Uo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const yn=new L,No=new L,ar=new L,Nn=new L,Oo=new L,cr=new L,ko=new L;class vo{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(yn.copy(this.origin).addScaledVector(this.direction,t),yn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){No.copy(e).add(t).multiplyScalar(.5),ar.copy(t).sub(e).normalize(),Nn.copy(this.origin).sub(No);const r=e.distanceTo(t)*.5,o=-this.direction.dot(ar),a=Nn.dot(this.direction),c=-Nn.dot(ar),l=Nn.lengthSq(),h=Math.abs(1-o*o);let u,f,d,g;if(h>0)if(u=o*c-a,f=o*a-c,g=r*h,u>=0)if(f>=-g)if(f<=g){const _=1/h;u*=_,f*=_,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(No).addScaledVector(ar,f),d}intersectSphere(e,t){yn.subVectors(e.center,this.origin);const n=yn.dot(this.direction),i=yn.dot(yn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,i=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,i=(e.min.x-f.x)*l),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,yn)!==null}intersectTriangle(e,t,n,i,r){Oo.subVectors(t,e),cr.subVectors(n,e),ko.crossVectors(Oo,cr);let o=this.direction.dot(ko),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Nn.subVectors(this.origin,e);const c=a*this.direction.dot(cr.crossVectors(Nn,cr));if(c<0)return null;const l=a*this.direction.dot(Oo.cross(Nn));if(l<0||c+l>o)return null;const h=-a*Nn.dot(ko);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class qe{constructor(e,t,n,i,r,o,a,c,l,h,u,f,d,g,_,m){qe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,l,h,u,f,d,g,_,m)}set(e,t,n,i,r,o,a,c,l,h,u,f,d,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new qe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Pi.setFromMatrixColumn(e,0).length(),r=1/Pi.setFromMatrixColumn(e,1).length(),o=1/Pi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=o*h,d=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=d+g*l,t[5]=f-_*l,t[9]=-a*c,t[2]=_-f*l,t[6]=g+d*l,t[10]=o*c}else if(e.order==="YXZ"){const f=c*h,d=c*u,g=l*h,_=l*u;t[0]=f+_*a,t[4]=g*a-d,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-g,t[6]=_+f*a,t[10]=o*c}else if(e.order==="ZXY"){const f=c*h,d=c*u,g=l*h,_=l*u;t[0]=f-_*a,t[4]=-o*u,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*h,t[9]=_-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const f=o*h,d=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=g*l-d,t[8]=f*l+_,t[1]=c*u,t[5]=_*l+f,t[9]=d*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const f=o*c,d=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=_-f*u,t[8]=g*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=d*u+g,t[10]=f-_*u}else if(e.order==="XZY"){const f=o*c,d=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=f*u+_,t[5]=o*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=a*h,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(mp,e,gp)}lookAt(e,t,n){const i=this.elements;return Ht.subVectors(e,t),Ht.lengthSq()===0&&(Ht.z=1),Ht.normalize(),On.crossVectors(n,Ht),On.lengthSq()===0&&(Math.abs(n.z)===1?Ht.x+=1e-4:Ht.z+=1e-4,Ht.normalize(),On.crossVectors(n,Ht)),On.normalize(),lr.crossVectors(Ht,On),i[0]=On.x,i[4]=lr.x,i[8]=Ht.x,i[1]=On.y,i[5]=lr.y,i[9]=Ht.y,i[2]=On.z,i[6]=lr.z,i[10]=Ht.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],_=n[6],m=n[10],p=n[14],v=n[3],x=n[7],y=n[11],I=n[15],A=i[0],R=i[4],w=i[8],M=i[12],b=i[1],P=i[5],k=i[9],U=i[13],B=i[2],q=i[6],G=i[10],J=i[14],V=i[3],he=i[7],le=i[11],xe=i[15];return r[0]=o*A+a*b+c*B+l*V,r[4]=o*R+a*P+c*q+l*he,r[8]=o*w+a*k+c*G+l*le,r[12]=o*M+a*U+c*J+l*xe,r[1]=h*A+u*b+f*B+d*V,r[5]=h*R+u*P+f*q+d*he,r[9]=h*w+u*k+f*G+d*le,r[13]=h*M+u*U+f*J+d*xe,r[2]=g*A+_*b+m*B+p*V,r[6]=g*R+_*P+m*q+p*he,r[10]=g*w+_*k+m*G+p*le,r[14]=g*M+_*U+m*J+p*xe,r[3]=v*A+x*b+y*B+I*V,r[7]=v*R+x*P+y*q+I*he,r[11]=v*w+x*k+y*G+I*le,r[15]=v*M+x*U+y*J+I*xe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+r*c*u-i*l*u-r*a*f+n*l*f+i*a*d-n*c*d)+_*(+t*c*d-t*l*f+r*o*f-i*o*d+i*l*h-r*c*h)+m*(+t*l*u-t*a*d-r*o*u+n*o*d+r*a*h-n*l*h)+p*(-i*a*h-t*c*u+t*a*f+i*o*u-n*o*f+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],_=e[13],m=e[14],p=e[15],v=u*m*l-_*f*l+_*c*d-a*m*d-u*c*p+a*f*p,x=g*f*l-h*m*l-g*c*d+o*m*d+h*c*p-o*f*p,y=h*_*l-g*u*l+g*a*d-o*_*d-h*a*p+o*u*p,I=g*u*c-h*_*c-g*a*f+o*_*f+h*a*m-o*u*m,A=t*v+n*x+i*y+r*I;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return e[0]=v*R,e[1]=(_*f*r-u*m*r-_*i*d+n*m*d+u*i*p-n*f*p)*R,e[2]=(a*m*r-_*c*r+_*i*l-n*m*l-a*i*p+n*c*p)*R,e[3]=(u*c*r-a*f*r-u*i*l+n*f*l+a*i*d-n*c*d)*R,e[4]=x*R,e[5]=(h*m*r-g*f*r+g*i*d-t*m*d-h*i*p+t*f*p)*R,e[6]=(g*c*r-o*m*r-g*i*l+t*m*l+o*i*p-t*c*p)*R,e[7]=(o*f*r-h*c*r+h*i*l-t*f*l-o*i*d+t*c*d)*R,e[8]=y*R,e[9]=(g*u*r-h*_*r-g*n*d+t*_*d+h*n*p-t*u*p)*R,e[10]=(o*_*r-g*a*r+g*n*l-t*_*l-o*n*p+t*a*p)*R,e[11]=(h*a*r-o*u*r-h*n*l+t*u*l+o*n*d-t*a*d)*R,e[12]=I*R,e[13]=(h*_*i-g*u*i+g*n*f-t*_*f-h*n*m+t*u*m)*R,e[14]=(g*a*i-o*_*i-g*n*c+t*_*c+o*n*m-t*a*m)*R,e[15]=(o*u*i-h*a*i+h*n*c-t*u*c-o*n*f+t*a*f)*R,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,f=r*l,d=r*h,g=r*u,_=o*h,m=o*u,p=a*u,v=c*l,x=c*h,y=c*u,I=n.x,A=n.y,R=n.z;return i[0]=(1-(_+p))*I,i[1]=(d+y)*I,i[2]=(g-x)*I,i[3]=0,i[4]=(d-y)*A,i[5]=(1-(f+p))*A,i[6]=(m+v)*A,i[7]=0,i[8]=(g+x)*R,i[9]=(m-v)*R,i[10]=(1-(f+_))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Pi.set(i[0],i[1],i[2]).length();const o=Pi.set(i[4],i[5],i[6]).length(),a=Pi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],nn.copy(this);const l=1/r,h=1/o,u=1/a;return nn.elements[0]*=l,nn.elements[1]*=l,nn.elements[2]*=l,nn.elements[4]*=h,nn.elements[5]*=h,nn.elements[6]*=h,nn.elements[8]*=u,nn.elements[9]*=u,nn.elements[10]*=u,t.setFromRotationMatrix(nn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=Cn){const c=this.elements,l=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),f=(n+i)/(n-i);let d,g;if(a===Cn)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===io)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=Cn){const c=this.elements,l=1/(t-e),h=1/(n-i),u=1/(o-r),f=(t+e)*l,d=(n+i)*h;let g,_;if(a===Cn)g=(o+r)*u,_=-2*u;else if(a===io)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Pi=new L,nn=new qe,mp=new L(0,0,0),gp=new L(1,1,1),On=new L,lr=new L,Ht=new L,bl=new qe,Tl=new xi;class hn{constructor(e=0,t=0,n=0,i=hn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(St(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-St(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(St(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-St(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(St(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-St(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return bl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Tl.setFromEuler(this),this.setFromQuaternion(Tl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hn.DEFAULT_ORDER="XYZ";class vu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _p=0;const El=new L,Li=new xi,xn=new qe,hr=new L,Ms=new L,vp=new L,yp=new xi,Cl=new L(1,0,0),Al=new L(0,1,0),Rl=new L(0,0,1),wl={type:"added"},xp={type:"removed"},Ii={type:"childadded",child:null},Fo={type:"childremoved",child:null};class ht extends fs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_p++}),this.uuid=Jt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ht.DEFAULT_UP.clone();const e=new L,t=new hn,n=new xi,i=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new qe},normalMatrix:{value:new He}}),this.matrix=new qe,this.matrixWorld=new qe,this.matrixAutoUpdate=ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.multiply(Li),this}rotateOnWorldAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.premultiply(Li),this}rotateX(e){return this.rotateOnAxis(Cl,e)}rotateY(e){return this.rotateOnAxis(Al,e)}rotateZ(e){return this.rotateOnAxis(Rl,e)}translateOnAxis(e,t){return El.copy(e).applyQuaternion(this.quaternion),this.position.add(El.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Cl,e)}translateY(e){return this.translateOnAxis(Al,e)}translateZ(e){return this.translateOnAxis(Rl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?hr.copy(e):hr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(Ms,hr,this.up):xn.lookAt(hr,Ms,this.up),this.quaternion.setFromRotationMatrix(xn),i&&(xn.extractRotation(i.matrixWorld),Li.setFromRotationMatrix(xn),this.quaternion.premultiply(Li.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(wl),Ii.child=e,this.dispatchEvent(Ii),Ii.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(xp),Fo.child=e,this.dispatchEvent(Fo),Fo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(wl),Ii.child=e,this.dispatchEvent(Ii),Ii.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,e,vp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,yp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];i.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ht.DEFAULT_UP=new L(0,1,0);ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new L,Mn=new L,Bo=new L,Sn=new L,Di=new L,Ui=new L,Pl=new L,zo=new L,Vo=new L,Go=new L,Ho=new Je,Wo=new Je,Xo=new Je;class jt{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),sn.subVectors(e,t),i.cross(sn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){sn.subVectors(i,t),Mn.subVectors(n,t),Bo.subVectors(e,t);const o=sn.dot(sn),a=sn.dot(Mn),c=sn.dot(Bo),l=Mn.dot(Mn),h=Mn.dot(Bo),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,g=(o*h-a*c)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Sn)===null?!1:Sn.x>=0&&Sn.y>=0&&Sn.x+Sn.y<=1}static getInterpolation(e,t,n,i,r,o,a,c){return this.getBarycoord(e,t,n,i,Sn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Sn.x),c.addScaledVector(o,Sn.y),c.addScaledVector(a,Sn.z),c)}static getInterpolatedAttribute(e,t,n,i,r,o){return Ho.setScalar(0),Wo.setScalar(0),Xo.setScalar(0),Ho.fromBufferAttribute(e,t),Wo.fromBufferAttribute(e,n),Xo.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(Ho,r.x),o.addScaledVector(Wo,r.y),o.addScaledVector(Xo,r.z),o}static isFrontFacing(e,t,n,i){return sn.subVectors(n,t),Mn.subVectors(e,t),sn.cross(Mn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return sn.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),sn.cross(Mn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return jt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return jt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return jt.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return jt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return jt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;Di.subVectors(i,n),Ui.subVectors(r,n),zo.subVectors(e,n);const c=Di.dot(zo),l=Ui.dot(zo);if(c<=0&&l<=0)return t.copy(n);Vo.subVectors(e,i);const h=Di.dot(Vo),u=Ui.dot(Vo);if(h>=0&&u<=h)return t.copy(i);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Di,o);Go.subVectors(e,r);const d=Di.dot(Go),g=Ui.dot(Go);if(g>=0&&d<=g)return t.copy(r);const _=d*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(Ui,a);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Pl.subVectors(r,i),a=(u-h)/(u-h+(d-g)),t.copy(i).addScaledVector(Pl,a);const p=1/(m+_+f);return o=_*p,a=f*p,t.copy(n).addScaledVector(Di,o).addScaledVector(Ui,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const yu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},kn={h:0,s:0,l:0},ur={h:0,s:0,l:0};function $o(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class $e{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=je.workingColorSpace){if(e=Oc(e,1),t=St(t,0,1),n=St(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=$o(o,r,e+1/3),this.g=$o(o,r,e),this.b=$o(o,r,e-1/3)}return je.toWorkingColorSpace(this,i),this}setStyle(e,t=Mt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mt){const n=yu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Rn(e.r),this.g=Rn(e.g),this.b=Rn(e.b),this}copyLinearToSRGB(e){return this.r=Qi(e.r),this.g=Qi(e.g),this.b=Qi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mt){return je.fromWorkingColorSpace(At.copy(this),e),Math.round(St(At.r*255,0,255))*65536+Math.round(St(At.g*255,0,255))*256+Math.round(St(At.b*255,0,255))}getHexString(e=Mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(At.copy(this),t);const n=At.r,i=At.g,r=At.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(At.copy(this),t),e.r=At.r,e.g=At.g,e.b=At.b,e}getStyle(e=Mt){je.fromWorkingColorSpace(At.copy(this),e);const t=At.r,n=At.g,i=At.b;return e!==Mt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(kn),this.setHSL(kn.h+e,kn.s+t,kn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(kn),e.getHSL(ur);const n=Os(kn.h,ur.h,t),i=Os(kn.s,ur.s,t),r=Os(kn.l,ur.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const At=new $e;$e.NAMES=yu;let Mp=0;class Qn extends fs{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mp++}),this.uuid=Jt(),this.name="",this.blending=Zi,this.side=Yn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ba,this.blendDst=Ta,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ei,this.stencilZFail=Ei,this.stencilZPass=Ei,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Zi&&(n.blending=this.blending),this.side!==Yn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ba&&(n.blendSrc=this.blendSrc),this.blendDst!==Ta&&(n.blendDst=this.blendDst),this.blendEquation!==li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==is&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==dl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ei&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ei&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ei&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class An extends Qn{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=tu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const pt=new L,fr=new pe;class kt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ac,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)fr.fromBufferAttribute(this,t),fr.applyMatrix3(e),this.setXY(t,fr.x,fr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix3(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=an(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=an(t,this.array)),t}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=an(t,this.array)),t}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=an(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=an(t,this.array)),t}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array),r=nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ac&&(e.usage=this.usage),e}}class xu extends kt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Mu extends kt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class gt extends kt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Sp=0;const Kt=new qe,qo=new ht,Ni=new L,Wt=new Jn,Ss=new Jn,yt=new L;class It extends fs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Sp++}),this.uuid=Jt(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(mu(e)?Mu:xu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new He().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Kt.makeRotationFromQuaternion(e),this.applyMatrix4(Kt),this}rotateX(e){return Kt.makeRotationX(e),this.applyMatrix4(Kt),this}rotateY(e){return Kt.makeRotationY(e),this.applyMatrix4(Kt),this}rotateZ(e){return Kt.makeRotationZ(e),this.applyMatrix4(Kt),this}translate(e,t,n){return Kt.makeTranslation(e,t,n),this.applyMatrix4(Kt),this}scale(e,t,n){return Kt.makeScale(e,t,n),this.applyMatrix4(Kt),this}lookAt(e){return qo.lookAt(e),qo.updateMatrix(),this.applyMatrix4(qo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ni).negate(),this.translate(Ni.x,Ni.y,Ni.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new gt(n,3))}else{for(let n=0,i=t.count;n<i;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Jn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Wt.setFromBufferAttribute(r),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Wt.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Wt.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Wt.min),this.boundingBox.expandByPoint(Wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Pn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const n=this.boundingSphere.center;if(Wt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Ss.setFromBufferAttribute(a),this.morphTargetsRelative?(yt.addVectors(Wt.min,Ss.min),Wt.expandByPoint(yt),yt.addVectors(Wt.max,Ss.max),Wt.expandByPoint(yt)):(Wt.expandByPoint(Ss.min),Wt.expandByPoint(Ss.max))}Wt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)yt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(yt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)yt.fromBufferAttribute(a,l),c&&(Ni.fromBufferAttribute(e,l),yt.add(Ni)),i=Math.max(i,n.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let w=0;w<n.count;w++)a[w]=new L,c[w]=new L;const l=new L,h=new L,u=new L,f=new pe,d=new pe,g=new pe,_=new L,m=new L;function p(w,M,b){l.fromBufferAttribute(n,w),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,b),f.fromBufferAttribute(r,w),d.fromBufferAttribute(r,M),g.fromBufferAttribute(r,b),h.sub(l),u.sub(l),d.sub(f),g.sub(f);const P=1/(d.x*g.y-g.x*d.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(P),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(P),a[w].add(_),a[M].add(_),a[b].add(_),c[w].add(m),c[M].add(m),c[b].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let w=0,M=v.length;w<M;++w){const b=v[w],P=b.start,k=b.count;for(let U=P,B=P+k;U<B;U+=3)p(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const x=new L,y=new L,I=new L,A=new L;function R(w){I.fromBufferAttribute(i,w),A.copy(I);const M=a[w];x.copy(M),x.sub(I.multiplyScalar(I.dot(M))).normalize(),y.crossVectors(A,M);const P=y.dot(c[w])<0?-1:1;o.setXYZW(w,x.x,x.y,x.z,P)}for(let w=0,M=v.length;w<M;++w){const b=v[w],P=b.start,k=b.count;for(let U=P,B=P+k;U<B;U+=3)R(e.getX(U+0)),R(e.getX(U+1)),R(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new L,r=new L,o=new L,a=new L,c=new L,l=new L,h=new L,u=new L;if(e)for(let f=0,d=e.count;f<d;f+=3){const g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?d=c[_]*a.data.stride+a.offset:d=c[_]*h;for(let p=0;p<h;p++)f[g++]=l[d++]}return new kt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new It,n=this.index.array,i=this.attributes;for(const a in i){const c=i[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=e(f,n);c.push(d)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(e.data))}h.length>0&&(i[c]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ll=new qe,ii=new vo,dr=new Pn,Il=new L,pr=new L,mr=new L,gr=new L,Ko=new L,_r=new L,Dl=new L,vr=new L;class rt extends ht{constructor(e=new It,t=new An){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){_r.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(Ko.fromBufferAttribute(u,e),o?_r.addScaledVector(Ko,h):_r.addScaledVector(Ko.sub(t),h))}t.add(_r)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),dr.copy(n.boundingSphere),dr.applyMatrix4(r),ii.copy(e.ray).recast(e.near),!(dr.containsPoint(ii.origin)===!1&&(ii.intersectSphere(dr,Il)===null||ii.origin.distanceToSquared(Il)>(e.far-e.near)**2))&&(Ll.copy(r).invert(),ii.copy(e.ray).applyMatrix4(Ll),!(n.boundingBox!==null&&ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ii)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=o[m.materialIndex],v=Math.max(m.start,d.start),x=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let y=v,I=x;y<I;y+=3){const A=a.getX(y),R=a.getX(y+1),w=a.getX(y+2);i=yr(this,p,e,n,l,h,u,A,R,w),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const v=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);i=yr(this,o,e,n,l,h,u,v,x,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=o[m.materialIndex],v=Math.max(m.start,d.start),x=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let y=v,I=x;y<I;y+=3){const A=y,R=y+1,w=y+2;i=yr(this,p,e,n,l,h,u,A,R,w),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const v=m,x=m+1,y=m+2;i=yr(this,o,e,n,l,h,u,v,x,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function bp(s,e,t,n,i,r,o,a){let c;if(e.side===Vt?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,e.side===Yn,a),c===null)return null;vr.copy(a),vr.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(vr);return l<t.near||l>t.far?null:{distance:l,point:vr.clone(),object:s}}function yr(s,e,t,n,i,r,o,a,c,l){s.getVertexPosition(a,pr),s.getVertexPosition(c,mr),s.getVertexPosition(l,gr);const h=bp(s,e,t,n,pr,mr,gr,Dl);if(h){const u=new L;jt.getBarycoord(Dl,pr,mr,gr,u),i&&(h.uv=jt.getInterpolatedAttribute(i,a,c,l,u,new pe)),r&&(h.uv1=jt.getInterpolatedAttribute(r,a,c,l,u,new pe)),o&&(h.normal=jt.getInterpolatedAttribute(o,a,c,l,u,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new L,materialIndex:0};jt.getNormal(pr,mr,gr,f.normal),h.face=f,h.barycoord=u}return h}class wt extends It{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new gt(l,3)),this.setAttribute("normal",new gt(h,3)),this.setAttribute("uv",new gt(u,2));function g(_,m,p,v,x,y,I,A,R,w,M){const b=y/R,P=I/w,k=y/2,U=I/2,B=A/2,q=R+1,G=w+1;let J=0,V=0;const he=new L;for(let le=0;le<G;le++){const xe=le*P-U;for(let Oe=0;Oe<q;Oe++){const re=Oe*b-k;he[_]=re*v,he[m]=xe*x,he[p]=B,l.push(he.x,he.y,he.z),he[_]=0,he[m]=0,he[p]=A>0?1:-1,h.push(he.x,he.y,he.z),u.push(Oe/R),u.push(1-le/w),J+=1}}for(let le=0;le<w;le++)for(let xe=0;xe<R;xe++){const Oe=f+xe+q*le,re=f+xe+q*(le+1),N=f+(xe+1)+q*(le+1),X=f+(xe+1)+q*le;c.push(Oe,re,X),c.push(re,N,X),V+=6}a.addGroup(d,V,M),d+=V,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ls(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Ut(s){const e={};for(let t=0;t<s.length;t++){const n=ls(s[t]);for(const i in n)e[i]=n[i]}return e}function Tp(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Su(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const Ep={clone:ls,merge:Ut};var Cp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ap=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Zn extends Qn{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cp,this.fragmentShader=Ap,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ls(e.uniforms),this.uniformsGroups=Tp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class bu extends ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new qe,this.projectionMatrix=new qe,this.projectionMatrixInverse=new qe,this.coordinateSystem=Cn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Fn=new L,Ul=new pe,Nl=new pe;class Ot extends bu{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=cs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ns*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cs*2*Math.atan(Math.tan(Ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Fn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z),Fn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z)}getViewSize(e,t){return this.getViewBounds(e,Ul,Nl),t.subVectors(Nl,Ul)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ns*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,t-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Oi=-90,ki=1;class Rp extends ht{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ot(Oi,ki,e,t);i.layers=this.layers,this.add(i);const r=new Ot(Oi,ki,e,t);r.layers=this.layers,this.add(r);const o=new Ot(Oi,ki,e,t);o.layers=this.layers,this.add(o);const a=new Ot(Oi,ki,e,t);a.layers=this.layers,this.add(a);const c=new Ot(Oi,ki,e,t);c.layers=this.layers,this.add(c);const l=new Ot(Oi,ki,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===Cn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===io)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Tu extends Tt{constructor(e,t,n,i,r,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:ss,super(e,t,n,i,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class wp extends jn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Tu(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Zt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new wt(5,5,5),r=new Zn({name:"CubemapFromEquirect",uniforms:ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Vt,blending:Xn});r.uniforms.tEquirect.value=t;const o=new rt(i,r),a=t.minFilter;return t.minFilter===di&&(t.minFilter=Zt),new Rp(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const Yo=new L,Pp=new L,Lp=new He;class ai{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Yo.subVectors(n,t).cross(Pp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Yo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Lp.getNormalMatrix(e),i=this.coplanarPoint(Yo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const si=new Pn,xr=new L;class kc{constructor(e=new ai,t=new ai,n=new ai,i=new ai,r=new ai,o=new ai){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Cn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],c=i[3],l=i[4],h=i[5],u=i[6],f=i[7],d=i[8],g=i[9],_=i[10],m=i[11],p=i[12],v=i[13],x=i[14],y=i[15];if(n[0].setComponents(c-r,f-l,m-d,y-p).normalize(),n[1].setComponents(c+r,f+l,m+d,y+p).normalize(),n[2].setComponents(c+o,f+h,m+g,y+v).normalize(),n[3].setComponents(c-o,f-h,m-g,y-v).normalize(),n[4].setComponents(c-a,f-u,m-_,y-x).normalize(),t===Cn)n[5].setComponents(c+a,f+u,m+_,y+x).normalize();else if(t===io)n[5].setComponents(a,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(si)}intersectsSprite(e){return si.center.set(0,0,0),si.radius=.7071067811865476,si.applyMatrix4(e.matrixWorld),this.intersectsSphere(si)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(xr.x=i.normal.x>0?e.max.x:e.min.x,xr.y=i.normal.y>0?e.max.y:e.min.y,xr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(xr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Eu(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Ip(s){const e=new WeakMap;function t(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=s.createBuffer();s.bindBuffer(c,f),s.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=s.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=s.SHORT;else if(l instanceof Uint32Array)d=s.UNSIGNED_INT;else if(l instanceof Int32Array)d=s.INT;else if(l instanceof Int8Array)d=s.BYTE;else if(l instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(s.bindBuffer(l,a),u.length===0)s.bufferSubData(l,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],_=u[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const _=u[d];s.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(s.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:r,update:o}}class vi extends It{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=e/a,f=t/c,d=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const v=p*f-o;for(let x=0;x<l;x++){const y=x*u-r;g.push(y,-v,0),_.push(0,0,1),m.push(x/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<a;v++){const x=v+l*p,y=v+l*(p+1),I=v+1+l*(p+1),A=v+1+l*p;d.push(x,y,A),d.push(y,I,A)}this.setIndex(d),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(_,3)),this.setAttribute("uv",new gt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vi(e.width,e.height,e.widthSegments,e.heightSegments)}}var Dp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Up=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Np=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Op=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Fp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,zp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Gp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Hp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,$p=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,qp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Kp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Yp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Jp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Qp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,em=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,tm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,nm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,im=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,sm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,rm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,om=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,am=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lm="gl_FragColor = linearToOutputTexel( gl_FragColor );",hm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,um=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,fm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,dm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,pm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,gm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,_m=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ym=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Mm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Sm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,bm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Em=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Cm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Am=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Rm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,wm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Pm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Lm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Im=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Dm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Um=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Nm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Om=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,km=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Bm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Gm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Wm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$m=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Km=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ym=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Zm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Jm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,e0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,t0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,n0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,i0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,s0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,r0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,o0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,a0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,c0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,l0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,h0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,u0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,f0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,d0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,p0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,m0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,g0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,_0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,v0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,y0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,x0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,M0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,S0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,b0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,T0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,E0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,C0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,A0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,R0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,w0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,P0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,L0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const I0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,D0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,N0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,O0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,k0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,F0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,B0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,z0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,V0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,G0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,H0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,X0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,q0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,K0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Y0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,j0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Z0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,J0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Q0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,eg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ng=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ig=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,og=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,hg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ug=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:Dp,alphahash_pars_fragment:Up,alphamap_fragment:Np,alphamap_pars_fragment:Op,alphatest_fragment:kp,alphatest_pars_fragment:Fp,aomap_fragment:Bp,aomap_pars_fragment:zp,batching_pars_vertex:Vp,batching_vertex:Gp,begin_vertex:Hp,beginnormal_vertex:Wp,bsdfs:Xp,iridescence_fragment:$p,bumpmap_pars_fragment:qp,clipping_planes_fragment:Kp,clipping_planes_pars_fragment:Yp,clipping_planes_pars_vertex:jp,clipping_planes_vertex:Zp,color_fragment:Jp,color_pars_fragment:Qp,color_pars_vertex:em,color_vertex:tm,common:nm,cube_uv_reflection_fragment:im,defaultnormal_vertex:sm,displacementmap_pars_vertex:rm,displacementmap_vertex:om,emissivemap_fragment:am,emissivemap_pars_fragment:cm,colorspace_fragment:lm,colorspace_pars_fragment:hm,envmap_fragment:um,envmap_common_pars_fragment:fm,envmap_pars_fragment:dm,envmap_pars_vertex:pm,envmap_physical_pars_fragment:Em,envmap_vertex:mm,fog_vertex:gm,fog_pars_vertex:_m,fog_fragment:vm,fog_pars_fragment:ym,gradientmap_pars_fragment:xm,lightmap_pars_fragment:Mm,lights_lambert_fragment:Sm,lights_lambert_pars_fragment:bm,lights_pars_begin:Tm,lights_toon_fragment:Cm,lights_toon_pars_fragment:Am,lights_phong_fragment:Rm,lights_phong_pars_fragment:wm,lights_physical_fragment:Pm,lights_physical_pars_fragment:Lm,lights_fragment_begin:Im,lights_fragment_maps:Dm,lights_fragment_end:Um,logdepthbuf_fragment:Nm,logdepthbuf_pars_fragment:Om,logdepthbuf_pars_vertex:km,logdepthbuf_vertex:Fm,map_fragment:Bm,map_pars_fragment:zm,map_particle_fragment:Vm,map_particle_pars_fragment:Gm,metalnessmap_fragment:Hm,metalnessmap_pars_fragment:Wm,morphinstance_vertex:Xm,morphcolor_vertex:$m,morphnormal_vertex:qm,morphtarget_pars_vertex:Km,morphtarget_vertex:Ym,normal_fragment_begin:jm,normal_fragment_maps:Zm,normal_pars_fragment:Jm,normal_pars_vertex:Qm,normal_vertex:e0,normalmap_pars_fragment:t0,clearcoat_normal_fragment_begin:n0,clearcoat_normal_fragment_maps:i0,clearcoat_pars_fragment:s0,iridescence_pars_fragment:r0,opaque_fragment:o0,packing:a0,premultiplied_alpha_fragment:c0,project_vertex:l0,dithering_fragment:h0,dithering_pars_fragment:u0,roughnessmap_fragment:f0,roughnessmap_pars_fragment:d0,shadowmap_pars_fragment:p0,shadowmap_pars_vertex:m0,shadowmap_vertex:g0,shadowmask_pars_fragment:_0,skinbase_vertex:v0,skinning_pars_vertex:y0,skinning_vertex:x0,skinnormal_vertex:M0,specularmap_fragment:S0,specularmap_pars_fragment:b0,tonemapping_fragment:T0,tonemapping_pars_fragment:E0,transmission_fragment:C0,transmission_pars_fragment:A0,uv_pars_fragment:R0,uv_pars_vertex:w0,uv_vertex:P0,worldpos_vertex:L0,background_vert:I0,background_frag:D0,backgroundCube_vert:U0,backgroundCube_frag:N0,cube_vert:O0,cube_frag:k0,depth_vert:F0,depth_frag:B0,distanceRGBA_vert:z0,distanceRGBA_frag:V0,equirect_vert:G0,equirect_frag:H0,linedashed_vert:W0,linedashed_frag:X0,meshbasic_vert:$0,meshbasic_frag:q0,meshlambert_vert:K0,meshlambert_frag:Y0,meshmatcap_vert:j0,meshmatcap_frag:Z0,meshnormal_vert:J0,meshnormal_frag:Q0,meshphong_vert:eg,meshphong_frag:tg,meshphysical_vert:ng,meshphysical_frag:ig,meshtoon_vert:sg,meshtoon_frag:rg,points_vert:og,points_frag:ag,shadow_vert:cg,shadow_frag:lg,sprite_vert:hg,sprite_frag:ug},ge={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},dn={basic:{uniforms:Ut([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Ut([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new $e(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Ut([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Ut([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Ut([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new $e(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Ut([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Ut([ge.points,ge.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Ut([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Ut([ge.common,ge.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Ut([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Ut([ge.sprite,ge.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Ut([ge.common,ge.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Ut([ge.lights,ge.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};dn.physical={uniforms:Ut([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const Mr={r:0,b:0,g:0},ri=new hn,fg=new qe;function dg(s,e,t,n,i,r,o){const a=new $e(0);let c=r===!0?0:1,l,h,u=null,f=0,d=null;function g(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?t:e).get(x)),x}function _(v){let x=!1;const y=g(v);y===null?p(a,c):y&&y.isColor&&(p(y,1),x=!0);const I=s.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(v,x){const y=g(x);y&&(y.isCubeTexture||y.mapping===go)?(h===void 0&&(h=new rt(new wt(1,1,1),new Zn({name:"BackgroundCubeMaterial",uniforms:ls(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),ri.copy(x.backgroundRotation),ri.x*=-1,ri.y*=-1,ri.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ri.y*=-1,ri.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(fg.makeRotationFromEuler(ri)),h.material.toneMapped=je.getTransfer(y.colorSpace)!==it,(u!==y||f!==y.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,u=y,f=y.version,d=s.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new rt(new vi(2,2),new Zn({name:"BackgroundMaterial",uniforms:ls(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Yn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=je.getTransfer(y.colorSpace)!==it,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||f!==y.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,u=y,f=y.version,d=s.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function p(v,x){v.getRGB(Mr,Su(s)),n.buffers.color.setClear(Mr.r,Mr.g,Mr.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(v,x=1){a.set(v),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,p(a,c)},render:_,addToRenderList:m}}function pg(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,o=!1;function a(b,P,k,U,B){let q=!1;const G=u(U,k,P);r!==G&&(r=G,l(r.object)),q=d(b,U,k,B),q&&g(b,U,k,B),B!==null&&e.update(B,s.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,y(b,P,k,U),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function c(){return s.createVertexArray()}function l(b){return s.bindVertexArray(b)}function h(b){return s.deleteVertexArray(b)}function u(b,P,k){const U=k.wireframe===!0;let B=n[b.id];B===void 0&&(B={},n[b.id]=B);let q=B[P.id];q===void 0&&(q={},B[P.id]=q);let G=q[U];return G===void 0&&(G=f(c()),q[U]=G),G}function f(b){const P=[],k=[],U=[];for(let B=0;B<t;B++)P[B]=0,k[B]=0,U[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:k,attributeDivisors:U,object:b,attributes:{},index:null}}function d(b,P,k,U){const B=r.attributes,q=P.attributes;let G=0;const J=k.getAttributes();for(const V in J)if(J[V].location>=0){const le=B[V];let xe=q[V];if(xe===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&(xe=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&(xe=b.instanceColor)),le===void 0||le.attribute!==xe||xe&&le.data!==xe.data)return!0;G++}return r.attributesNum!==G||r.index!==U}function g(b,P,k,U){const B={},q=P.attributes;let G=0;const J=k.getAttributes();for(const V in J)if(J[V].location>=0){let le=q[V];le===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&(le=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&(le=b.instanceColor));const xe={};xe.attribute=le,le&&le.data&&(xe.data=le.data),B[V]=xe,G++}r.attributes=B,r.attributesNum=G,r.index=U}function _(){const b=r.newAttributes;for(let P=0,k=b.length;P<k;P++)b[P]=0}function m(b){p(b,0)}function p(b,P){const k=r.newAttributes,U=r.enabledAttributes,B=r.attributeDivisors;k[b]=1,U[b]===0&&(s.enableVertexAttribArray(b),U[b]=1),B[b]!==P&&(s.vertexAttribDivisor(b,P),B[b]=P)}function v(){const b=r.newAttributes,P=r.enabledAttributes;for(let k=0,U=P.length;k<U;k++)P[k]!==b[k]&&(s.disableVertexAttribArray(k),P[k]=0)}function x(b,P,k,U,B,q,G){G===!0?s.vertexAttribIPointer(b,P,k,B,q):s.vertexAttribPointer(b,P,k,U,B,q)}function y(b,P,k,U){_();const B=U.attributes,q=k.getAttributes(),G=P.defaultAttributeValues;for(const J in q){const V=q[J];if(V.location>=0){let he=B[J];if(he===void 0&&(J==="instanceMatrix"&&b.instanceMatrix&&(he=b.instanceMatrix),J==="instanceColor"&&b.instanceColor&&(he=b.instanceColor)),he!==void 0){const le=he.normalized,xe=he.itemSize,Oe=e.get(he);if(Oe===void 0)continue;const re=Oe.buffer,N=Oe.type,X=Oe.bytesPerElement,ee=N===s.INT||N===s.UNSIGNED_INT||he.gpuType===wc;if(he.isInterleavedBufferAttribute){const j=he.data,fe=j.stride,_e=he.offset;if(j.isInstancedInterleavedBuffer){for(let ve=0;ve<V.locationSize;ve++)p(V.location+ve,j.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ve=0;ve<V.locationSize;ve++)m(V.location+ve);s.bindBuffer(s.ARRAY_BUFFER,re);for(let ve=0;ve<V.locationSize;ve++)x(V.location+ve,xe/V.locationSize,N,le,fe*X,(_e+xe/V.locationSize*ve)*X,ee)}else{if(he.isInstancedBufferAttribute){for(let j=0;j<V.locationSize;j++)p(V.location+j,he.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let j=0;j<V.locationSize;j++)m(V.location+j);s.bindBuffer(s.ARRAY_BUFFER,re);for(let j=0;j<V.locationSize;j++)x(V.location+j,xe/V.locationSize,N,le,xe*X,xe/V.locationSize*j*X,ee)}}else if(G!==void 0){const le=G[J];if(le!==void 0)switch(le.length){case 2:s.vertexAttrib2fv(V.location,le);break;case 3:s.vertexAttrib3fv(V.location,le);break;case 4:s.vertexAttrib4fv(V.location,le);break;default:s.vertexAttrib1fv(V.location,le)}}}}v()}function I(){w();for(const b in n){const P=n[b];for(const k in P){const U=P[k];for(const B in U)h(U[B].object),delete U[B];delete P[k]}delete n[b]}}function A(b){if(n[b.id]===void 0)return;const P=n[b.id];for(const k in P){const U=P[k];for(const B in U)h(U[B].object),delete U[B];delete P[k]}delete n[b.id]}function R(b){for(const P in n){const k=n[P];if(k[b.id]===void 0)continue;const U=k[b.id];for(const B in U)h(U[B].object),delete U[B];delete k[b.id]}}function w(){M(),o=!0,r!==i&&(r=i,l(r.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:w,resetDefaultState:M,dispose:I,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function mg(s,e,t){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];t.update(d,n,1)}function c(l,h,u,f){if(u===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)o(l[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*f[_];t.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function gg(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(R){return!(R!==Xt&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const w=R===Zs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==wn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==cn&&!w)}function c(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),v=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),x=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,A=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:I,maxSamples:A}}function _g(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new ai,a=new He,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):l();else{const v=r?0:n,x=v*4;let y=p.clippingState||null;c.value=y,y=h(g,f,x,d);for(let I=0;I!==x;++I)y[I]=t[I];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=d+_*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,y=d;x!==_;++x,y+=4)o.copy(u[x]).applyMatrix4(v,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function vg(s){let e=new WeakMap;function t(o,a){return a===to?o.mapping=ss:a===Ia&&(o.mapping=rs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===to||a===Ia)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new wp(c.height);return l.fromEquirectangularTexture(s,o),e.set(o,l),o.addEventListener("dispose",i),t(l.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Cu extends bu{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const qi=4,Ol=[.125,.215,.35,.446,.526,.582],hi=20,jo=new Cu,kl=new $e;let Zo=null,Jo=0,Qo=0,ea=!1;const ci=(1+Math.sqrt(5))/2,Fi=1/ci,Fl=[new L(-ci,Fi,0),new L(ci,Fi,0),new L(-Fi,0,ci),new L(Fi,0,ci),new L(0,ci,-Fi),new L(0,ci,Fi),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class Bl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Zo=this._renderer.getRenderTarget(),Jo=this._renderer.getActiveCubeFace(),Qo=this._renderer.getActiveMipmapLevel(),ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Zo,Jo,Qo),this._renderer.xr.enabled=ea,e.scissorTest=!1,Sr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ss||e.mapping===rs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zo=this._renderer.getRenderTarget(),Jo=this._renderer.getActiveCubeFace(),Qo=this._renderer.getActiveMipmapLevel(),ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Zt,minFilter:Zt,generateMipmaps:!1,type:Zs,format:Xt,colorSpace:us,depthBuffer:!1},i=zl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=yg(r)),this._blurMaterial=xg(r,e,t)}return i}_compileMaterial(e){const t=new rt(this._lodPlanes[0],e);this._renderer.compile(t,jo)}_sceneToCubeUV(e,t,n,i){const a=new Ot(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(kl),h.toneMapping=$n,h.autoClear=!1;const d=new An({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1}),g=new rt(new wt,d);let _=!1;const m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,_=!0):(d.color.copy(kl),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):v===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const x=this._cubeSize;Sr(i,v*x,p>2?x:0,x,x),h.setRenderTarget(i),_&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===ss||e.mapping===rs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vl());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new rt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;Sr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,jo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Fl[(i-r-1)%Fl.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new rt(this._lodPlanes[i],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*hi-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):hi;m>hi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${hi}`);const p=[];let v=0;for(let R=0;R<hi;++R){const w=R/_,M=Math.exp(-w*w/2);p.push(M),R===0?v+=M:R<m&&(v+=2*M)}for(let R=0;R<p.length;R++)p[R]=p[R]/v;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:x}=this;f.dTheta.value=g,f.mipInt.value=x-n;const y=this._sizeLods[i],I=3*y*(i>x-qi?i-x+qi:0),A=4*(this._cubeSize-y);Sr(t,I,A,3*y,2*y),c.setRenderTarget(t),c.render(u,jo)}}function yg(s){const e=[],t=[],n=[];let i=s;const r=s-qi+1+Ol.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let c=1/a;o>s-qi?c=Ol[o-s+qi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,_=3,m=2,p=1,v=new Float32Array(_*g*d),x=new Float32Array(m*g*d),y=new Float32Array(p*g*d);for(let A=0;A<d;A++){const R=A%3*2/3-1,w=A>2?0:-1,M=[R,w,0,R+2/3,w,0,R+2/3,w+1,0,R,w,0,R+2/3,w+1,0,R,w+1,0];v.set(M,_*g*A),x.set(f,m*g*A);const b=[A,A,A,A,A,A];y.set(b,p*g*A)}const I=new It;I.setAttribute("position",new kt(v,_)),I.setAttribute("uv",new kt(x,m)),I.setAttribute("faceIndex",new kt(y,p)),e.push(I),i>qi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function zl(s,e,t){const n=new jn(s,e,t);return n.texture.mapping=go,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Sr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function xg(s,e,t){const n=new Float32Array(hi),i=new L(0,1,0);return new Zn({name:"SphericalGaussianBlur",defines:{n:hi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Vl(){return new Zn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Gl(){return new Zn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Fc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Mg(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===to||c===Ia,h=c===ss||c===rs;if(l||h){let u=e.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Bl(s)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return l&&d&&d.height>0||h&&d&&i(d)?(t===null&&(t=new Bl(s)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Sg(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Is("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function bg(s,e,t,n){const i={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)e.remove(_[m])}f.removeEventListener("dispose",o),delete i[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,t.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)e.update(f[g],s.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const _=d[g];for(let m=0,p=_.length;m<p;m++)e.update(_[m],s.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,g=u.attributes.position;let _=0;if(d!==null){const v=d.array;_=d.version;for(let x=0,y=v.length;x<y;x+=3){const I=v[x+0],A=v[x+1],R=v[x+2];f.push(I,A,A,R,R,I)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,y=v.length/3-1;x<y;x+=3){const I=x+0,A=x+1,R=x+2;f.push(I,A,A,R,R,I)}}else return;const m=new(mu(f)?Mu:xu)(f,1);m.version=_;const p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Tg(s,e,t){let n;function i(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,d){s.drawElements(n,d,r,f*o),t.update(d,n,1)}function l(f,d,g){g!==0&&(s.drawElementsInstanced(n,d,r,f*o,g),t.update(d,n,g))}function h(f,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];t.update(m,n,1)}function u(f,d,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/o,d[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,_,0,g);let p=0;for(let v=0;v<g;v++)p+=d[v]*_[v];t.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Eg(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Cg(s,e,t){const n=new WeakMap,i=new Je;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let M=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let x=0;d===!0&&(x=1),g===!0&&(x=2),_===!0&&(x=3);let y=a.attributes.position.count*x,I=1;y>e.maxTextureSize&&(I=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const A=new Float32Array(y*I*4*u),R=new _u(A,y,I,u);R.type=cn,R.needsUpdate=!0;const w=x*4;for(let b=0;b<u;b++){const P=m[b],k=p[b],U=v[b],B=y*I*4*b;for(let q=0;q<P.count;q++){const G=q*w;d===!0&&(i.fromBufferAttribute(P,q),A[B+G+0]=i.x,A[B+G+1]=i.y,A[B+G+2]=i.z,A[B+G+3]=0),g===!0&&(i.fromBufferAttribute(k,q),A[B+G+4]=i.x,A[B+G+5]=i.y,A[B+G+6]=i.z,A[B+G+7]=0),_===!0&&(i.fromBufferAttribute(U,q),A[B+G+8]=i.x,A[B+G+9]=i.y,A[B+G+10]=i.z,A[B+G+11]=U.itemSize===4?i.w:1)}}f={count:u,texture:R,size:new pe(y,I)},n.set(a,f),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let d=0;for(let _=0;_<l.length;_++)d+=l[_];const g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(s,"morphTargetBaseInfluence",g),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function Ag(s,e,t,n){let i=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=e.get(c,h);if(i.get(u)!==l&&(e.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return u}function o(){i=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}class Au extends Tt{constructor(e,t,n,i,r,o,a,c,l,h=Ji){if(h!==Ji&&h!==as)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ji&&(n=_i),n===void 0&&h===as&&(n=os),super(null,i,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:$t,this.minFilter=c!==void 0?c:$t,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Ru=new Tt,Hl=new Au(1,1),wu=new _u,Pu=new dp,Lu=new Tu,Wl=[],Xl=[],$l=new Float32Array(16),ql=new Float32Array(9),Kl=new Float32Array(4);function ds(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Wl[i];if(r===void 0&&(r=new Float32Array(i),Wl[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function _t(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function vt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function yo(s,e){let t=Xl[e];t===void 0&&(t=new Int32Array(e),Xl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Rg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function wg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;s.uniform2fv(this.addr,e),vt(t,e)}}function Pg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(_t(t,e))return;s.uniform3fv(this.addr,e),vt(t,e)}}function Lg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;s.uniform4fv(this.addr,e),vt(t,e)}}function Ig(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,n))return;Kl.set(n),s.uniformMatrix2fv(this.addr,!1,Kl),vt(t,n)}}function Dg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,n))return;ql.set(n),s.uniformMatrix3fv(this.addr,!1,ql),vt(t,n)}}function Ug(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,n))return;$l.set(n),s.uniformMatrix4fv(this.addr,!1,$l),vt(t,n)}}function Ng(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Og(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;s.uniform2iv(this.addr,e),vt(t,e)}}function kg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;s.uniform3iv(this.addr,e),vt(t,e)}}function Fg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;s.uniform4iv(this.addr,e),vt(t,e)}}function Bg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function zg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;s.uniform2uiv(this.addr,e),vt(t,e)}}function Vg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;s.uniform3uiv(this.addr,e),vt(t,e)}}function Gg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;s.uniform4uiv(this.addr,e),vt(t,e)}}function Hg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Hl.compareFunction=pu,r=Hl):r=Ru,t.setTexture2D(e||r,i)}function Wg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Pu,i)}function Xg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Lu,i)}function $g(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||wu,i)}function qg(s){switch(s){case 5126:return Rg;case 35664:return wg;case 35665:return Pg;case 35666:return Lg;case 35674:return Ig;case 35675:return Dg;case 35676:return Ug;case 5124:case 35670:return Ng;case 35667:case 35671:return Og;case 35668:case 35672:return kg;case 35669:case 35673:return Fg;case 5125:return Bg;case 36294:return zg;case 36295:return Vg;case 36296:return Gg;case 35678:case 36198:case 36298:case 36306:case 35682:return Hg;case 35679:case 36299:case 36307:return Wg;case 35680:case 36300:case 36308:case 36293:return Xg;case 36289:case 36303:case 36311:case 36292:return $g}}function Kg(s,e){s.uniform1fv(this.addr,e)}function Yg(s,e){const t=ds(e,this.size,2);s.uniform2fv(this.addr,t)}function jg(s,e){const t=ds(e,this.size,3);s.uniform3fv(this.addr,t)}function Zg(s,e){const t=ds(e,this.size,4);s.uniform4fv(this.addr,t)}function Jg(s,e){const t=ds(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Qg(s,e){const t=ds(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function e_(s,e){const t=ds(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function t_(s,e){s.uniform1iv(this.addr,e)}function n_(s,e){s.uniform2iv(this.addr,e)}function i_(s,e){s.uniform3iv(this.addr,e)}function s_(s,e){s.uniform4iv(this.addr,e)}function r_(s,e){s.uniform1uiv(this.addr,e)}function o_(s,e){s.uniform2uiv(this.addr,e)}function a_(s,e){s.uniform3uiv(this.addr,e)}function c_(s,e){s.uniform4uiv(this.addr,e)}function l_(s,e,t){const n=this.cache,i=e.length,r=yo(t,i);_t(n,r)||(s.uniform1iv(this.addr,r),vt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||Ru,r[o])}function h_(s,e,t){const n=this.cache,i=e.length,r=yo(t,i);_t(n,r)||(s.uniform1iv(this.addr,r),vt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Pu,r[o])}function u_(s,e,t){const n=this.cache,i=e.length,r=yo(t,i);_t(n,r)||(s.uniform1iv(this.addr,r),vt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Lu,r[o])}function f_(s,e,t){const n=this.cache,i=e.length,r=yo(t,i);_t(n,r)||(s.uniform1iv(this.addr,r),vt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||wu,r[o])}function d_(s){switch(s){case 5126:return Kg;case 35664:return Yg;case 35665:return jg;case 35666:return Zg;case 35674:return Jg;case 35675:return Qg;case 35676:return e_;case 5124:case 35670:return t_;case 35667:case 35671:return n_;case 35668:case 35672:return i_;case 35669:case 35673:return s_;case 5125:return r_;case 36294:return o_;case 36295:return a_;case 36296:return c_;case 35678:case 36198:case 36298:case 36306:case 35682:return l_;case 35679:case 36299:case 36307:return h_;case 35680:case 36300:case 36308:case 36293:return u_;case 36289:case 36303:case 36311:case 36292:return f_}}class p_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=qg(t.type)}}class m_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=d_(t.type)}}class g_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const ta=/(\w+)(\])?(\[|\.)?/g;function Yl(s,e){s.seq.push(e),s.map[e.id]=e}function __(s,e,t){const n=s.name,i=n.length;for(ta.lastIndex=0;;){const r=ta.exec(n),o=ta.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){Yl(t,l===void 0?new p_(a,s,e):new m_(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new g_(a),Yl(t,u)),t=u}}}class $r{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);__(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function jl(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const v_=37297;let y_=0;function x_(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Zl=new He;function M_(s){je._getMatrix(Zl,je.workingColorSpace,s);const e=`mat3( ${Zl.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(s)){case _o:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Jl(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+x_(s.getShaderSource(e),o)}else return i}function S_(s,e){const t=M_(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function b_(s,e){let t;switch(e){case Sd:t="Linear";break;case bd:t="Reinhard";break;case Td:t="Cineon";break;case nu:t="ACESFilmic";break;case Cd:t="AgX";break;case Ad:t="Neutral";break;case Ed:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const br=new L;function T_(){je.getLuminanceCoefficients(br);const s=br.x.toFixed(4),e=br.y.toFixed(4),t=br.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function E_(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ds).join(`
`)}function C_(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function A_(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function Ds(s){return s!==""}function Ql(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function eh(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const R_=/^[ \t]*#include +<([\w\d./]+)>/gm;function cc(s){return s.replace(R_,P_)}const w_=new Map;function P_(s,e){let t=Xe[e];if(t===void 0){const n=w_.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return cc(t)}const L_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function th(s){return s.replace(L_,I_)}function I_(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function nh(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function D_(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===eu?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===td?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Tn&&(e="SHADOWMAP_TYPE_VSM"),e}function U_(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case ss:case rs:e="ENVMAP_TYPE_CUBE";break;case go:e="ENVMAP_TYPE_CUBE_UV";break}return e}function N_(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case rs:e="ENVMAP_MODE_REFRACTION";break}return e}function O_(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case tu:e="ENVMAP_BLENDING_MULTIPLY";break;case xd:e="ENVMAP_BLENDING_MIX";break;case Md:e="ENVMAP_BLENDING_ADD";break}return e}function k_(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function F_(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=D_(t),l=U_(t),h=N_(t),u=O_(t),f=k_(t),d=E_(t),g=C_(r),_=i.createProgram();let m,p,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ds).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ds).join(`
`),p.length>0&&(p+=`
`)):(m=[nh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ds).join(`
`),p=[nh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==$n?"#define TONE_MAPPING":"",t.toneMapping!==$n?Xe.tonemapping_pars_fragment:"",t.toneMapping!==$n?b_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,S_("linearToOutputTexel",t.outputColorSpace),T_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ds).join(`
`)),o=cc(o),o=Ql(o,t),o=eh(o,t),a=cc(a),a=Ql(a,t),a=eh(a,t),o=th(o),a=th(a),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===pl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===pl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=v+m+o,y=v+p+a,I=jl(i,i.VERTEX_SHADER,x),A=jl(i,i.FRAGMENT_SHADER,y);i.attachShader(_,I),i.attachShader(_,A),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function R(P){if(s.debug.checkShaderErrors){const k=i.getProgramInfoLog(_).trim(),U=i.getShaderInfoLog(I).trim(),B=i.getShaderInfoLog(A).trim();let q=!0,G=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,I,A);else{const J=Jl(i,I,"vertex"),V=Jl(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+k+`
`+J+`
`+V)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(U===""||B==="")&&(G=!1);G&&(P.diagnostics={runnable:q,programLog:k,vertexShader:{log:U,prefix:m},fragmentShader:{log:B,prefix:p}})}i.deleteShader(I),i.deleteShader(A),w=new $r(i,_),M=A_(i,_)}let w;this.getUniforms=function(){return w===void 0&&R(this),w};let M;this.getAttributes=function(){return M===void 0&&R(this),M};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=i.getProgramParameter(_,v_)),b},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=y_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=I,this.fragmentShader=A,this}let B_=0;class z_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new V_(e),t.set(e,n)),n}}class V_{constructor(e){this.id=B_++,this.code=e,this.usedTimes=0}}function G_(s,e,t,n,i,r,o){const a=new vu,c=new z_,l=new Set,h=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,b,P,k,U){const B=k.fog,q=U.geometry,G=M.isMeshStandardMaterial?k.environment:null,J=(M.isMeshStandardMaterial?t:e).get(M.envMap||G),V=J&&J.mapping===go?J.image.height:null,he=g[M.type];M.precision!==null&&(d=i.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const le=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,xe=le!==void 0?le.length:0;let Oe=0;q.morphAttributes.position!==void 0&&(Oe=1),q.morphAttributes.normal!==void 0&&(Oe=2),q.morphAttributes.color!==void 0&&(Oe=3);let re,N,X,ee;if(he){const tt=dn[he];re=tt.vertexShader,N=tt.fragmentShader}else re=M.vertexShader,N=M.fragmentShader,c.update(M),X=c.getVertexShaderID(M),ee=c.getFragmentShaderID(M);const j=s.getRenderTarget(),fe=s.state.buffers.depth.getReversed(),_e=U.isInstancedMesh===!0,ve=U.isBatchedMesh===!0,we=!!M.map,Y=!!M.matcap,ne=!!J,T=!!M.aoMap,te=!!M.lightMap,$=!!M.bumpMap,ae=!!M.normalMap,ie=!!M.displacementMap,ce=!!M.emissiveMap,me=!!M.metalnessMap,C=!!M.roughnessMap,S=M.anisotropy>0,z=M.clearcoat>0,Z=M.dispersion>0,oe=M.iridescence>0,Q=M.sheen>0,Pe=M.transmission>0,ye=S&&!!M.anisotropyMap,Ee=z&&!!M.clearcoatMap,Ke=z&&!!M.clearcoatNormalMap,ue=z&&!!M.clearcoatRoughnessMap,Ce=oe&&!!M.iridescenceMap,ke=oe&&!!M.iridescenceThicknessMap,Fe=Q&&!!M.sheenColorMap,Ae=Q&&!!M.sheenRoughnessMap,Ye=!!M.specularMap,We=!!M.specularColorMap,ot=!!M.specularIntensityMap,D=Pe&&!!M.transmissionMap,Me=Pe&&!!M.thicknessMap,K=!!M.gradientMap,se=!!M.alphaMap,Te=M.alphaTest>0,Se=!!M.alphaHash,Ve=!!M.extensions;let dt=$n;M.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(dt=s.toneMapping);const Et={shaderID:he,shaderType:M.type,shaderName:M.name,vertexShader:re,fragmentShader:N,defines:M.defines,customVertexShaderID:X,customFragmentShaderID:ee,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:ve,batchingColor:ve&&U._colorsTexture!==null,instancing:_e,instancingColor:_e&&U.instanceColor!==null,instancingMorph:_e&&U.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:j===null?s.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:us,alphaToCoverage:!!M.alphaToCoverage,map:we,matcap:Y,envMap:ne,envMapMode:ne&&J.mapping,envMapCubeUVHeight:V,aoMap:T,lightMap:te,bumpMap:$,normalMap:ae,displacementMap:f&&ie,emissiveMap:ce,normalMapObjectSpace:ae&&M.normalMapType===Nd,normalMapTangentSpace:ae&&M.normalMapType===du,metalnessMap:me,roughnessMap:C,anisotropy:S,anisotropyMap:ye,clearcoat:z,clearcoatMap:Ee,clearcoatNormalMap:Ke,clearcoatRoughnessMap:ue,dispersion:Z,iridescence:oe,iridescenceMap:Ce,iridescenceThicknessMap:ke,sheen:Q,sheenColorMap:Fe,sheenRoughnessMap:Ae,specularMap:Ye,specularColorMap:We,specularIntensityMap:ot,transmission:Pe,transmissionMap:D,thicknessMap:Me,gradientMap:K,opaque:M.transparent===!1&&M.blending===Zi&&M.alphaToCoverage===!1,alphaMap:se,alphaTest:Te,alphaHash:Se,combine:M.combine,mapUv:we&&_(M.map.channel),aoMapUv:T&&_(M.aoMap.channel),lightMapUv:te&&_(M.lightMap.channel),bumpMapUv:$&&_(M.bumpMap.channel),normalMapUv:ae&&_(M.normalMap.channel),displacementMapUv:ie&&_(M.displacementMap.channel),emissiveMapUv:ce&&_(M.emissiveMap.channel),metalnessMapUv:me&&_(M.metalnessMap.channel),roughnessMapUv:C&&_(M.roughnessMap.channel),anisotropyMapUv:ye&&_(M.anisotropyMap.channel),clearcoatMapUv:Ee&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Ke&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:ke&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:Fe&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&_(M.sheenRoughnessMap.channel),specularMapUv:Ye&&_(M.specularMap.channel),specularColorMapUv:We&&_(M.specularColorMap.channel),specularIntensityMapUv:ot&&_(M.specularIntensityMap.channel),transmissionMapUv:D&&_(M.transmissionMap.channel),thicknessMapUv:Me&&_(M.thicknessMap.channel),alphaMapUv:se&&_(M.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(ae||S),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!q.attributes.uv&&(we||se),fog:!!B,useFog:M.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:fe,skinning:U.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:Oe,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:dt,decodeVideoTexture:we&&M.map.isVideoTexture===!0&&je.getTransfer(M.map.colorSpace)===it,decodeVideoTextureEmissive:ce&&M.emissiveMap.isVideoTexture===!0&&je.getTransfer(M.emissiveMap.colorSpace)===it,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===En,flipSided:M.side===Vt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ve&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ve&&M.extensions.multiDraw===!0||ve)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Et.vertexUv1s=l.has(1),Et.vertexUv2s=l.has(2),Et.vertexUv3s=l.has(3),l.clear(),Et}function p(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)b.push(P),b.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(v(b,M),x(b,M),b.push(s.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function v(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function x(M,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reverseDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),M.push(a.mask)}function y(M){const b=g[M.type];let P;if(b){const k=dn[b];P=Ep.clone(k.uniforms)}else P=M.uniforms;return P}function I(M,b){let P;for(let k=0,U=h.length;k<U;k++){const B=h[k];if(B.cacheKey===b){P=B,++P.usedTimes;break}}return P===void 0&&(P=new F_(s,b,M,r),h.push(P)),P}function A(M){if(--M.usedTimes===0){const b=h.indexOf(M);h[b]=h[h.length-1],h.pop(),M.destroy()}}function R(M){c.remove(M)}function w(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:I,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:w}}function H_(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,c){s.get(o)[a]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function W_(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function ih(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function sh(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,f,d,g,_,m){let p=s[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},s[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),e++,p}function a(u,f,d,g,_,m){const p=o(u,f,d,g,_,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):t.push(p)}function c(u,f,d,g,_,m){const p=o(u,f,d,g,_,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):t.unshift(p)}function l(u,f){t.length>1&&t.sort(u||W_),n.length>1&&n.sort(f||ih),i.length>1&&i.sort(f||ih)}function h(){for(let u=e,f=s.length;u<f;u++){const d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:h,sort:l}}function X_(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new sh,s.set(n,[o])):i>=r.length?(o=new sh,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function $_(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new $e};break;case"SpotLight":t={position:new L,direction:new L,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new $e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":t={color:new $e,position:new L,halfWidth:new L,halfHeight:new L};break}return s[e.id]=t,t}}}function q_(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let K_=0;function Y_(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function j_(s){const e=new $_,t=q_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);const i=new L,r=new qe,o=new qe;function a(l){let h=0,u=0,f=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let d=0,g=0,_=0,m=0,p=0,v=0,x=0,y=0,I=0,A=0,R=0;l.sort(Y_);for(let M=0,b=l.length;M<b;M++){const P=l[M],k=P.color,U=P.intensity,B=P.distance,q=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=k.r*U,u+=k.g*U,f+=k.b*U;else if(P.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(P.sh.coefficients[G],U);R++}else if(P.isDirectionalLight){const G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const J=P.shadow,V=t.get(P);V.shadowIntensity=J.intensity,V.shadowBias=J.bias,V.shadowNormalBias=J.normalBias,V.shadowRadius=J.radius,V.shadowMapSize=J.mapSize,n.directionalShadow[d]=V,n.directionalShadowMap[d]=q,n.directionalShadowMatrix[d]=P.shadow.matrix,v++}n.directional[d]=G,d++}else if(P.isSpotLight){const G=e.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(k).multiplyScalar(U),G.distance=B,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,n.spot[_]=G;const J=P.shadow;if(P.map&&(n.spotLightMap[I]=P.map,I++,J.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[_]=J.matrix,P.castShadow){const V=t.get(P);V.shadowIntensity=J.intensity,V.shadowBias=J.bias,V.shadowNormalBias=J.normalBias,V.shadowRadius=J.radius,V.shadowMapSize=J.mapSize,n.spotShadow[_]=V,n.spotShadowMap[_]=q,y++}_++}else if(P.isRectAreaLight){const G=e.get(P);G.color.copy(k).multiplyScalar(U),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=G,m++}else if(P.isPointLight){const G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){const J=P.shadow,V=t.get(P);V.shadowIntensity=J.intensity,V.shadowBias=J.bias,V.shadowNormalBias=J.normalBias,V.shadowRadius=J.radius,V.shadowMapSize=J.mapSize,V.shadowCameraNear=J.camera.near,V.shadowCameraFar=J.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=P.shadow.matrix,x++}n.point[g]=G,g++}else if(P.isHemisphereLight){const G=e.get(P);G.skyColor.copy(P.color).multiplyScalar(U),G.groundColor.copy(P.groundColor).multiplyScalar(U),n.hemi[p]=G,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ge.LTC_FLOAT_1,n.rectAreaLTC2=ge.LTC_FLOAT_2):(n.rectAreaLTC1=ge.LTC_HALF_1,n.rectAreaLTC2=ge.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const w=n.hash;(w.directionalLength!==d||w.pointLength!==g||w.spotLength!==_||w.rectAreaLength!==m||w.hemiLength!==p||w.numDirectionalShadows!==v||w.numPointShadows!==x||w.numSpotShadows!==y||w.numSpotMaps!==I||w.numLightProbes!==R)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=y+I-A,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,w.directionalLength=d,w.pointLength=g,w.spotLength=_,w.rectAreaLength=m,w.hemiLength=p,w.numDirectionalShadows=v,w.numPointShadows=x,w.numSpotShadows=y,w.numSpotMaps=I,w.numLightProbes=R,n.version=K_++)}function c(l,h){let u=0,f=0,d=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,v=l.length;p<v;p++){const x=l[p];if(x.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),u++}else if(x.isSpotLight){const y=n.spot[d];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),d++}else if(x.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const y=n.point[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),f++}else if(x.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:n}}function rh(s){const e=new j_(s),t=[],n=[];function i(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function Z_(s){let e=new WeakMap;function t(i,r=0){const o=e.get(i);let a;return o===void 0?(a=new rh(s),e.set(i,[a])):r>=o.length?(a=new rh(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class J_ extends Qn{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Dd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Q_ extends Qn{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const ev=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,tv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function nv(s,e,t){let n=new kc;const i=new pe,r=new pe,o=new Je,a=new J_({depthPacking:Ud}),c=new Q_,l={},h=t.maxTextureSize,u={[Yn]:Vt,[Vt]:Yn,[En]:En},f=new Zn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pe},radius:{value:4}},vertexShader:ev,fragmentShader:tv}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new It;g.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new rt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=eu;let p=this.type;this.render=function(A,R,w){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const M=s.getRenderTarget(),b=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),k=s.state;k.setBlending(Xn),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const U=p!==Tn&&this.type===Tn,B=p===Tn&&this.type!==Tn;for(let q=0,G=A.length;q<G;q++){const J=A[q],V=J.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);const he=V.getFrameExtents();if(i.multiply(he),r.copy(V.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/he.x),i.x=r.x*he.x,V.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/he.y),i.y=r.y*he.y,V.mapSize.y=r.y)),V.map===null||U===!0||B===!0){const xe=this.type!==Tn?{minFilter:$t,magFilter:$t}:{};V.map!==null&&V.map.dispose(),V.map=new jn(i.x,i.y,xe),V.map.texture.name=J.name+".shadowMap",V.camera.updateProjectionMatrix()}s.setRenderTarget(V.map),s.clear();const le=V.getViewportCount();for(let xe=0;xe<le;xe++){const Oe=V.getViewport(xe);o.set(r.x*Oe.x,r.y*Oe.y,r.x*Oe.z,r.y*Oe.w),k.viewport(o),V.updateMatrices(J,xe),n=V.getFrustum(),y(R,w,V.camera,J,this.type)}V.isPointLightShadow!==!0&&this.type===Tn&&v(V,w),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(M,b,P)};function v(A,R){const w=e.update(_);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new jn(i.x,i.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,s.setRenderTarget(A.mapPass),s.clear(),s.renderBufferDirect(R,null,w,f,_,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,s.setRenderTarget(A.map),s.clear(),s.renderBufferDirect(R,null,w,d,_,null)}function x(A,R,w,M){let b=null;const P=w.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)b=P;else if(b=w.isPointLight===!0?c:a,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const k=b.uuid,U=R.uuid;let B=l[k];B===void 0&&(B={},l[k]=B);let q=B[U];q===void 0&&(q=b.clone(),B[U]=q,R.addEventListener("dispose",I)),b=q}if(b.visible=R.visible,b.wireframe=R.wireframe,M===Tn?b.side=R.shadowSide!==null?R.shadowSide:R.side:b.side=R.shadowSide!==null?R.shadowSide:u[R.side],b.alphaMap=R.alphaMap,b.alphaTest=R.alphaTest,b.map=R.map,b.clipShadows=R.clipShadows,b.clippingPlanes=R.clippingPlanes,b.clipIntersection=R.clipIntersection,b.displacementMap=R.displacementMap,b.displacementScale=R.displacementScale,b.displacementBias=R.displacementBias,b.wireframeLinewidth=R.wireframeLinewidth,b.linewidth=R.linewidth,w.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const k=s.properties.get(b);k.light=w}return b}function y(A,R,w,M,b){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&b===Tn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,A.matrixWorld);const U=e.update(A),B=A.material;if(Array.isArray(B)){const q=U.groups;for(let G=0,J=q.length;G<J;G++){const V=q[G],he=B[V.materialIndex];if(he&&he.visible){const le=x(A,he,M,b);A.onBeforeShadow(s,A,R,w,U,le,V),s.renderBufferDirect(w,null,U,le,A,V),A.onAfterShadow(s,A,R,w,U,le,V)}}}else if(B.visible){const q=x(A,B,M,b);A.onBeforeShadow(s,A,R,w,U,q,null),s.renderBufferDirect(w,null,U,q,A,null),A.onAfterShadow(s,A,R,w,U,q,null)}}const k=A.children;for(let U=0,B=k.length;U<B;U++)y(k[U],R,w,M,b)}function I(A){A.target.removeEventListener("dispose",I);for(const w in l){const M=l[w],b=A.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}const iv={[Ea]:Ca,[Aa]:Pa,[Ra]:La,[is]:wa,[Ca]:Ea,[Pa]:Aa,[La]:Ra,[wa]:is};function sv(s,e){function t(){let D=!1;const Me=new Je;let K=null;const se=new Je(0,0,0,0);return{setMask:function(Te){K!==Te&&!D&&(s.colorMask(Te,Te,Te,Te),K=Te)},setLocked:function(Te){D=Te},setClear:function(Te,Se,Ve,dt,Et){Et===!0&&(Te*=dt,Se*=dt,Ve*=dt),Me.set(Te,Se,Ve,dt),se.equals(Me)===!1&&(s.clearColor(Te,Se,Ve,dt),se.copy(Me))},reset:function(){D=!1,K=null,se.set(-1,0,0,0)}}}function n(){let D=!1,Me=!1,K=null,se=null,Te=null;return{setReversed:function(Se){if(Me!==Se){const Ve=e.get("EXT_clip_control");Me?Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.ZERO_TO_ONE_EXT):Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.NEGATIVE_ONE_TO_ONE_EXT);const dt=Te;Te=null,this.setClear(dt)}Me=Se},getReversed:function(){return Me},setTest:function(Se){Se?j(s.DEPTH_TEST):fe(s.DEPTH_TEST)},setMask:function(Se){K!==Se&&!D&&(s.depthMask(Se),K=Se)},setFunc:function(Se){if(Me&&(Se=iv[Se]),se!==Se){switch(Se){case Ea:s.depthFunc(s.NEVER);break;case Ca:s.depthFunc(s.ALWAYS);break;case Aa:s.depthFunc(s.LESS);break;case is:s.depthFunc(s.LEQUAL);break;case Ra:s.depthFunc(s.EQUAL);break;case wa:s.depthFunc(s.GEQUAL);break;case Pa:s.depthFunc(s.GREATER);break;case La:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}se=Se}},setLocked:function(Se){D=Se},setClear:function(Se){Te!==Se&&(Me&&(Se=1-Se),s.clearDepth(Se),Te=Se)},reset:function(){D=!1,K=null,se=null,Te=null,Me=!1}}}function i(){let D=!1,Me=null,K=null,se=null,Te=null,Se=null,Ve=null,dt=null,Et=null;return{setTest:function(tt){D||(tt?j(s.STENCIL_TEST):fe(s.STENCIL_TEST))},setMask:function(tt){Me!==tt&&!D&&(s.stencilMask(tt),Me=tt)},setFunc:function(tt,Qt,gn){(K!==tt||se!==Qt||Te!==gn)&&(s.stencilFunc(tt,Qt,gn),K=tt,se=Qt,Te=gn)},setOp:function(tt,Qt,gn){(Se!==tt||Ve!==Qt||dt!==gn)&&(s.stencilOp(tt,Qt,gn),Se=tt,Ve=Qt,dt=gn)},setLocked:function(tt){D=tt},setClear:function(tt){Et!==tt&&(s.clearStencil(tt),Et=tt)},reset:function(){D=!1,Me=null,K=null,se=null,Te=null,Se=null,Ve=null,dt=null,Et=null}}}const r=new t,o=new n,a=new i,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],g=null,_=!1,m=null,p=null,v=null,x=null,y=null,I=null,A=null,R=new $e(0,0,0),w=0,M=!1,b=null,P=null,k=null,U=null,B=null;const q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,J=0;const V=s.getParameter(s.VERSION);V.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(V)[1]),G=J>=1):V.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),G=J>=2);let he=null,le={};const xe=s.getParameter(s.SCISSOR_BOX),Oe=s.getParameter(s.VIEWPORT),re=new Je().fromArray(xe),N=new Je().fromArray(Oe);function X(D,Me,K,se){const Te=new Uint8Array(4),Se=s.createTexture();s.bindTexture(D,Se),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ve=0;Ve<K;Ve++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(Me,0,s.RGBA,1,1,se,0,s.RGBA,s.UNSIGNED_BYTE,Te):s.texImage2D(Me+Ve,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Te);return Se}const ee={};ee[s.TEXTURE_2D]=X(s.TEXTURE_2D,s.TEXTURE_2D,1),ee[s.TEXTURE_CUBE_MAP]=X(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[s.TEXTURE_2D_ARRAY]=X(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ee[s.TEXTURE_3D]=X(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),j(s.DEPTH_TEST),o.setFunc(is),$(!1),ae(rl),j(s.CULL_FACE),T(Xn);function j(D){h[D]!==!0&&(s.enable(D),h[D]=!0)}function fe(D){h[D]!==!1&&(s.disable(D),h[D]=!1)}function _e(D,Me){return u[D]!==Me?(s.bindFramebuffer(D,Me),u[D]=Me,D===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=Me),D===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=Me),!0):!1}function ve(D,Me){let K=d,se=!1;if(D){K=f.get(Me),K===void 0&&(K=[],f.set(Me,K));const Te=D.textures;if(K.length!==Te.length||K[0]!==s.COLOR_ATTACHMENT0){for(let Se=0,Ve=Te.length;Se<Ve;Se++)K[Se]=s.COLOR_ATTACHMENT0+Se;K.length=Te.length,se=!0}}else K[0]!==s.BACK&&(K[0]=s.BACK,se=!0);se&&s.drawBuffers(K)}function we(D){return g!==D?(s.useProgram(D),g=D,!0):!1}const Y={[li]:s.FUNC_ADD,[id]:s.FUNC_SUBTRACT,[sd]:s.FUNC_REVERSE_SUBTRACT};Y[rd]=s.MIN,Y[od]=s.MAX;const ne={[ad]:s.ZERO,[cd]:s.ONE,[ld]:s.SRC_COLOR,[ba]:s.SRC_ALPHA,[md]:s.SRC_ALPHA_SATURATE,[dd]:s.DST_COLOR,[ud]:s.DST_ALPHA,[hd]:s.ONE_MINUS_SRC_COLOR,[Ta]:s.ONE_MINUS_SRC_ALPHA,[pd]:s.ONE_MINUS_DST_COLOR,[fd]:s.ONE_MINUS_DST_ALPHA,[gd]:s.CONSTANT_COLOR,[_d]:s.ONE_MINUS_CONSTANT_COLOR,[vd]:s.CONSTANT_ALPHA,[yd]:s.ONE_MINUS_CONSTANT_ALPHA};function T(D,Me,K,se,Te,Se,Ve,dt,Et,tt){if(D===Xn){_===!0&&(fe(s.BLEND),_=!1);return}if(_===!1&&(j(s.BLEND),_=!0),D!==nd){if(D!==m||tt!==M){if((p!==li||y!==li)&&(s.blendEquation(s.FUNC_ADD),p=li,y=li),tt)switch(D){case Zi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Sa:s.blendFunc(s.ONE,s.ONE);break;case ol:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case al:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Zi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Sa:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case ol:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case al:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}v=null,x=null,I=null,A=null,R.set(0,0,0),w=0,m=D,M=tt}return}Te=Te||Me,Se=Se||K,Ve=Ve||se,(Me!==p||Te!==y)&&(s.blendEquationSeparate(Y[Me],Y[Te]),p=Me,y=Te),(K!==v||se!==x||Se!==I||Ve!==A)&&(s.blendFuncSeparate(ne[K],ne[se],ne[Se],ne[Ve]),v=K,x=se,I=Se,A=Ve),(dt.equals(R)===!1||Et!==w)&&(s.blendColor(dt.r,dt.g,dt.b,Et),R.copy(dt),w=Et),m=D,M=!1}function te(D,Me){D.side===En?fe(s.CULL_FACE):j(s.CULL_FACE);let K=D.side===Vt;Me&&(K=!K),$(K),D.blending===Zi&&D.transparent===!1?T(Xn):T(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);const se=D.stencilWrite;a.setTest(se),se&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ce(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?j(s.SAMPLE_ALPHA_TO_COVERAGE):fe(s.SAMPLE_ALPHA_TO_COVERAGE)}function $(D){b!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),b=D)}function ae(D){D!==Qf?(j(s.CULL_FACE),D!==P&&(D===rl?s.cullFace(s.BACK):D===ed?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):fe(s.CULL_FACE),P=D}function ie(D){D!==k&&(G&&s.lineWidth(D),k=D)}function ce(D,Me,K){D?(j(s.POLYGON_OFFSET_FILL),(U!==Me||B!==K)&&(s.polygonOffset(Me,K),U=Me,B=K)):fe(s.POLYGON_OFFSET_FILL)}function me(D){D?j(s.SCISSOR_TEST):fe(s.SCISSOR_TEST)}function C(D){D===void 0&&(D=s.TEXTURE0+q-1),he!==D&&(s.activeTexture(D),he=D)}function S(D,Me,K){K===void 0&&(he===null?K=s.TEXTURE0+q-1:K=he);let se=le[K];se===void 0&&(se={type:void 0,texture:void 0},le[K]=se),(se.type!==D||se.texture!==Me)&&(he!==K&&(s.activeTexture(K),he=K),s.bindTexture(D,Me||ee[D]),se.type=D,se.texture=Me)}function z(){const D=le[he];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Z(){try{s.compressedTexImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function oe(){try{s.compressedTexImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Q(){try{s.texSubImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Pe(){try{s.texSubImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ye(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ke(){try{s.texStorage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ue(){try{s.texStorage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ce(){try{s.texImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ke(){try{s.texImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Fe(D){re.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),re.copy(D))}function Ae(D){N.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),N.copy(D))}function Ye(D,Me){let K=l.get(Me);K===void 0&&(K=new WeakMap,l.set(Me,K));let se=K.get(D);se===void 0&&(se=s.getUniformBlockIndex(Me,D.name),K.set(D,se))}function We(D,Me){const se=l.get(Me).get(D);c.get(Me)!==se&&(s.uniformBlockBinding(Me,se,D.__bindingPointIndex),c.set(Me,se))}function ot(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},he=null,le={},u={},f=new WeakMap,d=[],g=null,_=!1,m=null,p=null,v=null,x=null,y=null,I=null,A=null,R=new $e(0,0,0),w=0,M=!1,b=null,P=null,k=null,U=null,B=null,re.set(0,0,s.canvas.width,s.canvas.height),N.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:j,disable:fe,bindFramebuffer:_e,drawBuffers:ve,useProgram:we,setBlending:T,setMaterial:te,setFlipSided:$,setCullFace:ae,setLineWidth:ie,setPolygonOffset:ce,setScissorTest:me,activeTexture:C,bindTexture:S,unbindTexture:z,compressedTexImage2D:Z,compressedTexImage3D:oe,texImage2D:Ce,texImage3D:ke,updateUBOMapping:Ye,uniformBlockBinding:We,texStorage2D:Ke,texStorage3D:ue,texSubImage2D:Q,texSubImage3D:Pe,compressedTexSubImage2D:ye,compressedTexSubImage3D:Ee,scissor:Fe,viewport:Ae,reset:ot}}function oh(s,e,t,n){const i=rv(n);switch(t){case au:return s*e;case lu:return s*e;case hu:return s*e*2;case Ic:return s*e/i.components*i.byteLength;case Dc:return s*e/i.components*i.byteLength;case uu:return s*e*2/i.components*i.byteLength;case Uc:return s*e*2/i.components*i.byteLength;case cu:return s*e*3/i.components*i.byteLength;case Xt:return s*e*4/i.components*i.byteLength;case Nc:return s*e*4/i.components*i.byteLength;case Vr:case Gr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Hr:case Wr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Na:case ka:return Math.max(s,16)*Math.max(e,8)/4;case Ua:case Oa:return Math.max(s,8)*Math.max(e,8)/2;case Fa:case Ba:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case za:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Va:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ga:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Ha:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Wa:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case $a:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case qa:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Ya:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case ja:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Za:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Ja:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Qa:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case ec:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Xr:case tc:case nc:return Math.ceil(s/4)*Math.ceil(e/4)*16;case fu:case ic:return Math.ceil(s/4)*Math.ceil(e/4)*8;case sc:case rc:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function rv(s){switch(s){case wn:case su:return{byteLength:1,components:1};case Xs:case ru:case Zs:return{byteLength:2,components:1};case Pc:case Lc:return{byteLength:2,components:4};case _i:case wc:case cn:return{byteLength:4,components:1};case ou:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function ov(s,e,t,n,i,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new pe,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,S){return d?new OffscreenCanvas(C,S):$s("canvas")}function _(C,S,z){let Z=1;const oe=me(C);if((oe.width>z||oe.height>z)&&(Z=z/Math.max(oe.width,oe.height)),Z<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const Q=Math.floor(Z*oe.width),Pe=Math.floor(Z*oe.height);u===void 0&&(u=g(Q,Pe));const ye=S?g(Q,Pe):u;return ye.width=Q,ye.height=Pe,ye.getContext("2d").drawImage(C,0,0,Q,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+Q+"x"+Pe+")."),ye}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){s.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function x(C,S,z,Z,oe=!1){if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Q=S;if(S===s.RED&&(z===s.FLOAT&&(Q=s.R32F),z===s.HALF_FLOAT&&(Q=s.R16F),z===s.UNSIGNED_BYTE&&(Q=s.R8)),S===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(Q=s.R8UI),z===s.UNSIGNED_SHORT&&(Q=s.R16UI),z===s.UNSIGNED_INT&&(Q=s.R32UI),z===s.BYTE&&(Q=s.R8I),z===s.SHORT&&(Q=s.R16I),z===s.INT&&(Q=s.R32I)),S===s.RG&&(z===s.FLOAT&&(Q=s.RG32F),z===s.HALF_FLOAT&&(Q=s.RG16F),z===s.UNSIGNED_BYTE&&(Q=s.RG8)),S===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(Q=s.RG8UI),z===s.UNSIGNED_SHORT&&(Q=s.RG16UI),z===s.UNSIGNED_INT&&(Q=s.RG32UI),z===s.BYTE&&(Q=s.RG8I),z===s.SHORT&&(Q=s.RG16I),z===s.INT&&(Q=s.RG32I)),S===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(Q=s.RGB8UI),z===s.UNSIGNED_SHORT&&(Q=s.RGB16UI),z===s.UNSIGNED_INT&&(Q=s.RGB32UI),z===s.BYTE&&(Q=s.RGB8I),z===s.SHORT&&(Q=s.RGB16I),z===s.INT&&(Q=s.RGB32I)),S===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(Q=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(Q=s.RGBA16UI),z===s.UNSIGNED_INT&&(Q=s.RGBA32UI),z===s.BYTE&&(Q=s.RGBA8I),z===s.SHORT&&(Q=s.RGBA16I),z===s.INT&&(Q=s.RGBA32I)),S===s.RGB&&z===s.UNSIGNED_INT_5_9_9_9_REV&&(Q=s.RGB9_E5),S===s.RGBA){const Pe=oe?_o:je.getTransfer(Z);z===s.FLOAT&&(Q=s.RGBA32F),z===s.HALF_FLOAT&&(Q=s.RGBA16F),z===s.UNSIGNED_BYTE&&(Q=Pe===it?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT_4_4_4_4&&(Q=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(Q=s.RGB5_A1)}return(Q===s.R16F||Q===s.R32F||Q===s.RG16F||Q===s.RG32F||Q===s.RGBA16F||Q===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function y(C,S){let z;return C?S===null||S===_i||S===os?z=s.DEPTH24_STENCIL8:S===cn?z=s.DEPTH32F_STENCIL8:S===Xs&&(z=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===_i||S===os?z=s.DEPTH_COMPONENT24:S===cn?z=s.DEPTH_COMPONENT32F:S===Xs&&(z=s.DEPTH_COMPONENT16),z}function I(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==$t&&C.minFilter!==Zt?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function A(C){const S=C.target;S.removeEventListener("dispose",A),w(S),S.isVideoTexture&&h.delete(S)}function R(C){const S=C.target;S.removeEventListener("dispose",R),b(S)}function w(C){const S=n.get(C);if(S.__webglInit===void 0)return;const z=C.source,Z=f.get(z);if(Z){const oe=Z[S.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&M(C),Object.keys(Z).length===0&&f.delete(z)}n.remove(C)}function M(C){const S=n.get(C);s.deleteTexture(S.__webglTexture);const z=C.source,Z=f.get(z);delete Z[S.__cacheKey],o.memory.textures--}function b(C){const S=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let oe=0;oe<S.__webglFramebuffer[Z].length;oe++)s.deleteFramebuffer(S.__webglFramebuffer[Z][oe]);else s.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)s.deleteFramebuffer(S.__webglFramebuffer[Z]);else s.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&s.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&s.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const z=C.textures;for(let Z=0,oe=z.length;Z<oe;Z++){const Q=n.get(z[Z]);Q.__webglTexture&&(s.deleteTexture(Q.__webglTexture),o.memory.textures--),n.remove(z[Z])}n.remove(C)}let P=0;function k(){P=0}function U(){const C=P;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),P+=1,C}function B(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function q(C,S){const z=n.get(C);if(C.isVideoTexture&&ie(C),C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){const Z=C.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{N(z,C,S);return}}t.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+S)}function G(C,S){const z=n.get(C);if(C.version>0&&z.__version!==C.version){N(z,C,S);return}t.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+S)}function J(C,S){const z=n.get(C);if(C.version>0&&z.__version!==C.version){N(z,C,S);return}t.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+S)}function V(C,S){const z=n.get(C);if(C.version>0&&z.__version!==C.version){X(z,C,S);return}t.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+S)}const he={[Ws]:s.REPEAT,[fi]:s.CLAMP_TO_EDGE,[Da]:s.MIRRORED_REPEAT},le={[$t]:s.NEAREST,[wd]:s.NEAREST_MIPMAP_NEAREST,[ir]:s.NEAREST_MIPMAP_LINEAR,[Zt]:s.LINEAR,[Ro]:s.LINEAR_MIPMAP_NEAREST,[di]:s.LINEAR_MIPMAP_LINEAR},xe={[Od]:s.NEVER,[Gd]:s.ALWAYS,[kd]:s.LESS,[pu]:s.LEQUAL,[Fd]:s.EQUAL,[Vd]:s.GEQUAL,[Bd]:s.GREATER,[zd]:s.NOTEQUAL};function Oe(C,S){if(S.type===cn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Zt||S.magFilter===Ro||S.magFilter===ir||S.magFilter===di||S.minFilter===Zt||S.minFilter===Ro||S.minFilter===ir||S.minFilter===di)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,he[S.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,he[S.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,he[S.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,le[S.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,le[S.minFilter]),S.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,xe[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===$t||S.minFilter!==ir&&S.minFilter!==di||S.type===cn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");s.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function re(C,S){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",A));const Z=S.source;let oe=f.get(Z);oe===void 0&&(oe={},f.set(Z,oe));const Q=B(S);if(Q!==C.__cacheKey){oe[Q]===void 0&&(oe[Q]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,z=!0),oe[Q].usedTimes++;const Pe=oe[C.__cacheKey];Pe!==void 0&&(oe[C.__cacheKey].usedTimes--,Pe.usedTimes===0&&M(S)),C.__cacheKey=Q,C.__webglTexture=oe[Q].texture}return z}function N(C,S,z){let Z=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=s.TEXTURE_3D);const oe=re(C,S),Q=S.source;t.bindTexture(Z,C.__webglTexture,s.TEXTURE0+z);const Pe=n.get(Q);if(Q.version!==Pe.__version||oe===!0){t.activeTexture(s.TEXTURE0+z);const ye=je.getPrimaries(je.workingColorSpace),Ee=S.colorSpace===Vn?null:je.getPrimaries(S.colorSpace),Ke=S.colorSpace===Vn||ye===Ee?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let ue=_(S.image,!1,i.maxTextureSize);ue=ce(S,ue);const Ce=r.convert(S.format,S.colorSpace),ke=r.convert(S.type);let Fe=x(S.internalFormat,Ce,ke,S.colorSpace,S.isVideoTexture);Oe(Z,S);let Ae;const Ye=S.mipmaps,We=S.isVideoTexture!==!0,ot=Pe.__version===void 0||oe===!0,D=Q.dataReady,Me=I(S,ue);if(S.isDepthTexture)Fe=y(S.format===as,S.type),ot&&(We?t.texStorage2D(s.TEXTURE_2D,1,Fe,ue.width,ue.height):t.texImage2D(s.TEXTURE_2D,0,Fe,ue.width,ue.height,0,Ce,ke,null));else if(S.isDataTexture)if(Ye.length>0){We&&ot&&t.texStorage2D(s.TEXTURE_2D,Me,Fe,Ye[0].width,Ye[0].height);for(let K=0,se=Ye.length;K<se;K++)Ae=Ye[K],We?D&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,Ae.width,Ae.height,Ce,ke,Ae.data):t.texImage2D(s.TEXTURE_2D,K,Fe,Ae.width,Ae.height,0,Ce,ke,Ae.data);S.generateMipmaps=!1}else We?(ot&&t.texStorage2D(s.TEXTURE_2D,Me,Fe,ue.width,ue.height),D&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ue.width,ue.height,Ce,ke,ue.data)):t.texImage2D(s.TEXTURE_2D,0,Fe,ue.width,ue.height,0,Ce,ke,ue.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){We&&ot&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Me,Fe,Ye[0].width,Ye[0].height,ue.depth);for(let K=0,se=Ye.length;K<se;K++)if(Ae=Ye[K],S.format!==Xt)if(Ce!==null)if(We){if(D)if(S.layerUpdates.size>0){const Te=oh(Ae.width,Ae.height,S.format,S.type);for(const Se of S.layerUpdates){const Ve=Ae.data.subarray(Se*Te/Ae.data.BYTES_PER_ELEMENT,(Se+1)*Te/Ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,Se,Ae.width,Ae.height,1,Ce,Ve)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,Ae.width,Ae.height,ue.depth,Ce,Ae.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,K,Fe,Ae.width,Ae.height,ue.depth,0,Ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?D&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,Ae.width,Ae.height,ue.depth,Ce,ke,Ae.data):t.texImage3D(s.TEXTURE_2D_ARRAY,K,Fe,Ae.width,Ae.height,ue.depth,0,Ce,ke,Ae.data)}else{We&&ot&&t.texStorage2D(s.TEXTURE_2D,Me,Fe,Ye[0].width,Ye[0].height);for(let K=0,se=Ye.length;K<se;K++)Ae=Ye[K],S.format!==Xt?Ce!==null?We?D&&t.compressedTexSubImage2D(s.TEXTURE_2D,K,0,0,Ae.width,Ae.height,Ce,Ae.data):t.compressedTexImage2D(s.TEXTURE_2D,K,Fe,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?D&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,Ae.width,Ae.height,Ce,ke,Ae.data):t.texImage2D(s.TEXTURE_2D,K,Fe,Ae.width,Ae.height,0,Ce,ke,Ae.data)}else if(S.isDataArrayTexture)if(We){if(ot&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Me,Fe,ue.width,ue.height,ue.depth),D)if(S.layerUpdates.size>0){const K=oh(ue.width,ue.height,S.format,S.type);for(const se of S.layerUpdates){const Te=ue.data.subarray(se*K/ue.data.BYTES_PER_ELEMENT,(se+1)*K/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,se,ue.width,ue.height,1,Ce,ke,Te)}S.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,Ce,ke,ue.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Fe,ue.width,ue.height,ue.depth,0,Ce,ke,ue.data);else if(S.isData3DTexture)We?(ot&&t.texStorage3D(s.TEXTURE_3D,Me,Fe,ue.width,ue.height,ue.depth),D&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,Ce,ke,ue.data)):t.texImage3D(s.TEXTURE_3D,0,Fe,ue.width,ue.height,ue.depth,0,Ce,ke,ue.data);else if(S.isFramebufferTexture){if(ot)if(We)t.texStorage2D(s.TEXTURE_2D,Me,Fe,ue.width,ue.height);else{let K=ue.width,se=ue.height;for(let Te=0;Te<Me;Te++)t.texImage2D(s.TEXTURE_2D,Te,Fe,K,se,0,Ce,ke,null),K>>=1,se>>=1}}else if(Ye.length>0){if(We&&ot){const K=me(Ye[0]);t.texStorage2D(s.TEXTURE_2D,Me,Fe,K.width,K.height)}for(let K=0,se=Ye.length;K<se;K++)Ae=Ye[K],We?D&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,Ce,ke,Ae):t.texImage2D(s.TEXTURE_2D,K,Fe,Ce,ke,Ae);S.generateMipmaps=!1}else if(We){if(ot){const K=me(ue);t.texStorage2D(s.TEXTURE_2D,Me,Fe,K.width,K.height)}D&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Ce,ke,ue)}else t.texImage2D(s.TEXTURE_2D,0,Fe,Ce,ke,ue);m(S)&&p(Z),Pe.__version=Q.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function X(C,S,z){if(S.image.length!==6)return;const Z=re(C,S),oe=S.source;t.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+z);const Q=n.get(oe);if(oe.version!==Q.__version||Z===!0){t.activeTexture(s.TEXTURE0+z);const Pe=je.getPrimaries(je.workingColorSpace),ye=S.colorSpace===Vn?null:je.getPrimaries(S.colorSpace),Ee=S.colorSpace===Vn||Pe===ye?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);const Ke=S.isCompressedTexture||S.image[0].isCompressedTexture,ue=S.image[0]&&S.image[0].isDataTexture,Ce=[];for(let se=0;se<6;se++)!Ke&&!ue?Ce[se]=_(S.image[se],!0,i.maxCubemapSize):Ce[se]=ue?S.image[se].image:S.image[se],Ce[se]=ce(S,Ce[se]);const ke=Ce[0],Fe=r.convert(S.format,S.colorSpace),Ae=r.convert(S.type),Ye=x(S.internalFormat,Fe,Ae,S.colorSpace),We=S.isVideoTexture!==!0,ot=Q.__version===void 0||Z===!0,D=oe.dataReady;let Me=I(S,ke);Oe(s.TEXTURE_CUBE_MAP,S);let K;if(Ke){We&&ot&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Me,Ye,ke.width,ke.height);for(let se=0;se<6;se++){K=Ce[se].mipmaps;for(let Te=0;Te<K.length;Te++){const Se=K[Te];S.format!==Xt?Fe!==null?We?D&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Te,0,0,Se.width,Se.height,Fe,Se.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Te,Ye,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?D&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Te,0,0,Se.width,Se.height,Fe,Ae,Se.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Te,Ye,Se.width,Se.height,0,Fe,Ae,Se.data)}}}else{if(K=S.mipmaps,We&&ot){K.length>0&&Me++;const se=me(Ce[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Me,Ye,se.width,se.height)}for(let se=0;se<6;se++)if(ue){We?D&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Ce[se].width,Ce[se].height,Fe,Ae,Ce[se].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ye,Ce[se].width,Ce[se].height,0,Fe,Ae,Ce[se].data);for(let Te=0;Te<K.length;Te++){const Ve=K[Te].image[se].image;We?D&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Te+1,0,0,Ve.width,Ve.height,Fe,Ae,Ve.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Te+1,Ye,Ve.width,Ve.height,0,Fe,Ae,Ve.data)}}else{We?D&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Fe,Ae,Ce[se]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ye,Fe,Ae,Ce[se]);for(let Te=0;Te<K.length;Te++){const Se=K[Te];We?D&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Te+1,0,0,Fe,Ae,Se.image[se]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Te+1,Ye,Fe,Ae,Se.image[se])}}}m(S)&&p(s.TEXTURE_CUBE_MAP),Q.__version=oe.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function ee(C,S,z,Z,oe,Q){const Pe=r.convert(z.format,z.colorSpace),ye=r.convert(z.type),Ee=x(z.internalFormat,Pe,ye,z.colorSpace),Ke=n.get(S),ue=n.get(z);if(ue.__renderTarget=S,!Ke.__hasExternalTextures){const Ce=Math.max(1,S.width>>Q),ke=Math.max(1,S.height>>Q);oe===s.TEXTURE_3D||oe===s.TEXTURE_2D_ARRAY?t.texImage3D(oe,Q,Ee,Ce,ke,S.depth,0,Pe,ye,null):t.texImage2D(oe,Q,Ee,Ce,ke,0,Pe,ye,null)}t.bindFramebuffer(s.FRAMEBUFFER,C),ae(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,oe,ue.__webglTexture,0,$(S)):(oe===s.TEXTURE_2D||oe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Z,oe,ue.__webglTexture,Q),t.bindFramebuffer(s.FRAMEBUFFER,null)}function j(C,S,z){if(s.bindRenderbuffer(s.RENDERBUFFER,C),S.depthBuffer){const Z=S.depthTexture,oe=Z&&Z.isDepthTexture?Z.type:null,Q=y(S.stencilBuffer,oe),Pe=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ye=$(S);ae(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ye,Q,S.width,S.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,ye,Q,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,Q,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Pe,s.RENDERBUFFER,C)}else{const Z=S.textures;for(let oe=0;oe<Z.length;oe++){const Q=Z[oe],Pe=r.convert(Q.format,Q.colorSpace),ye=r.convert(Q.type),Ee=x(Q.internalFormat,Pe,ye,Q.colorSpace),Ke=$(S);z&&ae(S)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ke,Ee,S.width,S.height):ae(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ke,Ee,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,Ee,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function fe(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(S.depthTexture);Z.__renderTarget=S,(!Z.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),q(S.depthTexture,0);const oe=Z.__webglTexture,Q=$(S);if(S.depthTexture.format===Ji)ae(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,oe,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,oe,0);else if(S.depthTexture.format===as)ae(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,oe,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,oe,0);else throw new Error("Unknown depthTexture format")}function _e(C){const S=n.get(C),z=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const Z=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Z){const oe=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Z.removeEventListener("dispose",oe)};Z.addEventListener("dispose",oe),S.__depthDisposeCallback=oe}S.__boundDepthTexture=Z}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");fe(S.__webglFramebuffer,C)}else if(z){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]===void 0)S.__webglDepthbuffer[Z]=s.createRenderbuffer(),j(S.__webglDepthbuffer[Z],C,!1);else{const oe=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Q=S.__webglDepthbuffer[Z];s.bindRenderbuffer(s.RENDERBUFFER,Q),s.framebufferRenderbuffer(s.FRAMEBUFFER,oe,s.RENDERBUFFER,Q)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=s.createRenderbuffer(),j(S.__webglDepthbuffer,C,!1);else{const Z=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,oe=S.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,oe),s.framebufferRenderbuffer(s.FRAMEBUFFER,Z,s.RENDERBUFFER,oe)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function ve(C,S,z){const Z=n.get(C);S!==void 0&&ee(Z.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&_e(C)}function we(C){const S=C.texture,z=n.get(C),Z=n.get(S);C.addEventListener("dispose",R);const oe=C.textures,Q=C.isWebGLCubeRenderTarget===!0,Pe=oe.length>1;if(Pe||(Z.__webglTexture===void 0&&(Z.__webglTexture=s.createTexture()),Z.__version=S.version,o.memory.textures++),Q){z.__webglFramebuffer=[];for(let ye=0;ye<6;ye++)if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[ye]=[];for(let Ee=0;Ee<S.mipmaps.length;Ee++)z.__webglFramebuffer[ye][Ee]=s.createFramebuffer()}else z.__webglFramebuffer[ye]=s.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let ye=0;ye<S.mipmaps.length;ye++)z.__webglFramebuffer[ye]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(Pe)for(let ye=0,Ee=oe.length;ye<Ee;ye++){const Ke=n.get(oe[ye]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&ae(C)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ye=0;ye<oe.length;ye++){const Ee=oe[ye];z.__webglColorRenderbuffer[ye]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[ye]);const Ke=r.convert(Ee.format,Ee.colorSpace),ue=r.convert(Ee.type),Ce=x(Ee.internalFormat,Ke,ue,Ee.colorSpace,C.isXRRenderTarget===!0),ke=$(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,ke,Ce,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,z.__webglColorRenderbuffer[ye])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),j(z.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),Oe(s.TEXTURE_CUBE_MAP,S);for(let ye=0;ye<6;ye++)if(S.mipmaps&&S.mipmaps.length>0)for(let Ee=0;Ee<S.mipmaps.length;Ee++)ee(z.__webglFramebuffer[ye][Ee],C,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ee);else ee(z.__webglFramebuffer[ye],C,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0);m(S)&&p(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let ye=0,Ee=oe.length;ye<Ee;ye++){const Ke=oe[ye],ue=n.get(Ke);t.bindTexture(s.TEXTURE_2D,ue.__webglTexture),Oe(s.TEXTURE_2D,Ke),ee(z.__webglFramebuffer,C,Ke,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,0),m(Ke)&&p(s.TEXTURE_2D)}t.unbindTexture()}else{let ye=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ye=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ye,Z.__webglTexture),Oe(ye,S),S.mipmaps&&S.mipmaps.length>0)for(let Ee=0;Ee<S.mipmaps.length;Ee++)ee(z.__webglFramebuffer[Ee],C,S,s.COLOR_ATTACHMENT0,ye,Ee);else ee(z.__webglFramebuffer,C,S,s.COLOR_ATTACHMENT0,ye,0);m(S)&&p(ye),t.unbindTexture()}C.depthBuffer&&_e(C)}function Y(C){const S=C.textures;for(let z=0,Z=S.length;z<Z;z++){const oe=S[z];if(m(oe)){const Q=v(C),Pe=n.get(oe).__webglTexture;t.bindTexture(Q,Pe),p(Q),t.unbindTexture()}}}const ne=[],T=[];function te(C){if(C.samples>0){if(ae(C)===!1){const S=C.textures,z=C.width,Z=C.height;let oe=s.COLOR_BUFFER_BIT;const Q=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Pe=n.get(C),ye=S.length>1;if(ye)for(let Ee=0;Ee<S.length;Ee++)t.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ee,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ee,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let Ee=0;Ee<S.length;Ee++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(oe|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(oe|=s.STENCIL_BUFFER_BIT)),ye){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ee]);const Ke=n.get(S[Ee]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ke,0)}s.blitFramebuffer(0,0,z,Z,0,0,z,Z,oe,s.NEAREST),c===!0&&(ne.length=0,T.length=0,ne.push(s.COLOR_ATTACHMENT0+Ee),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ne.push(Q),T.push(Q),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,T)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ne))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ye)for(let Ee=0;Ee<S.length;Ee++){t.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ee,s.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ee]);const Ke=n.get(S[Ee]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ee,s.TEXTURE_2D,Ke,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const S=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[S])}}}function $(C){return Math.min(i.maxSamples,C.samples)}function ae(C){const S=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function ie(C){const S=o.render.frame;h.get(C)!==S&&(h.set(C,S),C.update())}function ce(C,S){const z=C.colorSpace,Z=C.format,oe=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==us&&z!==Vn&&(je.getTransfer(z)===it?(Z!==Xt||oe!==wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),S}function me(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=k,this.setTexture2D=q,this.setTexture2DArray=G,this.setTexture3D=J,this.setTextureCube=V,this.rebindTextures=ve,this.setupRenderTarget=we,this.updateRenderTargetMipmap=Y,this.updateMultisampleRenderTarget=te,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=ae}function av(s,e){function t(n,i=Vn){let r;const o=je.getTransfer(i);if(n===wn)return s.UNSIGNED_BYTE;if(n===Pc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Lc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===ou)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===su)return s.BYTE;if(n===ru)return s.SHORT;if(n===Xs)return s.UNSIGNED_SHORT;if(n===wc)return s.INT;if(n===_i)return s.UNSIGNED_INT;if(n===cn)return s.FLOAT;if(n===Zs)return s.HALF_FLOAT;if(n===au)return s.ALPHA;if(n===cu)return s.RGB;if(n===Xt)return s.RGBA;if(n===lu)return s.LUMINANCE;if(n===hu)return s.LUMINANCE_ALPHA;if(n===Ji)return s.DEPTH_COMPONENT;if(n===as)return s.DEPTH_STENCIL;if(n===Ic)return s.RED;if(n===Dc)return s.RED_INTEGER;if(n===uu)return s.RG;if(n===Uc)return s.RG_INTEGER;if(n===Nc)return s.RGBA_INTEGER;if(n===Vr||n===Gr||n===Hr||n===Wr)if(o===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Vr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Vr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Wr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ua||n===Na||n===Oa||n===ka)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ua)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Oa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ka)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fa||n===Ba||n===za)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Fa||n===Ba)return o===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===za)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Va||n===Ga||n===Ha||n===Wa||n===Xa||n===$a||n===qa||n===Ka||n===Ya||n===ja||n===Za||n===Ja||n===Qa||n===ec)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Va)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ga)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ha)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$a)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===qa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ka)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ya)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ja)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Za)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ja)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ec)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Xr||n===tc||n===nc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Xr)return o===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===tc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===nc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===fu||n===ic||n===sc||n===rc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Xr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ic)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===sc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===rc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===os?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class cv extends Ot{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ln extends ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const lv={type:"move"};class na{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ln,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ln,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ln,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(lv)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ln;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const hv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,uv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class fv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Tt,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Zn({vertexShader:hv,fragmentShader:uv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new rt(new vi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dv extends fs{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null;const _=new fv,m=t.getContextAttributes();let p=null,v=null;const x=[],y=[],I=new pe;let A=null;const R=new Ot;R.viewport=new Je;const w=new Ot;w.viewport=new Je;const M=[R,w],b=new cv;let P=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(N){let X=x[N];return X===void 0&&(X=new na,x[N]=X),X.getTargetRaySpace()},this.getControllerGrip=function(N){let X=x[N];return X===void 0&&(X=new na,x[N]=X),X.getGripSpace()},this.getHand=function(N){let X=x[N];return X===void 0&&(X=new na,x[N]=X),X.getHandSpace()};function U(N){const X=y.indexOf(N.inputSource);if(X===-1)return;const ee=x[X];ee!==void 0&&(ee.update(N.inputSource,N.frame,l||o),ee.dispatchEvent({type:N.type,data:N.inputSource}))}function B(){i.removeEventListener("select",U),i.removeEventListener("selectstart",U),i.removeEventListener("selectend",U),i.removeEventListener("squeeze",U),i.removeEventListener("squeezestart",U),i.removeEventListener("squeezeend",U),i.removeEventListener("end",B),i.removeEventListener("inputsourceschange",q);for(let N=0;N<x.length;N++){const X=y[N];X!==null&&(y[N]=null,x[N].disconnect(X))}P=null,k=null,_.reset(),e.setRenderTarget(p),d=null,f=null,u=null,i=null,v=null,re.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(N){r=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(N){a=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(N){l=N},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(N){if(i=N,i!==null){if(p=e.getRenderTarget(),i.addEventListener("select",U),i.addEventListener("selectstart",U),i.addEventListener("selectend",U),i.addEventListener("squeeze",U),i.addEventListener("squeezestart",U),i.addEventListener("squeezeend",U),i.addEventListener("end",B),i.addEventListener("inputsourceschange",q),m.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(I),i.renderState.layers===void 0){const X={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,X),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new jn(d.framebufferWidth,d.framebufferHeight,{format:Xt,type:wn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let X=null,ee=null,j=null;m.depth&&(j=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,X=m.stencil?as:Ji,ee=m.stencil?os:_i);const fe={colorFormat:t.RGBA8,depthFormat:j,scaleFactor:r};u=new XRWebGLBinding(i,t),f=u.createProjectionLayer(fe),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new jn(f.textureWidth,f.textureHeight,{format:Xt,type:wn,depthTexture:new Au(f.textureWidth,f.textureHeight,ee,void 0,void 0,void 0,void 0,void 0,void 0,X),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),re.setContext(i),re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function q(N){for(let X=0;X<N.removed.length;X++){const ee=N.removed[X],j=y.indexOf(ee);j>=0&&(y[j]=null,x[j].disconnect(ee))}for(let X=0;X<N.added.length;X++){const ee=N.added[X];let j=y.indexOf(ee);if(j===-1){for(let _e=0;_e<x.length;_e++)if(_e>=y.length){y.push(ee),j=_e;break}else if(y[_e]===null){y[_e]=ee,j=_e;break}if(j===-1)break}const fe=x[j];fe&&fe.connect(ee)}}const G=new L,J=new L;function V(N,X,ee){G.setFromMatrixPosition(X.matrixWorld),J.setFromMatrixPosition(ee.matrixWorld);const j=G.distanceTo(J),fe=X.projectionMatrix.elements,_e=ee.projectionMatrix.elements,ve=fe[14]/(fe[10]-1),we=fe[14]/(fe[10]+1),Y=(fe[9]+1)/fe[5],ne=(fe[9]-1)/fe[5],T=(fe[8]-1)/fe[0],te=(_e[8]+1)/_e[0],$=ve*T,ae=ve*te,ie=j/(-T+te),ce=ie*-T;if(X.matrixWorld.decompose(N.position,N.quaternion,N.scale),N.translateX(ce),N.translateZ(ie),N.matrixWorld.compose(N.position,N.quaternion,N.scale),N.matrixWorldInverse.copy(N.matrixWorld).invert(),fe[10]===-1)N.projectionMatrix.copy(X.projectionMatrix),N.projectionMatrixInverse.copy(X.projectionMatrixInverse);else{const me=ve+ie,C=we+ie,S=$-ce,z=ae+(j-ce),Z=Y*we/C*me,oe=ne*we/C*me;N.projectionMatrix.makePerspective(S,z,Z,oe,me,C),N.projectionMatrixInverse.copy(N.projectionMatrix).invert()}}function he(N,X){X===null?N.matrixWorld.copy(N.matrix):N.matrixWorld.multiplyMatrices(X.matrixWorld,N.matrix),N.matrixWorldInverse.copy(N.matrixWorld).invert()}this.updateCamera=function(N){if(i===null)return;let X=N.near,ee=N.far;_.texture!==null&&(_.depthNear>0&&(X=_.depthNear),_.depthFar>0&&(ee=_.depthFar)),b.near=w.near=R.near=X,b.far=w.far=R.far=ee,(P!==b.near||k!==b.far)&&(i.updateRenderState({depthNear:b.near,depthFar:b.far}),P=b.near,k=b.far),R.layers.mask=N.layers.mask|2,w.layers.mask=N.layers.mask|4,b.layers.mask=R.layers.mask|w.layers.mask;const j=N.parent,fe=b.cameras;he(b,j);for(let _e=0;_e<fe.length;_e++)he(fe[_e],j);fe.length===2?V(b,R,w):b.projectionMatrix.copy(R.projectionMatrix),le(N,b,j)};function le(N,X,ee){ee===null?N.matrix.copy(X.matrixWorld):(N.matrix.copy(ee.matrixWorld),N.matrix.invert(),N.matrix.multiply(X.matrixWorld)),N.matrix.decompose(N.position,N.quaternion,N.scale),N.updateMatrixWorld(!0),N.projectionMatrix.copy(X.projectionMatrix),N.projectionMatrixInverse.copy(X.projectionMatrixInverse),N.isPerspectiveCamera&&(N.fov=cs*2*Math.atan(1/N.projectionMatrix.elements[5]),N.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(N){c=N,f!==null&&(f.fixedFoveation=N),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=N)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(b)};let xe=null;function Oe(N,X){if(h=X.getViewerPose(l||o),g=X,h!==null){const ee=h.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let j=!1;ee.length!==b.cameras.length&&(b.cameras.length=0,j=!0);for(let _e=0;_e<ee.length;_e++){const ve=ee[_e];let we=null;if(d!==null)we=d.getViewport(ve);else{const ne=u.getViewSubImage(f,ve);we=ne.viewport,_e===0&&(e.setRenderTargetTextures(v,ne.colorTexture,f.ignoreDepthValues?void 0:ne.depthStencilTexture),e.setRenderTarget(v))}let Y=M[_e];Y===void 0&&(Y=new Ot,Y.layers.enable(_e),Y.viewport=new Je,M[_e]=Y),Y.matrix.fromArray(ve.transform.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.projectionMatrix.fromArray(ve.projectionMatrix),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert(),Y.viewport.set(we.x,we.y,we.width,we.height),_e===0&&(b.matrix.copy(Y.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),j===!0&&b.cameras.push(Y)}const fe=i.enabledFeatures;if(fe&&fe.includes("depth-sensing")){const _e=u.getDepthInformation(ee[0]);_e&&_e.isValid&&_e.texture&&_.init(e,_e,i.renderState)}}for(let ee=0;ee<x.length;ee++){const j=y[ee],fe=x[ee];j!==null&&fe!==void 0&&fe.update(j,X,l||o)}xe&&xe(N,X),X.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:X}),g=null}const re=new Eu;re.setAnimationLoop(Oe),this.setAnimationLoop=function(N){xe=N},this.dispose=function(){}}}const oi=new hn,pv=new qe;function mv(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Su(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,v,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,v,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Vt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Vt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=e.get(p),x=v.envMap,y=v.envMapRotation;x&&(m.envMap.value=x,oi.copy(y),oi.x*=-1,oi.y*=-1,oi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),m.envMapRotation.value.setFromMatrix4(pv.makeRotationFromEuler(oi)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,v,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=x*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Vt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const v=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function gv(s,e,t,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,x){const y=x.program;n.uniformBlockBinding(v,y)}function l(v,x){let y=i[v.id];y===void 0&&(g(v),y=h(v),i[v.id]=y,v.addEventListener("dispose",m));const I=x.program;n.updateUBOMapping(v,I);const A=e.render.frame;r[v.id]!==A&&(f(v),r[v.id]=A)}function h(v){const x=u();v.__bindingPointIndex=x;const y=s.createBuffer(),I=v.__size,A=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,I,A),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,x,y),y}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const x=i[v.id],y=v.uniforms,I=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,x);for(let A=0,R=y.length;A<R;A++){const w=Array.isArray(y[A])?y[A]:[y[A]];for(let M=0,b=w.length;M<b;M++){const P=w[M];if(d(P,A,M,I)===!0){const k=P.__offset,U=Array.isArray(P.value)?P.value:[P.value];let B=0;for(let q=0;q<U.length;q++){const G=U[q],J=_(G);typeof G=="number"||typeof G=="boolean"?(P.__data[0]=G,s.bufferSubData(s.UNIFORM_BUFFER,k+B,P.__data)):G.isMatrix3?(P.__data[0]=G.elements[0],P.__data[1]=G.elements[1],P.__data[2]=G.elements[2],P.__data[3]=0,P.__data[4]=G.elements[3],P.__data[5]=G.elements[4],P.__data[6]=G.elements[5],P.__data[7]=0,P.__data[8]=G.elements[6],P.__data[9]=G.elements[7],P.__data[10]=G.elements[8],P.__data[11]=0):(G.toArray(P.__data,B),B+=J.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,k,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(v,x,y,I){const A=v.value,R=x+"_"+y;if(I[R]===void 0)return typeof A=="number"||typeof A=="boolean"?I[R]=A:I[R]=A.clone(),!0;{const w=I[R];if(typeof A=="number"||typeof A=="boolean"){if(w!==A)return I[R]=A,!0}else if(w.equals(A)===!1)return w.copy(A),!0}return!1}function g(v){const x=v.uniforms;let y=0;const I=16;for(let R=0,w=x.length;R<w;R++){const M=Array.isArray(x[R])?x[R]:[x[R]];for(let b=0,P=M.length;b<P;b++){const k=M[b],U=Array.isArray(k.value)?k.value:[k.value];for(let B=0,q=U.length;B<q;B++){const G=U[B],J=_(G),V=y%I,he=V%J.boundary,le=V+he;y+=he,le!==0&&I-le<J.storage&&(y+=I-le),k.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=J.storage}}}const A=y%I;return A>0&&(y+=I-A),v.__size=y,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),s.deleteBuffer(i[x.id]),delete i[x.id],delete r[x.id]}function p(){for(const v in i)s.deleteBuffer(i[v]);o=[],i={},r={}}return{bind:c,update:l,dispose:p}}class _v{constructor(e={}){const{canvas:t=rp(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const v=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Mt,this.toneMapping=$n,this.toneMappingExposure=1;const y=this;let I=!1,A=0,R=0,w=null,M=-1,b=null;const P=new Je,k=new Je;let U=null;const B=new $e(0);let q=0,G=t.width,J=t.height,V=1,he=null,le=null;const xe=new Je(0,0,G,J),Oe=new Je(0,0,G,J);let re=!1;const N=new kc;let X=!1,ee=!1;const j=new qe,fe=new qe,_e=new L,ve=new Je,we={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Y=!1;function ne(){return w===null?V:1}let T=n;function te(E,O){return t.getContext(E,O)}try{const E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Rc}`),t.addEventListener("webglcontextlost",se,!1),t.addEventListener("webglcontextrestored",Te,!1),t.addEventListener("webglcontextcreationerror",Se,!1),T===null){const O="webgl2";if(T=te(O,E),T===null)throw te(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let $,ae,ie,ce,me,C,S,z,Z,oe,Q,Pe,ye,Ee,Ke,ue,Ce,ke,Fe,Ae,Ye,We,ot,D;function Me(){$=new Sg(T),$.init(),We=new av(T,$),ae=new gg(T,$,e,We),ie=new sv(T,$),ae.reverseDepthBuffer&&f&&ie.buffers.depth.setReversed(!0),ce=new Eg(T),me=new H_,C=new ov(T,$,ie,me,ae,We,ce),S=new vg(y),z=new Mg(y),Z=new Ip(T),ot=new pg(T,Z),oe=new bg(T,Z,ce,ot),Q=new Ag(T,oe,Z,ce),Fe=new Cg(T,ae,C),ue=new _g(me),Pe=new G_(y,S,z,$,ae,ot,ue),ye=new mv(y,me),Ee=new X_,Ke=new Z_($),ke=new dg(y,S,z,ie,Q,d,c),Ce=new nv(y,Q,ae),D=new gv(T,ce,ae,ie),Ae=new mg(T,$,ce),Ye=new Tg(T,$,ce),ce.programs=Pe.programs,y.capabilities=ae,y.extensions=$,y.properties=me,y.renderLists=Ee,y.shadowMap=Ce,y.state=ie,y.info=ce}Me();const K=new dv(y,T);this.xr=K,this.getContext=function(){return T},this.getContextAttributes=function(){return T.getContextAttributes()},this.forceContextLoss=function(){const E=$.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=$.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(E){E!==void 0&&(V=E,this.setSize(G,J,!1))},this.getSize=function(E){return E.set(G,J)},this.setSize=function(E,O,H=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=E,J=O,t.width=Math.floor(E*V),t.height=Math.floor(O*V),H===!0&&(t.style.width=E+"px",t.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(G*V,J*V).floor()},this.setDrawingBufferSize=function(E,O,H){G=E,J=O,V=H,t.width=Math.floor(E*H),t.height=Math.floor(O*H),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(P)},this.getViewport=function(E){return E.copy(xe)},this.setViewport=function(E,O,H,W){E.isVector4?xe.set(E.x,E.y,E.z,E.w):xe.set(E,O,H,W),ie.viewport(P.copy(xe).multiplyScalar(V).round())},this.getScissor=function(E){return E.copy(Oe)},this.setScissor=function(E,O,H,W){E.isVector4?Oe.set(E.x,E.y,E.z,E.w):Oe.set(E,O,H,W),ie.scissor(k.copy(Oe).multiplyScalar(V).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(E){ie.setScissorTest(re=E)},this.setOpaqueSort=function(E){he=E},this.setTransparentSort=function(E){le=E},this.getClearColor=function(E){return E.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor.apply(ke,arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha.apply(ke,arguments)},this.clear=function(E=!0,O=!0,H=!0){let W=0;if(E){let F=!1;if(w!==null){const de=w.texture.format;F=de===Nc||de===Uc||de===Dc}if(F){const de=w.texture.type,be=de===wn||de===_i||de===Xs||de===os||de===Pc||de===Lc,Le=ke.getClearColor(),Ie=ke.getClearAlpha(),Be=Le.r,Ge=Le.g,De=Le.b;be?(g[0]=Be,g[1]=Ge,g[2]=De,g[3]=Ie,T.clearBufferuiv(T.COLOR,0,g)):(_[0]=Be,_[1]=Ge,_[2]=De,_[3]=Ie,T.clearBufferiv(T.COLOR,0,_))}else W|=T.COLOR_BUFFER_BIT}O&&(W|=T.DEPTH_BUFFER_BIT),H&&(W|=T.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),T.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",se,!1),t.removeEventListener("webglcontextrestored",Te,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),Ee.dispose(),Ke.dispose(),me.dispose(),S.dispose(),z.dispose(),Q.dispose(),ot.dispose(),D.dispose(),Pe.dispose(),K.dispose(),K.removeEventListener("sessionstart",Zc),K.removeEventListener("sessionend",Jc),ei.stop()};function se(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function Te(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const E=ce.autoReset,O=Ce.enabled,H=Ce.autoUpdate,W=Ce.needsUpdate,F=Ce.type;Me(),ce.autoReset=E,Ce.enabled=O,Ce.autoUpdate=H,Ce.needsUpdate=W,Ce.type=F}function Se(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ve(E){const O=E.target;O.removeEventListener("dispose",Ve),dt(O)}function dt(E){Et(E),me.remove(E)}function Et(E){const O=me.get(E).programs;O!==void 0&&(O.forEach(function(H){Pe.releaseProgram(H)}),E.isShaderMaterial&&Pe.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,H,W,F,de){O===null&&(O=we);const be=F.isMesh&&F.matrixWorld.determinant()<0,Le=$f(E,O,H,W,F);ie.setMaterial(W,be);let Ie=H.index,Be=1;if(W.wireframe===!0){if(Ie=oe.getWireframeAttribute(H),Ie===void 0)return;Be=2}const Ge=H.drawRange,De=H.attributes.position;let Ze=Ge.start*Be,at=(Ge.start+Ge.count)*Be;de!==null&&(Ze=Math.max(Ze,de.start*Be),at=Math.min(at,(de.start+de.count)*Be)),Ie!==null?(Ze=Math.max(Ze,0),at=Math.min(at,Ie.count)):De!=null&&(Ze=Math.max(Ze,0),at=Math.min(at,De.count));const ct=at-Ze;if(ct<0||ct===1/0)return;ot.setup(F,W,Le,H,Ie);let Bt,Qe=Ae;if(Ie!==null&&(Bt=Z.get(Ie),Qe=Ye,Qe.setIndex(Bt)),F.isMesh)W.wireframe===!0?(ie.setLineWidth(W.wireframeLinewidth*ne()),Qe.setMode(T.LINES)):Qe.setMode(T.TRIANGLES);else if(F.isLine){let Ne=W.linewidth;Ne===void 0&&(Ne=1),ie.setLineWidth(Ne*ne()),F.isLineSegments?Qe.setMode(T.LINES):F.isLineLoop?Qe.setMode(T.LINE_LOOP):Qe.setMode(T.LINE_STRIP)}else F.isPoints?Qe.setMode(T.POINTS):F.isSprite&&Qe.setMode(T.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Qe.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if($.get("WEBGL_multi_draw"))Qe.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Ne=F._multiDrawStarts,_n=F._multiDrawCounts,et=F._multiDrawCount,en=Ie?Z.get(Ie).bytesPerElement:1,Ti=me.get(W).currentProgram.getUniforms();for(let Gt=0;Gt<et;Gt++)Ti.setValue(T,"_gl_DrawID",Gt),Qe.render(Ne[Gt]/en,_n[Gt])}else if(F.isInstancedMesh)Qe.renderInstances(Ze,ct,F.count);else if(H.isInstancedBufferGeometry){const Ne=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,_n=Math.min(H.instanceCount,Ne);Qe.renderInstances(Ze,ct,_n)}else Qe.render(Ze,ct)};function tt(E,O,H){E.transparent===!0&&E.side===En&&E.forceSinglePass===!1?(E.side=Vt,E.needsUpdate=!0,nr(E,O,H),E.side=Yn,E.needsUpdate=!0,nr(E,O,H),E.side=En):nr(E,O,H)}this.compile=function(E,O,H=null){H===null&&(H=E),p=Ke.get(H),p.init(O),x.push(p),H.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),E!==H&&E.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),p.setupLights();const W=new Set;return E.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const de=F.material;if(de)if(Array.isArray(de))for(let be=0;be<de.length;be++){const Le=de[be];tt(Le,H,F),W.add(Le)}else tt(de,H,F),W.add(de)}),x.pop(),p=null,W},this.compileAsync=function(E,O,H=null){const W=this.compile(E,O,H);return new Promise(F=>{function de(){if(W.forEach(function(be){me.get(be).currentProgram.isReady()&&W.delete(be)}),W.size===0){F(E);return}setTimeout(de,10)}$.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Qt=null;function gn(E){Qt&&Qt(E)}function Zc(){ei.stop()}function Jc(){ei.start()}const ei=new Eu;ei.setAnimationLoop(gn),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(E){Qt=E,K.setAnimationLoop(E),E===null?ei.stop():ei.start()},K.addEventListener("sessionstart",Zc),K.addEventListener("sessionend",Jc),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera(O),O=K.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,O,w),p=Ke.get(E,x.length),p.init(O),x.push(p),fe.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),N.setFromProjectionMatrix(fe),ee=this.localClippingEnabled,X=ue.init(this.clippingPlanes,ee),m=Ee.get(E,v.length),m.init(),v.push(m),K.enabled===!0&&K.isPresenting===!0){const de=y.xr.getDepthSensingMesh();de!==null&&Co(de,O,-1/0,y.sortObjects)}Co(E,O,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(he,le),Y=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,Y&&ke.addToRenderList(m,E),this.info.render.frame++,X===!0&&ue.beginShadows();const H=p.state.shadowsArray;Ce.render(H,E,O),X===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,F=m.transmissive;if(p.setupLights(),O.isArrayCamera){const de=O.cameras;if(F.length>0)for(let be=0,Le=de.length;be<Le;be++){const Ie=de[be];el(W,F,E,Ie)}Y&&ke.render(E);for(let be=0,Le=de.length;be<Le;be++){const Ie=de[be];Qc(m,E,Ie,Ie.viewport)}}else F.length>0&&el(W,F,E,O),Y&&ke.render(E),Qc(m,E,O);w!==null&&(C.updateMultisampleRenderTarget(w),C.updateRenderTargetMipmap(w)),E.isScene===!0&&E.onAfterRender(y,E,O),ot.resetDefaultState(),M=-1,b=null,x.pop(),x.length>0?(p=x[x.length-1],X===!0&&ue.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function Co(E,O,H,W){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||N.intersectsSprite(E)){W&&ve.setFromMatrixPosition(E.matrixWorld).applyMatrix4(fe);const be=Q.update(E),Le=E.material;Le.visible&&m.push(E,be,Le,H,ve.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||N.intersectsObject(E))){const be=Q.update(E),Le=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ve.copy(E.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),ve.copy(be.boundingSphere.center)),ve.applyMatrix4(E.matrixWorld).applyMatrix4(fe)),Array.isArray(Le)){const Ie=be.groups;for(let Be=0,Ge=Ie.length;Be<Ge;Be++){const De=Ie[Be],Ze=Le[De.materialIndex];Ze&&Ze.visible&&m.push(E,be,Ze,H,ve.z,De)}}else Le.visible&&m.push(E,be,Le,H,ve.z,null)}}const de=E.children;for(let be=0,Le=de.length;be<Le;be++)Co(de[be],O,H,W)}function Qc(E,O,H,W){const F=E.opaque,de=E.transmissive,be=E.transparent;p.setupLightsView(H),X===!0&&ue.setGlobalState(y.clippingPlanes,H),W&&ie.viewport(P.copy(W)),F.length>0&&tr(F,O,H),de.length>0&&tr(de,O,H),be.length>0&&tr(be,O,H),ie.buffers.depth.setTest(!0),ie.buffers.depth.setMask(!0),ie.buffers.color.setMask(!0),ie.setPolygonOffset(!1)}function el(E,O,H,W){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[W.id]===void 0&&(p.state.transmissionRenderTarget[W.id]=new jn(1,1,{generateMipmaps:!0,type:$.has("EXT_color_buffer_half_float")||$.has("EXT_color_buffer_float")?Zs:wn,minFilter:di,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace}));const de=p.state.transmissionRenderTarget[W.id],be=W.viewport||P;de.setSize(be.z,be.w);const Le=y.getRenderTarget();y.setRenderTarget(de),y.getClearColor(B),q=y.getClearAlpha(),q<1&&y.setClearColor(16777215,.5),y.clear(),Y&&ke.render(H);const Ie=y.toneMapping;y.toneMapping=$n;const Be=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),p.setupLightsView(W),X===!0&&ue.setGlobalState(y.clippingPlanes,W),tr(E,H,W),C.updateMultisampleRenderTarget(de),C.updateRenderTargetMipmap(de),$.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let De=0,Ze=O.length;De<Ze;De++){const at=O[De],ct=at.object,Bt=at.geometry,Qe=at.material,Ne=at.group;if(Qe.side===En&&ct.layers.test(W.layers)){const _n=Qe.side;Qe.side=Vt,Qe.needsUpdate=!0,tl(ct,H,W,Bt,Qe,Ne),Qe.side=_n,Qe.needsUpdate=!0,Ge=!0}}Ge===!0&&(C.updateMultisampleRenderTarget(de),C.updateRenderTargetMipmap(de))}y.setRenderTarget(Le),y.setClearColor(B,q),Be!==void 0&&(W.viewport=Be),y.toneMapping=Ie}function tr(E,O,H){const W=O.isScene===!0?O.overrideMaterial:null;for(let F=0,de=E.length;F<de;F++){const be=E[F],Le=be.object,Ie=be.geometry,Be=W===null?be.material:W,Ge=be.group;Le.layers.test(H.layers)&&tl(Le,O,H,Ie,Be,Ge)}}function tl(E,O,H,W,F,de){E.onBeforeRender(y,O,H,W,F,de),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),F.onBeforeRender(y,O,H,W,E,de),F.transparent===!0&&F.side===En&&F.forceSinglePass===!1?(F.side=Vt,F.needsUpdate=!0,y.renderBufferDirect(H,O,W,F,E,de),F.side=Yn,F.needsUpdate=!0,y.renderBufferDirect(H,O,W,F,E,de),F.side=En):y.renderBufferDirect(H,O,W,F,E,de),E.onAfterRender(y,O,H,W,F,de)}function nr(E,O,H){O.isScene!==!0&&(O=we);const W=me.get(E),F=p.state.lights,de=p.state.shadowsArray,be=F.state.version,Le=Pe.getParameters(E,F.state,de,O,H),Ie=Pe.getProgramCacheKey(Le);let Be=W.programs;W.environment=E.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(E.isMeshStandardMaterial?z:S).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Be===void 0&&(E.addEventListener("dispose",Ve),Be=new Map,W.programs=Be);let Ge=Be.get(Ie);if(Ge!==void 0){if(W.currentProgram===Ge&&W.lightsStateVersion===be)return il(E,Le),Ge}else Le.uniforms=Pe.getUniforms(E),E.onBeforeCompile(Le,y),Ge=Pe.acquireProgram(Le,Ie),Be.set(Ie,Ge),W.uniforms=Le.uniforms;const De=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(De.clippingPlanes=ue.uniform),il(E,Le),W.needsLights=Kf(E),W.lightsStateVersion=be,W.needsLights&&(De.ambientLightColor.value=F.state.ambient,De.lightProbe.value=F.state.probe,De.directionalLights.value=F.state.directional,De.directionalLightShadows.value=F.state.directionalShadow,De.spotLights.value=F.state.spot,De.spotLightShadows.value=F.state.spotShadow,De.rectAreaLights.value=F.state.rectArea,De.ltc_1.value=F.state.rectAreaLTC1,De.ltc_2.value=F.state.rectAreaLTC2,De.pointLights.value=F.state.point,De.pointLightShadows.value=F.state.pointShadow,De.hemisphereLights.value=F.state.hemi,De.directionalShadowMap.value=F.state.directionalShadowMap,De.directionalShadowMatrix.value=F.state.directionalShadowMatrix,De.spotShadowMap.value=F.state.spotShadowMap,De.spotLightMatrix.value=F.state.spotLightMatrix,De.spotLightMap.value=F.state.spotLightMap,De.pointShadowMap.value=F.state.pointShadowMap,De.pointShadowMatrix.value=F.state.pointShadowMatrix),W.currentProgram=Ge,W.uniformsList=null,Ge}function nl(E){if(E.uniformsList===null){const O=E.currentProgram.getUniforms();E.uniformsList=$r.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function il(E,O){const H=me.get(E);H.outputColorSpace=O.outputColorSpace,H.batching=O.batching,H.batchingColor=O.batchingColor,H.instancing=O.instancing,H.instancingColor=O.instancingColor,H.instancingMorph=O.instancingMorph,H.skinning=O.skinning,H.morphTargets=O.morphTargets,H.morphNormals=O.morphNormals,H.morphColors=O.morphColors,H.morphTargetsCount=O.morphTargetsCount,H.numClippingPlanes=O.numClippingPlanes,H.numIntersection=O.numClipIntersection,H.vertexAlphas=O.vertexAlphas,H.vertexTangents=O.vertexTangents,H.toneMapping=O.toneMapping}function $f(E,O,H,W,F){O.isScene!==!0&&(O=we),C.resetTextureUnits();const de=O.fog,be=W.isMeshStandardMaterial?O.environment:null,Le=w===null?y.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:us,Ie=(W.isMeshStandardMaterial?z:S).get(W.envMap||be),Be=W.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Ge=!!H.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),De=!!H.morphAttributes.position,Ze=!!H.morphAttributes.normal,at=!!H.morphAttributes.color;let ct=$n;W.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(ct=y.toneMapping);const Bt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Qe=Bt!==void 0?Bt.length:0,Ne=me.get(W),_n=p.state.lights;if(X===!0&&(ee===!0||E!==b)){const qt=E===b&&W.id===M;ue.setState(W,E,qt)}let et=!1;W.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==_n.state.version||Ne.outputColorSpace!==Le||F.isBatchedMesh&&Ne.batching===!1||!F.isBatchedMesh&&Ne.batching===!0||F.isBatchedMesh&&Ne.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Ne.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Ne.instancing===!1||!F.isInstancedMesh&&Ne.instancing===!0||F.isSkinnedMesh&&Ne.skinning===!1||!F.isSkinnedMesh&&Ne.skinning===!0||F.isInstancedMesh&&Ne.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Ne.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Ne.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Ne.instancingMorph===!1&&F.morphTexture!==null||Ne.envMap!==Ie||W.fog===!0&&Ne.fog!==de||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==ue.numPlanes||Ne.numIntersection!==ue.numIntersection)||Ne.vertexAlphas!==Be||Ne.vertexTangents!==Ge||Ne.morphTargets!==De||Ne.morphNormals!==Ze||Ne.morphColors!==at||Ne.toneMapping!==ct||Ne.morphTargetsCount!==Qe)&&(et=!0):(et=!0,Ne.__version=W.version);let en=Ne.currentProgram;et===!0&&(en=nr(W,O,F));let Ti=!1,Gt=!1,gs=!1;const lt=en.getUniforms(),un=Ne.uniforms;if(ie.useProgram(en.program)&&(Ti=!0,Gt=!0,gs=!0),W.id!==M&&(M=W.id,Gt=!0),Ti||b!==E){ie.buffers.depth.getReversed()?(j.copy(E.projectionMatrix),ap(j),cp(j),lt.setValue(T,"projectionMatrix",j)):lt.setValue(T,"projectionMatrix",E.projectionMatrix),lt.setValue(T,"viewMatrix",E.matrixWorldInverse);const Ln=lt.map.cameraPosition;Ln!==void 0&&Ln.setValue(T,_e.setFromMatrixPosition(E.matrixWorld)),ae.logarithmicDepthBuffer&&lt.setValue(T,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&lt.setValue(T,"isOrthographic",E.isOrthographicCamera===!0),b!==E&&(b=E,Gt=!0,gs=!0)}if(F.isSkinnedMesh){lt.setOptional(T,F,"bindMatrix"),lt.setOptional(T,F,"bindMatrixInverse");const qt=F.skeleton;qt&&(qt.boneTexture===null&&qt.computeBoneTexture(),lt.setValue(T,"boneTexture",qt.boneTexture,C))}F.isBatchedMesh&&(lt.setOptional(T,F,"batchingTexture"),lt.setValue(T,"batchingTexture",F._matricesTexture,C),lt.setOptional(T,F,"batchingIdTexture"),lt.setValue(T,"batchingIdTexture",F._indirectTexture,C),lt.setOptional(T,F,"batchingColorTexture"),F._colorsTexture!==null&&lt.setValue(T,"batchingColorTexture",F._colorsTexture,C));const _s=H.morphAttributes;if((_s.position!==void 0||_s.normal!==void 0||_s.color!==void 0)&&Fe.update(F,H,en),(Gt||Ne.receiveShadow!==F.receiveShadow)&&(Ne.receiveShadow=F.receiveShadow,lt.setValue(T,"receiveShadow",F.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(un.envMap.value=Ie,un.flipEnvMap.value=Ie.isCubeTexture&&Ie.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&O.environment!==null&&(un.envMapIntensity.value=O.environmentIntensity),Gt&&(lt.setValue(T,"toneMappingExposure",y.toneMappingExposure),Ne.needsLights&&qf(un,gs),de&&W.fog===!0&&ye.refreshFogUniforms(un,de),ye.refreshMaterialUniforms(un,W,V,J,p.state.transmissionRenderTarget[E.id]),$r.upload(T,nl(Ne),un,C)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&($r.upload(T,nl(Ne),un,C),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&lt.setValue(T,"center",F.center),lt.setValue(T,"modelViewMatrix",F.modelViewMatrix),lt.setValue(T,"normalMatrix",F.normalMatrix),lt.setValue(T,"modelMatrix",F.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const qt=W.uniformsGroups;for(let Ln=0,In=qt.length;Ln<In;Ln++){const sl=qt[Ln];D.update(sl,en),D.bind(sl,en)}}return en}function qf(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function Kf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(E,O,H){me.get(E.texture).__webglTexture=O,me.get(E.depthTexture).__webglTexture=H;const W=me.get(E);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=H===void 0,W.__autoAllocateDepthBuffer||$.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,O){const H=me.get(E);H.__webglFramebuffer=O,H.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(E,O=0,H=0){w=E,A=O,R=H;let W=!0,F=null,de=!1,be=!1;if(E){const Ie=me.get(E);if(Ie.__useDefaultFramebuffer!==void 0)ie.bindFramebuffer(T.FRAMEBUFFER,null),W=!1;else if(Ie.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(Ie.__hasExternalTextures)C.rebindTextures(E,me.get(E.texture).__webglTexture,me.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const De=E.depthTexture;if(Ie.__boundDepthTexture!==De){if(De!==null&&me.has(De)&&(E.width!==De.image.width||E.height!==De.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}const Be=E.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(be=!0);const Ge=me.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ge[O])?F=Ge[O][H]:F=Ge[O],de=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?F=me.get(E).__webglMultisampledFramebuffer:Array.isArray(Ge)?F=Ge[H]:F=Ge,P.copy(E.viewport),k.copy(E.scissor),U=E.scissorTest}else P.copy(xe).multiplyScalar(V).floor(),k.copy(Oe).multiplyScalar(V).floor(),U=re;if(ie.bindFramebuffer(T.FRAMEBUFFER,F)&&W&&ie.drawBuffers(E,F),ie.viewport(P),ie.scissor(k),ie.setScissorTest(U),de){const Ie=me.get(E.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ie.__webglTexture,H)}else if(be){const Ie=me.get(E.texture),Be=O||0;T.framebufferTextureLayer(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,Ie.__webglTexture,H||0,Be)}M=-1},this.readRenderTargetPixels=function(E,O,H,W,F,de,be){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Le=me.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&be!==void 0&&(Le=Le[be]),Le){ie.bindFramebuffer(T.FRAMEBUFFER,Le);try{const Ie=E.texture,Be=Ie.format,Ge=Ie.type;if(!ae.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ae.textureTypeReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-W&&H>=0&&H<=E.height-F&&T.readPixels(O,H,W,F,We.convert(Be),We.convert(Ge),de)}finally{const Ie=w!==null?me.get(w).__webglFramebuffer:null;ie.bindFramebuffer(T.FRAMEBUFFER,Ie)}}},this.readRenderTargetPixelsAsync=async function(E,O,H,W,F,de,be){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Le=me.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&be!==void 0&&(Le=Le[be]),Le){const Ie=E.texture,Be=Ie.format,Ge=Ie.type;if(!ae.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ae.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=E.width-W&&H>=0&&H<=E.height-F){ie.bindFramebuffer(T.FRAMEBUFFER,Le);const De=T.createBuffer();T.bindBuffer(T.PIXEL_PACK_BUFFER,De),T.bufferData(T.PIXEL_PACK_BUFFER,de.byteLength,T.STREAM_READ),T.readPixels(O,H,W,F,We.convert(Be),We.convert(Ge),0);const Ze=w!==null?me.get(w).__webglFramebuffer:null;ie.bindFramebuffer(T.FRAMEBUFFER,Ze);const at=T.fenceSync(T.SYNC_GPU_COMMANDS_COMPLETE,0);return T.flush(),await op(T,at,4),T.bindBuffer(T.PIXEL_PACK_BUFFER,De),T.getBufferSubData(T.PIXEL_PACK_BUFFER,0,de),T.deleteBuffer(De),T.deleteSync(at),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,O=null,H=0){E.isTexture!==!0&&(Is("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,E=arguments[1]);const W=Math.pow(2,-H),F=Math.floor(E.image.width*W),de=Math.floor(E.image.height*W),be=O!==null?O.x:0,Le=O!==null?O.y:0;C.setTexture2D(E,0),T.copyTexSubImage2D(T.TEXTURE_2D,H,0,0,be,Le,F,de),ie.unbindTexture()},this.copyTextureToTexture=function(E,O,H=null,W=null,F=0){E.isTexture!==!0&&(Is("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,E=arguments[1],O=arguments[2],F=arguments[3]||0,H=null);let de,be,Le,Ie,Be,Ge,De,Ze,at;const ct=E.isCompressedTexture?E.mipmaps[F]:E.image;H!==null?(de=H.max.x-H.min.x,be=H.max.y-H.min.y,Le=H.isBox3?H.max.z-H.min.z:1,Ie=H.min.x,Be=H.min.y,Ge=H.isBox3?H.min.z:0):(de=ct.width,be=ct.height,Le=ct.depth||1,Ie=0,Be=0,Ge=0),W!==null?(De=W.x,Ze=W.y,at=W.z):(De=0,Ze=0,at=0);const Bt=We.convert(O.format),Qe=We.convert(O.type);let Ne;O.isData3DTexture?(C.setTexture3D(O,0),Ne=T.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(C.setTexture2DArray(O,0),Ne=T.TEXTURE_2D_ARRAY):(C.setTexture2D(O,0),Ne=T.TEXTURE_2D),T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,O.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,O.unpackAlignment);const _n=T.getParameter(T.UNPACK_ROW_LENGTH),et=T.getParameter(T.UNPACK_IMAGE_HEIGHT),en=T.getParameter(T.UNPACK_SKIP_PIXELS),Ti=T.getParameter(T.UNPACK_SKIP_ROWS),Gt=T.getParameter(T.UNPACK_SKIP_IMAGES);T.pixelStorei(T.UNPACK_ROW_LENGTH,ct.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,ct.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Ie),T.pixelStorei(T.UNPACK_SKIP_ROWS,Be),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Ge);const gs=E.isDataArrayTexture||E.isData3DTexture,lt=O.isDataArrayTexture||O.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const un=me.get(E),_s=me.get(O),qt=me.get(un.__renderTarget),Ln=me.get(_s.__renderTarget);ie.bindFramebuffer(T.READ_FRAMEBUFFER,qt.__webglFramebuffer),ie.bindFramebuffer(T.DRAW_FRAMEBUFFER,Ln.__webglFramebuffer);for(let In=0;In<Le;In++)gs&&T.framebufferTextureLayer(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,me.get(E).__webglTexture,F,Ge+In),E.isDepthTexture?(lt&&T.framebufferTextureLayer(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,me.get(O).__webglTexture,F,at+In),T.blitFramebuffer(Ie,Be,de,be,De,Ze,de,be,T.DEPTH_BUFFER_BIT,T.NEAREST)):lt?T.copyTexSubImage3D(Ne,F,De,Ze,at+In,Ie,Be,de,be):T.copyTexSubImage2D(Ne,F,De,Ze,at+In,Ie,Be,de,be);ie.bindFramebuffer(T.READ_FRAMEBUFFER,null),ie.bindFramebuffer(T.DRAW_FRAMEBUFFER,null)}else lt?E.isDataTexture||E.isData3DTexture?T.texSubImage3D(Ne,F,De,Ze,at,de,be,Le,Bt,Qe,ct.data):O.isCompressedArrayTexture?T.compressedTexSubImage3D(Ne,F,De,Ze,at,de,be,Le,Bt,ct.data):T.texSubImage3D(Ne,F,De,Ze,at,de,be,Le,Bt,Qe,ct):E.isDataTexture?T.texSubImage2D(T.TEXTURE_2D,F,De,Ze,de,be,Bt,Qe,ct.data):E.isCompressedTexture?T.compressedTexSubImage2D(T.TEXTURE_2D,F,De,Ze,ct.width,ct.height,Bt,ct.data):T.texSubImage2D(T.TEXTURE_2D,F,De,Ze,de,be,Bt,Qe,ct);T.pixelStorei(T.UNPACK_ROW_LENGTH,_n),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,et),T.pixelStorei(T.UNPACK_SKIP_PIXELS,en),T.pixelStorei(T.UNPACK_SKIP_ROWS,Ti),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Gt),F===0&&O.generateMipmaps&&T.generateMipmap(Ne),ie.unbindTexture()},this.copyTextureToTexture3D=function(E,O,H=null,W=null,F=0){return E.isTexture!==!0&&(Is("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,W=arguments[1]||null,E=arguments[2],O=arguments[3],F=arguments[4]||0),Is('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,O,H,W,F)},this.initRenderTarget=function(E){me.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),ie.unbindTexture()},this.resetState=function(){A=0,R=0,w=null,ie.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}class Bc{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new $e(e),this.density=t}clone(){return new Bc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class vv extends ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class yv{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ac,this.updateRanges=[],this.version=0,this.uuid=Jt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Dt=new L;class so{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix4(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyNormalMatrix(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.transformDirection(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=an(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=an(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=an(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=an(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=an(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array),r=nt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new kt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new so(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Iu extends Qn{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new $e(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Bi;const bs=new L,zi=new L,Vi=new L,Gi=new pe,Ts=new pe,Du=new qe,Tr=new L,Es=new L,Er=new L,ah=new pe,ia=new pe,ch=new pe;class xv extends ht{constructor(e=new Iu){if(super(),this.isSprite=!0,this.type="Sprite",Bi===void 0){Bi=new It;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new yv(t,5);Bi.setIndex([0,1,2,0,2,3]),Bi.setAttribute("position",new so(n,3,0,!1)),Bi.setAttribute("uv",new so(n,2,3,!1))}this.geometry=Bi,this.material=e,this.center=new pe(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),zi.setFromMatrixScale(this.matrixWorld),Du.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Vi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&zi.multiplyScalar(-Vi.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;Cr(Tr.set(-.5,-.5,0),Vi,o,zi,i,r),Cr(Es.set(.5,-.5,0),Vi,o,zi,i,r),Cr(Er.set(.5,.5,0),Vi,o,zi,i,r),ah.set(0,0),ia.set(1,0),ch.set(1,1);let a=e.ray.intersectTriangle(Tr,Es,Er,!1,bs);if(a===null&&(Cr(Es.set(-.5,.5,0),Vi,o,zi,i,r),ia.set(0,1),a=e.ray.intersectTriangle(Tr,Er,Es,!1,bs),a===null))return;const c=e.ray.origin.distanceTo(bs);c<e.near||c>e.far||t.push({distance:c,point:bs.clone(),uv:jt.getInterpolation(bs,Tr,Es,Er,ah,ia,ch,new pe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Cr(s,e,t,n,i,r){Gi.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Ts.x=r*Gi.x-i*Gi.y,Ts.y=i*Gi.x+r*Gi.y):Ts.copy(Gi),s.copy(e),s.x+=Ts.x,s.y+=Ts.y,s.applyMatrix4(Du)}const lh=new L,hh=new Je,uh=new Je,Mv=new L,fh=new qe,Ar=new L,sa=new Pn,dh=new qe,ra=new vo;class nM extends rt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=cl,this.bindMatrix=new qe,this.bindMatrixInverse=new qe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Jn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ar),this.boundingBox.expandByPoint(Ar)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Pn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ar),this.boundingSphere.expandByPoint(Ar)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),sa.copy(this.boundingSphere),sa.applyMatrix4(i),e.ray.intersectsSphere(sa)!==!1&&(dh.copy(i).invert(),ra.copy(e.ray).applyMatrix4(dh),!(this.boundingBox!==null&&ra.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,ra)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Je,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===cl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Rd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;hh.fromBufferAttribute(i.attributes.skinIndex,e),uh.fromBufferAttribute(i.attributes.skinWeight,e),lh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const o=uh.getComponent(r);if(o!==0){const a=hh.getComponent(r);fh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Mv.copy(lh).applyMatrix4(fh),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Sv extends ht{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Uu extends Tt{constructor(e=null,t=1,n=1,i,r,o,a,c,l=$t,h=$t,u,f){super(null,o,a,c,l,h,i,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ph=new qe,bv=new qe;class Nu{constructor(e=[],t=[]){this.uuid=Jt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new qe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new qe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:bv;ph.multiplyMatrices(a,t[r]),ph.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Nu(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Uu(t,e,e,Xt,cn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Sv),this.bones.push(o),this.boneInverses.push(new qe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const o=t[i];e.bones.push(o.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class mh extends kt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Hi=new qe,gh=new qe,Rr=[],_h=new Jn,Tv=new qe,Cs=new rt,As=new Pn;class iM extends rt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new mh(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Tv)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Jn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hi),_h.copy(e.boundingBox).applyMatrix4(Hi),this.boundingBox.union(_h)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Pn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hi),As.copy(e.boundingSphere).applyMatrix4(Hi),this.boundingSphere.union(As)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Cs.geometry=this.geometry,Cs.material=this.material,Cs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),As.copy(this.boundingSphere),As.applyMatrix4(n),e.ray.intersectsSphere(As)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Hi),gh.multiplyMatrices(n,Hi),Cs.matrixWorld=gh,Cs.raycast(e,Rr);for(let o=0,a=Rr.length;o<a;o++){const c=Rr[o];c.instanceId=r,c.object=this,t.push(c)}Rr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new mh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Uu(new Float32Array(i*this.count),i,this.count,Ic,cn));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=i*e;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Ev extends Qn{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new $e(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ro=new L,oo=new L,vh=new qe,Rs=new vo,wr=new Pn,oa=new L,yh=new L;class Ou extends ht{constructor(e=new It,t=new Ev){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)ro.fromBufferAttribute(t,i-1),oo.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=ro.distanceTo(oo);e.setAttribute("lineDistance",new gt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wr.copy(n.boundingSphere),wr.applyMatrix4(i),wr.radius+=r,e.ray.intersectsSphere(wr)===!1)return;vh.copy(i).invert(),Rs.copy(e.ray).applyMatrix4(vh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=d,m=g-1;_<m;_+=l){const p=h.getX(_),v=h.getX(_+1),x=Pr(this,e,Rs,c,p,v);x&&t.push(x)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(d),p=Pr(this,e,Rs,c,_,m);p&&t.push(p)}}else{const d=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let _=d,m=g-1;_<m;_+=l){const p=Pr(this,e,Rs,c,_,_+1);p&&t.push(p)}if(this.isLineLoop){const _=Pr(this,e,Rs,c,g-1,d);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Pr(s,e,t,n,i,r){const o=s.geometry.attributes.position;if(ro.fromBufferAttribute(o,i),oo.fromBufferAttribute(o,r),t.distanceSqToSegment(ro,oo,oa,yh)>n)return;oa.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(oa);if(!(c<e.near||c>e.far))return{distance:c,point:yh.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}const xh=new L,Mh=new L;class sM extends Ou{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)xh.fromBufferAttribute(t,i),Mh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+xh.distanceTo(Mh);e.setAttribute("lineDistance",new gt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class rM extends Ou{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class ku extends Qn{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new $e(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Sh=new qe,lc=new vo,Lr=new Pn,Ir=new L;class Cv extends ht{constructor(e=new It,t=new ku){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Lr.copy(n.boundingSphere),Lr.applyMatrix4(i),Lr.radius+=r,e.ray.intersectsSphere(Lr)===!1)return;Sh.copy(i).invert(),lc.copy(e.ray).applyMatrix4(Sh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=f,_=d;g<_;g++){const m=l.getX(g);Ir.fromBufferAttribute(u,m),bh(Ir,m,c,i,e,t,this)}}else{const f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let g=f,_=d;g<_;g++)Ir.fromBufferAttribute(u,g),bh(Ir,g,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function bh(s,e,t,n,i,r,o){const a=lc.distanceSqToPoint(s);if(a<t){const c=new L;lc.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class es extends Tt{constructor(e,t,n,i,r,o,a,c,l){super(e,t,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class pn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(r-1);const h=n[i],f=n[i+1]-h,d=(o-h)/f;return(i+d)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),c=t||(o.isVector2?new pe:new L);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new L,i=[],r=[],o=[],a=new L,c=new qe;for(let d=0;d<=e;d++){const g=d/e;i[d]=this.getTangentAt(g,new L)}r[0]=new L,o[0]=new L;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(i[d-1],i[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(St(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,g))}o[d].crossVectors(i[d],r[d])}if(t===!0){let d=Math.acos(St(r[0].dot(r[e]),-1,1));d/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(i[g],d*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class zc extends pn{constructor(e=0,t=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new pe){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Av extends zc{constructor(e,t,n,i,r,o){super(e,t,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Vc(){let s=0,e=0,t=0,n=0;function i(r,o,a,c){s=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){i(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,d=(a-o)/h-(c-o)/(h+u)+(c-a)/u;f*=h,d*=h,i(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return s+e*r+t*o+n*a}}}const Dr=new L,aa=new Vc,ca=new Vc,la=new Vc;class Rv extends pn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new L){const n=t,i=this.points,r=i.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%r]:(Dr.subVectors(i[0],i[1]).add(i[0]),l=Dr);const u=i[a%r],f=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(Dr.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Dr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),aa.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,g,_,m),ca.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,g,_,m),la.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(aa.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),ca.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),la.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(aa.calc(c),ca.calc(c),la.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new L().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Th(s,e,t,n,i){const r=(n-e)*.5,o=(i-t)*.5,a=s*s,c=s*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*s+t}function wv(s,e){const t=1-s;return t*t*e}function Pv(s,e){return 2*(1-s)*s*e}function Lv(s,e){return s*s*e}function ks(s,e,t,n){return wv(s,e)+Pv(s,t)+Lv(s,n)}function Iv(s,e){const t=1-s;return t*t*t*e}function Dv(s,e){const t=1-s;return 3*t*t*s*e}function Uv(s,e){return 3*(1-s)*s*s*e}function Nv(s,e){return s*s*s*e}function Fs(s,e,t,n,i){return Iv(s,e)+Dv(s,t)+Uv(s,n)+Nv(s,i)}class Fu extends pn{constructor(e=new pe,t=new pe,n=new pe,i=new pe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new pe){const n=t,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Fs(e,i.x,r.x,o.x,a.x),Fs(e,i.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Ov extends pn{constructor(e=new L,t=new L,n=new L,i=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new L){const n=t,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Fs(e,i.x,r.x,o.x,a.x),Fs(e,i.y,r.y,o.y,a.y),Fs(e,i.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Bu extends pn{constructor(e=new pe,t=new pe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new pe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new pe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class kv extends pn{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class zu extends pn{constructor(e=new pe,t=new pe,n=new pe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new pe){const n=t,i=this.v0,r=this.v1,o=this.v2;return n.set(ks(e,i.x,r.x,o.x),ks(e,i.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Vu extends pn{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){const n=t,i=this.v0,r=this.v1,o=this.v2;return n.set(ks(e,i.x,r.x,o.x),ks(e,i.y,r.y,o.y),ks(e,i.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Gu extends pn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new pe){const n=t,i=this.points,r=(i.length-1)*e,o=Math.floor(r),a=r-o,c=i[o===0?o:o-1],l=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Th(a,c.x,l.x,h.x,u.x),Th(a,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new pe().fromArray(i))}return this}}var ao=Object.freeze({__proto__:null,ArcCurve:Av,CatmullRomCurve3:Rv,CubicBezierCurve:Fu,CubicBezierCurve3:Ov,EllipseCurve:zc,LineCurve:Bu,LineCurve3:kv,QuadraticBezierCurve:zu,QuadraticBezierCurve3:Vu,SplineCurve:Gu});class Fv extends pn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ao[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const o=i[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const o=r[i],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new ao[i.type]().fromJSON(i))}return this}}class hc extends Fv{constructor(e){super(),this.type="Path",this.currentPoint=new pe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Bu(this.currentPoint.clone(),new pe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new zu(this.currentPoint.clone(),new pe(e,t),new pe(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,o){const a=new Fu(this.currentPoint.clone(),new pe(e,t),new pe(n,i),new pe(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Gu(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,i,r,o),this}absarc(e,t,n,i,r,o){return this.absellipse(e,t,n,n,i,r,o),this}ellipse(e,t,n,i,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,i,r,o,a,c),this}absellipse(e,t,n,i,r,o,a,c){const l=new zc(e,t,n,i,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class ts extends It{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],f=[],d=[];let g=0;const _=[],m=n/2;let p=0;v(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new gt(u,3)),this.setAttribute("normal",new gt(f,3)),this.setAttribute("uv",new gt(d,2));function v(){const y=new L,I=new L;let A=0;const R=(t-e)/n;for(let w=0;w<=r;w++){const M=[],b=w/r,P=b*(t-e)+e;for(let k=0;k<=i;k++){const U=k/i,B=U*c+a,q=Math.sin(B),G=Math.cos(B);I.x=P*q,I.y=-b*n+m,I.z=P*G,u.push(I.x,I.y,I.z),y.set(q,R,G).normalize(),f.push(y.x,y.y,y.z),d.push(U,1-b),M.push(g++)}_.push(M)}for(let w=0;w<i;w++)for(let M=0;M<r;M++){const b=_[M][w],P=_[M+1][w],k=_[M+1][w+1],U=_[M][w+1];(e>0||M!==0)&&(h.push(b,P,U),A+=3),(t>0||M!==r-1)&&(h.push(P,k,U),A+=3)}l.addGroup(p,A,0),p+=A}function x(y){const I=g,A=new pe,R=new L;let w=0;const M=y===!0?e:t,b=y===!0?1:-1;for(let k=1;k<=i;k++)u.push(0,m*b,0),f.push(0,b,0),d.push(.5,.5),g++;const P=g;for(let k=0;k<=i;k++){const B=k/i*c+a,q=Math.cos(B),G=Math.sin(B);R.x=M*G,R.y=m*b,R.z=M*q,u.push(R.x,R.y,R.z),f.push(0,b,0),A.x=q*.5+.5,A.y=G*.5*b+.5,d.push(A.x,A.y),g++}for(let k=0;k<i;k++){const U=I+k,B=P+k;y===!0?h.push(B,B+1,U):h.push(B+1,B,U),w+=3}l.addGroup(p,w,y===!0?1:2),p+=w}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ts(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Js extends hc{constructor(e){super(e),this.uuid=Jt(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new hc().fromJSON(i))}return this}}const Bv={triangulate:function(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=Hu(s,0,i,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,f,d;if(n&&(r=Wv(s,e,r,t)),s.length>80*t){a=l=s[0],c=h=s[1];for(let g=t;g<i;g+=t)u=s[g],f=s[g+1],u<a&&(a=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-a,h-c),d=d!==0?32767/d:0}return qs(r,o,t,a,c,d,0),o}};function Hu(s,e,t,n,i){let r,o;if(i===ty(s,e,t,n)>0)for(r=e;r<t;r+=n)o=Eh(r,s[r],s[r+1],o);else for(r=t-n;r>=e;r-=n)o=Eh(r,s[r],s[r+1],o);return o&&xo(o,o.next)&&(Ys(o),o=o.next),o}function yi(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(xo(t,t.next)||ft(t.prev,t,t.next)===0)){if(Ys(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function qs(s,e,t,n,i,r,o){if(!s)return;!o&&r&&Yv(s,n,i,r);let a=s,c,l;for(;s.prev!==s.next;){if(c=s.prev,l=s.next,r?Vv(s,n,i,r):zv(s)){e.push(c.i/t|0),e.push(s.i/t|0),e.push(l.i/t|0),Ys(s),s=l.next,a=l.next;continue}if(s=l,s===a){o?o===1?(s=Gv(yi(s),e,t),qs(s,e,t,n,i,r,2)):o===2&&Hv(s,e,t,n,i,r):qs(yi(s),e,t,n,i,r,1);break}}}function zv(s){const e=s.prev,t=s,n=s.next;if(ft(e,t,n)>=0)return!1;const i=e.x,r=t.x,o=n.x,a=e.y,c=t.y,l=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,f=i>r?i>o?i:o:r>o?r:o,d=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&Ki(i,a,r,c,o,l,g.x,g.y)&&ft(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Vv(s,e,t,n){const i=s.prev,r=s,o=s.next;if(ft(i,r,o)>=0)return!1;const a=i.x,c=r.x,l=o.x,h=i.y,u=r.y,f=o.y,d=a<c?a<l?a:l:c<l?c:l,g=h<u?h<f?h:f:u<f?u:f,_=a>c?a>l?a:l:c>l?c:l,m=h>u?h>f?h:f:u>f?u:f,p=uc(d,g,e,t,n),v=uc(_,m,e,t,n);let x=s.prevZ,y=s.nextZ;for(;x&&x.z>=p&&y&&y.z<=v;){if(x.x>=d&&x.x<=_&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&Ki(a,h,c,u,l,f,x.x,x.y)&&ft(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=d&&y.x<=_&&y.y>=g&&y.y<=m&&y!==i&&y!==o&&Ki(a,h,c,u,l,f,y.x,y.y)&&ft(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=d&&x.x<=_&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&Ki(a,h,c,u,l,f,x.x,x.y)&&ft(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=v;){if(y.x>=d&&y.x<=_&&y.y>=g&&y.y<=m&&y!==i&&y!==o&&Ki(a,h,c,u,l,f,y.x,y.y)&&ft(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Gv(s,e,t){let n=s;do{const i=n.prev,r=n.next.next;!xo(i,r)&&Wu(i,n,n.next,r)&&Ks(i,r)&&Ks(r,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Ys(n),Ys(n.next),n=s=r),n=n.next}while(n!==s);return yi(n)}function Hv(s,e,t,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Jv(o,a)){let c=Xu(o,a);o=yi(o,o.next),c=yi(c,c.next),qs(o,e,t,n,i,r,0),qs(c,e,t,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function Wv(s,e,t,n){const i=[];let r,o,a,c,l;for(r=0,o=e.length;r<o;r++)a=e[r]*n,c=r<o-1?e[r+1]*n:s.length,l=Hu(s,a,c,n,!1),l===l.next&&(l.steiner=!0),i.push(Zv(l));for(i.sort(Xv),r=0;r<i.length;r++)t=$v(i[r],t);return t}function Xv(s,e){return s.x-e.x}function $v(s,e){const t=qv(s,e);if(!t)return e;const n=Xu(t,s);return yi(n,n.next),yi(t,t.next)}function qv(s,e){let t=e,n=-1/0,i;const r=s.x,o=s.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const f=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=r&&f>n&&(n=f,i=t.x<t.next.x?t:t.next,f===r))return i}t=t.next}while(t!==e);if(!i)return null;const a=i,c=i.x,l=i.y;let h=1/0,u;t=i;do r>=t.x&&t.x>=c&&r!==t.x&&Ki(o<l?r:n,o,c,l,o<l?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),Ks(t,s)&&(u<h||u===h&&(t.x>i.x||t.x===i.x&&Kv(i,t)))&&(i=t,h=u)),t=t.next;while(t!==a);return i}function Kv(s,e){return ft(s.prev,s,e.prev)<0&&ft(e.next,s,s.next)<0}function Yv(s,e,t,n){let i=s;do i.z===0&&(i.z=uc(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,jv(i)}function jv(s){let e,t,n,i,r,o,a,c,l=1;do{for(t=s,s=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<l&&(a++,n=n.nextZ,!!n);e++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,a--):(i=n,n=n.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;t=n}r.nextZ=null,l*=2}while(o>1);return s}function uc(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function Zv(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function Ki(s,e,t,n,i,r,o,a){return(i-o)*(e-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(i-o)*(n-a)}function Jv(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!Qv(s,e)&&(Ks(s,e)&&Ks(e,s)&&ey(s,e)&&(ft(s.prev,s,e.prev)||ft(s,e.prev,e))||xo(s,e)&&ft(s.prev,s,s.next)>0&&ft(e.prev,e,e.next)>0)}function ft(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function xo(s,e){return s.x===e.x&&s.y===e.y}function Wu(s,e,t,n){const i=Nr(ft(s,e,t)),r=Nr(ft(s,e,n)),o=Nr(ft(t,n,s)),a=Nr(ft(t,n,e));return!!(i!==r&&o!==a||i===0&&Ur(s,t,e)||r===0&&Ur(s,n,e)||o===0&&Ur(t,s,n)||a===0&&Ur(t,e,n))}function Ur(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Nr(s){return s>0?1:s<0?-1:0}function Qv(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Wu(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Ks(s,e){return ft(s.prev,s,s.next)<0?ft(s,e,s.next)>=0&&ft(s,s.prev,e)>=0:ft(s,e,s.prev)<0||ft(s,s.next,e)<0}function ey(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Xu(s,e){const t=new fc(s.i,s.x,s.y),n=new fc(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Eh(s,e,t,n){const i=new fc(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Ys(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function fc(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function ty(s,e,t,n){let i=0;for(let r=e,o=t-n;r<t;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}class qn{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return qn.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Ch(e),Ah(n,e);let o=e.length;t.forEach(Ch);for(let c=0;c<t.length;c++)i.push(o),o+=t[c].length,Ah(n,t[c]);const a=Bv.triangulate(n,i);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function Ch(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Ah(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Mo extends It{constructor(e=new Js([new pe(.5,.5),new pe(-.5,.5),new pe(-.5,-.5),new pe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let a=0,c=e.length;a<c;a++){const l=e[a];o(l)}this.setAttribute("position",new gt(i,3)),this.setAttribute("uv",new gt(r,2)),this.computeVertexNormals();function o(a){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:d-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:ny;let x,y=!1,I,A,R,w;p&&(x=p.getSpacedPoints(h),y=!0,f=!1,I=p.computeFrenetFrames(h,!1),A=new L,R=new L,w=new L),f||(m=0,d=0,g=0,_=0);const M=a.extractPoints(l);let b=M.shape;const P=M.holes;if(!qn.isClockWise(b)){b=b.reverse();for(let Y=0,ne=P.length;Y<ne;Y++){const T=P[Y];qn.isClockWise(T)&&(P[Y]=T.reverse())}}const U=qn.triangulateShape(b,P),B=b;for(let Y=0,ne=P.length;Y<ne;Y++){const T=P[Y];b=b.concat(T)}function q(Y,ne,T){return ne||console.error("THREE.ExtrudeGeometry: vec does not exist"),Y.clone().addScaledVector(ne,T)}const G=b.length,J=U.length;function V(Y,ne,T){let te,$,ae;const ie=Y.x-ne.x,ce=Y.y-ne.y,me=T.x-Y.x,C=T.y-Y.y,S=ie*ie+ce*ce,z=ie*C-ce*me;if(Math.abs(z)>Number.EPSILON){const Z=Math.sqrt(S),oe=Math.sqrt(me*me+C*C),Q=ne.x-ce/Z,Pe=ne.y+ie/Z,ye=T.x-C/oe,Ee=T.y+me/oe,Ke=((ye-Q)*C-(Ee-Pe)*me)/(ie*C-ce*me);te=Q+ie*Ke-Y.x,$=Pe+ce*Ke-Y.y;const ue=te*te+$*$;if(ue<=2)return new pe(te,$);ae=Math.sqrt(ue/2)}else{let Z=!1;ie>Number.EPSILON?me>Number.EPSILON&&(Z=!0):ie<-Number.EPSILON?me<-Number.EPSILON&&(Z=!0):Math.sign(ce)===Math.sign(C)&&(Z=!0),Z?(te=-ce,$=ie,ae=Math.sqrt(S)):(te=ie,$=ce,ae=Math.sqrt(S/2))}return new pe(te/ae,$/ae)}const he=[];for(let Y=0,ne=B.length,T=ne-1,te=Y+1;Y<ne;Y++,T++,te++)T===ne&&(T=0),te===ne&&(te=0),he[Y]=V(B[Y],B[T],B[te]);const le=[];let xe,Oe=he.concat();for(let Y=0,ne=P.length;Y<ne;Y++){const T=P[Y];xe=[];for(let te=0,$=T.length,ae=$-1,ie=te+1;te<$;te++,ae++,ie++)ae===$&&(ae=0),ie===$&&(ie=0),xe[te]=V(T[te],T[ae],T[ie]);le.push(xe),Oe=Oe.concat(xe)}for(let Y=0;Y<m;Y++){const ne=Y/m,T=d*Math.cos(ne*Math.PI/2),te=g*Math.sin(ne*Math.PI/2)+_;for(let $=0,ae=B.length;$<ae;$++){const ie=q(B[$],he[$],te);j(ie.x,ie.y,-T)}for(let $=0,ae=P.length;$<ae;$++){const ie=P[$];xe=le[$];for(let ce=0,me=ie.length;ce<me;ce++){const C=q(ie[ce],xe[ce],te);j(C.x,C.y,-T)}}}const re=g+_;for(let Y=0;Y<G;Y++){const ne=f?q(b[Y],Oe[Y],re):b[Y];y?(R.copy(I.normals[0]).multiplyScalar(ne.x),A.copy(I.binormals[0]).multiplyScalar(ne.y),w.copy(x[0]).add(R).add(A),j(w.x,w.y,w.z)):j(ne.x,ne.y,0)}for(let Y=1;Y<=h;Y++)for(let ne=0;ne<G;ne++){const T=f?q(b[ne],Oe[ne],re):b[ne];y?(R.copy(I.normals[Y]).multiplyScalar(T.x),A.copy(I.binormals[Y]).multiplyScalar(T.y),w.copy(x[Y]).add(R).add(A),j(w.x,w.y,w.z)):j(T.x,T.y,u/h*Y)}for(let Y=m-1;Y>=0;Y--){const ne=Y/m,T=d*Math.cos(ne*Math.PI/2),te=g*Math.sin(ne*Math.PI/2)+_;for(let $=0,ae=B.length;$<ae;$++){const ie=q(B[$],he[$],te);j(ie.x,ie.y,u+T)}for(let $=0,ae=P.length;$<ae;$++){const ie=P[$];xe=le[$];for(let ce=0,me=ie.length;ce<me;ce++){const C=q(ie[ce],xe[ce],te);y?j(C.x,C.y+x[h-1].y,x[h-1].x+T):j(C.x,C.y,u+T)}}}N(),X();function N(){const Y=i.length/3;if(f){let ne=0,T=G*ne;for(let te=0;te<J;te++){const $=U[te];fe($[2]+T,$[1]+T,$[0]+T)}ne=h+m*2,T=G*ne;for(let te=0;te<J;te++){const $=U[te];fe($[0]+T,$[1]+T,$[2]+T)}}else{for(let ne=0;ne<J;ne++){const T=U[ne];fe(T[2],T[1],T[0])}for(let ne=0;ne<J;ne++){const T=U[ne];fe(T[0]+G*h,T[1]+G*h,T[2]+G*h)}}n.addGroup(Y,i.length/3-Y,0)}function X(){const Y=i.length/3;let ne=0;ee(B,ne),ne+=B.length;for(let T=0,te=P.length;T<te;T++){const $=P[T];ee($,ne),ne+=$.length}n.addGroup(Y,i.length/3-Y,1)}function ee(Y,ne){let T=Y.length;for(;--T>=0;){const te=T;let $=T-1;$<0&&($=Y.length-1);for(let ae=0,ie=h+m*2;ae<ie;ae++){const ce=G*ae,me=G*(ae+1),C=ne+te+ce,S=ne+$+ce,z=ne+$+me,Z=ne+te+me;_e(C,S,z,Z)}}}function j(Y,ne,T){c.push(Y),c.push(ne),c.push(T)}function fe(Y,ne,T){ve(Y),ve(ne),ve(T);const te=i.length/3,$=v.generateTopUV(n,i,te-3,te-2,te-1);we($[0]),we($[1]),we($[2])}function _e(Y,ne,T,te){ve(Y),ve(ne),ve(te),ve(ne),ve(T),ve(te);const $=i.length/3,ae=v.generateSideWallUV(n,i,$-6,$-3,$-2,$-1);we(ae[0]),we(ae[1]),we(ae[3]),we(ae[1]),we(ae[2]),we(ae[3])}function ve(Y){i.push(c[Y*3+0]),i.push(c[Y*3+1]),i.push(c[Y*3+2])}function we(Y){r.push(Y.x),r.push(Y.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return iy(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,o=e.shapes.length;r<o;r++){const a=t[e.shapes[r]];n.push(a)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new ao[i.type]().fromJSON(i)),new Mo(n,e.options)}}const ny={generateTopUV:function(s,e,t,n,i){const r=e[t*3],o=e[t*3+1],a=e[n*3],c=e[n*3+1],l=e[i*3],h=e[i*3+1];return[new pe(r,o),new pe(a,c),new pe(l,h)]},generateSideWallUV:function(s,e,t,n,i,r){const o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],f=e[i*3],d=e[i*3+1],g=e[i*3+2],_=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new pe(o,1-c),new pe(l,1-u),new pe(f,1-g),new pe(_,1-p)]:[new pe(a,1-c),new pe(h,1-u),new pe(d,1-g),new pe(m,1-p)]}};function iy(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Gc extends It{constructor(e=new Js([new pe(0,.5),new pe(-.5,-.5),new pe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],o=[];let a=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new gt(i,3)),this.setAttribute("normal",new gt(r,3)),this.setAttribute("uv",new gt(o,2));function l(h){const u=i.length/3,f=h.extractPoints(t);let d=f.shape;const g=f.holes;qn.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,p=g.length;m<p;m++){const v=g[m];qn.isClockWise(v)===!0&&(g[m]=v.reverse())}const _=qn.triangulateShape(d,g);for(let m=0,p=g.length;m<p;m++){const v=g[m];d=d.concat(v)}for(let m=0,p=d.length;m<p;m++){const v=d[m];i.push(v.x,v.y,0),r.push(0,0,1),o.push(v.x,v.y)}for(let m=0,p=_.length;m<p;m++){const v=_[m],x=v[0]+u,y=v[1]+u,I=v[2]+u;n.push(x,y,I),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return sy(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const o=t[e.shapes[i]];n.push(o)}return new Gc(n,e.curveSegments)}}function sy(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class $u extends It{constructor(e=new Vu(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),t=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:r};const o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new L,c=new L,l=new pe;let h=new L;const u=[],f=[],d=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new gt(u,3)),this.setAttribute("normal",new gt(f,3)),this.setAttribute("uv",new gt(d,2));function _(){for(let x=0;x<t;x++)m(x);m(r===!1?t:0),v(),p()}function m(x){h=e.getPointAt(x/t,h);const y=o.normals[x],I=o.binormals[x];for(let A=0;A<=i;A++){const R=A/i*Math.PI*2,w=Math.sin(R),M=-Math.cos(R);c.x=M*y.x+w*I.x,c.y=M*y.y+w*I.y,c.z=M*y.z+w*I.z,c.normalize(),f.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,u.push(a.x,a.y,a.z)}}function p(){for(let x=1;x<=t;x++)for(let y=1;y<=i;y++){const I=(i+1)*(x-1)+(y-1),A=(i+1)*x+(y-1),R=(i+1)*x+y,w=(i+1)*(x-1)+y;g.push(I,A,w),g.push(A,R,w)}}function v(){for(let x=0;x<=t;x++)for(let y=0;y<=i;y++)l.x=x/t,l.y=y/i,d.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new $u(new ao[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class bt extends Qn{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new $e(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $e(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=du,this.normalScale=new pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class qu extends bt{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new pe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return St(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new $e(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new $e(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new $e(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}function Or(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function ry(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function oy(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Rh(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let c=0;c!==e;++c)i[o++]=s[a+c]}return i}function Ku(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push.apply(t,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}class So{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break e}o=t.length;break t}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class ay extends So{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ll,endingEnd:ll}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,o=e+1,a=i[r],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case hl:r=e,a=2*t-n;break;case ul:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case hl:o=e,c=2*n-t;break;case ul:o=1,c=n+i[1]-i[0];break;default:o=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(i-t),_=g*g,m=_*g,p=-f*m+2*f*_-f*g,v=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,x=(-1-d)*m+(1.5+d)*_+.5*g,y=d*m-d*_;for(let I=0;I!==a;++I)r[I]=p*o[h+I]+v*o[l+I]+x*o[c+I]+y*o[u+I];return r}}class cy extends So{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(i-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*u+o[c+f]*h;return r}}class ly extends So{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class mn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Or(t,this.TimeBufferType),this.values=Or(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Or(e.times,Array),values:Or(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ly(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new cy(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ay(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case no:t=this.InterpolantFactoryMethodDiscrete;break;case oc:t=this.InterpolantFactoryMethodLinear;break;case wo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return no;case this.InterpolantFactoryMethodLinear:return oc;case this.InterpolantFactoryMethodSmooth:return wo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(i!==void 0&&ry(i))for(let a=0,c=i.length;a!==c;++a){const l=i[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===wo,r=e.length-1;let o=1;for(let a=1;a<r;++a){let c=!1;const l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(i)c=!0;else{const u=a*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){const _=t[u+g];if(_!==t[f+g]||_!==t[d+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];const u=a*n,f=o*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}mn.prototype.TimeBufferType=Float32Array;mn.prototype.ValueBufferType=Float32Array;mn.prototype.DefaultInterpolation=oc;class ps extends mn{constructor(e,t,n){super(e,t,n)}}ps.prototype.ValueTypeName="bool";ps.prototype.ValueBufferType=Array;ps.prototype.DefaultInterpolation=no;ps.prototype.InterpolantFactoryMethodLinear=void 0;ps.prototype.InterpolantFactoryMethodSmooth=void 0;class Yu extends mn{}Yu.prototype.ValueTypeName="color";class co extends mn{}co.prototype.ValueTypeName="number";class hy extends So{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(i-t);let l=e*a;for(let h=l+a;l!==h;l+=4)xi.slerpFlat(r,0,o,l-a,o,l,c);return r}}class bo extends mn{InterpolantFactoryMethodLinear(e){return new hy(this.times,this.values,this.getValueSize(),e)}}bo.prototype.ValueTypeName="quaternion";bo.prototype.InterpolantFactoryMethodSmooth=void 0;class ms extends mn{constructor(e,t,n){super(e,t,n)}}ms.prototype.ValueTypeName="string";ms.prototype.ValueBufferType=Array;ms.prototype.DefaultInterpolation=no;ms.prototype.InterpolantFactoryMethodLinear=void 0;ms.prototype.InterpolantFactoryMethodSmooth=void 0;class lo extends mn{}lo.prototype.ValueTypeName="vector";class oM{constructor(e="",t=-1,n=[],i=Pd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Jt(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(fy(n[o]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,o=n.length;r!==o;++r)t.push(mn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);const h=oy(c);c=Rh(c,1,h),l=Rh(l,1,h),!i&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new co(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){const l=e[a],h=l.name.match(r);if(h&&h.length>1){const u=h[1];let f=i[u];f||(i[u]=f=[]),f.push(l)}}const o=[];for(const a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,f,d,g,_){if(d.length!==0){const m=[],p=[];Ku(d,m,p,g),m.length!==0&&_.push(new u(f,m,p))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let u=0;u<l.length;u++){const f=l[u].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const d={};let g;for(g=0;g<f.length;g++)if(f[g].morphTargets)for(let _=0;_<f[g].morphTargets.length;_++)d[f[g].morphTargets[_]]=-1;for(const _ in d){const m=[],p=[];for(let v=0;v!==f[g].morphTargets.length;++v){const x=f[g];m.push(x.time),p.push(x.morphTarget===_?1:0)}i.push(new co(".morphTargetInfluence["+_+"]",m,p))}c=d.length*o}else{const d=".bones["+t[u].name+"]";n(lo,d+".position",f,"pos",i),n(bo,d+".quaternion",f,"rot",i),n(lo,d+".scale",f,"scl",i)}}return i.length===0?null:new this(r,c,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function uy(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return co;case"vector":case"vector2":case"vector3":case"vector4":return lo;case"color":return Yu;case"quaternion":return bo;case"bool":case"boolean":return ps;case"string":return ms}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function fy(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=uy(s.type);if(s.times===void 0){const t=[],n=[];Ku(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const Hn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class dy{constructor(e,t,n){const i=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){const d=l[u],g=l[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null}}}const py=new dy;class Qs{constructor(e){this.manager=e!==void 0?e:py,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Qs.DEFAULT_MATERIAL_NAME="__DEFAULT";const bn={};class my extends Error{constructor(e,t){super(e),this.response=t}}class aM extends Qs{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Hn.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(bn[e]!==void 0){bn[e].push({onLoad:t,onProgress:n,onError:i});return}bn[e]=[],bn[e].push({onLoad:t,onProgress:n,onError:i});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=bn[e],u=l.body.getReader(),f=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=f?parseInt(f):0,g=d!==0;let _=0;const m=new ReadableStream({start(p){v();function v(){u.read().then(({done:x,value:y})=>{if(x)p.close();else{_+=y.byteLength;const I=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:d});for(let A=0,R=h.length;A<R;A++){const w=h[A];w.onProgress&&w.onProgress(I)}p.enqueue(y),v()}},x=>{p.error(x)})}}});return new Response(m)}else throw new my(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return l.arrayBuffer().then(g=>d.decode(g))}}}).then(l=>{Hn.add(e,l);const h=bn[e];delete bn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onLoad&&d.onLoad(l)}}).catch(l=>{const h=bn[e];if(h===void 0)throw this.manager.itemError(e),l;delete bn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onError&&d.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class gy extends Qs{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=Hn.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;const a=$s("img");function c(){h(),Hn.add(e,this),t&&t(this),r.manager.itemEnd(e)}function l(u){h(),i&&i(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}}class cM extends Qs{constructor(e){super(e)}load(e,t,n,i){const r=new Tt,o=new gy(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class er extends ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new $e(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class _y extends er{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $e(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const ha=new qe,wh=new L,Ph=new L;class Hc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pe(512,512),this.map=null,this.mapPass=null,this.matrix=new qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new kc,this._frameExtents=new pe(1,1),this._viewportCount=1,this._viewports=[new Je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;wh.setFromMatrixPosition(e.matrixWorld),t.position.copy(wh),Ph.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ph),t.updateMatrixWorld(),ha.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ha),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ha)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class vy extends Hc{constructor(){super(new Ot(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=cs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Lh extends er{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.target=new ht,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new vy}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Ih=new qe,ws=new L,ua=new L;class yy extends Hc{constructor(){super(new Ot(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new pe(4,2),this._viewportCount=6,this._viewports=[new Je(2,1,1,1),new Je(0,1,1,1),new Je(3,1,1,1),new Je(1,1,1,1),new Je(3,0,1,1),new Je(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ws.setFromMatrixPosition(e.matrixWorld),n.position.copy(ws),ua.copy(n.position),ua.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ua),n.updateMatrixWorld(),i.makeTranslation(-ws.x,-ws.y,-ws.z),Ih.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ih)}}class lM extends er{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new yy}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class xy extends Hc{constructor(){super(new Cu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class My extends er{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.target=new ht,this.shadow=new xy}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Sy extends er{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class hM{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class uM extends Qs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=Hn.get(e);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{t&&t(l),r.manager.itemEnd(e)}).catch(l=>{i&&i(l)});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Hn.add(e,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){i&&i(l),Hn.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});Hn.add(e,c),r.manager.itemStart(e)}}const Wc="\\[\\]\\.:\\/",by=new RegExp("["+Wc+"]","g"),Xc="[^"+Wc+"]",Ty="[^"+Wc.replace("\\.","")+"]",Ey=/((?:WC+[\/:])*)/.source.replace("WC",Xc),Cy=/(WCOD+)?/.source.replace("WCOD",Ty),Ay=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Xc),Ry=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Xc),wy=new RegExp("^"+Ey+Cy+Ay+Ry+"$"),Py=["material","materials","bones","map"];class Ly{constructor(e,t,n){const i=n||st.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class st{constructor(e,t,n){this.path=t,this.parsedPath=n||st.parseTrackName(t),this.node=st.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new st.Composite(e,t,n):new st(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(by,"")}static parseTrackName(e){const t=wy.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);Py.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const c=n(a.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=st.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const o=e[i];if(o===void 0){const l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}st.Composite=Ly;st.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};st.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};st.prototype.GetterByBindingType=[st.prototype._getValue_direct,st.prototype._getValue_array,st.prototype._getValue_arrayElement,st.prototype._getValue_toArray];st.prototype.SetterByBindingTypeAndVersioning=[[st.prototype._setValue_direct,st.prototype._setValue_direct_setNeedsUpdate,st.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[st.prototype._setValue_array,st.prototype._setValue_array_setNeedsUpdate,st.prototype._setValue_array_setMatrixWorldNeedsUpdate],[st.prototype._setValue_arrayElement,st.prototype._setValue_arrayElement_setNeedsUpdate,st.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[st.prototype._setValue_fromArray,st.prototype._setValue_fromArray_setNeedsUpdate,st.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Rc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Rc);const Iy=8,fa=700,Dh=6500,da=s=>Math.max(0,Math.min(1,s));class Dy{constructor(){this.ctx=null,this.muted=!1,this.running=!1,this.master=null,this.engineGain=null,this.turboGain=null,this.roadGain=null,this.windGain=null,this.hornOsc1=null,this.hornOsc2=null,this.hornGain=null,this.rainGain=null,this.isRaining=!1,this.load=0,this.boost=0,this.lastEngineUpdate=0,this.shiftDipUntil=0,this.shiftDipLevel=1}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.master=this.ctx.createDynamicsCompressor(),this.master.threshold.value=-14,this.master.knee.value=10,this.master.ratio.value=3,this.master.attack.value=.005,this.master.release.value=.2,this.master.connect(this.ctx.destination);const t=this.ctx.sampleRate*2,n=this.ctx.createBuffer(1,t,this.ctx.sampleRate),i=n.getChannelData(0);for(let o=0;o<t;o++)i[o]=Math.random()*2-1;this.noise=this.ctx.createBufferSource(),this.noise.buffer=n,this.noise.loop=!0,this.noise.start(),this.setupEngine(),this.setupRoadNoise(),this.hornGain=this.ctx.createGain(),this.hornGain.gain.value=0,this.hornOsc1=this.ctx.createOscillator(),this.hornOsc2=this.ctx.createOscillator(),this.hornOsc1.type="sawtooth",this.hornOsc2.type="sawtooth",this.hornOsc1.frequency.value=349.23,this.hornOsc2.frequency.value=440;const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.value=850,r.Q.value=2,this.hornOsc1.connect(r),this.hornOsc2.connect(r),r.connect(this.hornGain),this.hornGain.connect(this.master),this.hornOsc1.start(),this.hornOsc2.start(),this.running=!0}setupEngine(){const e=this.ctx,t=32,n=new Float32Array(t),i=new Float32Array(t);for(let h=1;h<t;h++)i[h]=(h===2?1.3:h===4?.9:1)/Math.pow(h,1.35);const r=e.createPeriodicWave(n,i),o=(h,u)=>{const f=e.createOscillator();h==="firing"?f.setPeriodicWave(r):f.type=h;const d=e.createGain();return d.gain.value=u,f.connect(d),f.start(),{o:f,g:d}};this.firingA=o("firing",.55),this.firingB=o("firing",.35),this.firingB.o.detune.value=7,this.halfOrder=o("triangle",.32),this.crankOrder=o("sine",.28),this.lopeGain=e.createGain(),this.lopeGain.gain.value=1,this.lopeLfo=e.createOscillator(),this.lopeLfo.type="sine",this.lopeDepth=e.createGain(),this.lopeDepth.gain.value=.2,this.lopeLfo.connect(this.lopeDepth),this.lopeDepth.connect(this.lopeGain.gain),this.lopeLfo.start();for(const h of[this.firingA,this.firingB,this.halfOrder,this.crankOrder])h.g.connect(this.lopeGain);this.driveGain=e.createGain(),this.driveGain.gain.value=.35;const a=e.createWaveShaper(),c=new Float32Array(2048);for(let h=0;h<c.length;h++){const u=h/(c.length-1)*2-1;c[h]=Math.tanh(2.5*u)/Math.tanh(2.5)}a.curve=c,a.oversample="2x";const l=e.createBiquadFilter();l.type="peaking",l.frequency.value=120,l.Q.value=.9,l.gain.value=5,this.cabinFilter=e.createBiquadFilter(),this.cabinFilter.type="lowpass",this.cabinFilter.frequency.value=400,this.cabinFilter.Q.value=.6,this.engineGain=e.createGain(),this.engineGain.gain.value=0,this.lopeGain.connect(this.driveGain),this.driveGain.connect(a),a.connect(l),l.connect(this.cabinFilter),this.cabinFilter.connect(this.engineGain),this.engineGain.connect(this.master)}setupRoadNoise(){const e=this.ctx,t=(i,r,o,a)=>{const c=e.createBiquadFilter();return c.type=i,c.frequency.value=r,c.Q.value=o,this.noise.connect(c),c.connect(a),a.connect(this.master),c},n=()=>{const i=e.createGain();return i.gain.value=0,i};this.turboGain=n(),this.turboFilter=t("bandpass",1500,1.2,this.turboGain),this.roadGain=n(),this.roadFilter=t("lowpass",220,.7,this.roadGain),this.windGain=n(),this.windFilter=t("bandpass",900,.6,this.windGain),this.rainGain=n(),t("bandpass",1100,.7,this.rainGain),this.tireGain=n(),this.tireFilter=t("bandpass",920,4.5,this.tireGain)}setRainAmbience(e){if(this.isRaining=e,!this.ctx||!this.rainGain)return;const t=e&&!this.muted?.035:0;this.rainGain.gain.setTargetAtTime(t,this.ctx.currentTime,.3)}updateEngine(e,t,n,i,r=0){if(!this.ctx||!this.running)return;const o=this.ctx.currentTime,a=Math.min(.1,Math.max(0,o-this.lastEngineUpdate));if(this.lastEngineUpdate=o,i||this.muted){for(const _ of[this.engineGain,this.turboGain,this.roadGain,this.windGain,this.tireGain])_==null||_.gain.setTargetAtTime(0,o,.08);return}const c=Math.max(fa*.9,Math.min(Dh*1.03,e)),l=da((c-fa)/(Dh-fa)),h=da(n/240);this.load+=(t-this.load)*Math.min(1,a*4);const u=t*da((c-1600)/2400);this.boost+=(u-this.boost)*Math.min(1,a*(u>this.boost?2:5));const f=c/60*(Iy/2);this.firingA.o.frequency.setTargetAtTime(f,o,.025),this.firingB.o.frequency.setTargetAtTime(f,o,.025),this.halfOrder.o.frequency.setTargetAtTime(f/2,o,.025),this.crankOrder.o.frequency.setTargetAtTime(f/4,o,.025),this.lopeLfo.frequency.setTargetAtTime(f/8,o,.025),this.lopeDepth.gain.setTargetAtTime(.1+(1-l)*.3,o,.1),this.driveGain.gain.setTargetAtTime(.32+this.load*.42+l*.12,o,.06),this.cabinFilter.frequency.setTargetAtTime(230+l*520+this.load*650,o,.06);const d=o<this.shiftDipUntil?this.shiftDipLevel:1,g=(.05+l*.06+this.load*.07)*d;if(this.engineGain.gain.setTargetAtTime(g,o,.045),this.turboFilter.frequency.setTargetAtTime(1300+this.boost*2200,o,.1),this.turboGain.gain.setTargetAtTime(this.boost*.012,o,.12),this.roadFilter.frequency.setTargetAtTime(180+h*380,o,.2),this.roadGain.gain.setTargetAtTime(.012+Math.pow(h,1.5)*.06,o,.2),this.windFilter.frequency.setTargetAtTime(650+h*1e3,o,.2),this.windGain.gain.setTargetAtTime(Math.pow(h,2.4)*.006,o,.2),this.tireGain&&this.tireFilter){const _=Math.abs(r),m=Math.min(1,n/120),p=_>.42?Math.min(.055,(_-.42)*.075*m):0;this.tireFilter.frequency.setTargetAtTime(780+_*340,o,.05),this.tireGain.gain.setTargetAtTime(p,o,.05)}}triggerGearShift(e=!0){if(!this.ctx||this.muted)return;const t=this.ctx.currentTime;this.shiftDipLevel=e?.6:1.2,this.shiftDipUntil=t+(e?.12:.15)}setHorn(e){if(!this.ctx||!this.hornGain)return;const t=this.ctx.currentTime,n=e&&!this.muted?.09:0;this.hornGain.gain.setTargetAtTime(n,t,.015)}playSelektorClick(){if(!this.ctx||this.muted)return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type="triangle",t.frequency.setValueAtTime(1400,e),t.frequency.exponentialRampToValueAtTime(600,e+.03),n.gain.setValueAtTime(.05,e),n.gain.exponentialRampToValueAtTime(.001,e+.03),t.connect(n),n.connect(this.master),t.start(e),t.stop(e+.035)}playMakasWhoosh(e=1,t=!1){if(!this.ctx||this.muted)return;const n=this.ctx.currentTime,i=.28,r=Math.floor(this.ctx.sampleRate*i),o=this.ctx.createBuffer(1,r,this.ctx.sampleRate),a=o.getChannelData(0);for(let g=0;g<r;g++){const _=Math.sin(g/r*Math.PI);a[g]=(Math.random()*2-1)*_}const c=this.ctx.createBufferSource();c.buffer=o;const l=this.ctx.createBiquadFilter();l.type="bandpass",l.Q.value=2,l.frequency.setValueAtTime(950,n),l.frequency.exponentialRampToValueAtTime(240,n+i);const h=this.ctx.createGain();h.gain.setValueAtTime(.18,n),h.gain.exponentialRampToValueAtTime(.01,n+i),c.connect(l),l.connect(h),h.connect(this.master),c.start(n);const u=this.ctx.createOscillator(),f=this.ctx.createGain();u.type="sine";const d=520+Math.min(e,10)*65;u.frequency.setValueAtTime(d,n),t?(u.frequency.setValueAtTime(d*1.25,n+.07),u.frequency.setValueAtTime(d*1.5,n+.14)):u.frequency.exponentialRampToValueAtTime(d*1.25,n+.12),f.gain.setValueAtTime(.08,n),f.gain.exponentialRampToValueAtTime(.001,n+(t?.28:.18)),u.connect(f),f.connect(this.master),u.start(n),u.stop(n+(t?.3:.2))}playCrash(){if(!this.ctx||this.muted)return;const e=this.ctx.currentTime,t=.45,n=Math.floor(this.ctx.sampleRate*t),i=this.ctx.createBuffer(1,n,this.ctx.sampleRate),r=i.getChannelData(0);for(let l=0;l<n;l++)r[l]=(Math.random()*2-1)*Math.exp(-l/(n*.25));const o=this.ctx.createBufferSource();o.buffer=i;const a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=650;const c=this.ctx.createGain();c.gain.setValueAtTime(.28,e),c.gain.exponentialRampToValueAtTime(.005,e+t),o.connect(a),a.connect(c),c.connect(this.master),o.start(e)}toggleMute(){if(this.muted=!this.muted,this.muted&&this.ctx)for(const e of[this.engineGain,this.turboGain,this.roadGain,this.windGain,this.tireGain,this.rainGain])e==null||e.gain.setTargetAtTime(0,this.ctx.currentTime,.05);else this.setRainAmbience(this.isRaining);return this.muted}}const Uy="modulepreload",Ny=function(s,e){return new URL(s,e).href},Uh={},ju=function(e,t,n){let i=Promise.resolve();if(t&&t.length>0){let o=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const a=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));i=o(t.map(h=>{if(h=Ny(h,n),h in Uh)return;Uh[h]=!0;const u=h.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(!!n)for(let _=a.length-1;_>=0;_--){const m=a[_];if(m.href===h&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${f}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":Uy,u||(g.as="script"),g.crossOrigin="",g.href=h,l&&g.setAttribute("nonce",l),document.head.appendChild(g),u)return new Promise((_,m)=>{g.addEventListener("load",_),g.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return i.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})},Bn={cyan:{hex:61695,css:"#00f0ff",name:"Buz Mavisi"},purple:{hex:12069375,css:"#b829ff",name:"Neon Mor"},red:{hex:16719426,css:"#ff1e42",name:"Sport Kırmızı"},emerald:{hex:65416,css:"#00ff88",name:"Zümrüt Yeşili"},amber:{hex:16755200,css:"#ffaa00",name:"Altın Kehribar"}},ze=600,ut=338,zn=86,kr=174.5,Fr=154.5,pi=63,Oy=s=>46.53+1.01785*s-51149e-8*s*s,ky=s=>549.507-1.02696*s+588647e-9*s*s,Fy=s=>-46.017+2.05038*s-.00534236*s*s,By=s=>639.832-2.00603*s+.00495744*s*s,zy=[[244.5,-4],[355.5,-4],[354.9,0],[353.2,3],[351,5.5],[348.8,7.2],[337.5,8.2],[331,9.8],[329.4,11.8],[328.2,13.8],[325,16],[321,18.2],[317.6,20.2],[322,22.4],[334,23],[341,24.3],[343,26.5],[342.6,31],[341.4,36],[340.4,40],[338.5,42.2],[335.5,43.3],[328,44],[300,44.9],[272,44.6],[264,44.2],[259.5,45.6],[257.8,44],[257.6,40],[256.4,34],[255.6,28],[256.5,23.2],[262,22.6],[276,22],[280.5,20.2],[278.5,18.2],[274.8,16],[272.2,13.8],[270.6,11.5],[268.5,9.6],[264.5,8.2],[250.5,7.2],[248.4,5.5],[246.2,3],[244.8,0]],Vy=[[-4,80.4],[0,80],[4,79.3],[8,78.6],[12,77.8],[16,76.9],[20,76.3],[28,76],[36,76.1],[42,76.7],[48,77.6],[53,78.6],[57,79.8],[59.5,81.2],[62,84.2],[64,96],[-4,96]],Gy=[[604,77.6],[598,76.6],[592,75.4],[586,74.4],[580,73.6],[574,72.9],[568,72.4],[562,72.2],[557,73.2],[552,74.4],[547,74.9],[543,75.8],[540,77.2],[537,79],[534,80.4],[530,82.8],[526,85.6],[524,87.3],[526,100],[604,100]],pa=9,Nh=22,Hy=48;function Wy(s){const e=n=>{s.beginPath(),n(),s.fill()},t=n=>e(()=>n.forEach(([i,r],o)=>o===0?s.moveTo(i,r):s.lineTo(i,r)));e(()=>{s.moveTo(-4,-4);for(let n=-4;n<=104;n+=2)s.lineTo(Oy(n),n);for(let n=104;n>=22;n-=2)s.lineTo(Math.max(-4,Fy(n)),n);s.lineTo(-4,22)}),e(()=>{s.moveTo(ze+4,-4);for(let n=-4;n<=100;n+=2)s.lineTo(ky(n),n);for(let n=100;n>=18;n-=2)s.lineTo(Math.min(ze+4,By(n)),n);s.lineTo(ze+4,18)}),t(zy),t(Vy),t(Gy),e(()=>s.roundRect(-4,81.5,44.5,33,4)),e(()=>s.roundRect(559.5,81.5,44.5,33,4))}function Oh(s){const e=document.createElement("canvas");e.width=ze*s,e.height=ut*s;const t=e.getContext("2d");t.scale(s,s),t.fillStyle="#fff",Wy(t);const n=t.getImageData(0,0,e.width,e.height).data,i=new Uint8Array(e.width*e.height);for(let r=0;r<i.length;r++)i[r]=n[r*4+3];return i}function Xy(){var t,n;const s=Math.min(window.devicePixelRatio||1,2),e=Math.max(((t=window.screen)==null?void 0:t.width)||0,((n=window.screen)==null?void 0:n.height)||0,window.innerWidth,window.innerHeight)*s;return Math.max(2,Math.min(4,Math.ceil(e/ze)))}function dc(s,e,t){const n=s*s,i=n*s;e[t]=(-i+2*n-s)*.5,e[t+1]=(3*i-5*n+2)*.5,e[t+2]=(-3*i+4*n+s)*.5,e[t+3]=(i-n)*.5}function kh(s,e){const t=new Int32Array(e*4),n=new Float32Array(e*4),i=s/e;for(let r=0;r<e;r++){const o=(r+.5)*i-.5,a=Math.floor(o);dc(o-a,n,r*4);for(let c=0;c<4;c++)t[r*4+c]=Math.min(s-1,Math.max(0,a-1+c))}return{idx:t,w:n}}function $y(s,e,t,n,i){const r=kh(e,n),o=kh(t,i),a=new Float32Array(n*t*4);for(let l=0;l<t;l++){const h=l*e,u=l*n;for(let f=0;f<n;f++){let d=0,g=0,_=0,m=0;for(let v=0;v<4;v++){const x=r.w[f*4+v],y=(h+r.idx[f*4+v])*4;d+=s[y]*x,g+=s[y+1]*x,_+=s[y+2]*x,m+=s[y+3]*x}const p=(u+f)*4;a[p]=d,a[p+1]=g,a[p+2]=_,a[p+3]=m}}const c=new Float32Array(n*i*4);for(let l=0;l<i;l++){const h=o.idx[l*4],u=o.idx[l*4+1],f=o.idx[l*4+2],d=o.idx[l*4+3],g=o.w[l*4],_=o.w[l*4+1],m=o.w[l*4+2],p=o.w[l*4+3],v=h*n*4,x=u*n*4,y=f*n*4,I=d*n*4,A=l*n*4;for(let R=0;R<n*4;R++)c[A+R]=a[v+R]*g+a[x+R]*_+a[y+R]*m+a[I+R]*p}return c}const qy=new Float32Array(4),Ky=new Float32Array(4);function Yy(s,e,t,n,i,r){const o=Math.floor(n),a=Math.floor(i),c=qy,l=Ky;dc(n-o,c,0),dc(i-a,l,0);let h=0,u=0,f=0;for(let d=0;d<4;d++){const g=Math.min(t-1,Math.max(0,a-1+d));for(let _=0;_<4;_++){const m=Math.min(e-1,Math.max(0,o-1+_)),p=c[_]*l[d],v=(g*e+m)*4;h+=s[v]*p,u+=s[v+1]*p,f+=s[v+2]*p}}r[0]=h,r[1]=u,r[2]=f}function jy(s,e){const t=Math.hypot(s,e);if(t>pi)return 0;const n=t>=48,i=Math.abs(s)<=26&&e>=-15&&e<=28&&t<=31,r=e>=-13&&e<=14&&t<49.5,o=e>10&&t<49.5&&Math.abs(s)<=29-(e-10)*.18&&!(Math.abs(s)<=6&&e>29&&e<44);return n||i||r||o?t>pi-1.5?(pi-t)/1.5:1:0}const ji=class ji{constructor(e){this.renderer=e,this.group=new ln,this.overlayCanvas=document.getElementById("cockpit-canvas"),this.overlayCtx=this.overlayCanvas?this.overlayCanvas.getContext("2d"):null,this.ambientKey="cyan",this.makasFlashIntensity=0,this.wipersEnabled=!1,this.wiperPhase=0,this.currentSteerVisual=0,this.viewPreset=0,this.wheelScreenBounds={cx:300,cy:500,r:120},this.mirrorW=0,this.mirrorH=0,this.mirrorRenderTarget=new jn(1,1,{minFilter:Zt,magFilter:Zt,format:Xt,samples:2}),this.mirrorFrame=0,this.mirrorCanvas=document.createElement("canvas"),this.mirrorCtx=this.mirrorCanvas.getContext("2d"),this.resizeMirror(),this.mirrorCamera=new Ot(52,2,.5,220),this.group.add(this.mirrorCamera),this.mirrorCamera.position.set(0,1.35,1.8),this.mirrorCamera.rotation.set(0,Math.PI,0),this.imageLoaded=!1,this.texScale=Xy(),this.dashCanvas=document.createElement("canvas"),this.dashCanvas.width=ze*this.texScale,this.dashCanvas.height=ut*this.texScale,this.wheelCanvas=document.createElement("canvas"),this.wheelSize=Math.ceil(pi*2+8),this.wheelCanvas.width=this.wheelSize*this.texScale,this.wheelCanvas.height=this.wheelSize*this.texScale,this.mode="photo",this.interior3d=null,this._interiorPromise=null,this._overlayCleared=!1,this.camera=null,this.loadPhotorealisticCockpit()}get is3D(){return this.mode==="3d"&&!!this.interior3d}async setMode(e,t){if(this.mode=e==="3d"?"3d":"photo",this._overlayCleared=!1,this.mode==="3d"&&!this.interior3d){this._interiorPromise??(this._interiorPromise=ju(()=>import("./cockpit3d-CuxyRoUw.js"),__vite__mapDeps([0,1]),import.meta.url).then(n=>n.loadCockpit3D({eyeAnchor:t,mirrorTexture:this.mirrorRenderTarget.texture,paintScreen:(i,r,o,a)=>this.paint3DScreen(i,r,o,a)})));try{this.interior3d=await this._interiorPromise,this.group.add(this.interior3d.group)}catch(n){console.warn("3D kokpit yüklenemedi, fotoğraf kokpite dönülüyor:",n),this._interiorPromise=null,this.mode="photo"}}return this.interior3d&&(this.interior3d.group.visible=this.mode==="3d"),this.mode}loadPhotorealisticCockpit(){const e=new Image;e.crossOrigin="anonymous",e.onload=()=>{this.processCockpitImage(e),this.imageLoaded=!0},e.src="./audi_cockpit.png"}processCockpitImage(e){const t=this.texScale,n=ze*ut,i=document.createElement("canvas");i.width=ze,i.height=ut;const r=i.getContext("2d");r.drawImage(e,0,0,ze,ut);const a=r.getImageData(0,0,ze,ut).data,c=Oh(1),l=new Uint8Array(n),h=[[180,40],[420,40],[300,65],[15,45],[585,45],[82,95],[518,95]],u=[];for(const[re,N]of h){const X=N*ze+re;l[X]=1,u.push(X)}let f=0;for(;f<u.length;){const re=u[f++],N=re%ze,X=Math.floor(re/ze),ee=re*4,j=a[ee],fe=a[ee+1],_e=a[ee+2],ve=[[N-1,X],[N+1,X],[N,X-1],[N,X+1]];for(const[we,Y]of ve){if(we<0||we>=ze||Y<0||Y>=135)continue;const ne=Y*ze+we;if(l[ne]||c[ne]>=128)continue;const T=ne*4,te=a[T],$=a[T+1],ae=a[T+2],ie=Math.abs(te-j)+Math.abs($-fe)+Math.abs(ae-_e),ce=Math.max(te,$,ae)-Math.min(te,$,ae);ie<=10&&ce<=3&&te>=162&&(l[ne]=1,u.push(ne))}}const d=ze+1,g=new Float64Array(d*(ut+1)*4),_=new Float64Array(d*(ut+1)*4),m=new Uint8Array(n);for(let re=0;re<ut;re++)for(let N=0;N<ze;N++){let X=!1;for(let ee=Math.max(0,re-1);ee<=Math.min(ut-1,re+1)&&!X;ee++)for(let j=Math.max(0,N-1);j<=Math.min(ze-1,N+1);j++)if(l[ee*ze+j]){X=!0;break}m[re*ze+N]=X?0:1}for(let re=0;re<ut;re++)for(let N=0;N<4;N++){let X=0,ee=0;for(let j=0;j<ze;j++){const fe=re*ze+j,_e=N<3?a[fe*4+N]:1;l[fe]&&(X+=_e),m[fe]&&(ee+=_e);const ve=((re+1)*d+j+1)*4+N,we=(re*d+j+1)*4+N;g[ve]=g[we]+X,_[ve]=_[we]+ee}}const p=(re,N,X,ee,j)=>{const fe=Math.max(0,N-ee),_e=Math.max(0,X-ee),ve=Math.min(ze,N+ee+1),we=Math.min(ut,X+ee+1),Y=(_e*d+fe)*4,ne=(_e*d+ve)*4,T=(we*d+fe)*4,te=(we*d+ve)*4,$=re[te+3]-re[ne+3]-re[T+3]+re[Y+3];if($<=0)return 0;for(let ae=0;ae<3;ae++)j[ae]=(re[te+ae]-re[ne+ae]-re[T+ae]+re[Y+ae])/$;return $},v=new Uint8Array(n);for(let re=0;re<ut;re++)for(let N=0;N<ze;N++)if(!(c[re*ze+N]<128))for(let X=Math.max(0,re-2);X<=Math.min(ut-1,re+2);X++)for(let ee=Math.max(0,N-2);ee<=Math.min(ze-1,N+2);ee++)v[X*ze+ee]=1;const x=new Float32Array(n*4),y=[0,0,0],I=[0,0,0];for(let re=0;re<ut;re++)for(let N=0;N<ze;N++){const X=re*ze+N,ee=X*4,j=a[ee],fe=a[ee+1],_e=a[ee+2];if(x[ee]=j,x[ee+1]=fe,x[ee+2]=_e,x[ee+3]=255,l[X]){x[ee+3]=0;continue}if(c[X]>=128||p(g,N,re,3,y)===0)continue;const ve=j-y[0],we=fe-y[1],Y=_e-y[2],ne=Math.max(Math.abs(ve),Math.abs(we),Math.abs(Y));if(ne<=pa||v[X]&&ne<Hy){x[ee+3]=0;continue}let T;if(p(_,N,re,2,I)>0){const te=I[0]-y[0],$=I[1]-y[1],ae=I[2]-y[2],ie=te*te+$*$+ae*ae;Math.max(Math.abs(te),Math.abs($),Math.abs(ae))>Nh*2&&(T=Math.min(1,Math.max(0,(ve*te+we*$+Y*ae)/ie)),T<.98&&(x[ee]=I[0],x[ee+1]=I[1],x[ee+2]=I[2]))}if(T===void 0){const te=Math.min(1,(ne-pa)/(Nh-pa));T=te*te*(3-2*te)}x[ee+3]=T*255}const A=new Float32Array(n);for(let re=0;re<n;re++)A[re]=x[re*4+3];for(let re=0;re<135;re++)for(let N=0;N<ze;N++){const X=re*ze+N,ee=A[X];if(ee===0||ee>=230||c[X]>=128)continue;let j=0;for(let fe=Math.max(0,re-2);fe<=Math.min(ut-1,re+2);fe++)for(let _e=Math.max(0,N-2);_e<=Math.min(ze-1,N+2);_e++)(_e!==N||fe!==re)&&(j=Math.max(j,A[fe*ze+_e]));j<190&&(x[X*4+3]=0)}const R=new Uint8Array(n);for(let re=0;re<n;re++)R[re]=x[re*4+3]>0?1:0;for(let re=0;re<4;re++){const N=[];for(let X=0;X<ut;X++)for(let ee=0;ee<ze;ee++){const j=X*ze+ee;if(R[j])continue;let fe=0,_e=0,ve=0,we=0;for(let Y=Math.max(0,X-1);Y<=Math.min(ut-1,X+1);Y++)for(let ne=Math.max(0,ee-1);ne<=Math.min(ze-1,ee+1);ne++){const T=Y*ze+ne;R[T]&&(fe+=x[T*4],_e+=x[T*4+1],ve+=x[T*4+2],we++)}we>0&&(x[j*4]=fe/we,x[j*4+1]=_e/we,x[j*4+2]=ve/we,N.push(j))}for(const X of N)R[X]=1}const w=ze*t,M=ut*t,b=$y(x,ze,ut,w,M),P=Oh(t),k=this.dashCanvas.getContext("2d"),U=k.createImageData(w,M),B=U.data;for(let re=0,N=0;re<w*M;re++,N+=4)B[N]=b[N],B[N+1]=b[N+1],B[N+2]=b[N+2],B[N+3]=Math.max(b[N+3],P[re]);k.putImageData(U,0,0);const q=this.wheelSize*t,G=this.wheelCanvas.getContext("2d"),J=G.createImageData(q,q),V=J.data,he=this.wheelSize/2,le=[0,0,0],xe=3;for(let re=0;re<q;re++)for(let N=0;N<q;N++){const X=(N+.5)/t-he,ee=(re+.5)/t-he;if(Math.hypot(X,ee)>pi+1)continue;let j=0;for(let _e=0;_e<xe;_e++)for(let ve=0;ve<xe;ve++)j+=jy((N+(ve+.5)/xe)/t-he,(re+(_e+.5)/xe)/t-he);if(j<=0)continue;Yy(a,ze,ut,kr+X-.5,Fr+ee-.5,le);const fe=(re*q+N)*4;V[fe]=le[0],V[fe+1]=le[1],V[fe+2]=le[2],V[fe+3]=j/(xe*xe)*255}G.putImageData(J,0,0),k.save(),k.scale(t,t),k.beginPath(),k.arc(kr,Fr,pi+1,0,Math.PI*2),k.clip(),k.clearRect(110,84,135,9),k.fillStyle="#3a3635",k.fillRect(110,91,135,14),k.fillStyle="#0e1117",k.fillRect(112,103,130,33),k.fillStyle="#2a2625",k.fillRect(110,136,135,10),k.fillStyle="#0a0c10",k.fillRect(110,146,135,24),k.fillStyle="#b8bec8",k.fillRect(110,135,135,2),k.fillRect(110,170,135,2);const Oe=k.createLinearGradient(0,172,0,220);Oe.addColorStop(0,"#c8c2b6"),Oe.addColorStop(.3,"#dfd9ce"),Oe.addColorStop(1,"#d5cfc4"),k.fillStyle=Oe,k.fillRect(110,172,135,50),k.fillStyle="#181617",k.beginPath(),k.arc(kr,Fr,25,0,Math.PI*2),k.fill(),k.restore()}paint3DScreen(e,t,n,i){const r=this._screenState;r&&e==="cluster"&&this.drawVirtualCockpitScreen(t,0,0,n,i,r.speedKmh,r.rpm,r.gear,r.highBeam,r.odometerKm)}setViewPreset(e){this.viewPreset=e%3}setAmbientColor(e){const t=Bn[e]||Bn.cyan;return this.ambientKey=e,t}cycleAmbientColor(){const e=Object.keys(Bn),t=e.indexOf(this.ambientKey),n=e[(t+1)%e.length];return this.setAmbientColor(n)}triggerMakasCockpitPulse(){this.makasFlashIntensity=1}toggleWipers(e){return typeof e=="boolean"?this.wipersEnabled=e:this.wipersEnabled=!this.wipersEnabled,this.wipersEnabled}resizeMirror(){const e=Math.min(window.devicePixelRatio||1,2),t=Math.max(160,Math.min(512,Math.round(window.innerWidth*e*.15/16)*16));t!==this.mirrorW&&(this.mirrorW=t,this.mirrorH=t/2,this.mirrorRenderTarget.setSize(this.mirrorW,this.mirrorH),this.mirrorFrame=0,this.mirrorPixels=new Uint8Array(this.mirrorW*this.mirrorH*4),this.mirrorPixels32=new Uint32Array(this.mirrorPixels.buffer),this.mirrorCanvas.width=this.mirrorW,this.mirrorCanvas.height=this.mirrorH,this.mirrorImgData=this.mirrorCtx.createImageData(this.mirrorW,this.mirrorH),this.mirrorImgData32=new Uint32Array(this.mirrorImgData.data.buffer))}renderRearMirror(e){if(!this.renderer||(this.resizeMirror(),this.mirrorFrame++%2!==0))return;const t=this.renderer.getRenderTarget();if(this.renderer.setRenderTarget(this.mirrorRenderTarget),this.renderer.clear(),this.renderer.render(e,this.mirrorCamera),this.is3D){this.renderer.setRenderTarget(t);return}this.renderer.readRenderTargetPixels(this.mirrorRenderTarget,0,0,this.mirrorW,this.mirrorH,this.mirrorPixels),this.renderer.setRenderTarget(t);const n=this.mirrorPixels32,i=this.mirrorImgData32,r=this.mirrorW,o=this.mirrorH;for(let a=0;a<o;a++){const c=(o-1-a)*r+(r-1),l=a*r;for(let h=0;h<r;h++)i[l+h]=n[c-h]|4278190080}this.mirrorCtx.putImageData(this.mirrorImgData,0,0)}update(e,t,n=[]){var y;const{speedKmh:i,rpm:r,gear:o,steerInput:a,throttle:c,highBeam:l,combo:h,comboTimer:u,score:f,odometerKm:d,lateralG:g,bodyRoll:_=0,bodyPitch:m=0}=t,v=.85-Math.min(1,Math.max(0,((i||90)-60)/180))*.25,x=a*v;if(this.currentSteerVisual=xt.lerp(this.currentSteerVisual,x,Math.min(1,e*16)),(this.wipersEnabled||this.wiperPhase>.01)&&(this.wiperPhase+=e*4.2,!this.wipersEnabled&&this.wiperPhase>=Math.PI?this.wiperPhase=0:this.wiperPhase%=Math.PI),this.makasFlashIntensity>0&&(this.makasFlashIntensity=Math.max(0,this.makasFlashIntensity-e*2.5)),this.is3D){this._screenState={...t,nearbyCars:n},this.interior3d.update({steerAngle:this.currentSteerVisual,night:!!t.cabinNight,aspect:window.innerWidth/window.innerHeight,ambientHex:((y=Bn[this.ambientKey])==null?void 0:y.hex)??61695,flash:this.makasFlashIntensity,wiperSweep:Math.sin(this.wiperPhase),wipersVisible:this.wipersEnabled||this.wiperPhase>.01}),this.camera&&(this.wheelScreenBounds=this.interior3d.getWheelScreenBounds(this.camera)),!this._overlayCleared&&this.overlayCtx&&(this.overlayCtx.clearRect(0,0,this.overlayCanvas.width,this.overlayCanvas.height),this._overlayCleared=!0);return}this.renderOverlayCanvas(i,r,o,c,l,h,u,f,d,g,_,m,n)}renderOverlayCanvas(e,t,n,i,r,o,a,c,l,h,u,f,d){if(!this.overlayCanvas||!this.overlayCtx||!this.imageLoaded)return;const g=Math.min(window.devicePixelRatio||1,2),_=window.innerWidth,m=window.innerHeight,p=Math.round(_*g),v=Math.round(m*g);(this.overlayCanvas.width!==p||this.overlayCanvas.height!==v)&&(this.overlayCanvas.width=p,this.overlayCanvas.height=v);const x=this.overlayCtx;x.save(),x.imageSmoothingEnabled=!0,x.imageSmoothingQuality="high",x.scale(g,g),x.clearRect(0,0,_,m);const y=-(h||0)*3.2,I=(f||0)*42;x.translate(_/2+y,m/2+I),x.rotate((u||0)*.22),x.scale(1.02,1.02),x.translate(-_/2,-m/2);const R=m*[.44,.32,.54][this.viewPreset%3],w=m-R,M=_/m;let b=0,P=ze;if(M<1.15&&this.viewPreset!==1){const le=Math.max(0,Math.min(1,(1.15-M)/.65));b=36*le,P=ze-110*le}const k=le=>(le-b)/P*_,U=_/P,B=le=>le<=zn?le/zn*R:R+(le-zn)/(ut-zn)*w,q=w/(ut-zn);(this.wipersEnabled||this.wiperPhase>.01)&&this.drawWindshieldWipers(x,k,B,R);const G=this.texScale;x.drawImage(this.dashCanvas,b*G,0,P*G,zn*G,0,0,_,R+1),x.drawImage(this.dashCanvas,b*G,zn*G,P*G,(ut-zn)*G,0,R,_,w),this.drawLiveMirrors(x,k,B,d),this.drawVirtualCockpitScreen(x,k(136),B(103),98*U,32*q,e,t,n,r,l),this.drawUpperMmiScreen(x,k(271),B(139),66*U,27*q,d,e,o,c,h),this.drawLowerMmiScreen(x,k(271),B(176),61*U,34*q,n),this.drawAmbientLedStrips(x,k,B);const J=k(kr),V=B(Fr),he=this.wheelSize*U;this.wheelSize*q,this.wheelScreenBounds={cx:J,cy:V,r:pi*U},x.save(),x.translate(J,V),x.scale(1,q/U),x.rotate(this.currentSteerVisual),x.drawImage(this.wheelCanvas,-he/2,-he/2,he,he),x.restore(),x.restore()}drawWindshieldWipers(e,t,n,i){const r=Math.sin(this.wiperPhase),o=-Math.PI*.88+r*(Math.PI*.44),a=[175,345];e.save(),e.strokeStyle="#14171f",e.lineCap="round",a.forEach(c=>{const l=t(c),h=i+6,u=i*.82;e.save(),e.translate(l,h),e.rotate(o),e.lineWidth=5,e.beginPath(),e.moveTo(0,0),e.lineTo(u,0),e.stroke(),e.lineWidth=8,e.strokeStyle="#090b10",e.beginPath(),e.moveTo(u*.25,-2),e.lineTo(u,-2),e.stroke(),e.restore()}),e.restore()}drawLiveMirrors(e,t,n,i){e.save(),e.beginPath(),e.moveTo(t(258),n(22)),e.lineTo(t(342),n(22)),e.lineTo(t(339),n(45)),e.lineTo(t(261),n(45)),e.closePath(),e.clip(),e.drawImage(this.mirrorCanvas,t(257),n(21),t(343)-t(257),n(46)-n(21)),e.restore(),e.save(),e.beginPath(),e.roundRect(t(1),n(82),t(38)-t(1),n(114)-n(82),6),e.clip(),e.drawImage(this.mirrorCanvas,0,0,this.mirrorW*.55,this.mirrorH,t(1),n(82),t(38)-t(1),n(114)-n(82)),i.some(o=>Math.abs(o.relZ)<7&&o.relX<-1.1&&o.relX>-5.2)&&Math.floor(performance.now()/130)%2===0&&(e.fillStyle="#ff9900",e.beginPath(),e.arc(t(8),n(90),5,0,Math.PI*2),e.fill()),e.restore(),e.save(),e.beginPath(),e.roundRect(t(562),n(82),t(599)-t(562),n(114)-n(82),6),e.clip(),e.drawImage(this.mirrorCanvas,this.mirrorW*.45,0,this.mirrorW*.55,this.mirrorH,t(562),n(82),t(599)-t(562),n(114)-n(82)),e.restore()}drawVirtualCockpitScreen(e,t,n,i,r,o,a,c,l,h){var v;const u=((v=Bn[this.ambientKey])==null?void 0:v.css)||"#00f0ff",f=Math.max(1,e.getTransform().a),d={r:r*.43,tach:{cx:t+i*.2,cy:n+r*.52},speedo:{cx:t+i*.8,cy:n+r*.52},centerX:t+i*.5};e.save(),e.drawImage(this.getClusterFace(i,r,f),t,n,i,r);const{r:g,tach:_,speedo:m,centerX:p}=d;this.drawClusterNeedle(e,_.cx,_.cy,g,Math.min(1,a/8e3),a>6500?"#ff3b4f":u),this.drawClusterNeedle(e,m.cx,m.cy,g,Math.min(1,o/260),u),e.textAlign="center",e.textBaseline="middle",e.fillStyle="#f8fafc",e.font=`800 ${r*.17}px system-ui, sans-serif`,e.fillText(`D${c}`,_.cx,_.cy+g*.5),e.font=`800 ${r*.3}px system-ui, sans-serif`,e.fillText(String(Math.round(o)),p,n+r*.52),e.fillStyle="#94a3b8",e.font=`600 ${r*.09}px system-ui, sans-serif`,e.fillText("km/h",p,n+r*.7),e.fillText(`${Math.floor(h)} km`,p,n+r*.88),l&&(e.fillStyle="#3b82f6",e.font=`800 ${r*.11}px system-ui, sans-serif`,e.fillText("≡D",p,n+r*.13)),e.restore()}getClusterFace(e,t,n){var h;const i=`${e}x${t}@${n.toFixed(2)}`;if(((h=this._clusterFace)==null?void 0:h.key)===i)return this._clusterFace.canvas;const r=document.createElement("canvas");r.width=Math.ceil(e*n),r.height=Math.ceil(t*n);const o=r.getContext("2d");o.scale(n,n),o.beginPath(),o.roundRect(0,0,e,t,t*.18),o.clip();const a=o.createRadialGradient(e/2,t*.45,t*.1,e/2,t*.5,e*.6);a.addColorStop(0,"#111a2b"),a.addColorStop(1,"#05070c"),o.fillStyle=a,o.fillRect(0,0,e,t);const c=t*.43;this.drawDialFace(o,e*.2,t*.52,c,{max:8,major:1,minor:.5,label:1,redFrom:6.5,unit:"x1000/min"}),this.drawDialFace(o,e*.8,t*.52,c,{max:260,major:20,minor:10,label:40,unit:"km/h"});const l=t*.045;o.strokeStyle="#cbd5e1",o.lineWidth=t*.012;for(let u=0;u<4;u++)o.beginPath(),o.arc(e/2+(u-1.5)*l*1.45,t*.27,l,0,Math.PI*2),o.stroke();return this._clusterFace={key:i,canvas:r},r}drawDialFace(e,t,n,i,{max:r,major:o,minor:a,label:c,redFrom:l=null,unit:h}){const{DIAL_START:u,DIAL_SWEEP:f}=ji,d=_=>u+f*(_/r),g=e.createRadialGradient(t,n,i*.2,t,n,i);g.addColorStop(0,"#0d1422"),g.addColorStop(1,"#070a12"),e.fillStyle=g,e.beginPath(),e.arc(t,n,i,0,Math.PI*2),e.fill(),e.strokeStyle="#334155",e.lineWidth=i*.03,e.beginPath(),e.arc(t,n,i,0,Math.PI*2),e.stroke(),l!==null&&(e.strokeStyle="rgba(255, 59, 79, 0.85)",e.lineWidth=i*.06,e.beginPath(),e.arc(t,n,i*.9,d(l),d(r)),e.stroke()),e.lineCap="round";for(let _=0;_<=r+1e-6;_+=a){const m=Math.abs(_/o-Math.round(_/o))<1e-6,p=d(_),v=i*(m?.76:.82);e.strokeStyle=l!==null&&_>=l?"#ff3b4f":m?"#e2e8f0":"#64748b",e.lineWidth=i*(m?.035:.022),e.beginPath(),e.moveTo(t+Math.cos(p)*v,n+Math.sin(p)*v),e.lineTo(t+Math.cos(p)*i*.88,n+Math.sin(p)*i*.88),e.stroke()}e.fillStyle="#cbd5e1",e.font=`600 ${i*.16}px system-ui, sans-serif`,e.textAlign="center",e.textBaseline="middle";for(let _=0;_<=r+1e-6;_+=c){const m=d(_);e.fillText(String(_),t+Math.cos(m)*i*.6,n+Math.sin(m)*i*.6)}e.fillStyle="#64748b",e.font=`500 ${i*.11}px system-ui, sans-serif`,e.fillText(h,t,n+i*.78)}drawClusterNeedle(e,t,n,i,r,o){const{DIAL_START:a,DIAL_SWEEP:c}=ji,l=a+c*Math.max(.005,r);e.lineCap="round",e.globalAlpha=.85,e.strokeStyle=o,e.lineWidth=i*.05,e.beginPath(),e.arc(t,n,i*.94,a,l),e.stroke(),e.globalAlpha=1;const h=t+Math.cos(l)*i*.22,u=n+Math.sin(l)*i*.22,f=t+Math.cos(l)*i*.9,d=n+Math.sin(l)*i*.9;e.strokeStyle="rgba(255, 70, 50, 0.3)",e.lineWidth=i*.12,e.beginPath(),e.moveTo(h,u),e.lineTo(f,d),e.stroke(),e.strokeStyle="#ff5a3c",e.lineWidth=i*.045,e.beginPath(),e.moveTo(h,u),e.lineTo(f,d),e.stroke(),e.fillStyle="#1e293b",e.beginPath(),e.arc(t,n,i*.2,0,Math.PI*2),e.fill()}drawUpperMmiScreen(e,t,n,i,r,o,a,c,l,h){var x;const u=((x=Bn[this.ambientKey])==null?void 0:x.css)||"#00f0ff";e.save(),e.beginPath(),e.roundRect(t,n,i,r,3),e.clip(),e.fillStyle="#060911",e.fillRect(t,n,i,r);const f=i*.54;e.fillStyle=u,e.font=`800 ${Math.max(7,r*.16)}px system-ui, sans-serif`,e.textAlign="left",e.fillText("● AUDI MMI NAVIGATION",t+5,n+r*.24),e.fillStyle="#f8fafc",e.font=`900 ${Math.max(8,r*.22)}px ui-monospace, monospace`,e.fillText(`${Math.round(a)} KM/S`,t+5,n+r*.56),e.fillStyle=c>1?"#ffae00":"#94a3b8",e.font=`800 ${Math.max(7,r*.17)}px system-ui, sans-serif`,e.fillText(`KOMBO: ${c.toFixed(1)}x`,t+5,n+r*.84);const d=t+f+2,g=n+3,_=i-f-5,m=r-6;e.fillStyle="#0c1322",e.strokeStyle="rgba(255,255,255,0.2)",e.lineWidth=1,e.fillRect(d,g,_,m),e.strokeRect(d,g,_,m),e.strokeStyle="rgba(255,255,255,0.18)";for(let y=1;y<4;y++){const I=d+_/4*y;e.beginPath(),e.moveTo(I,g),e.lineTo(I,g+m),e.stroke()}const p=d+_/2+(o.playerX||0)/16*_,v=g+m*.74;o.forEach(y=>{if(y.relZ<-90||y.relZ>30)return;const I=d+_/2+y.x/16*_,A=v+y.relZ/90*(m*.74);if(!(A<g+2||A>g+m-2))if(y.isPeer)e.fillStyle=y.color||"#10b981",e.fillRect(I-3.5,A-5,7,10),e.strokeStyle="#ffffff",e.lineWidth=1,e.strokeRect(I-3.5,A-5,7,10);else{const R=Math.abs(y.relZ)<12&&Math.abs(y.relX)<2.4;e.fillStyle=R?"#ff2a4b":"#f59e0b",e.fillRect(I-2.5,A-4,5,8)}}),e.fillStyle=u,e.fillRect(p-3,v-4.5,6,9),e.restore()}drawLowerMmiScreen(e,t,n,i,r,o){var c;const a=((c=Bn[this.ambientKey])==null?void 0:c.css)||"#00f0ff";e.save(),e.beginPath(),e.roundRect(t,n,i,r,3),e.clip(),e.fillStyle="#070a12",e.fillRect(t,n,i,r),e.fillStyle="#f8fafc",e.font=`800 ${Math.max(8,r*.24)}px ui-monospace, monospace`,e.textAlign="left",e.fillText("21.5°",t+6,n+r*.38),e.textAlign="right",e.fillText("22.0°",t+i-6,n+r*.38),e.textAlign="center",e.fillStyle=a,e.font=`800 ${Math.max(6,r*.17)}px system-ui, sans-serif`,e.fillText(`AUTO • D${o}`,t+i/2,n+r*.36),e.fillStyle="rgba(255,255,255,0.08)",e.fillRect(t+4,n+r*.58,i-8,r*.32),e.fillStyle="#cbd5e1",e.font=`700 ${Math.max(6,r*.16)}px system-ui, sans-serif`,e.fillText("drive select  •  ⚠️  •  ESP",t+i/2,n+r*.8),e.restore()}drawAmbientLedStrips(e,t,n){var o;const i=((o=Bn[this.ambientKey])==null?void 0:o.css)||"#00f0ff",r=.65+this.makasFlashIntensity*.35;e.save(),e.strokeStyle=i,e.shadowColor=i,e.shadowBlur=10+this.makasFlashIntensity*14,e.globalAlpha=r,e.lineWidth=2.5+this.makasFlashIntensity*2,e.lineCap="round",e.beginPath(),e.moveTo(t(234),n(134)),e.lineTo(t(476),n(135)),e.moveTo(t(234),n(170)),e.lineTo(t(462),n(169)),e.stroke(),e.beginPath(),e.moveTo(t(14),n(168)),e.lineTo(t(110),n(136)),e.moveTo(t(490),n(136)),e.lineTo(t(586),n(168)),e.stroke(),e.restore()}};Ao(ji,"DIAL_START",Math.PI*.75),Ao(ji,"DIAL_SWEEP",Math.PI*1.5);let pc=ji;function qr(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,c=new It;let l=0;for(let h=0;h<s.length;++h){const u=s[h];let f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(t){let h=0;const u=[];for(let f=0;f<s.length;++f){const d=s[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=s[f].attributes.position.count}c.setIndex(u)}for(const h in r){const u=Fh(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let _=0;_<o[h].length;++_)d.push(o[h][_][f]);const g=Fh(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function Fh(s){let e,t,n,i=-1,r=0;for(let l=0;l<s.length;++l){const h=s[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const o=new e(r),a=new kt(o,t,n);let c=0;for(let l=0;l<s.length;++l){const h=s[l];if(h.isInterleavedBufferAttribute){const u=c/t;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<t;g++){const _=h.getComponent(f,g);a.setComponent(f+u,g,_)}}else o.set(h.array,c);c+=h.count*t}return i!==void 0&&(a.gpuType=i),a}function fM(s,e){if(e===Ld)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===fl||e===Id){let t=s.getIndex();if(t===null){const o=[],a=s.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);s.setIndex(o),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===fl)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}function Zy(s,e=Math.PI/3){const t=Math.cos(e),n=(1+1e-10)*100,i=[new L,new L,new L],r=new L,o=new L,a=new L,c=new L;function l(_){const m=~~(_.x*n),p=~~(_.y*n),v=~~(_.z*n);return`${m},${p},${v}`}const h=s.index?s.toNonIndexed():s,u=h.attributes.position,f={};for(let _=0,m=u.count/3;_<m;_++){const p=3*_,v=i[0].fromBufferAttribute(u,p+0),x=i[1].fromBufferAttribute(u,p+1),y=i[2].fromBufferAttribute(u,p+2);r.subVectors(y,x),o.subVectors(v,x);const I=new L().crossVectors(r,o).normalize();for(let A=0;A<3;A++){const R=i[A],w=l(R);w in f||(f[w]=[]),f[w].push(I)}}const d=new Float32Array(u.count*3),g=new kt(d,3,!1);for(let _=0,m=u.count/3;_<m;_++){const p=3*_,v=i[0].fromBufferAttribute(u,p+0),x=i[1].fromBufferAttribute(u,p+1),y=i[2].fromBufferAttribute(u,p+2);r.subVectors(y,x),o.subVectors(v,x),a.crossVectors(r,o).normalize();for(let I=0;I<3;I++){const A=i[I],R=l(A),w=f[R];c.set(0,0,0);for(let M=0,b=w.length;M<b;M++){const P=w[M];a.dot(P)>t&&c.add(P)}c.normalize(),g.setXYZ(p+I,c.x,c.y,c.z)}}return h.setAttribute("normal",g),h}const Zu=1,mi={night:{key:"night",label:"Gece",icon:"🌙",skyColor:857384,fogColor:1252918,fogDensity:.0022,ambientIntensity:1.25,ambientColor:10204392,hemiGroundColor:2766415,dirIntensity:1.1,dirColor:10863871,roadRoughness:.42,roadMetalness:.2,streetlightsOn:!0,rain:!1},rain:{key:"rain",label:"Yağmur",icon:"🌧️",skyColor:725536,fogColor:1186864,fogDensity:.0032,ambientIntensity:1.05,ambientColor:9086166,hemiGroundColor:2239810,dirIntensity:.9,dirColor:9089279,roadRoughness:.18,roadMetalness:.48,streetlightsOn:!0,rain:!0},sunset:{key:"sunset",label:"Gün Batımı",icon:"🌇",skyColor:2889264,fogColor:6696e3,fogDensity:.0025,ambientIntensity:1.25,ambientColor:16752762,hemiGroundColor:4006446,dirIntensity:1.65,dirColor:16742212,roadRoughness:.36,roadMetalness:.25,streetlightsOn:!0,rain:!1},day:{key:"day",label:"Gündüz",icon:"☀️",skyColor:4884956,fogColor:9156848,fogDensity:.0018,ambientIntensity:1.5,ambientColor:16777215,hemiGroundColor:4674921,dirIntensity:1.85,dirColor:16775399,roadRoughness:.65,roadMetalness:.1,streetlightsOn:!1,rain:!1}},Br=[-5.4,-1.8,1.8,5.4],fn=8.4;class Jy{constructor(e){this.scene=e,this.weatherKey="night",this.roadTexture=null,this.roadMat=null,this.scrollOffset=0,this.worldDistM=0,this.curvableGeometries=[],this.sceneryItems=[],this.lampFixtures=[],this.rainSystem=null,this.headlightGroup=new ln,this.scene.add(this.headlightGroup),this.buildLights(),this.buildRoad(),this.buildRoadsideScenery(),this.buildRainParticles(),this.applyWeather("night")}evalRoadProfile(e){const o=Math.floor(e/1500),a=e-o*1500,c=(o&1)===0,l=c?0:85,h=c?1:-1;if(a<=1050)return{c:l,d1:0,d2:0};const u=a-1050,f=Math.PI*2/450,d=f*u,g=l+h*85*(u/450-Math.sin(d)/(Math.PI*2)),_=h*(85/450)*(1-Math.cos(d)),m=h*(85*f/450)*Math.sin(d);return{c:g,d1:_,d2:m}}evalRoadCenterX(e){return this.evalRoadProfile(e).c}evalRoadDeriv1(e){return this.evalRoadProfile(e).d1}evalRoadDeriv2(e){return this.evalRoadProfile(e).d2}getCurveOffsetAtZ(e){const t=this.worldDistM,n=this.evalRoadCenterX(t),i=this.evalRoadDeriv1(t);return this.evalRoadCenterX(t-e)-n+e*i}getCurveSlopeAtZ(e){const t=this.worldDistM,n=this.evalRoadDeriv1(t);return-this.evalRoadDeriv1(t-e)+n}getCurveYawAtZ(e){return Math.atan(this.getCurveSlopeAtZ(e))}getCurrentCurvature(){return this.evalRoadDeriv2(this.worldDistM)}registerCurvableGeometry(e){const t=e.attributes.position,n=new Float32Array(t.count);for(let i=0;i<t.count;i++)n[i]=t.getX(i);this.curvableGeometries.push({geo:e,baseX:n})}buildLights(){this.ambientLight=new Sy(10204392,1.25),this.scene.add(this.ambientLight),this.hemiLight=new _y(10863871,2766415,.95),this.hemiLight.position.set(0,50,0),this.scene.add(this.hemiLight),this.dirLight=new My(10863871,1.1),this.dirLight.position.set(-20,55,-40),this.scene.add(this.dirLight);const e=document.createElement("canvas");e.width=512,e.height=256;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,0,256);n.addColorStop(0,"#1e3a5f"),n.addColorStop(.45,"#6488b8"),n.addColorStop(.5,"#cbd5e1"),n.addColorStop(.55,"#1e293b"),n.addColorStop(1,"#0f172a"),t.fillStyle=n,t.fillRect(0,0,512,256),t.fillStyle="#ffffff";for(let r=0;r<8;r++)t.fillRect(30+r*60,85,28,10);const i=new es(e);i.mapping=to,i.colorSpace=Mt,this.scene.environment=i,this.scene.environmentIntensity=.85,this.lowBeamLight=new Lh(16054783,14,165,Math.PI/2.8,.35,.85),this.lowBeamLight.position.set(0,.9,-1.7),this.lowBeamTarget=new ht,this.lowBeamTarget.position.set(0,0,-65),this.headlightGroup.add(this.lowBeamLight),this.headlightGroup.add(this.lowBeamTarget),this.lowBeamLight.target=this.lowBeamTarget,this.highBeamLight=new Lh(14216447,0,230,Math.PI/2.5,.22,.7),this.highBeamLight.position.set(0,.95,-1.7),this.highBeamTarget=new ht,this.highBeamTarget.position.set(0,.5,-140),this.headlightGroup.add(this.highBeamLight),this.headlightGroup.add(this.highBeamTarget),this.highBeamLight.target=this.highBeamTarget}createRoadCanvasTexture(){const e=document.createElement("canvas");e.width=1024,e.height=1024;const t=e.getContext("2d");t.fillStyle="#2d3442",t.fillRect(0,0,1024,1024);for(let o=0;o<16e3;o++){const a=Math.random()*1024,c=Math.random()*1024,l=38+Math.floor(Math.random()*22);t.fillStyle=`rgb(${l},${l+3},${l+8})`,t.fillRect(a,c,2,3)}t.fillStyle="#eab308",t.fillRect(58,0,14,1024),t.fillStyle="#e2e8f0",t.fillRect(952,0,14,1024);for(let o=0;o<1024;o+=64)t.fillStyle=o/64%2===0?"#dc2626":"#f1f5f9",t.fillRect(12,o,26,64),t.fillRect(986,o,26,64);t.fillStyle="#f8fafc";const n=72,i=880;for(let o=1;o<=3;o++){const a=n+i/4*o-6;t.fillRect(a,80,12,310),t.fillRect(a,590,12,310)}const r=new es(e);return r.wrapS=Ws,r.wrapT=Ws,r.repeat.set(1,22),r.anisotropy=8,r.colorSpace=Mt,r}buildRoad(){this.roadTexture=this.createRoadCanvasTexture();const e=440,t=110,n=new vi(fn*2+1.6,e,1,t);n.rotateX(-Math.PI/2),n.translate(0,0,-140),this.registerCurvableGeometry(n),this.roadMat=new bt({map:this.roadTexture,roughness:.38,metalness:.25});const i=new rt(n,this.roadMat);this.scene.add(i);const r=new vi(320,e,1,40);r.rotateX(-Math.PI/2),r.translate(0,-.05,-140),this.registerCurvableGeometry(r);const o=new bt({color:593172,roughness:.95}),a=new rt(r,o);this.scene.add(a);const c=new bt({color:3357512,roughness:.75,metalness:.15}),l=new wt(.65,.95,e,1,1,t);l.translate(-fn-.55,.47,-140),this.registerCurvableGeometry(l);const h=new rt(l,c);this.scene.add(h);const u=new wt(.65,.95,e,1,1,t);u.translate(fn+.55,.47,-140),this.registerCurvableGeometry(u);const f=new rt(u,c);this.scene.add(f)}createHighwayGantrySign(e,t){const n=new ln,i=new bt({color:6583435,roughness:.4,metalness:.8}),r=new rt(new ts(.22,.26,8.2,12),i);r.position.set(-fn-1.2,4.1,0),n.add(r);const o=new rt(new ts(.22,.26,8.2,12),i);o.position.set(fn+1.2,4.1,0),n.add(o);const a=new rt(new wt((fn+1.4)*2,.38,.38),i);a.position.set(0,7.8,0),n.add(a);const c=document.createElement("canvas");c.width=1024,c.height=256;const l=c.getContext("2d");l.fillStyle="#046a38",l.fillRect(0,0,1024,256),l.strokeStyle="#ffffff",l.lineWidth=10,l.strokeRect(14,14,996,228),l.fillStyle="#e11d48",l.fillRect(48,46,130,64),l.fillStyle="#ffffff",l.font="900 40px system-ui, sans-serif",l.textAlign="center",l.fillText("O-4",113,92),l.font="900 54px system-ui, sans-serif",l.fillText(e,540,106),l.fillStyle="#fde047",l.font="800 36px system-ui, sans-serif",l.fillText(t,540,174);for(let f=0;f<4;f++){const d=200+f*225;l.fillStyle="#ffffff",l.fillText("↓",d,228)}const h=new es(c);h.colorSpace=Mt;const u=new rt(new wt(11.8,2.5,.16),new An({map:h}));return u.position.set(0,7.6,.22),n.add(u),n}buildRoadsideScenery(){const e=new bt({color:4674921,roughness:.4,metalness:.75}),t=new An({color:16765565});this.lampFixtures.push(t);const n=new An({color:16720435}),i=new An({color:16777215}),r=18,o=20,a=[["İSTANBUL MERKEZ  12 KM","15 TEMMUZ ŞEHİTLER KÖPRÜSÜ  •  AVRASYA TÜNELİ"],["ANKARA / KOCAELİ","SOL ŞERİT SÜREKLİ İŞGAL EDİLEMEZ"],["FSM KÖPRÜSÜ  •  LEVENT","HIZ SINIRI 120 KM/S  •  RADAR KONTROL"]],c=new bt({color:856864,roughness:.85}),l=new qe,h=new xi,u=new hn,f=new L,d=new L(1,1,1),g=(_,m,p,v,x=0)=>(h.setFromEuler(u.set(0,0,x)),_.applyMatrix4(l.compose(f.set(m,p,v),h,d)));for(let _=0;_<r;_++){const m=40-_*o,p=new ln;p.position.z=m;const v=[],x=[],y=[],I=new rt(g(new wt(.12,.22,.08),-fn-.55,1.05,0),n);p.add(I);const A=new rt(g(new wt(.12,.22,.08),fn+.55,1.05,0),i);p.add(A),[-1,1].forEach(w=>{const M=w*(fn+1.35);v.push(g(new ts(.1,.14,8.8,8),M,4.4,0)),v.push(g(new wt(2.6,.1,.1),M-w*1.2,8.6,0,w*.12)),x.push(g(new wt(.75,.08,.32),M-w*2.2,8.45,0))}),[-1,1].forEach(w=>{const M=14+(_*7+(w>0?3:0))%28,b=8+_%5*2;y.push(g(new wt(b,M,10),w*(26+_%4*7),M/2-.5,0))}),p.add(new rt(qr(v),e)),p.add(new rt(qr(x),t));const R=new rt(qr(y),c);if(R.layers.set(Zu),p.add(R),[...v,...x,...y].forEach(w=>w.dispose()),_%6===2){const[w,M]=a[Math.floor(_/6)%a.length],b=this.createHighwayGantrySign(w,M);p.add(b)}this.scene.add(p),this.sceneryItems.push(p)}}buildRainParticles(){const t=new Float32Array(4200);for(let r=0;r<1400;r++)t[r*3]=(Math.random()-.5)*28,t[r*3+1]=Math.random()*14,t[r*3+2]=10-Math.random()*140;const n=new It;n.setAttribute("position",new kt(t,3));const i=new ku({color:10868991,size:.14,transparent:!0,opacity:.55});this.rainSystem=new Cv(n,i),this.rainSystem.visible=!1,this.scene.add(this.rainSystem)}applyWeather(e){const t=mi[e]||mi.night;return this.weatherKey=t.key,this.scene.background=new $e(t.skyColor),this.scene.fog=new Bc(t.fogColor,t.fogDensity),this.ambientLight.color.setHex(t.ambientColor),this.ambientLight.intensity=t.ambientIntensity,this.hemiLight&&(this.hemiLight.color.setHex(t.dirColor),this.hemiLight.groundColor.setHex(t.hemiGroundColor||2766415),this.hemiLight.intensity=t.ambientIntensity*.85),this.dirLight.color.setHex(t.dirColor),this.dirLight.intensity=t.dirIntensity,this.roadMat&&(this.roadMat.roughness=t.roadRoughness,this.roadMat.metalness=t.roadMetalness,this.roadMat.needsUpdate=!0),this.lampFixtures.forEach(n=>{n.color.setHex(t.streetlightsOn?16768921:6583435)}),this.rainSystem&&(this.rainSystem.visible=t.rain),this.lowBeamLight.intensity=t.streetlightsOn?14:2.5,t}cycleWeather(){const e=Object.keys(mi),t=e.indexOf(this.weatherKey),n=e[(t+1)%e.length];return this.applyWeather(n)}update(e,t,n,i,r=null){r!==null?this.worldDistM=r:this.worldDistM+=t*e,this.scrollOffset+=t*e/20,this.roadTexture&&(this.roadTexture.offset.y=this.scrollOffset);for(const a of this.curvableGeometries){const c=a.geo.attributes.position,l=a.baseX;for(let h=0;h<c.count;h++){const u=c.getZ(h);c.setX(h,l[h]+this.getCurveOffsetAtZ(u))}c.needsUpdate=!0}const o=this.sceneryItems.length*20;for(const a of this.sceneryItems)a.position.z+=t*e,a.position.z>45&&(a.position.z-=o),a.position.x=this.getCurveOffsetAtZ(a.position.z),a.rotation.y=this.getCurveYawAtZ(a.position.z);if(this.headlightGroup.position.x=n,this.lowBeamTarget.position.x=this.getCurveOffsetAtZ(-55)*.7,this.highBeamTarget.position.x=this.getCurveOffsetAtZ(-115)*.7,this.highBeamLight.intensity=i?28:0,this.rainSystem&&this.rainSystem.visible){const a=this.rainSystem.geometry.attributes.position;for(let c=0;c<a.count;c++){let l=a.getY(c)-18*e,h=a.getZ(c)+t*e*.85;l<0&&(l=14),h>10&&(h-=140),a.setY(c,l),a.setZ(c,h)}a.needsUpdate=!0}}}const Ps=new L;function Yt(s,e,t,n,i,r){const o=2*Math.PI*i/4,a=Math.max(r-2*i,0),c=Math.PI/4;Ps.copy(e),Ps[n]=0,Ps.normalize();const l=.5*o/(o+a),h=1-Ps.angleTo(s)/c;return Math.sign(Ps[t])===1?h*l:a/(o+a)+l+l*(1-h)}class Qy extends wt{constructor(e=1,t=1,n=1,i=2,r=.1){if(i=i*2+1,r=Math.min(e/2,t/2,n/2,r),super(1,1,1,i,i,i),i===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const a=new L,c=new L,l=new L(e,t,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,u=this.attributes.normal.array,f=this.attributes.uv.array,d=h.length/6,g=new L,_=.5/i;for(let m=0,p=0;m<h.length;m+=3,p+=2)switch(a.fromArray(h,m),c.copy(a),c.x-=Math.sign(c.x)*_,c.y-=Math.sign(c.y)*_,c.z-=Math.sign(c.z)*_,c.normalize(),h[m+0]=l.x*Math.sign(a.x)+c.x*r,h[m+1]=l.y*Math.sign(a.y)+c.y*r,h[m+2]=l.z*Math.sign(a.z)+c.z*r,u[m+0]=c.x,u[m+1]=c.y,u[m+2]=c.z,Math.floor(m/d)){case 0:g.set(1,0,0),f[p+0]=Yt(g,c,"z","y",r,n),f[p+1]=1-Yt(g,c,"y","z",r,t);break;case 1:g.set(-1,0,0),f[p+0]=1-Yt(g,c,"z","y",r,n),f[p+1]=1-Yt(g,c,"y","z",r,t);break;case 2:g.set(0,1,0),f[p+0]=1-Yt(g,c,"x","z",r,e),f[p+1]=Yt(g,c,"z","x",r,n);break;case 3:g.set(0,-1,0),f[p+0]=1-Yt(g,c,"x","z",r,e),f[p+1]=1-Yt(g,c,"z","x",r,n);break;case 4:g.set(0,0,1),f[p+0]=1-Yt(g,c,"x","y",r,e),f[p+1]=1-Yt(g,c,"y","x",r,t);break;case 5:g.set(0,0,-1),f[p+0]=Yt(g,c,"x","y",r,e),f[p+1]=1-Yt(g,c,"y","x",r,t);break}}}const hs=[{hex:15856629,metalness:.12,roughness:.34,weight:3},{hex:14672872,metalness:.55,roughness:.24,weight:3},{hex:790033,metalness:.7,roughness:.2,weight:3},{hex:2764599,metalness:.85,roughness:.26,weight:3},{hex:8423054,metalness:.08,roughness:.42,weight:2},{hex:11976134,metalness:.95,roughness:.22,weight:3},{hex:10227227,metalness:.7,roughness:.22,weight:1.5},{hex:1454957,metalness:.85,roughness:.24,weight:1.2},{hex:2911188,metalness:.6,roughness:.25,weight:1},{hex:1785137,metalness:.8,roughness:.28,weight:.8},{hex:8161398,metalness:.15,roughness:.4,weight:.7},{hex:8810590,metalness:.9,roughness:.3,weight:.8},{hex:14655523,metalness:.45,roughness:.26,weight:.5},{hex:13784091,metalness:.5,roughness:.26,weight:.5}];var Qh;const ex=typeof window<"u"&&((Qh=window.matchMedia)==null?void 0:Qh.call(window,"(pointer: coarse)").matches),tx=new Map(hs.map(s=>[s.hex,s])),nx=hs.reduce((s,e)=>s+e.weight,0);function ix(){let s=Math.random()*nx;for(const e of hs)if(s-=e.weight,s<=0)return e.hex;return hs[0].hex}function sx(s){return hs[s*5%hs.length].hex}function mc(s,e){const t=tx.get(e);s.color.setHex(e),s.metalness=t?t.metalness:.6,s.roughness=t?t.roughness:.25}const gi={day:{head:13951732,tail:11536412,brake:16722496},night:{head:16777215,tail:16718382,brake:16733283}},rx=["34 IST 34","06 AB 1923","35 KRZ 35","16 BRS 160","41 KCL 41","07 AT 707"];let zr=null;function ox(){const s=document.createElement("canvas");s.width=64,s.height=64;const e=s.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.22,"rgba(255,255,255,0.55)"),t.addColorStop(.55,"rgba(255,255,255,0.12)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);const n=new es(s);return n.colorSpace=Mt,n}function ax(s){const e=document.createElement("canvas");e.width=256,e.height=64;const t=e.getContext("2d");t.fillStyle="#f8fafc",t.fillRect(0,0,256,64),t.strokeStyle="#0f172a",t.lineWidth=4,t.strokeRect(2,2,252,60),t.fillStyle="#1d4ed8",t.fillRect(4,4,30,56),t.fillStyle="#ffffff",t.font="800 14px system-ui, sans-serif",t.textAlign="center",t.fillText("TR",19,50),t.fillStyle="#0f172a",t.font="900 32px ui-monospace, monospace";const n=206,i=t.measureText(s).width;i>n&&(t.font=`900 ${Math.floor(32*n/i)}px ui-monospace, monospace`),t.fillText(s,142,44);const r=new es(e);return r.colorSpace=Mt,r}function To(){if(zr)return zr;const s=n=>new An({color:n,toneMapped:!1}),e=ox(),t=(n,i)=>new An({color:n,map:e,transparent:!0,opacity:i,blending:Sa,depthWrite:!1,fog:!1,toneMapped:!1});return zr={glass:new bt({color:724758,roughness:.07,metalness:.75,envMapIntensity:1.3}),trim:new bt({color:1382172,roughness:.8,metalness:.05}),rims:[new bt({color:13226201,roughness:.26,metalness:1}),new bt({color:3817287,roughness:.32,metalness:.85}),new bt({color:10125912,roughness:.34,metalness:1})],cargo:[new bt({color:15856887,roughness:.5,metalness:.1}),new bt({color:12831185,roughness:.35,metalness:.6}),new bt({color:3359061,roughness:.45,metalness:.3})],head:s(gi.day.head),tail:s(gi.day.tail),tailBrake:s(gi.day.brake),amber:s(16751135),glowFront:t(15003391,.95),glowRear:t(16719922,.7),glowBrake:t(16724035,1),plates:rx.map(n=>new An({map:ax(n)}))},zr}function dM(s,e){const t=To().glowFront.clone();return t.color.setHex(s),t.opacity=e,t}function cx(s){const e=To(),t=s?gi.night:gi.day;e.head.color.setHex(t.head),e.tail.color.setHex(t.tail),e.tailBrake.color.setHex(t.brake)}const Wi=xt.lerp,Ju=s=>Math.min(1,Math.max(0,s)),Kr=(s,e,t)=>{const n=Ju((t-s)/(e-s));return n*n*(3-2*n)};function lx(s,e){const t=s.index?s.toNonIndexed():s;return!e&&t.attributes.uv&&t.deleteAttribute("uv"),t.attributes.normal||t.computeVertexNormals(),t}function hx(s,e=!1){if(!s.length)return null;const t=qr(s.map(n=>lx(n,e)));return t.computeBoundingSphere(),t}function Ue(s,e,t,n,i,r,o=0){const a=new wt(s,e,t);return o&&a.rotateX(o),a.translate(n,i,r),a}function rn(s,e,t,n,i,r,o=.03){const a=Math.min(o,s/2-.002,e/2-.002,t/2-.002),c=new Qy(s,e,t,2,a);return c.translate(n,i,r),c}function Bs(s,e,t,n,i,r="x",o=12){const a=new ts(s,s,e,o);return r==="x"?a.rotateZ(Math.PI/2):r==="z"&&a.rotateX(Math.PI/2),a.translate(t,n,i),a}function on(s,e,t,n,i,r=!1){const o=new vi(s,e);return r&&o.rotateY(Math.PI),o.translate(t,n,i),o}function Gn(s,e,{bevel:t=.04,bevelSegs:n=2,segs:i=6}={}){const r=new Js;s(r);const o=Math.max(.01,e-2*t),a=new Mo(r,{depth:o,steps:1,curveSegments:i,bevelEnabled:t>0,bevelThickness:t,bevelSize:t,bevelOffset:-t,bevelSegments:n});return a.translate(0,0,-o/2),a.rotateY(-Math.PI/2),a}function zs(s,e){const t=s.attributes.position;for(let n=0;n<t.count;n++)t.setX(n,t.getX(n)*e(t.getY(n),t.getZ(n)));return t.needsUpdate=!0,s}function Yi(s,e=.62){return s.attributes.uv&&s.deleteAttribute("uv"),s.deleteAttribute("normal"),Zy(s,e)}function ho(s,e){s.moveTo(e[0][0],e[0][1]);for(let t=1;t<e.length;t++)s.lineTo(e[t][0],e[t][1]);return s}function Vs(s,e,t,n){const i=[];for(let r=0;r<=n;r++){const o=e+(t-e)*r/n;i.push([s*Math.cos(o),s*Math.sin(o)])}return i}const Qu={aero:{n:5,inner:.36,outer:.84,fill:.6,skew:.28},multi:{n:10,inner:.42,outer:.88,fill:.48,skew:0},twin:{n:6,inner:.34,outer:.86,fill:.68,skew:.12}},Bh=Object.keys(Qu),ma=new Map;function ux(s,e){const t=`${s.toFixed(3)}|${e}`;if(ma.has(t))return ma.get(t);const n=Qu[e],i=Vs(s,0,Math.PI*2,24);i.pop();const r=ho(new Js,i),o=Math.PI*2/n.n;for(let c=0;c<n.n;c++){const l=c*o+.3,h=l+o*n.fill,u=Vs(s*n.outer,l+n.skew,h+n.skew,3),f=Vs(s*n.inner,h,l,1);r.holes.push(ho(new hc,u.concat(f)))}const a=new Gc(r);return a.deleteAttribute("uv"),ma.set(t,a),a}function ef(s,e,t,n,i){const r=t*.74;for(const[o,a]of e){const c=Math.sign(o);s.trim.push(Bs(t,n,o,t,a,"x",18)),s.trim.push(Bs(t*.93,n+.025,o,t,a,"x",18)),s.rim.push(ux(r,i).clone().rotateY(c*Math.PI/2).translate(o+c*(n/2+.016),t,a)),s.rim.push(Bs(t*.11,.03,o+c*(n/2+.012),t,a,"x",10))}}const tf={sedan:{axle:.31,r:.35,tw:.25,gc:.16,noseY:.7,beltY:.94,deckY:.95,lip:.035,aU:-.2,rfU:-.03,rrU:.16,cU:.33,cabinW:.84,tumble:.14,rearCurve:.35,grille:"wide",frontBar:!1,rearBar:!0,exhaust:"twin",twoTone:!0},fastback:{axle:.31,r:.35,tw:.25,gc:.15,noseY:.68,beltY:.93,deckY:.96,lip:.05,aU:-.19,rfU:-.02,rrU:.08,cU:.44,cabinW:.84,tumble:.15,rearCurve:.75,grille:"closed",frontBar:!0,rearBar:!0,exhaust:null,twoTone:!0},coupe:{axle:.31,r:.34,tw:.27,gc:.13,noseY:.66,beltY:.86,deckY:.9,lip:.07,aU:-.12,rfU:.03,rrU:.14,cU:.44,cabinW:.78,tumble:.18,rearCurve:.85,grille:"sport",frontBar:!1,rearBar:!0,exhaust:"quad",twoTone:!0},suv:{axle:.315,r:.38,tw:.27,gc:.22,noseY:.92,beltY:1.08,deckY:1.08,lip:0,aU:-.2,rfU:-.08,rrU:.43,cU:.465,cabinW:.86,tumble:.1,rearCurve:.1,grille:"wide",frontBar:!1,rearBar:!1,exhaust:"twin",twoTone:!0,rails:!0,cladding:!0,roofSpoiler:!0},crossover:{axle:.315,r:.37,tw:.26,gc:.2,noseY:.88,beltY:1.05,deckY:1.07,lip:.05,aU:-.2,rfU:-.07,rrU:.25,cU:.45,cabinW:.85,tumble:.12,rearCurve:.55,grille:"closed",frontBar:!0,rearBar:!0,exhaust:null,twoTone:!0,cladding:!0},van:{axle:.33,r:.37,tw:.26,gc:.2,noseY:.98,beltY:1.12,deckY:1.12,lip:0,aU:-.33,rfU:-.2,rrU:.45,cU:.44,cabinW:.92,tumble:.05,rearCurve:0,grille:"wide",frontBar:!1,rearBar:!1,exhaust:null,twoTone:!1,van:!0},truck:{truck:!0,twoTone:!1},luxury:{axle:.29,r:.36,tw:.26,gc:.15,noseY:.76,beltY:.99,deckY:1,lip:.03,aU:-.17,rfU:-.01,rrU:.19,cU:.345,cabinW:.84,tumble:.13,rearCurve:.3,grille:"singleframe",frontBar:!1,rearBar:!0,exhaust:"twin",twoTone:!1,nose:.12,hx:.33,hw:.2,chrome:!0,flare:!0}},fx={type:"luxury",length:4.85,width:1.94,height:1.45},dx={sedan:["sedan","fastback"],sport:["coupe"],suv:["suv","crossover"],van:["van"],truck:["truck"]};function nf(){return{body:[],glass:[],trim:[],rim:[],cargo:[],head:[],tail:[],blinkL:[],blinkR:[],plate:[],glowF:[],glowR:[],flare:[]}}function px(s,e,t,n){const i=nf(),r=s.length,o=s.width,a=s.height,c=-r/2,l=r/2,{r:h,tw:u,gc:f,noseY:d,beltY:g,deckY:_}=e,m=h+.045,p=-r*e.axle,v=r*e.axle,x=e.aU*r,y=e.rfU*r,I=e.rrU*r,A=e.cU*r,R=o*.98,w=g-.04,M=o*e.cabinW,b=M*(1-e.tumble),P=t?i.glass:i.body,k=e.nose??.2,U=Gn(T=>{T.moveTo(c+.18,f),T.lineTo(p-m,f),T.absarc(p,h,m,Math.PI,0,!0),T.lineTo(p+m,f),T.lineTo(v-m,f),T.absarc(v,h,m,Math.PI,0,!0),T.lineTo(v+m,f),T.lineTo(l-.16,f),T.quadraticCurveTo(l,f,l,f+.16),e.van?T.lineTo(l,_):(T.lineTo(l,_-.14),T.quadraticCurveTo(l+.005,_+.01,l-.14,_+e.lip)),T.lineTo(A,g),T.lineTo(x,g),T.quadraticCurveTo((x+c)/2,g-(g-d)*.25,c+k*1.1,d),T.quadraticCurveTo(c+.01,d-.02,c,d-k),T.lineTo(c,f+.14),T.quadraticCurveTo(c,f,c+.18,f)},R,{bevel:.05}),B=Yi(U);zs(B,(T,te)=>{const $=Kr(.72,1,Math.abs(te)/l),ae=1-(te<0?.09:.06)*$,ie=1-.05*Kr(g-.16,g+.02,T),ce=1-.035*(1-Kr(f,f+.18,T));return ae*ie*ce}),i.body.push(B);const q=T=>te=>1-e.tumble*Ju((te-T)/(a-T)),G=Gn(T=>{const te=x-.03,$=A+.03;T.moveTo(te,w),T.quadraticCurveTo(Wi(te,y,.6),Wi(w,a,.72),y,a-.015),T.quadraticCurveTo((y+I)/2,a+.035,I,a-.015);const ae=Wi((I+$)/2,I+($-I)*.3,e.rearCurve),ie=Wi((a+w)/2,a-.01,e.rearCurve);T.quadraticCurveTo(ae,ie,$,w)},M,{bevel:.035});i.glass.push(Yi(zs(G,q(w))));const J=y+.05,V=I-.02,he=Gn(T=>{T.moveTo(J,a-.05),T.lineTo(J,a),T.quadraticCurveTo((J+V)/2,a+.05,V,a),T.lineTo(V,a-.05)},b+.03,{bevel:.02});if(P.push(Yi(he)),e.van){const T=-.02*r,te=Gn($=>{$.moveTo(T,w),$.lineTo(l,w),$.lineTo(l,a-.12),$.quadraticCurveTo(l,a,l-.12,a),$.lineTo(T,a)},M+.03,{bevel:.03});i.body.push(Yi(zs(te,q(w))))}const le=o/2-u/2-.035;ef(i,[[-le,p],[le,p],[-le,v],[le,v]],h,u,n);const xe=2*(le-u/2)-.02;[p,v].forEach(T=>{i.trim.push(Ue(xe,m+.05,m*1.9,0,h-.05+(m+.05)/2,T))});const Oe=v-p-2*m-.06;if([-1,1].forEach(T=>{i.trim.push(Ue(.03,.08,Oe,T*(R*.965)/2,f+.04,0))}),e.cladding){const T=te=>Gn($=>{const ae=Vs(m+.07,Math.PI,0,10).map(([ce,me])=>[te+ce,h+me]),ie=Vs(m,0,Math.PI,10).map(([ce,me])=>[te+ce,h+me]);ho($,ae.concat(ie))},.05,{bevel:.012,bevelSegs:1});[-1,1].forEach(te=>{[p,v].forEach($=>{i.trim.push(T($).translate(te*(R/2-.012),0,0))}),i.trim.push(Ue(.03,.14,Oe+.02,te*(R*.965/2+.006),f+.12,0))}),i.trim.push(Ue(o*.9,.13,.08,0,f+.07,c+.05)),i.trim.push(Ue(o*.9,.13,.08,0,f+.07,l-.05))}const re=M/2+.1,N=g+.07,X=x+.2;[-1,1].forEach(T=>{i.body.push(rn(.2,.1,.12,T*re,N,X,.04)),i.trim.push(Ue(.12,.03,.05,T*(M/2+.02),N-.03,X+.02)),(T<0?i.blinkL:i.blinkR).push(Ue(.13,.014,.03,T*(re+.01),N-.045,X-.04))}),e.chrome&&[-1,1].forEach(T=>{i.rim.push(Ue(.012,.02,(A-x)*.92,T*(M/2+.004),g+.012,(x+A)/2)),[-.06*r,.12*r].forEach(te=>{i.rim.push(Ue(.015,.025,.16,T*o*.478,g-.08,te))})}),i.glass.push(rn(.055,.065,.17,0,a+.04,I-.2,.025)),e.rails&&[-1,1].forEach(T=>{i.trim.push(Ue(.035,.035,(I-y)*.9,T*(b/2-.04),a+.035,(y+I)/2))}),(e.roofSpoiler||e.van)&&P.push(rn(b*.94,.04,.2,0,a+.005,I+.04,.015));const ee=d-.1,j=o*(e.hx??.3),fe=o*(e.hw??.2);[-1,1].forEach(T=>{i.glass.push(Ue(fe+.04,.12,.06,T*j,ee-.03,c+.04)),i.head.push(Ue(fe,.036,.07,T*j,ee,c+.02)),i.head.push(Ue(.03,.08,.07,T*(j+fe/2-.015),ee-.05,c+.025)),(T<0?i.blinkL:i.blinkR).push(Ue(.1,.028,.065,T*(j-fe/2+.06),ee-.065,c+.028)),i.glowF.push(on(1.1,.55,T*j,ee-.02,c-.07,!0)),e.flare&&i.flare.push(on(2.4,1.3,T*j,ee-.02,c-.1,!0)),e.chrome&&i.head.push(Ue(fe*.8,.014,.07,T*j,ee-.035,c+.022))}),e.frontBar&&i.head.push(Ue(2*j-fe,.016,.07,0,ee+.004,c+.025));const _e=f+.12,ve=d-.14,we=Wi(_e,ve,.45),Y=(ve-_e)*.55;if(e.grille==="wide")i.glass.push(rn(o*.52,Y,.06,0,we,c+.01,.025)),i.rim.push(Ue(o*.54,.012,.02,0,we+Y/2+.008,c-.012));else if(e.grille==="sport")i.glass.push(rn(o*.4,Y*.8,.06,0,we-.02,c+.01,.025)),[-1,1].forEach(T=>{i.glass.push(rn(o*.18,Y*.9,.06,T*o*.34,we-.03,c+.012,.025))});else if(e.grille==="singleframe"){const T=d-.08,te=f+.1,$=T-te,ae=[[-.21,1],[.21,1],[.28,.85],[.31,.42],[.26,.08],[.21,0],[-.21,0],[-.26,.08],[-.31,.42],[-.28,.85]],ie=(ce,me,C)=>{const S=te+$/2,z=ae.map(([oe,Q])=>[oe*o*ce,S+(te+Q*$-S)*ce]),Z=new Mo(ho(new Js,z),{depth:me,steps:1,bevelEnabled:!1});return Z.translate(0,0,C),Z};i.glass.push(ie(1,.08,c-.02)),i.rim.push(ie(1.07,.08,c-.012));for(let ce=-4;ce<=4;ce++)i.rim.push(Ue(.012,$*.76,.012,ce*o*.055,te+$*.5,c-.026));[-1,1].forEach(ce=>{i.glass.push(rn(o*.16,.1,.06,ce*o*.4,f+.17,c+.012,.02))}),i.rim.push(Ue(o*.62,.012,.02,0,f+.075,c+.02))}else i.glass.push(rn(o*.6,.09,.06,0,_e+.04,c+.012,.02));e.cladding||i.trim.push(Ue(o*.84,.05,.1,0,f+.03,c+.06));const ne=e.grille==="closed"?_e+.14:e.grille==="singleframe"?f+.1+(d-.18-f)*.35:we;if(i.plate.push(on(.52,.12,0,ne,c-.036,!0)),e.van)[-1,1].forEach(T=>{const te=T*o*.45;i.glass.push(Ue(.1,.5,.04,te,.95,l-.005)),i.tail.push(Ue(.07,.4,.05,te,1,l+.004)),(T<0?i.blinkL:i.blinkR).push(Ue(.07,.07,.05,te,.74,l+.006)),i.glass.push(Ue(o*.36,.42,.02,T*o*.2,1.62,l+.003)),i.glowR.push(on(.6,.8,te,.95,l+.06))}),i.trim.push(Ue(.02,1.05,.012,0,1.28,l+.004)),i.tail.push(Ue(.36,.03,.03,0,a-.06,l+.004)),i.trim.push(Ue(o*.94,.14,.1,0,f+.06,l-.03)),i.plate.push(on(.52,.12,0,.55,l+.008)),i.trim.push(Ue(.56,.15,.01,0,.55,l+.002));else{const T=_-.12,te=o*.33,$=o*.22;e.rearBar&&(i.glass.push(Ue(o*.86,.085,.05,0,T,l-.008)),i.tail.push(Ue(2*te-$+.02,.02,.05,0,T+.008,l+.003))),[-1,1].forEach(ie=>{e.rearBar||i.glass.push(Ue($+.05,.11,.05,ie*te,T-.01,l-.008)),i.tail.push(Ue($,.045,.05,ie*te,T+.008,l+.004)),i.tail.push(Ue(.035,.1,.05,ie*(te+$/2-.0175),T-.03,l+.002)),(ie<0?i.blinkL:i.blinkR).push(Ue(.1,.026,.05,ie*(te-$/2+.06),T-.028,l+.006)),i.glowR.push(on(.85,.46,ie*te,T,l+.06))}),i.tail.push(Ue(b*.32,.022,.035,0,a-.025,I+.012));const ae=Wi(f+.16,_-.14,.35);i.plate.push(on(.52,.12,0,ae,l+.008)),i.trim.push(Ue(.56,.15,.01,0,ae,l+.002)),i.trim.push(Ue(o*.8,.1,.12,0,f+.06,l-.04)),e.chrome&&i.rim.push(Ue(o*.66,.014,.02,0,T-.07,l+.006)),e.exhaust==="twin"?[-1,1].forEach(ie=>i.rim.push(Ue(.17,.05,.04,ie*o*.3,f+.07,l+.01))):e.exhaust==="quad"&&[-.36,-.27,.27,.36].forEach(ie=>i.rim.push(Bs(.042,.08,ie*o,f+.07,l,"z",12)))}return i}function mx(s,e){const t=nf(),n=s.length,i=s.width,r=s.height,o=-n/2,a=n/2,c=.5,l=.32,h=.5,u=c+.06,f=o+1,d=o+2.1,g=i*.96,_=M=>1-.05*Kr(2.3,2.66,M),m=Gn(M=>{M.moveTo(o+.12,h),M.lineTo(f-u,h),M.absarc(f,c,u,Math.PI,0,!0),M.lineTo(d,h),M.lineTo(d,2.66),M.lineTo(o+.36,2.66),M.quadraticCurveTo(o+.14,2.65,o+.12,2.42),M.lineTo(o+.02,1.15),M.quadraticCurveTo(o,1,o,.85),M.lineTo(o,h+.12),M.quadraticCurveTo(o,h,o+.12,h)},g,{bevel:.07});t.body.push(Yi(zs(m,_)));const p=Gn(M=>{M.moveTo(o+.045,1.6),M.lineTo(o+.105,2.38),M.lineTo(d-.62,2.38),M.lineTo(d-.62,1.6)},g+.014,{bevel:0});t.glass.push(zs(p,_));const v=Gn(M=>{M.moveTo(d-1.3,2.6),M.quadraticCurveTo(d-.45,2.64,d-.02,r-.03),M.lineTo(d+.1,r-.03),M.lineTo(d+.1,2.6)},i*.9,{bevel:.04});t.body.push(Yi(v));const x=d+.15,y=a-x,I=(a+x)/2;t.cargo.push(rn(i,r-1.1,y,0,(r+1.1)/2,I,.06)),t.body.push(Ue(i+.012,.2,y-.3,0,1.38,I)),t.body.push(Ue(i+.012,.05,y-.3,0,1.56,I)),t.trim.push(Ue(i*.72,.26,n-.9,0,.78,.2)),[-1,1].forEach(M=>t.trim.push(Ue(.04,.16,4.2,M*(i/2-.08),.72,-.48))),t.rim.push(Bs(.28,1,-(i/2-.38),.8,-1.6,"z",16));const A=i/2-l/2-.04,R=a-1.95,w=a-.9;return ef(t,[[-A,f],[A,f],[-A,R],[A,R],[-A,w],[A,w]],c,l,e),t.glass.push(rn(i*.62,.42,.05,0,1.3,o+.01,.03)),[1.17,1.3,1.43].forEach(M=>t.rim.push(Ue(i*.6,.025,.02,0,M,o-.02))),t.trim.push(Ue(i*.97,.22,.12,0,.62,o+.04)),[-1,1].forEach(M=>{t.glass.push(Ue(.42,.16,.05,M*.8,.86,o+.01)),t.head.push(Ue(.36,.035,.05,M*.8,.9,o-.005)),t.head.push(Ue(.03,.09,.05,M*.995,.85,o-.004)),(M<0?t.blinkL:t.blinkR).push(Ue(.1,.05,.05,M*1.07,.82,o-.002)),t.glowF.push(on(1.3,.65,M*.8,.88,o-.08,!0)),t.trim.push(Ue(.25,.03,.03,M*(g/2+.1),2.05,o+.35)),t.trim.push(rn(.07,.42,.2,M*(g/2+.22),1.95,o+.35,.025))}),t.plate.push(on(.52,.12,0,.62,o-.028,!0)),t.trim.push(Ue(.025,r-1.25,.012,0,(r+1.1)/2,a+.005)),[-.85,-.3,.3,.85].forEach(M=>t.rim.push(Ue(.03,r-1.4,.03,M,(r+1.1)/2,a+.015))),t.trim.push(Ue(i*.92,.18,.06,0,.92,a-.04)),t.trim.push(Ue(i*.92,.12,.1,0,.55,a-.05)),[-1,1].forEach(M=>{t.tail.push(Ue(.3,.07,.04,M*.8,.94,a)),(M<0?t.blinkL:t.blinkR).push(Ue(.12,.07,.04,M*1.04,.94,a)),t.tail.push(Ue(.18,.035,.03,M*(i/2-.15),r-.07,a+.01)),t.glowR.push(on(.9,.45,M*.8,.94,a+.06))}),t.plate.push(on(.52,.12,0,.72,a+.005)),t}const ga=new Map;function sf(s,e,t,n){const i=`${s.type}|${e}|${t?1:0}|${n}`;if(ga.has(i))return ga.get(i);const r=tf[e],o=r.truck?mx(s,n):px(s,r,t,n),a={};for(const c of Object.keys(o))a[c]=hx(o[c],c==="plate"||c==="glowF"||c==="glowR"||c==="flare");return ga.set(i,a),a}function gx(s,e,t,n){const i=To(),r=dx[s.type]||["sedan"],o=r[t%r.length],a=tf[o],c=!!a.twoTone&&e%3===1,l=a.truck?"multi":Bh[(e+t)%Bh.length],h=sf(s,o,c,l),u=ex?new bt({envMapIntensity:1.15}):new qu({clearcoat:1,clearcoatRoughness:.06,envMapIntensity:1.15});mc(u,n);const f=new ln,d=(y,I)=>{if(!y)return null;const A=new rt(y,I);return f.add(A),A};d(h.body,u),d(h.glass,i.glass),d(h.trim,i.trim),d(h.rim,a.truck?i.rims[0]:i.rims[(e*7+t)%i.rims.length]),d(h.cargo,i.cargo[e%i.cargo.length]),d(h.head,i.head),d(h.plate,i.plates[e%i.plates.length]);const g=d(h.tail,i.tail),_=d(h.blinkL,i.amber),m=d(h.blinkR,i.amber),p=d(h.glowF,i.glowFront),v=d(h.glowR,i.glowRear);_.visible=!1,m.visible=!1,p.visible=!1,v.visible=!1,p.renderOrder=2,v.renderOrder=2;let x=!1;return{group:f,style:o,bodyMat:u,leftBlinker:_,rightBlinker:m,setBraking(y){y!==x&&(x=y,g.material=y?i.tailBrake:i.tail,v.material=y?i.glowBrake:i.glowRear)},setNight(y){p.visible=y,v.visible=y}}}function _x({paintHex:s=946076,metalness:e=.82,roughness:t=.2}={}){const n=To(),i=sf(fx,"luxury",!1,"multi"),r=new qu({color:s,metalness:e,roughness:t,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.2}),o=new bt({color:15133681,roughness:.12,metalness:1}),a=n.head.clone(),c=n.tail.clone(),l=n.glowFront.clone(),h=n.glowRear.clone(),u=n.glowFront.clone();u.color.setHex(10274047);const f=new ln,d=(v,x)=>{const y=new rt(v,x);return f.add(y),y};d(i.body,r),d(i.glass,n.glass),d(i.trim,n.trim),d(i.rim,o),d(i.head,a),d(i.tail,c),d(i.plate,n.plates[0]);const g=d(i.glowF,l),_=d(i.glowR,h),m=d(i.flare,u);[g,_,m].forEach(v=>{v.visible=!1,v.renderOrder=2});let p="";return{group:f,bodyMat:r,setLights({night:v=!1,braking:x=!1,highBeam:y=!1}){const I=`${v?1:0}${x?1:0}${y?1:0}`;if(I===p)return;p=I;const A=v?gi.night:gi.day;a.color.setHex(y?13624063:A.head),c.color.setHex(x?A.brake:A.tail),h.opacity=x?1:.7,g.visible=v||y,_.visible=v||x,m.visible=y}}}const _a=[{type:"sedan",width:1.86,height:1.42,length:4.5,baseSpeedKmh:105},{type:"sport",width:1.92,height:1.28,length:4.4,baseSpeedKmh:122},{type:"suv",width:2.02,height:1.72,length:4.75,baseSpeedKmh:98},{type:"van",width:2.05,height:2.08,length:5.1,baseSpeedKmh:88},{type:"truck",width:2.38,height:3.15,length:8.6,baseSpeedKmh:76}];class vx{constructor(e){this.scene=e,this.vehicles=[],this.densityMode="heavy",this.maxVehicles=18,this.isRemoteControlled=!1,this.nightLights=null,this.lastMakasTime=0,this.lastMakasCarId=-1,this.initPool(24)}setNightLights(e){this.nightLights=e,cx(e);for(const t of this.vehicles)t.visual.setNight(e)}setDensity(e){this.densityMode=e,e==="normal"?this.maxVehicles=12:e==="heavy"?this.maxVehicles=18:this.maxVehicles=24}initPool(e){for(let t=0;t<e;t++){const n=_a[t%_a.length],i=Math.floor(t/_a.length),r=gx(n,t,i,sx(t)),o={id:t+1,spec:n,mesh:r.group,bodyMat:r.bodyMat,visual:r,leftBlinker:r.leftBlinker,rightBlinker:r.rightBlinker,lane:t%4,targetLane:t%4,x:Br[t%4],z:-45-t*22,syncWorldDistM:45+t*22,hasSynced:!1,noCollideUntil:0,pushRemainingZ:0,localOverrideUntil:0,isBraking:!1,speedKmh:n.baseSpeedKmh,targetSpeedKmh:n.baseSpeedKmh,changingLaneTimer:0,blinkerDir:0,overtaken:!1,active:!0};o.mesh.position.set(o.x,0,o.z),this.scene.add(o.mesh),this.vehicles.push(o)}this.resetTraffic()}resetTraffic(){this.isRemoteControlled=!1;for(let e=0;e<this.vehicles.length;e++){const t=this.vehicles[e];t.active=e<this.maxVehicles,t.mesh.visible=t.active,t.hasSynced=!1,this.respawnVehicle(t,-42-e*18)}}getLaneTargetSpeed(e,t){const i=[144,118,98,78][e]??100,r=t.type==="sport"?8:t.type==="truck"?-6:0;return i+r+(Math.random()*10-5)}respawnVehicle(e,t=null,n=0){let i=Math.floor(Math.random()*4);e.spec.type==="truck"?i=Math.random()<.8?3:2:e.spec.type==="van"?i=Math.random()<.6?3:2:e.spec.type==="sport"?i=Math.random()<.72?0:1:e.spec.type==="sedan"&&(i=Math.random()<.45?0:Math.random()<.75?1:2);let r=t!==null?t:n-165-Math.random()*135;for(let a=0;a<10&&this.vehicles.some(l=>l!==e&&l.active&&l.targetLane===i&&Math.abs(l.z-r)<18);a++)e.spec.type==="truck"||e.spec.type==="van"?i=i===3?2:3:i=(i+1)%4,r-=15;const o=new Set(this.vehicles.filter(a=>a!==e&&a.active&&Math.abs(a.z-r)<15).map(a=>a.targetLane));o.size>=3&&o.has(i)&&(r-=24),e.lane=i,e.targetLane=i,e.x=Br[i],e.z=r,e.targetSpeedKmh=this.getLaneTargetSpeed(i,e.spec),e.speedKmh=e.targetSpeedKmh,e.blinkerDir=0,e.changingLaneTimer=0,e.isBraking=!1,e.overtaken=!1,mc(e.bodyMat,ix()),e.mesh.position.set(e.x,0,e.z),e.mesh.rotation.y=0}isLaneClear(e,t,n=15,i=null,r=null){if(t<0||t>3)return!1;const o=Br[t];if(i!==null&&Math.abs(e.z)<16&&Math.abs(o-i)<2.8)return!1;if(r!=null&&r.connected){for(const a of r.peers)if(Math.abs(e.z-a.relZ)<16&&Math.abs(o-a.x)<2.8)return!1}return!this.vehicles.some(a=>a!==e&&a.active&&(a.lane===t||a.targetLane===t)&&Math.abs(a.z-e.z)<n)}notifyHighBeamFlash(e,t=0){let n=!1;for(const i of this.vehicles){if(!i.active)continue;const r=i.z-t;if(r<-8&&r>-85&&Math.abs(i.x-e)<2.2){const o=i.targetLane+1;o<=3&&this.isLaneClear(i,o,14,e)?(i.targetLane=o,i.targetSpeedKmh=this.getLaneTargetSpeed(o,i.spec),i.blinkerDir=1,i.changingLaneTimer=1.6,n=!0):i.targetLane>0&&this.isLaneClear(i,i.targetLane-1,14,e)&&(i.targetLane=i.targetLane-1,i.targetSpeedKmh=this.getLaneTargetSpeed(i.targetLane,i.spec),i.blinkerDir=-1,i.changingLaneTimer=1.6,n=!0)}}return n}applyPeerCarHit(e,t,n,i){const r=this.vehicles.find(o=>o.id===e);r&&(r.pushRemainingZ=t-n-r.z,r.speedKmh=i,r.noCollideUntil=performance.now()/1e3+1.2)}update(e,t,n,i,r=null,o=null){var g,_,m;const a=performance.now()/1e3,c=Math.floor(a*3.5)%2===0,l=!!(o!=null&&o.connected),h=l?Math.min(this.vehicles.length,this.maxVehicles+4):this.maxVehicles;if(r){const p=!!((g=mi[r.weatherKey])!=null&&g.streetlightsOn);p!==this.nightLights&&this.setNightLights(p)}const u=l?o.peers:[],f=Math.min(0,...u.map(p=>p.relZ)),d=Math.max(0,...u.map(p=>p.relZ));for(let p=0;p<this.vehicles.length;p++){const v=this.vehicles[p];if(!this.isRemoteControlled){const U=p<h;U&&!v.active&&this.respawnVehicle(v,null,f),v.active=U,v.mesh.visible=v.active}if(!v.active)continue;const x=v.z;if(this.isRemoteControlled){v.syncWorldDistM+=v.speedKmh/3.6*e;const B=((o==null?void 0:o.localWorldDistM)??0)-v.syncWorldDistM;!v.hasSynced||Math.abs(v.z-B)>22?(v.z=B,v.hasSynced=!0,v.overtaken=v.z>.5):v.z=xt.lerp(v.z,B,Math.min(1,e*18)),v.speedKmh=xt.lerp(v.speedKmh,v.targetSpeedKmh,e*1.5),v.visual.setBraking(v.isBraking)}else{let U=null,B=999;for(const J of this.vehicles)if(!(J===v||!J.active)&&J.targetLane===v.targetLane&&J.z<v.z){const V=v.z-J.z;V<B&&(B=V,U=J)}let q=!1;if(U&&B<18){if(v.z<f-16&&v.lane===v.targetLane&&Math.random()<.02){const J=v.lane-1,V=v.lane+1;this.isLaneClear(v,J,16,n,o)?(v.targetLane=J,v.blinkerDir=-1,v.changingLaneTimer=1.8):this.isLaneClear(v,V,16,n,o)&&(v.targetLane=V,v.blinkerDir=1,v.changingLaneTimer=1.8)}v.speedKmh=xt.lerp(v.speedKmh,U.speedKmh*.92,e*4),q=!0}else v.speedKmh=xt.lerp(v.speedKmh,v.targetSpeedKmh,e*1.5);if(v.z>0&&v.z<30&&Math.abs(v.x-n)<2.8){const J=Math.max(40,t-14);v.speedKmh>J&&(v.speedKmh=J,q=!0)}for(const J of u)if(v.z>J.relZ&&v.z<J.relZ+30&&Math.abs(v.x-J.x)<2.8){const V=Math.max(40,(J.speedKmh||90)-14);v.speedKmh>V&&(v.speedKmh=V,q=!0)}v.isBraking=q,v.visual.setBraking(q);const G=(t-v.speedKmh)/3.6;v.z+=G*e}const y=Br[v.targetLane],I=y-v.x;let A=0;if(Math.abs(I)>.04){const U=Math.sign(I)*Math.min(Math.abs(I),e*3.4);v.x+=U,A=-Math.sign(I)*.065}else v.x=y,v.lane=v.targetLane;v.changingLaneTimer>0&&(v.changingLaneTimer-=e,v.changingLaneTimer<=0&&(v.blinkerDir=0)),v.leftBlinker.visible=v.blinkerDir===-1&&c,v.rightBlinker.visible=v.blinkerDir===1&&c;const R=v.spec.length/2+1.85,w=v.spec.width/2+.86;if(x>=1.2&&v.z<R+1.5&&Math.abs(v.x-n)<w+.5&&(v.z=R+1.5,v.speedKmh=Math.max(35,t-18),this.isRemoteControlled&&o&&(v.syncWorldDistM=o.localWorldDistM-v.z)),v.pushRemainingZ){const U=v.pushRemainingZ*Math.min(1,e*12);v.pushRemainingZ=Math.abs(v.pushRemainingZ-U)<.05?0:v.pushRemainingZ-U,v.z+=U,this.isRemoteControlled&&(v.syncWorldDistM-=U)}const M=r?r.getCurveOffsetAtZ(v.z):0,b=r?r.getCurveYawAtZ(v.z):0;v.mesh.position.set(v.x+M,0,v.z),v.mesh.rotation.y=A+b;const P=Math.abs(v.z),k=Math.abs(v.x-n);if(a>v.noCollideUntil&&x<1.2&&P<R-.4&&k<w-.16&&(v.noCollideUntil=a+1.2,v.pushRemainingZ=-R-1.2-v.z,v.speedKmh=Math.max(50,t*.7),this.isRemoteControlled&&(v.localOverrideUntil=a+.8),(_=i==null?void 0:i.onCollision)==null||_.call(i,v),v.overtaken=!0),!v.overtaken&&x<=.5&&v.z>.5&&t>=95){v.overtaken=!0;const U=k-w;if(U>=-.15&&U<1.65){const B=U<.68&&t>=135,G=a-this.lastMakasTime<.42&&this.lastMakasCarId!==v.id;this.lastMakasTime=a,this.lastMakasCarId=v.id,(m=i==null?void 0:i.onMakas)==null||m.call(i,{car:v,lateralGap:Math.max(.08,U),speedKmh:t,isRazorClose:B,isDoubleMakas:G})}}this.isRemoteControlled||(v.z>d+42?this.respawnVehicle(v,null,f):v.z<f-320&&this.respawnVehicle(v,f-160,f))}}exportSyncState(e,t=null){const n=Math.min(this.vehicles.length,this.maxVehicles+4);return{densityMode:this.densityMode,weatherKey:t,cars:this.vehicles.slice(0,n).map(i=>({id:i.id,active:i.active,lane:i.lane,targetLane:i.targetLane,x:Number(i.x.toFixed(2)),worldDistM:Number((e-i.z).toFixed(2)),speedKmh:Math.round(i.speedKmh),targetSpeedKmh:Math.round(i.targetSpeedKmh),blinkerDir:i.blinkerDir,braking:i.isBraking?1:0,colorHex:i.bodyMat.color.getHex()}))}}applySyncState(e,t){if(!e||!Array.isArray(e.cars))return;const n=performance.now()/1e3;this.isRemoteControlled=!0,e.densityMode&&e.densityMode!==this.densityMode&&this.setDensity(e.densityMode);for(let i=0;i<this.vehicles.length;i++){const r=e.cars[i],o=this.vehicles[i];if(!r||r.active===!1){o.active=!1,o.mesh.visible=!1;continue}if(n<o.localOverrideUntil)continue;o.active=!0,o.mesh.visible=!0,o.lane=r.lane,o.targetLane=r.targetLane,o.speedKmh=r.speedKmh,o.targetSpeedKmh=r.targetSpeedKmh,o.blinkerDir=r.blinkerDir,o.isBraking=!!r.braking,r.blinkerDir!==0&&o.changingLaneTimer<=0&&(o.changingLaneTimer=1),typeof r.colorHex=="number"&&mc(o.bodyMat,r.colorHex),o.syncWorldDistM=r.worldDistM;const a=t-r.worldDistM;!o.hasSynced||Math.abs(o.z-a)>16?(o.z=a,o.x=r.x,o.overtaken=o.z>.5,o.hasSynced=!0):Math.abs(o.x-r.x)>.9&&(o.x=xt.lerp(o.x,r.x,.5))}}getRadarSnapshot(e){const t=this.vehicles.filter(n=>n.active).map(n=>({x:n.x,relX:n.x-e,relZ:n.z}));return t.playerX=e,t}}class yx{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){const e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){const e=[];for(const t of this._parts)e.push(t);return xx(e).buffer}}function xx(s){let e=0;for(const i of s)e+=i.byteLength;const t=new Uint8Array(e);let n=0;for(const i of s){const r=new Uint8Array(i.buffer,i.byteOffset,i.byteLength);t.set(r,n),n+=i.byteLength}return t}function rf(s){return new Mx(s).unpack()}function of(s){const e=new Sx,t=e.pack(s);return t instanceof Promise?t.then(()=>e.getBuffer()):e.getBuffer()}class Mx{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){const e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let t;if((t=e^160)<=15)return this.unpack_raw(t);if((t=e^176)<=15)return this.unpack_string(t);if((t=e^144)<=15)return this.unpack_array(t);if((t=e^128)<=15)return this.unpack_map(t);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return t=this.unpack_uint16(),this.unpack_string(t);case 217:return t=this.unpack_uint32(),this.unpack_string(t);case 218:return t=this.unpack_uint16(),this.unpack_raw(t);case 219:return t=this.unpack_uint32(),this.unpack_raw(t);case 220:return t=this.unpack_uint16(),this.unpack_array(t);case 221:return t=this.unpack_uint32(),this.unpack_array(t);case 222:return t=this.unpack_uint16(),this.unpack_map(t);case 223:return t=this.unpack_uint32(),this.unpack_map(t)}}unpack_uint8(){const e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){const e=this.read(2),t=(e[0]&255)*256+(e[1]&255);return this.index+=2,t}unpack_uint32(){const e=this.read(4),t=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,t}unpack_uint64(){const e=this.read(8),t=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,t}unpack_int8(){const e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){const e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){const e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){const e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);const t=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,t}unpack_string(e){const t=this.read(e);let n=0,i="",r,o;for(;n<e;)r=t[n],r<160?(o=r,n++):(r^192)<32?(o=(r&31)<<6|t[n+1]&63,n+=2):(r^224)<16?(o=(r&15)<<12|(t[n+1]&63)<<6|t[n+2]&63,n+=3):(o=(r&7)<<18|(t[n+1]&63)<<12|(t[n+2]&63)<<6|t[n+3]&63,n+=4),i+=String.fromCodePoint(o);return this.index+=e,i}unpack_array(e){const t=new Array(e);for(let n=0;n<e;n++)t[n]=this.unpack();return t}unpack_map(e){const t={};for(let n=0;n<e;n++){const i=this.unpack();t[i]=this.unpack()}return t}unpack_float(){const e=this.unpack_uint32(),t=e>>31,n=(e>>23&255)-127,i=e&8388607|8388608;return(t===0?1:-1)*i*2**(n-23)}unpack_double(){const e=this.unpack_uint32(),t=this.unpack_uint32(),n=e>>31,i=(e>>20&2047)-1023,o=(e&1048575|1048576)*2**(i-20)+t*2**(i-52);return(n===0?1:-1)*o}read(e){const t=this.index;if(t+e<=this.length)return this.dataView.subarray(t,t+e);throw new Error("BinaryPackFailure: read index out of range")}}class Sx{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{const t=e.constructor;if(e instanceof Array){const n=this.pack_array(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){const n=e;this.pack_bin(new Uint8Array(n.buffer,n.byteOffset,n.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(n=>{this.pack_bin(new Uint8Array(n)),this._bufferBuilder.flush()});if(t==Object||t.toString().startsWith("class")){const n=this.pack_object(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${t.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){const t=e.length;if(t<=15)this.pack_uint8(160+t);else if(t<=65535)this._bufferBuilder.append(218),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(t);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){const t=this._textEncoder.encode(e),n=t.length;if(n<=15)this.pack_uint8(176+n);else if(n<=65535)this._bufferBuilder.append(216),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(n);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(t)}pack_array(e){const t=e.length;if(t<=15)this.pack_uint8(144+t);else if(t<=65535)this._bufferBuilder.append(220),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(t);else throw new Error("Invalid length");const n=i=>{if(i<t){const r=this.pack(e[i]);return r instanceof Promise?r.then(()=>n(i+1)):n(i+1)}};return n(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let t=0;e<0&&(t=1,e=-e);const n=Math.floor(Math.log(e)/Math.LN2),i=e/2**n-1,r=Math.floor(i*2**52),o=2**32,a=t<<31|n+1023<<20|r/o&1048575,c=r%o;this._bufferBuilder.append(203),this.pack_int32(a),this.pack_int32(c)}pack_object(e){const t=Object.keys(e),n=t.length;if(n<=15)this.pack_uint8(128+n);else if(n<=65535)this._bufferBuilder.append(222),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(n);else throw new Error("Invalid length");const i=r=>{if(r<t.length){const o=t[r];if(e.hasOwnProperty(o)){this.pack(o);const a=this.pack(e[o]);if(a instanceof Promise)return a.then(()=>i(r+1))}return i(r+1)}};return i(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){const t=e&4294967295;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_uint64(e){const t=e/4294967296,n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){const t=Math.floor(e/4294967296),n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}constructor(){this._bufferBuilder=new yx,this._textEncoder=new TextEncoder}}let af=!0,cf=!0;function Us(s,e,t){const n=s.match(e);return n&&n.length>=t&&parseFloat(n[t],10)}function Mi(s,e,t){if(!s.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){$c("Unable to polyfill events");return}const i=s.RTCPeerConnection.prototype,r=i.addEventListener;i.addEventListener=function(a,c){if(a!==e)return r.apply(this,arguments);const l=h=>{const u=t(h);u&&(c.handleEvent?c.handleEvent(u):c(u))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(c,l),r.apply(this,[a,l])};const o=i.removeEventListener;i.removeEventListener=function(a,c){if(a!==e||!this._eventMap||!this._eventMap[e])return o.apply(this,arguments);if(!this._eventMap[e].has(c))return o.apply(this,arguments);const l=this._eventMap[e].get(c);return this._eventMap[e].delete(c),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,o.apply(this,[a,l])},Object.defineProperty(i,"on"+e,{get(){return this["_on"+e]},set(a){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),a&&this.addEventListener(e,this["_on"+e]=a)},enumerable:!0,configurable:!0})}function bx(s){return typeof s!="boolean"?new Error("Argument type: "+typeof s+". Please use a boolean."):(af=s,s?"adapter.js logging disabled":"adapter.js logging enabled")}function Tx(s){return typeof s!="boolean"?new Error("Argument type: "+typeof s+". Please use a boolean."):(cf=!s,"adapter.js deprecation warnings "+(s?"disabled":"enabled"))}function $c(){if(typeof window=="object"){if(af)return;typeof console<"u"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function qc(s,e){cf&&console.warn(s+" is deprecated, please use "+e+" instead.")}function Ex(s){const e={browser:null,version:null};if(typeof s>"u"||!s.navigator||!s.navigator.userAgent)return e.browser="Not a browser.",e;const{navigator:t}=s;if(t.userAgentData&&t.userAgentData.brands){const n=t.userAgentData.brands.find(i=>i.brand==="Chromium");if(n){const i=parseInt(n.version,10);if(i>=90)return{browser:"chrome",version:i}}}if(t.mozGetUserMedia)e.browser="firefox",e.version=parseInt(Us(t.userAgent,/Firefox\/(\d+)\./,1));else if(t.webkitGetUserMedia||s.isSecureContext===!1&&s.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(Us(t.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(s.RTCPeerConnection&&t.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(Us(t.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=s.RTCRtpTransceiver&&"currentDirection"in s.RTCRtpTransceiver.prototype,e._safariVersion=Us(t.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function zh(s){return Object.prototype.toString.call(s)==="[object Object]"}function lf(s){return zh(s)?Object.keys(s).reduce(function(e,t){const n=zh(s[t]),i=n?lf(s[t]):s[t],r=n&&!Object.keys(i).length;return i===void 0||r?e:Object.assign(e,{[t]:i})},{}):s}function gc(s,e,t){!e||t.has(e.id)||(t.set(e.id,e),Object.keys(e).forEach(n=>{n.endsWith("Id")?gc(s,s.get(e[n]),t):n.endsWith("Ids")&&e[n].forEach(i=>{gc(s,s.get(i),t)})}))}function Vh(s,e,t){const n=t?"outbound-rtp":"inbound-rtp",i=new Map;if(e===null)return i;const r=[];return s.forEach(o=>{o.type==="track"&&o.trackIdentifier===e.id&&r.push(o)}),r.forEach(o=>{s.forEach(a=>{a.type===n&&a.trackId===o.id&&gc(s,a,i)})}),i}const Gh=$c;function hf(s,e){if(e.version>=64)return;const t=s&&s.navigator;if(!t.mediaDevices)return;const n=function(a){if(typeof a!="object"||a.mandatory||a.optional)return a;const c={};return Object.keys(a).forEach(l=>{if(l==="require"||l==="advanced"||l==="mediaSource")return;const h=typeof a[l]=="object"?a[l]:{ideal:a[l]};h.exact!==void 0&&typeof h.exact=="number"&&(h.min=h.max=h.exact);const u=function(f,d){return f?f+d.charAt(0).toUpperCase()+d.slice(1):d==="deviceId"?"sourceId":d};if(h.ideal!==void 0){c.optional=c.optional||[];let f={};typeof h.ideal=="number"?(f[u("min",l)]=h.ideal,c.optional.push(f),f={},f[u("max",l)]=h.ideal,c.optional.push(f)):(f[u("",l)]=h.ideal,c.optional.push(f))}h.exact!==void 0&&typeof h.exact!="number"?(c.mandatory=c.mandatory||{},c.mandatory[u("",l)]=h.exact):["min","max"].forEach(f=>{h[f]!==void 0&&(c.mandatory=c.mandatory||{},c.mandatory[u(f,l)]=h[f])})}),a.advanced&&(c.optional=(c.optional||[]).concat(a.advanced)),c},i=function(a,c){if(e.version>=61)return c(a);if(a=JSON.parse(JSON.stringify(a)),a&&typeof a.audio=="object"){const l=function(h,u,f){u in h&&!(f in h)&&(h[f]=h[u],delete h[u])};a=JSON.parse(JSON.stringify(a)),l(a.audio,"autoGainControl","googAutoGainControl"),l(a.audio,"noiseSuppression","googNoiseSuppression"),a.audio=n(a.audio)}if(a&&typeof a.video=="object"){let l=a.video.facingMode;l=l&&(typeof l=="object"?l:{ideal:l});const h=e.version<66;if(l&&(l.exact==="user"||l.exact==="environment"||l.ideal==="user"||l.ideal==="environment")&&!(t.mediaDevices.getSupportedConstraints&&t.mediaDevices.getSupportedConstraints().facingMode&&!h)){delete a.video.facingMode;let u;if(l.exact==="environment"||l.ideal==="environment"?u=["back","rear"]:(l.exact==="user"||l.ideal==="user")&&(u=["front"]),u)return t.mediaDevices.enumerateDevices().then(f=>{f=f.filter(g=>g.kind==="videoinput");let d=f.find(g=>u.some(_=>g.label.toLowerCase().includes(_)));return!d&&f.length&&u.includes("back")&&(d=f[f.length-1]),d&&(a.video.deviceId=l.exact?{exact:d.deviceId}:{ideal:d.deviceId}),a.video=n(a.video),Gh("chrome: "+JSON.stringify(a)),c(a)})}a.video=n(a.video)}return Gh("chrome: "+JSON.stringify(a)),c(a)},r=function(a){return e.version>=64?a:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[a.name]||a.name,message:a.message,constraint:a.constraint||a.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},o=function(a,c,l){i(a,h=>{t.webkitGetUserMedia(h,c,u=>{l&&l(r(u))})})};if(t.getUserMedia=o.bind(t),t.mediaDevices.getUserMedia){const a=t.mediaDevices.getUserMedia.bind(t.mediaDevices);t.mediaDevices.getUserMedia=function(c){return i(c,l=>a(l).then(h=>{if(l.audio&&!h.getAudioTracks().length||l.video&&!h.getVideoTracks().length)throw h.getTracks().forEach(u=>{u.stop()}),new DOMException("","NotFoundError");return h},h=>Promise.reject(r(h))))}}}function uf(s){s.MediaStream=s.MediaStream||s.webkitMediaStream}function ff(s,e){if(!(e.version>102))if(typeof s=="object"&&s.RTCPeerConnection&&!("ontrack"in s.RTCPeerConnection.prototype)){Object.defineProperty(s.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(n){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=n)},enumerable:!0,configurable:!0});const t=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=i=>{i.stream.addEventListener("addtrack",r=>{let o;s.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.track.id):o={track:r.track};const a=new Event("track");a.track=r.track,a.receiver=o,a.transceiver={receiver:o},a.streams=[i.stream],this.dispatchEvent(a)}),i.stream.getTracks().forEach(r=>{let o;s.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.id):o={track:r};const a=new Event("track");a.track=r,a.receiver=o,a.transceiver={receiver:o},a.streams=[i.stream],this.dispatchEvent(a)})},this.addEventListener("addstream",this._ontrackpoly)),t.apply(this,arguments)}}else Mi(s,"track",t=>(t.transceiver||Object.defineProperty(t,"transceiver",{value:{receiver:t.receiver}}),t))}function df(s){if(typeof s=="object"&&s.RTCPeerConnection&&!("getSenders"in s.RTCPeerConnection.prototype)&&"createDTMFSender"in s.RTCPeerConnection.prototype){const e=function(i,r){return{track:r,get dtmf(){return this._dtmf===void 0&&(r.kind==="audio"?this._dtmf=i.createDTMFSender(r):this._dtmf=null),this._dtmf},_pc:i}};if(!s.RTCPeerConnection.prototype.getSenders){s.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};const i=s.RTCPeerConnection.prototype.addTrack;s.RTCPeerConnection.prototype.addTrack=function(a,c){let l=i.apply(this,arguments);return l||(l=e(this,a),this._senders.push(l)),l};const r=s.RTCPeerConnection.prototype.removeTrack;s.RTCPeerConnection.prototype.removeTrack=function(a){r.apply(this,arguments);const c=this._senders.indexOf(a);c!==-1&&this._senders.splice(c,1)}}const t=s.RTCPeerConnection.prototype.addStream;s.RTCPeerConnection.prototype.addStream=function(r){this._senders=this._senders||[],t.apply(this,[r]),r.getTracks().forEach(o=>{this._senders.push(e(this,o))})};const n=s.RTCPeerConnection.prototype.removeStream;s.RTCPeerConnection.prototype.removeStream=function(r){this._senders=this._senders||[],n.apply(this,[r]),r.getTracks().forEach(o=>{const a=this._senders.find(c=>c.track===o);a&&this._senders.splice(this._senders.indexOf(a),1)})}}else if(typeof s=="object"&&s.RTCPeerConnection&&"getSenders"in s.RTCPeerConnection.prototype&&"createDTMFSender"in s.RTCPeerConnection.prototype&&s.RTCRtpSender&&!("dtmf"in s.RTCRtpSender.prototype)){const e=s.RTCPeerConnection.prototype.getSenders;s.RTCPeerConnection.prototype.getSenders=function(){const n=e.apply(this,[]);return n.forEach(i=>i._pc=this),n},Object.defineProperty(s.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function pf(s,e){if(e.version>=67||!(typeof s=="object"&&s.RTCPeerConnection&&s.RTCRtpSender&&s.RTCRtpReceiver))return;if(!("getStats"in s.RTCRtpSender.prototype)){const n=s.RTCPeerConnection.prototype.getSenders;n&&(s.RTCPeerConnection.prototype.getSenders=function(){const o=n.apply(this,[]);return o.forEach(a=>a._pc=this),o});const i=s.RTCPeerConnection.prototype.addTrack;i&&(s.RTCPeerConnection.prototype.addTrack=function(){const o=i.apply(this,arguments);return o._pc=this,o}),s.RTCRtpSender.prototype.getStats=function(){const o=this;return this._pc.getStats().then(a=>Vh(a,o.track,!0))}}if(!("getStats"in s.RTCRtpReceiver.prototype)){const n=s.RTCPeerConnection.prototype.getReceivers;n&&(s.RTCPeerConnection.prototype.getReceivers=function(){const r=n.apply(this,[]);return r.forEach(o=>o._pc=this),r}),Mi(s,"track",i=>(i.receiver._pc=i.srcElement,i)),s.RTCRtpReceiver.prototype.getStats=function(){const r=this;return this._pc.getStats().then(o=>Vh(o,r.track,!1))}}if(!("getStats"in s.RTCRtpSender.prototype&&"getStats"in s.RTCRtpReceiver.prototype))return;const t=s.RTCPeerConnection.prototype.getStats;s.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof s.MediaStreamTrack){const i=arguments[0];let r,o,a;return this.getSenders().forEach(c=>{c.track===i&&(r?a=!0:r=c)}),this.getReceivers().forEach(c=>(c.track===i&&(o?a=!0:o=c),c.track===i)),a||r&&o?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):r?r.getStats():o?o.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return t.apply(this,arguments)}}function mf(s){s.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(o=>this._shimmedLocalStreams[o][0])};const e=s.RTCPeerConnection.prototype.addTrack;s.RTCPeerConnection.prototype.addTrack=function(o,a){if(!a)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};const c=e.apply(this,arguments);return this._shimmedLocalStreams[a.id]?this._shimmedLocalStreams[a.id].indexOf(c)===-1&&this._shimmedLocalStreams[a.id].push(c):this._shimmedLocalStreams[a.id]=[a,c],c};const t=s.RTCPeerConnection.prototype.addStream;s.RTCPeerConnection.prototype.addStream=function(o){this._shimmedLocalStreams=this._shimmedLocalStreams||{},o.getTracks().forEach(l=>{if(this.getSenders().find(u=>u.track===l))throw new DOMException("Track already exists.","InvalidAccessError")});const a=this.getSenders();t.apply(this,arguments);const c=this.getSenders().filter(l=>a.indexOf(l)===-1);this._shimmedLocalStreams[o.id]=[o].concat(c)};const n=s.RTCPeerConnection.prototype.removeStream;s.RTCPeerConnection.prototype.removeStream=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[o.id],n.apply(this,arguments)};const i=s.RTCPeerConnection.prototype.removeTrack;s.RTCPeerConnection.prototype.removeTrack=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},o&&Object.keys(this._shimmedLocalStreams).forEach(a=>{const c=this._shimmedLocalStreams[a].indexOf(o);c!==-1&&this._shimmedLocalStreams[a].splice(c,1),this._shimmedLocalStreams[a].length===1&&delete this._shimmedLocalStreams[a]}),i.apply(this,arguments)}}function gf(s,e){if(!s.RTCPeerConnection)return;if(s.RTCPeerConnection.prototype.addTrack&&e.version>=65)return mf(s);const t=s.RTCPeerConnection.prototype.getLocalStreams;s.RTCPeerConnection.prototype.getLocalStreams=function(){const h=t.apply(this);return this._reverseStreams=this._reverseStreams||{},h.map(u=>this._reverseStreams[u.id])};const n=s.RTCPeerConnection.prototype.addStream;s.RTCPeerConnection.prototype.addStream=function(h){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},h.getTracks().forEach(u=>{if(this.getSenders().find(d=>d.track===u))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[h.id]){const u=new s.MediaStream(h.getTracks());this._streams[h.id]=u,this._reverseStreams[u.id]=h,h=u}n.apply(this,[h])};const i=s.RTCPeerConnection.prototype.removeStream;s.RTCPeerConnection.prototype.removeStream=function(h){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},i.apply(this,[this._streams[h.id]||h]),delete this._reverseStreams[this._streams[h.id]?this._streams[h.id].id:h.id],delete this._streams[h.id]},s.RTCPeerConnection.prototype.addTrack=function(h,u){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");const f=[].slice.call(arguments,1);if(f.length!==1||!f[0].getTracks().find(_=>_===h))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(_=>_.track===h))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};const g=this._streams[u.id];if(g)g.addTrack(h),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{const _=new s.MediaStream([h]);this._streams[u.id]=_,this._reverseStreams[_.id]=u,this.addStream(_)}return this.getSenders().find(_=>_.track===h)};function r(l,h){let u=h.sdp;return Object.keys(l._reverseStreams||[]).forEach(f=>{const d=l._reverseStreams[f],g=l._streams[d.id];u=u.replace(new RegExp(g.id,"g"),d.id)}),new RTCSessionDescription({type:h.type,sdp:u})}function o(l,h){let u=h.sdp;return Object.keys(l._reverseStreams||[]).forEach(f=>{const d=l._reverseStreams[f],g=l._streams[d.id];u=u.replace(new RegExp(d.id,"g"),g.id)}),new RTCSessionDescription({type:h.type,sdp:u})}["createOffer","createAnswer"].forEach(function(l){const h=s.RTCPeerConnection.prototype[l],u={[l](){const f=arguments;return arguments.length&&typeof arguments[0]=="function"?h.apply(this,[g=>{const _=r(this,g);f[0].apply(null,[_])},g=>{f[1]&&f[1].apply(null,g)},arguments[2]]):h.apply(this,arguments).then(g=>r(this,g))}};s.RTCPeerConnection.prototype[l]=u[l]});const a=s.RTCPeerConnection.prototype.setLocalDescription;s.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?a.apply(this,arguments):(arguments[0]=o(this,arguments[0]),a.apply(this,arguments))};const c=Object.getOwnPropertyDescriptor(s.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(s.RTCPeerConnection.prototype,"localDescription",{get(){const l=c.get.apply(this);return l.type===""?l:r(this,l)}}),s.RTCPeerConnection.prototype.removeTrack=function(h){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!h._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(h._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let f;Object.keys(this._streams).forEach(d=>{this._streams[d].getTracks().find(_=>h.track===_)&&(f=this._streams[d])}),f&&(f.getTracks().length===1?this.removeStream(this._reverseStreams[f.id]):f.removeTrack(h.track),this.dispatchEvent(new Event("negotiationneeded")))}}function _c(s,e){!s.RTCPeerConnection&&s.webkitRTCPeerConnection&&(s.RTCPeerConnection=s.webkitRTCPeerConnection),s.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){const n=s.RTCPeerConnection.prototype[t],i={[t](){return arguments[0]=new(t==="addIceCandidate"?s.RTCIceCandidate:s.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};s.RTCPeerConnection.prototype[t]=i[t]})}function _f(s,e){e.version>102||Mi(s,"negotiationneeded",t=>{const n=t.target;if(!((e.version<72||n.getConfiguration&&n.getConfiguration().sdpSemantics==="plan-b")&&n.signalingState!=="stable"))return t})}const Hh=Object.freeze(Object.defineProperty({__proto__:null,fixNegotiationNeeded:_f,shimAddTrackRemoveTrack:gf,shimAddTrackRemoveTrackWithNative:mf,shimGetSendersWithDtmf:df,shimGetUserMedia:hf,shimMediaStream:uf,shimOnTrack:ff,shimPeerConnection:_c,shimSenderReceiverGetStats:pf},Symbol.toStringTag,{value:"Module"}));function vf(s,e){const t=s&&s.navigator;if(!t.mediaDevices)return;const n=s&&s.MediaStreamTrack;if(t.getUserMedia=function(i,r,o){qc("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),t.mediaDevices.getUserMedia(i).then(r,o)},!(e.version>55&&"autoGainControl"in t.mediaDevices.getSupportedConstraints())){const i=function(o,a,c){a in o&&!(c in o)&&(o[c]=o[a],delete o[a])},r=t.mediaDevices.getUserMedia.bind(t.mediaDevices);if(t.mediaDevices.getUserMedia=function(o){return typeof o=="object"&&typeof o.audio=="object"&&(o=JSON.parse(JSON.stringify(o)),i(o.audio,"autoGainControl","mozAutoGainControl"),i(o.audio,"noiseSuppression","mozNoiseSuppression")),r(o)},n&&n.prototype.getSettings){const o=n.prototype.getSettings;n.prototype.getSettings=function(){const a=o.apply(this,arguments);return i(a,"mozAutoGainControl","autoGainControl"),i(a,"mozNoiseSuppression","noiseSuppression"),a}}if(n&&n.prototype.applyConstraints){const o=n.prototype.applyConstraints;n.prototype.applyConstraints=function(a){return this.kind==="audio"&&typeof a=="object"&&(a=JSON.parse(JSON.stringify(a)),i(a,"autoGainControl","mozAutoGainControl"),i(a,"noiseSuppression","mozNoiseSuppression")),o.apply(this,[a])}}}}function Cx(s,e){s.navigator.mediaDevices&&(s.navigator.mediaDevices&&"getDisplayMedia"in s.navigator.mediaDevices||(s.navigator.mediaDevices.getDisplayMedia=function(n){if(!(n&&n.video)){const i=new DOMException("getDisplayMedia without video constraints is undefined");return i.name="NotFoundError",i.code=8,Promise.reject(i)}return n.video===!0?n.video={mediaSource:e}:n.video.mediaSource=e,s.navigator.mediaDevices.getUserMedia(n)}))}function yf(s){typeof s=="object"&&s.RTCTrackEvent&&"receiver"in s.RTCTrackEvent.prototype&&!("transceiver"in s.RTCTrackEvent.prototype)&&Object.defineProperty(s.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function vc(s,e){typeof s!="object"||!(s.RTCPeerConnection||s.mozRTCPeerConnection)||(!s.RTCPeerConnection&&s.mozRTCPeerConnection&&(s.RTCPeerConnection=s.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){const n=s.RTCPeerConnection.prototype[t],i={[t](){return arguments[0]=new(t==="addIceCandidate"?s.RTCIceCandidate:s.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};s.RTCPeerConnection.prototype[t]=i[t]}))}function xf(s,e){if(typeof s!="object"||!(s.RTCPeerConnection||s.mozRTCPeerConnection)||e.version>=151)return;const t={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},n=s.RTCPeerConnection.prototype.getStats;s.RTCPeerConnection.prototype.getStats=function(){const[r,o,a]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):n.apply(this,[r||null]).then(c=>{if(e.version<53&&!o)try{c.forEach(l=>{l.type=t[l.type]||l.type})}catch(l){if(l.name!=="TypeError")throw l;c.forEach((h,u)=>{c.set(u,Object.assign({},h,{type:t[h.type]||h.type}))})}return c}).then(o,a)}}function Mf(s){if(!(typeof s=="object"&&s.RTCPeerConnection&&s.RTCRtpSender)||s.RTCRtpSender&&"getStats"in s.RTCRtpSender.prototype)return;const e=s.RTCPeerConnection.prototype.getSenders;e&&(s.RTCPeerConnection.prototype.getSenders=function(){const i=e.apply(this,[]);return i.forEach(r=>r._pc=this),i});const t=s.RTCPeerConnection.prototype.addTrack;t&&(s.RTCPeerConnection.prototype.addTrack=function(){const i=t.apply(this,arguments);return i._pc=this,i}),s.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function Sf(s){if(!(typeof s=="object"&&s.RTCPeerConnection&&s.RTCRtpSender)||s.RTCRtpSender&&"getStats"in s.RTCRtpReceiver.prototype)return;const e=s.RTCPeerConnection.prototype.getReceivers;e&&(s.RTCPeerConnection.prototype.getReceivers=function(){const n=e.apply(this,[]);return n.forEach(i=>i._pc=this),n}),Mi(s,"track",t=>(t.receiver._pc=t.srcElement,t)),s.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function bf(s){!s.RTCPeerConnection||"removeStream"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.removeStream=function(t){qc("removeStream","removeTrack"),this.getSenders().forEach(n=>{n.track&&t.getTracks().includes(n.track)&&this.removeTrack(n)})})}function Tf(s){s.DataChannel&&!s.RTCDataChannel&&(s.RTCDataChannel=s.DataChannel)}function Ef(s,e){if(!(typeof s=="object"&&s.RTCPeerConnection)||e.version>=110)return;const t=s.RTCPeerConnection.prototype.addTransceiver;t&&(s.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let i=arguments[1]&&arguments[1].sendEncodings;i===void 0&&(i=[]),i=[...i];const r=i.length>0;r&&i.forEach(a=>{if("rid"in a&&!/^[a-z0-9]{0,16}$/i.test(a.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in a&&!(parseFloat(a.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in a&&!(parseFloat(a.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});const o=t.apply(this,arguments);if(r){const{sender:a}=o,c=a.getParameters();(!("encodings"in c)||c.encodings.length===1&&Object.keys(c.encodings[0]).length===0)&&(c.encodings=i,a.sendEncodings=i,this.setParametersPromises.push(a.setParameters(c).then(()=>{delete a.sendEncodings}).catch(()=>{delete a.sendEncodings})))}return o})}function Cf(s,e){if(!(typeof s=="object"&&s.RTCRtpSender)||e.version>=110)return;const t=s.RTCRtpSender.prototype.getParameters;t&&(s.RTCRtpSender.prototype.getParameters=function(){const i=t.apply(this,arguments);return"encodings"in i||(i.encodings=[].concat(this.sendEncodings||[{}])),i})}function Af(s,e){if(!(typeof s=="object"&&s.RTCPeerConnection)||e.version>=110)return;const t=s.RTCPeerConnection.prototype.createOffer;s.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}function Rf(s,e){if(!(typeof s=="object"&&s.RTCPeerConnection)||e.version>=110)return;const t=s.RTCPeerConnection.prototype.createAnswer;s.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}const Wh=Object.freeze(Object.defineProperty({__proto__:null,shimAddTransceiver:Ef,shimCreateAnswer:Rf,shimCreateOffer:Af,shimGetDisplayMedia:Cx,shimGetParameters:Cf,shimGetStats:xf,shimGetUserMedia:vf,shimOnTrack:yf,shimPeerConnection:vc,shimRTCDataChannel:Tf,shimReceiverGetStats:Sf,shimRemoveStream:bf,shimSenderGetStats:Mf},Symbol.toStringTag,{value:"Module"}));function wf(s){if(!(typeof s!="object"||!s.RTCPeerConnection)){if("getLocalStreams"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in s.RTCPeerConnection.prototype)){const e=s.RTCPeerConnection.prototype.addTrack;s.RTCPeerConnection.prototype.addStream=function(n){this._localStreams||(this._localStreams=[]),this._localStreams.includes(n)||this._localStreams.push(n),n.getAudioTracks().forEach(i=>e.call(this,i,n)),n.getVideoTracks().forEach(i=>e.call(this,i,n))},s.RTCPeerConnection.prototype.addTrack=function(n,...i){return i&&i.forEach(r=>{this._localStreams?this._localStreams.includes(r)||this._localStreams.push(r):this._localStreams=[r]}),e.apply(this,arguments)}}"removeStream"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.removeStream=function(t){this._localStreams||(this._localStreams=[]);const n=this._localStreams.indexOf(t);if(n===-1)return;this._localStreams.splice(n,1);const i=t.getTracks();this.getSenders().forEach(r=>{i.includes(r.track)&&this.removeTrack(r)})})}}function Pf(s){if(!(typeof s!="object"||!s.RTCPeerConnection)&&("getRemoteStreams"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in s.RTCPeerConnection.prototype))){Object.defineProperty(s.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(t){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=t),this.addEventListener("track",this._onaddstreampoly=n=>{n.streams.forEach(i=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(i))return;this._remoteStreams.push(i);const r=new Event("addstream");r.stream=i,this.dispatchEvent(r)})})}});const e=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(){const n=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(i){i.streams.forEach(r=>{if(n._remoteStreams||(n._remoteStreams=[]),n._remoteStreams.indexOf(r)>=0)return;n._remoteStreams.push(r);const o=new Event("addstream");o.stream=r,n.dispatchEvent(o)})}),e.apply(n,arguments)}}}function Lf(s){if(typeof s!="object"||!s.RTCPeerConnection)return;const e=s.RTCPeerConnection.prototype,t=e.createOffer,n=e.createAnswer,i=e.setLocalDescription,r=e.setRemoteDescription,o=e.addIceCandidate;e.createOffer=function(l,h){const u=arguments.length>=2?arguments[2]:arguments[0],f=t.apply(this,[u]);return h?(f.then(l,h),Promise.resolve()):f},e.createAnswer=function(l,h){const u=arguments.length>=2?arguments[2]:arguments[0],f=n.apply(this,[u]);return h?(f.then(l,h),Promise.resolve()):f};let a=function(c,l,h){const u=i.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u};e.setLocalDescription=a,a=function(c,l,h){const u=r.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u},e.setRemoteDescription=a,a=function(c,l,h){const u=o.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u},e.addIceCandidate=a}function If(s){const e=s&&s.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){const t=e.mediaDevices,n=t.getUserMedia.bind(t);e.mediaDevices.getUserMedia=i=>n(Df(i))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=(function(n,i,r){e.mediaDevices.getUserMedia(n).then(i,r)}).bind(e))}function Df(s){return s&&s.video!==void 0?Object.assign({},s,{video:lf(s.video)}):s}function Uf(s){if(!s.RTCPeerConnection)return;const e=s.RTCPeerConnection;s.RTCPeerConnection=function(n,i){if(n&&n.iceServers){const r=[];for(let o=0;o<n.iceServers.length;o++){let a=n.iceServers[o];a.urls===void 0&&a.url?(qc("RTCIceServer.url","RTCIceServer.urls"),a=JSON.parse(JSON.stringify(a)),a.urls=a.url,delete a.url,r.push(a)):r.push(n.iceServers[o])}n.iceServers=r}return new e(n,i)},s.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(s.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function Nf(s){typeof s=="object"&&s.RTCTrackEvent&&"receiver"in s.RTCTrackEvent.prototype&&!("transceiver"in s.RTCTrackEvent.prototype)&&Object.defineProperty(s.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Of(s){const e=s.RTCPeerConnection.prototype.createOffer;s.RTCPeerConnection.prototype.createOffer=function(n){if(n){typeof n.offerToReceiveAudio<"u"&&(n.offerToReceiveAudio=!!n.offerToReceiveAudio);const i=this.getTransceivers().find(o=>o.receiver.track.kind==="audio");n.offerToReceiveAudio===!1&&i?i.direction==="sendrecv"?i.setDirection?i.setDirection("sendonly"):i.direction="sendonly":i.direction==="recvonly"&&(i.setDirection?i.setDirection("inactive"):i.direction="inactive"):n.offerToReceiveAudio===!0&&!i&&this.addTransceiver("audio",{direction:"recvonly"}),typeof n.offerToReceiveVideo<"u"&&(n.offerToReceiveVideo=!!n.offerToReceiveVideo);const r=this.getTransceivers().find(o=>o.receiver.track.kind==="video");n.offerToReceiveVideo===!1&&r?r.direction==="sendrecv"?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":r.direction==="recvonly"&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):n.offerToReceiveVideo===!0&&!r&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function kf(s){typeof s!="object"||s.AudioContext||(s.AudioContext=s.webkitAudioContext)}const Xh=Object.freeze(Object.defineProperty({__proto__:null,shimAudioContext:kf,shimCallbacksAPI:Lf,shimConstraints:Df,shimCreateOfferLegacy:Of,shimGetUserMedia:If,shimLocalStreamsAPI:wf,shimRTCIceServerUrls:Uf,shimRemoteStreamsAPI:Pf,shimTrackEventTransceiver:Nf},Symbol.toStringTag,{value:"Module"}));function Ax(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var va={exports:{}},$h;function Rx(){return $h||($h=1,(function(s){const e={};e.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)},e.localCName=e.generateIdentifier(),e.splitLines=function(t){return t.trim().split(`
`).map(n=>n.trim())},e.splitSections=function(t){return t.split(`
m=`).map((i,r)=>(r>0?"m="+i:i).trim()+`\r
`)},e.getDescription=function(t){const n=e.splitSections(t);return n&&n[0]},e.getMediaSections=function(t){const n=e.splitSections(t);return n.shift(),n},e.matchPrefix=function(t,n){return e.splitLines(t).filter(i=>i.indexOf(n)===0)},e.parseCandidate=function(t){let n;t.indexOf("a=candidate:")===0?n=t.substring(12).split(" "):n=t.substring(10).split(" ");const i={foundation:n[0],component:{1:"rtp",2:"rtcp"}[n[1]]||n[1],protocol:n[2].toLowerCase(),priority:parseInt(n[3],10),ip:n[4],address:n[4],port:parseInt(n[5],10),type:n[7]};for(let r=8;r<n.length;r+=2)switch(n[r]){case"raddr":i.relatedAddress=n[r+1];break;case"rport":i.relatedPort=parseInt(n[r+1],10);break;case"tcptype":i.tcpType=n[r+1];break;case"ufrag":i.ufrag=n[r+1],i.usernameFragment=n[r+1];break;default:i[n[r]]===void 0&&(i[n[r]]=n[r+1]);break}return i},e.writeCandidate=function(t){const n=[];n.push(t.foundation);const i=t.component;i==="rtp"?n.push(1):i==="rtcp"?n.push(2):n.push(i),n.push(t.protocol.toUpperCase()),n.push(t.priority),n.push(t.address||t.ip),n.push(t.port);const r=t.type;return n.push("typ"),n.push(r),r!=="host"&&t.relatedAddress&&t.relatedPort!==void 0&&(n.push("raddr"),n.push(t.relatedAddress),n.push("rport"),n.push(t.relatedPort)),t.tcpType&&t.protocol.toLowerCase()==="tcp"&&(n.push("tcptype"),n.push(t.tcpType)),(t.usernameFragment||t.ufrag)&&(n.push("ufrag"),n.push(t.usernameFragment||t.ufrag)),"candidate:"+n.join(" ")},e.parseIceOptions=function(t){return t.substring(14).split(" ")},e.parseRtpMap=function(t){let n=t.substring(9).split(" ");const i={payloadType:parseInt(n.shift(),10)};return n=n[0].split("/"),i.name=n[0],i.clockRate=parseInt(n[1],10),i.channels=n.length===3?parseInt(n[2],10):1,i.numChannels=i.channels,i},e.writeRtpMap=function(t){let n=t.payloadType;t.preferredPayloadType!==void 0&&(n=t.preferredPayloadType);const i=t.channels||t.numChannels||1;return"a=rtpmap:"+n+" "+t.name+"/"+t.clockRate+(i!==1?"/"+i:"")+`\r
`},e.parseExtmap=function(t){const n=t.substring(9).split(" ");return{id:parseInt(n[0],10),direction:n[0].indexOf("/")>0?n[0].split("/")[1]:"sendrecv",uri:n[1],attributes:n.slice(2).join(" ")}},e.writeExtmap=function(t){return"a=extmap:"+(t.id||t.preferredId)+(t.direction&&t.direction!=="sendrecv"?"/"+t.direction:"")+" "+t.uri+(t.attributes?" "+t.attributes:"")+`\r
`},e.parseFmtp=function(t){const n={};let i;const r=t.substring(t.indexOf(" ")+1).split(";");for(let o=0;o<r.length;o++)i=r[o].trim().split("="),n[i[0].trim()]=i[1];return n},e.writeFmtp=function(t){let n="",i=t.payloadType;if(t.preferredPayloadType!==void 0&&(i=t.preferredPayloadType),t.parameters&&Object.keys(t.parameters).length){const r=[];Object.keys(t.parameters).forEach(o=>{t.parameters[o]!==void 0?r.push(o+"="+t.parameters[o]):r.push(o)}),n+="a=fmtp:"+i+" "+r.join(";")+`\r
`}return n},e.parseRtcpFb=function(t){const n=t.substring(t.indexOf(" ")+1).split(" ");return{type:n.shift(),parameter:n.join(" ")}},e.writeRtcpFb=function(t){let n="",i=t.payloadType;return t.preferredPayloadType!==void 0&&(i=t.preferredPayloadType),t.rtcpFeedback&&t.rtcpFeedback.length&&t.rtcpFeedback.forEach(r=>{n+="a=rtcp-fb:"+i+" "+r.type+(r.parameter&&r.parameter.length?" "+r.parameter:"")+`\r
`}),n},e.parseSsrcMedia=function(t){const n=t.indexOf(" "),i={ssrc:parseInt(t.substring(7,n),10)},r=t.indexOf(":",n);return r>-1?(i.attribute=t.substring(n+1,r),i.value=t.substring(r+1)):i.attribute=t.substring(n+1),i},e.parseSsrcGroup=function(t){const n=t.substring(13).split(" ");return{semantics:n.shift(),ssrcs:n.map(i=>parseInt(i,10))}},e.getMid=function(t){const n=e.matchPrefix(t,"a=mid:")[0];if(n)return n.substring(6)},e.parseFingerprint=function(t){const n=t.substring(14).split(" ");return{algorithm:n[0].toLowerCase(),value:n[1].toUpperCase()}},e.getDtlsParameters=function(t,n){return{role:"auto",fingerprints:e.matchPrefix(t+n,"a=fingerprint:").map(e.parseFingerprint)}},e.writeDtlsParameters=function(t,n){let i="a=setup:"+n+`\r
`;return t.fingerprints.forEach(r=>{i+="a=fingerprint:"+r.algorithm+" "+r.value+`\r
`}),i},e.parseCryptoLine=function(t){const n=t.substring(9).split(" ");return{tag:parseInt(n[0],10),cryptoSuite:n[1],keyParams:n[2],sessionParams:n.slice(3)}},e.writeCryptoLine=function(t){return"a=crypto:"+t.tag+" "+t.cryptoSuite+" "+(typeof t.keyParams=="object"?e.writeCryptoKeyParams(t.keyParams):t.keyParams)+(t.sessionParams?" "+t.sessionParams.join(" "):"")+`\r
`},e.parseCryptoKeyParams=function(t){if(t.indexOf("inline:")!==0)return null;const n=t.substring(7).split("|");return{keyMethod:"inline",keySalt:n[0],lifeTime:n[1],mkiValue:n[2]?n[2].split(":")[0]:void 0,mkiLength:n[2]?n[2].split(":")[1]:void 0}},e.writeCryptoKeyParams=function(t){return t.keyMethod+":"+t.keySalt+(t.lifeTime?"|"+t.lifeTime:"")+(t.mkiValue&&t.mkiLength?"|"+t.mkiValue+":"+t.mkiLength:"")},e.getCryptoParameters=function(t,n){return e.matchPrefix(t+n,"a=crypto:").map(e.parseCryptoLine)},e.getIceParameters=function(t,n){const i=e.matchPrefix(t+n,"a=ice-ufrag:")[0],r=e.matchPrefix(t+n,"a=ice-pwd:")[0];return i&&r?{usernameFragment:i.substring(12),password:r.substring(10)}:null},e.writeIceParameters=function(t){let n="a=ice-ufrag:"+t.usernameFragment+`\r
a=ice-pwd:`+t.password+`\r
`;return t.iceLite&&(n+=`a=ice-lite\r
`),n},e.parseRtpParameters=function(t){const n={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},r=e.splitLines(t)[0].split(" ");n.profile=r[2];for(let a=3;a<r.length;a++){const c=r[a],l=e.matchPrefix(t,"a=rtpmap:"+c+" ")[0];if(l){const h=e.parseRtpMap(l),u=e.matchPrefix(t,"a=fmtp:"+c+" ");switch(h.parameters=u.length?e.parseFmtp(u[0]):{},h.rtcpFeedback=e.matchPrefix(t,"a=rtcp-fb:"+c+" ").map(e.parseRtcpFb),n.codecs.push(h),h.name.toUpperCase()){case"RED":case"ULPFEC":n.fecMechanisms.push(h.name.toUpperCase());break}}}e.matchPrefix(t,"a=extmap:").forEach(a=>{n.headerExtensions.push(e.parseExtmap(a))});const o=e.matchPrefix(t,"a=rtcp-fb:* ").map(e.parseRtcpFb);return n.codecs.forEach(a=>{o.forEach(c=>{a.rtcpFeedback.find(h=>h.type===c.type&&h.parameter===c.parameter)||a.rtcpFeedback.push(c)})}),n},e.writeRtpDescription=function(t,n){let i="";i+="m="+t+" ",i+=n.codecs.length>0?"9":"0",i+=" "+(n.profile||"UDP/TLS/RTP/SAVPF")+" ",i+=n.codecs.map(o=>o.preferredPayloadType!==void 0?o.preferredPayloadType:o.payloadType).join(" ")+`\r
`,i+=`c=IN IP4 0.0.0.0\r
`,i+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,n.codecs.forEach(o=>{i+=e.writeRtpMap(o),i+=e.writeFmtp(o),i+=e.writeRtcpFb(o)});let r=0;return n.codecs.forEach(o=>{o.maxptime>r&&(r=o.maxptime)}),r>0&&(i+="a=maxptime:"+r+`\r
`),n.headerExtensions&&n.headerExtensions.forEach(o=>{i+=e.writeExtmap(o)}),i},e.parseRtpEncodingParameters=function(t){const n=[],i=e.parseRtpParameters(t),r=i.fecMechanisms.indexOf("RED")!==-1,o=i.fecMechanisms.indexOf("ULPFEC")!==-1,a=e.matchPrefix(t,"a=ssrc:").map(f=>e.parseSsrcMedia(f)).filter(f=>f.attribute==="cname"),c=a.length>0&&a[0].ssrc;let l;const h=e.matchPrefix(t,"a=ssrc-group:FID").map(f=>f.substring(17).split(" ").map(g=>parseInt(g,10)));h.length>0&&h[0].length>1&&h[0][0]===c&&(l=h[0][1]),i.codecs.forEach(f=>{if(f.name.toUpperCase()==="RTX"&&f.parameters.apt){let d={ssrc:c,codecPayloadType:parseInt(f.parameters.apt,10)};c&&l&&(d.rtx={ssrc:l}),n.push(d),r&&(d=JSON.parse(JSON.stringify(d)),d.fec={ssrc:c,mechanism:o?"red+ulpfec":"red"},n.push(d))}}),n.length===0&&c&&n.push({ssrc:c});let u=e.matchPrefix(t,"b=");return u.length&&(u[0].indexOf("b=TIAS:")===0?u=parseInt(u[0].substring(7),10):u[0].indexOf("b=AS:")===0?u=parseInt(u[0].substring(5),10)*1e3*.95-2e3*8:u=void 0,n.forEach(f=>{f.maxBitrate=u})),n},e.parseRtcpParameters=function(t){const n={},i=e.matchPrefix(t,"a=ssrc:").map(a=>e.parseSsrcMedia(a)).filter(a=>a.attribute==="cname")[0];i&&(n.cname=i.value,n.ssrc=i.ssrc);const r=e.matchPrefix(t,"a=rtcp-rsize");n.reducedSize=r.length>0,n.compound=r.length===0;const o=e.matchPrefix(t,"a=rtcp-mux");return n.mux=o.length>0,n},e.writeRtcpParameters=function(t){let n="";return t.reducedSize&&(n+=`a=rtcp-rsize\r
`),t.mux&&(n+=`a=rtcp-mux\r
`),t.ssrc!==void 0&&t.cname&&(n+="a=ssrc:"+t.ssrc+" cname:"+t.cname+`\r
`),n},e.parseMsid=function(t){let n;const i=e.matchPrefix(t,"a=msid:");if(i.length===1)return n=i[0].substring(7).split(" "),{stream:n[0],track:n[1]};const r=e.matchPrefix(t,"a=ssrc:").map(o=>e.parseSsrcMedia(o)).filter(o=>o.attribute==="msid");if(r.length>0)return n=r[0].value.split(" "),{stream:n[0],track:n[1]}},e.parseSctpDescription=function(t){const n=e.parseMLine(t),i=e.matchPrefix(t,"a=max-message-size:");let r;i.length>0&&(r=parseInt(i[0].substring(19),10)),isNaN(r)&&(r=65536);const o=e.matchPrefix(t,"a=sctp-port:");if(o.length>0)return{port:parseInt(o[0].substring(12),10),protocol:n.fmt,maxMessageSize:r};const a=e.matchPrefix(t,"a=sctpmap:");if(a.length>0){const c=a[0].substring(10).split(" ");return{port:parseInt(c[0],10),protocol:c[1],maxMessageSize:r}}},e.writeSctpDescription=function(t,n){let i=[];return t.protocol!=="DTLS/SCTP"?i=["m="+t.kind+" 9 "+t.protocol+" "+n.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+n.port+`\r
`]:i=["m="+t.kind+" 9 "+t.protocol+" "+n.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+n.port+" "+n.protocol+` 65535\r
`],n.maxMessageSize!==void 0&&i.push("a=max-message-size:"+n.maxMessageSize+`\r
`),i.join("")},e.generateSessionId=function(){return Math.random().toString().substr(2,22)},e.writeSessionBoilerplate=function(t,n,i){let r;const o=n!==void 0?n:2;return t?r=t:r=e.generateSessionId(),`v=0\r
o=`+(i||"thisisadapterortc")+" "+r+" "+o+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`},e.getDirection=function(t,n){const i=e.splitLines(t);for(let r=0;r<i.length;r++)switch(i[r]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return i[r].substring(2)}return n?e.getDirection(n):"sendrecv"},e.getKind=function(t){return e.splitLines(t)[0].split(" ")[0].substring(2)},e.isRejected=function(t){return t.split(" ",2)[1]==="0"},e.parseMLine=function(t){const i=e.splitLines(t)[0].substring(2).split(" ");return{kind:i[0],port:parseInt(i[1],10),protocol:i[2],fmt:i.slice(3).join(" ")}},e.parseOLine=function(t){const i=e.matchPrefix(t,"o=")[0].substring(2).split(" ");return{username:i[0],sessionId:i[1],sessionVersion:parseInt(i[2],10),netType:i[3],addressType:i[4],address:i[5]}},e.isValidSDP=function(t){if(typeof t!="string"||t.length===0)return!1;const n=e.splitLines(t);for(let i=0;i<n.length;i++)if(n[i].length<2||n[i].charAt(1)!=="=")return!1;return!0},s.exports=e})(va)),va.exports}var Ff=Rx();const ns=Ax(Ff),wx=Jf({__proto__:null,default:ns},[Ff]);function Yr(s){if(!s.RTCIceCandidate||s.RTCIceCandidate&&"foundation"in s.RTCIceCandidate.prototype)return;const e=s.RTCIceCandidate;s.RTCIceCandidate=function(n){if(typeof n=="object"&&n.candidate&&n.candidate.indexOf("a=")===0&&(n=JSON.parse(JSON.stringify(n)),n.candidate=n.candidate.substring(2)),n.candidate&&n.candidate.length){const i=new e(n),r=ns.parseCandidate(n.candidate);for(const o in r)o in i||Object.defineProperty(i,o,{value:r[o]});return i.toJSON=function(){return{candidate:i.candidate,sdpMid:i.sdpMid,sdpMLineIndex:i.sdpMLineIndex,usernameFragment:i.usernameFragment}},i}return new e(n)},s.RTCIceCandidate.prototype=e.prototype,Mi(s,"icecandidate",t=>(t.candidate&&Object.defineProperty(t,"candidate",{value:new s.RTCIceCandidate(t.candidate),writable:"false"}),t))}function yc(s){!s.RTCIceCandidate||s.RTCIceCandidate&&"relayProtocol"in s.RTCIceCandidate.prototype||Mi(s,"icecandidate",e=>{if(e.candidate){const t=ns.parseCandidate(e.candidate.candidate);t.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[t.priority>>24])}return e})}function jr(s,e){if(!s.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in s.RTCPeerConnection.prototype||Object.defineProperty(s.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp}});const t=function(a){if(!a||!a.sdp)return!1;const c=ns.splitSections(a.sdp);return c.shift(),c.some(l=>{const h=ns.parseMLine(l);return h&&h.kind==="application"&&h.protocol.indexOf("SCTP")!==-1})},n=function(a){const c=a.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(c===null||c.length<2)return-1;const l=parseInt(c[1],10);return l!==l?-1:l},i=function(a){let c=65536;return e.browser==="firefox"&&(e.version<57?a===-1?c=16384:c=2147483637:e.version<60?c=e.version===57?65535:65536:c=2147483637),c},r=function(a,c){let l=65536;e.browser==="firefox"&&e.version===57&&(l=65535);const h=ns.matchPrefix(a.sdp,"a=max-message-size:");return h.length>0?l=parseInt(h[0].substring(19),10):e.browser==="firefox"&&c!==-1&&(l=2147483637),l},o=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){const{sdpSemantics:c}=this.getConfiguration();c==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp},enumerable:!0,configurable:!0})}if(t(arguments[0])){const c=n(arguments[0]),l=i(c),h=r(arguments[0],c);let u;l===0&&h===0?u=Number.POSITIVE_INFINITY:l===0||h===0?u=Math.max(l,h):u=Math.min(l,h);const f={};Object.defineProperty(f,"maxMessageSize",{get(){return u}}),this._sctp=f}return o.apply(this,arguments)}}function Zr(s,e){if(!(s.RTCPeerConnection&&"createDataChannel"in s.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function t(i,r){const o=i.send;i.send=function(){const c=arguments[0],l=c.length||c.size||c.byteLength;if(i.readyState==="open"&&r.sctp&&l>r.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+r.sctp.maxMessageSize+" bytes)");return o.apply(i,arguments)}}const n=s.RTCPeerConnection.prototype.createDataChannel;s.RTCPeerConnection.prototype.createDataChannel=function(){const r=n.apply(this,arguments);return t(r,this),r},Mi(s,"datachannel",i=>(t(i.channel,i.target),i))}function xc(s){if(!s.RTCPeerConnection||"connectionState"in s.RTCPeerConnection.prototype)return;const e=s.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(t){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),t&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=t)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(t=>{const n=e[t];e[t]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=i=>{const r=i.target;if(r._lastConnectionState!==r.connectionState){r._lastConnectionState=r.connectionState;const o=new Event("connectionstatechange",i);r.dispatchEvent(o)}return i},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),n.apply(this,arguments)}})}function Mc(s,e){if(!s.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;const t=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(i){if(i&&i.sdp&&i.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){const r=i.sdp.split(`
`).filter(o=>o.trim()!=="a=extmap-allow-mixed").join(`
`);s.RTCSessionDescription&&i instanceof s.RTCSessionDescription?arguments[0]=new s.RTCSessionDescription({type:i.type,sdp:r}):i.sdp=r}return t.apply(this,arguments)}}function Jr(s,e){if(!(s.RTCPeerConnection&&s.RTCPeerConnection.prototype))return;const t=s.RTCPeerConnection.prototype.addIceCandidate;!t||t.length===0||(s.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():t.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function Qr(s,e){if(!(s.RTCPeerConnection&&s.RTCPeerConnection.prototype))return;const t=s.RTCPeerConnection.prototype.setLocalDescription;!t||t.length===0||(s.RTCPeerConnection.prototype.setLocalDescription=function(){let i=arguments[0]||{};if(typeof i!="object"||i.type&&i.sdp)return t.apply(this,arguments);if(i={type:i.type,sdp:i.sdp},!i.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":i.type="offer";break;default:i.type="answer";break}return i.sdp||i.type!=="offer"&&i.type!=="answer"?t.apply(this,[i]):(i.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(o=>t.apply(this,[o]))})}const Px=Object.freeze(Object.defineProperty({__proto__:null,removeExtmapAllowMixed:Mc,shimAddIceCandidateNullOrEmpty:Jr,shimConnectionState:xc,shimMaxMessageSize:jr,shimParameterlessSetLocalDescription:Qr,shimRTCIceCandidate:Yr,shimRTCIceCandidateRelayProtocol:yc,shimSendThrowTypeError:Zr},Symbol.toStringTag,{value:"Module"}));function Lx({window:s}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){const t=$c,n=Ex(s),i={browserDetails:n,commonShim:Px,extractVersion:Us,disableLog:bx,disableWarnings:Tx,sdp:wx};switch(n.browser){case"chrome":if(!Hh||!_c||!e.shimChrome)return t("Chrome shim is not included in this adapter release."),i;if(n.version===null)return t("Chrome shim can not determine version, not shimming."),i;t("adapter.js shimming chrome."),i.browserShim=Hh,Jr(s,n),Qr(s),hf(s,n),uf(s),_c(s,n),ff(s,n),gf(s,n),df(s),pf(s,n),_f(s,n),Yr(s),yc(s),xc(s),jr(s,n),Zr(s,n),Mc(s,n);break;case"firefox":if(!Wh||!vc||!e.shimFirefox)return t("Firefox shim is not included in this adapter release."),i;t("adapter.js shimming firefox."),i.browserShim=Wh,Jr(s,n),Qr(s),vf(s,n),vc(s,n),xf(s,n),yf(s),bf(s),Mf(s),Sf(s),Tf(s),Ef(s,n),Cf(s,n),Af(s,n),Rf(s,n),Yr(s),xc(s),jr(s,n),Zr(s,n);break;case"safari":if(!Xh||!e.shimSafari)return t("Safari shim is not included in this adapter release."),i;t("adapter.js shimming safari."),i.browserShim=Xh,Jr(s,n),Qr(s),Uf(s),Of(s),Lf(s),wf(s),Pf(s),Nf(s),If(s),kf(s),Yr(s),yc(s),jr(s,n),Zr(s,n),Mc(s,n);break;default:t("Unsupported browser!");break}return i}const qh=Lx({window:typeof window>"u"?void 0:window});function Si(s,e,t,n){Object.defineProperty(s,e,{get:t,set:n,enumerable:!0,configurable:!0})}class Bf{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{const t=[],n=e.byteLength,i=Math.ceil(n/this.chunkedMTU);let r=0,o=0;for(;o<n;){const a=Math.min(n,o+this.chunkedMTU),c=e.slice(o,a),l={__peerData:this._dataCount,n:r,data:c,total:i};t.push(l),o=a,r++}return this._dataCount++,t}}}function Ix(s){let e=0;for(const i of s)e+=i.byteLength;const t=new Uint8Array(e);let n=0;for(const i of s)t.set(i,n),n+=i.byteLength;return t}const ya=qh.default||qh,Ls=new class{isWebRTCSupported(){return typeof RTCPeerConnection<"u"}isBrowserSupported(){const s=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(s)?s==="chrome"?e>=this.minChromeVersion:s==="firefox"?e>=this.minFirefoxVersion:s==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return ya.browserDetails.browser}getVersion(){return ya.browserDetails.version||0}isUnifiedPlanSupported(){const s=this.getBrowser(),e=ya.browserDetails.version||0;if(s==="chrome"&&e<this.minChromeVersion)return!1;if(s==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let t,n=!1;try{t=new RTCPeerConnection,t.addTransceiver("audio"),n=!0}catch{}finally{t&&t.close()}return n}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator<"u"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},Dx=s=>!s||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(s),zf=()=>Math.random().toString(36).slice(2),Kh={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"};class Ux extends Bf{noop(){}blobToArrayBuffer(e,t){const n=new FileReader;return n.onload=function(i){i.target&&t(i.target.result)},n.readAsArrayBuffer(e),n}binaryStringToArrayBuffer(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n)&255;return t.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=Kh,this.browser=Ls.getBrowser(),this.browserVersion=Ls.getVersion(),this.pack=of,this.unpack=rf,this.supports=(function(){const t={browser:Ls.isBrowserSupported(),webRTC:Ls.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!t.webRTC)return t;let n;try{n=new RTCPeerConnection(Kh),t.audioVideo=!0;let i;try{i=n.createDataChannel("_PEERJSTEST",{ordered:!0}),t.data=!0,t.reliable=!!i.ordered;try{i.binaryType="blob",t.binaryBlob=!Ls.isIOS}catch{}}catch{}finally{i&&i.close()}}catch{}finally{n&&n.close()}return t})(),this.validateId=Dx,this.randomToken=zf}}const zt=new Ux,Nx="PeerJS: ";class Ox{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...t){const n=[Nx,...t];for(const i in n)n[i]instanceof Error&&(n[i]="("+n[i].name+") "+n[i].message);e>=3?console.log(...n):e>=2?console.warn("WARNING",...n):e>=1&&console.error("ERROR",...n)}constructor(){this._logLevel=0}}var Re=new Ox,Kc={},kx=Object.prototype.hasOwnProperty,Ft="~";function js(){}Object.create&&(js.prototype=Object.create(null),new js().__proto__||(Ft=!1));function Fx(s,e,t){this.fn=s,this.context=e,this.once=t||!1}function Vf(s,e,t,n,i){if(typeof t!="function")throw new TypeError("The listener must be a function");var r=new Fx(t,n||s,i),o=Ft?Ft+e:e;return s._events[o]?s._events[o].fn?s._events[o]=[s._events[o],r]:s._events[o].push(r):(s._events[o]=r,s._eventsCount++),s}function eo(s,e){--s._eventsCount===0?s._events=new js:delete s._events[e]}function Lt(){this._events=new js,this._eventsCount=0}Lt.prototype.eventNames=function(){var e=[],t,n;if(this._eventsCount===0)return e;for(n in t=this._events)kx.call(t,n)&&e.push(Ft?n.slice(1):n);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(t)):e};Lt.prototype.listeners=function(e){var t=Ft?Ft+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var i=0,r=n.length,o=new Array(r);i<r;i++)o[i]=n[i].fn;return o};Lt.prototype.listenerCount=function(e){var t=Ft?Ft+e:e,n=this._events[t];return n?n.fn?1:n.length:0};Lt.prototype.emit=function(e,t,n,i,r,o){var a=Ft?Ft+e:e;if(!this._events[a])return!1;var c=this._events[a],l=arguments.length,h,u;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,n),!0;case 4:return c.fn.call(c.context,t,n,i),!0;case 5:return c.fn.call(c.context,t,n,i,r),!0;case 6:return c.fn.call(c.context,t,n,i,r,o),!0}for(u=1,h=new Array(l-1);u<l;u++)h[u-1]=arguments[u];c.fn.apply(c.context,h)}else{var f=c.length,d;for(u=0;u<f;u++)switch(c[u].once&&this.removeListener(e,c[u].fn,void 0,!0),l){case 1:c[u].fn.call(c[u].context);break;case 2:c[u].fn.call(c[u].context,t);break;case 3:c[u].fn.call(c[u].context,t,n);break;case 4:c[u].fn.call(c[u].context,t,n,i);break;default:if(!h)for(d=1,h=new Array(l-1);d<l;d++)h[d-1]=arguments[d];c[u].fn.apply(c[u].context,h)}}return!0};Lt.prototype.on=function(e,t,n){return Vf(this,e,t,n,!1)};Lt.prototype.once=function(e,t,n){return Vf(this,e,t,n,!0)};Lt.prototype.removeListener=function(e,t,n,i){var r=Ft?Ft+e:e;if(!this._events[r])return this;if(!t)return eo(this,r),this;var o=this._events[r];if(o.fn)o.fn===t&&(!i||o.once)&&(!n||o.context===n)&&eo(this,r);else{for(var a=0,c=[],l=o.length;a<l;a++)(o[a].fn!==t||i&&!o[a].once||n&&o[a].context!==n)&&c.push(o[a]);c.length?this._events[r]=c.length===1?c[0]:c:eo(this,r)}return this};Lt.prototype.removeAllListeners=function(e){var t;return e?(t=Ft?Ft+e:e,this._events[t]&&eo(this,t)):(this._events=new js,this._eventsCount=0),this};Lt.prototype.off=Lt.prototype.removeListener;Lt.prototype.addListener=Lt.prototype.on;Lt.prefixed=Ft;Lt.EventEmitter=Lt;Kc=Lt;var bi={};Si(bi,"ConnectionType",()=>Kn);Si(bi,"PeerErrorType",()=>mt);Si(bi,"BaseConnectionErrorType",()=>Sc);Si(bi,"DataConnectionErrorType",()=>Yc);Si(bi,"SerializationType",()=>Eo);Si(bi,"SocketEventType",()=>Wn);Si(bi,"ServerMessageType",()=>Pt);var Kn=(function(s){return s.Data="data",s.Media="media",s})({}),mt=(function(s){return s.BrowserIncompatible="browser-incompatible",s.Disconnected="disconnected",s.InvalidID="invalid-id",s.InvalidKey="invalid-key",s.Network="network",s.PeerUnavailable="peer-unavailable",s.SslUnavailable="ssl-unavailable",s.ServerError="server-error",s.SocketError="socket-error",s.SocketClosed="socket-closed",s.UnavailableID="unavailable-id",s.WebRTC="webrtc",s})({}),Sc=(function(s){return s.NegotiationFailed="negotiation-failed",s.ConnectionClosed="connection-closed",s})({}),Yc=(function(s){return s.NotOpenYet="not-open-yet",s.MessageToBig="message-too-big",s})({}),Eo=(function(s){return s.Binary="binary",s.BinaryUTF8="binary-utf8",s.JSON="json",s.None="raw",s})({}),Wn=(function(s){return s.Message="message",s.Disconnected="disconnected",s.Error="error",s.Close="close",s})({}),Pt=(function(s){return s.Heartbeat="HEARTBEAT",s.Candidate="CANDIDATE",s.Offer="OFFER",s.Answer="ANSWER",s.Open="OPEN",s.Error="ERROR",s.IdTaken="ID-TAKEN",s.InvalidKey="INVALID-KEY",s.Leave="LEAVE",s.Expire="EXPIRE",s})({});const Gf="1.5.5";class Bx extends Kc.EventEmitter{constructor(e,t,n,i,r,o=5e3){super(),this.pingInterval=o,this._disconnected=!0,this._messagesQueue=[];const a=e?"wss://":"ws://";this._baseUrl=a+t+":"+n+i+"peerjs?key="+r}start(e,t){this._id=e;const n=`${this._baseUrl}&id=${e}&token=${t}`;this._socket||!this._disconnected||(this._socket=new WebSocket(n+"&version="+Gf),this._disconnected=!1,this._socket.onmessage=i=>{let r;try{r=JSON.parse(i.data),Re.log("Server message received:",r)}catch{Re.log("Invalid server message",i.data);return}this.emit(Wn.Message,r)},this._socket.onclose=i=>{this._disconnected||(Re.log("Socket closed.",i),this._cleanup(),this._disconnected=!0,this.emit(Wn.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),Re.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){Re.log("Cannot send heartbeat, because socket closed");return}const e=JSON.stringify({type:Pt.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){const e=[...this._messagesQueue];this._messagesQueue=[];for(const t of e)this.send(t)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(Wn.Error,"Invalid message");return}if(!this._wsOpen())return;const t=JSON.stringify(e);this._socket.send(t)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}}class Hf{constructor(e){this.connection=e}startConnection(e){const t=this._startPeerConnection();if(this.connection.peerConnection=t,this.connection.type===Kn.Media&&e._stream&&this._addTracksToConnection(e._stream,t),e.originator){const n=this.connection,i={ordered:!!e.reliable},r=t.createDataChannel(n.label,i);n._initializeDataChannel(r),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){Re.log("Creating RTCPeerConnection.");const e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){const t=this.connection.peer,n=this.connection.connectionId,i=this.connection.type,r=this.connection.provider;Re.log("Listening for ICE candidates."),e.onicecandidate=o=>{!o.candidate||!o.candidate.candidate||(Re.log(`Received ICE candidates for ${t}:`,o.candidate),r.socket.send({type:Pt.Candidate,payload:{candidate:o.candidate,type:i,connectionId:n},dst:t}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":Re.log("iceConnectionState is failed, closing connections to "+t),this.connection.emitError(Sc.NegotiationFailed,"Negotiation of connection to "+t+" failed."),this.connection.close();break;case"closed":Re.log("iceConnectionState is closed, closing connections to "+t),this.connection.emitError(Sc.ConnectionClosed,"Connection to "+t+" closed."),this.connection.close();break;case"disconnected":Re.log("iceConnectionState changed to disconnected on the connection with "+t);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},Re.log("Listening for data channel"),e.ondatachannel=o=>{Re.log("Received data channel");const a=o.channel;r.getConnection(t,n)._initializeDataChannel(a)},Re.log("Listening for remote stream"),e.ontrack=o=>{Re.log("Received remote stream");const a=o.streams[0],c=r.getConnection(t,n);if(c.type===Kn.Media){const l=c;this._addStreamToMediaConnection(a,l)}}}cleanup(){Re.log("Cleaning up PeerConnection to "+this.connection.peer);const e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};const t=e.signalingState!=="closed";let n=!1;const i=this.connection.dataChannel;i&&(n=!!i.readyState&&i.readyState!=="closed"),(t||n)&&e.close()}async _makeOffer(){const e=this.connection.peerConnection,t=this.connection.provider;try{const n=await e.createOffer(this.connection.options.constraints);Re.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Re.log("Set localDescription:",n,`for:${this.connection.peer}`);let i={sdp:n,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===Kn.Data){const r=this.connection;i={...i,label:r.label,reliable:r.reliable,serialization:r.serialization}}t.socket.send({type:Pt.Offer,payload:i,dst:this.connection.peer})}catch(i){i!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(t.emitError(mt.WebRTC,i),Re.log("Failed to setLocalDescription, ",i))}}catch(n){t.emitError(mt.WebRTC,n),Re.log("Failed to createOffer, ",n)}}async _makeAnswer(){const e=this.connection.peerConnection,t=this.connection.provider;try{const n=await e.createAnswer();Re.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Re.log("Set localDescription:",n,`for:${this.connection.peer}`),t.socket.send({type:Pt.Answer,payload:{sdp:n,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(i){t.emitError(mt.WebRTC,i),Re.log("Failed to setLocalDescription, ",i)}}catch(n){t.emitError(mt.WebRTC,n),Re.log("Failed to create answer, ",n)}}async handleSDP(e,t){t=new RTCSessionDescription(t);const n=this.connection.peerConnection,i=this.connection.provider;Re.log("Setting remote description",t);const r=this;try{await n.setRemoteDescription(t),Re.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await r._makeAnswer()}catch(o){i.emitError(mt.WebRTC,o),Re.log("Failed to setRemoteDescription, ",o)}}async handleCandidate(e){Re.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),Re.log(`Added ICE candidate for:${this.connection.peer}`)}catch(t){this.connection.provider.emitError(mt.WebRTC,t),Re.log("Failed to handleCandidate, ",t)}}_addTracksToConnection(e,t){if(Re.log(`add tracks from stream ${e.id} to peer connection`),!t.addTrack)return Re.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(n=>{t.addTrack(n,e)})}_addStreamToMediaConnection(e,t){Re.log(`add stream ${e.id} to media connection ${t.connectionId}`),t.addStream(e)}}class Wf extends Kc.EventEmitter{emitError(e,t){Re.error("Error:",t),this.emit("error",new zx(`${e}`,t))}}class zx extends Error{constructor(e,t){typeof t=="string"?super(t):(super(),Object.assign(this,t)),this.type=e}}class Xf extends Wf{get open(){return this._open}constructor(e,t,n){super(),this.peer=e,this.provider=t,this.options=n,this._open=!1,this.metadata=n.metadata}}var Tc;const Gs=class Gs extends Xf{get type(){return Kn.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,t,n){super(e,t,n),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||Gs.ID_PREFIX+zt.randomToken(),this._negotiator=new Hf(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Re.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{Re.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){Re.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){const t=e.type,n=e.payload;switch(e.type){case Pt.Answer:this._negotiator.handleSDP(t,n.sdp),this._open=!0;break;case Pt.Candidate:this._negotiator.handleCandidate(n.candidate);break;default:Re.warn(`Unrecognized message type:${t} from peer:${this.peer}`);break}}answer(e,t={}){if(this._localStream){Re.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,t&&t.sdpTransform&&(this.options.sdpTransform=t.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});const n=this.provider._getMessages(this.connectionId);for(const i of n)this.handleMessage(i);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}};Tc=new WeakMap,vs(Gs,Tc,Gs.ID_PREFIX="mc_");let uo=Gs;class Vx{constructor(e){this._options=e}_buildRequest(e){const t=this._options.secure?"https":"http",{host:n,port:i,path:r,key:o}=this._options,a=new URL(`${t}://${n}:${i}${r}${o}/${e}`);return a.searchParams.set("ts",`${Date.now()}${Math.random()}`),a.searchParams.set("version",Gf),fetch(a.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{const e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){Re.error("Error retrieving ID",e);let t="";throw this._options.path==="/"&&this._options.host!==zt.CLOUD_HOST&&(t=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+t)}}async listAllPeers(){try{const e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let t="";throw this._options.host===zt.CLOUD_HOST?t="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":t="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+t)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw Re.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}}var Ec,Cc;const ui=class ui extends Xf{get type(){return Kn.Data}constructor(e,t,n){super(e,t,n),this.connectionId=this.options.connectionId||ui.ID_PREFIX+zf(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new Hf(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Re.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=t=>{Re.log(`DC#${this.connectionId} dc onmessage:`,t.data)},this.dataChannel.onclose=()=>{Re.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e!=null&&e.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,t=!1){if(!this.open){this.emitError(Yc.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,t)}async handleMessage(e){const t=e.payload;switch(e.type){case Pt.Answer:await this._negotiator.handleSDP(e.type,t.sdp);break;case Pt.Candidate:await this._negotiator.handleCandidate(t.candidate);break;default:Re.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}};Ec=new WeakMap,Cc=new WeakMap,vs(ui,Ec,ui.ID_PREFIX="dc_"),vs(ui,Cc,ui.MAX_BUFFERED_AMOUNT=8388608);let fo=ui;class jc extends fo{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",t=>this._handleDataMessage(t))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>fo.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(t){return Re.error(`DC#:${this.connectionId} Error when sending:`,t),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;const e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e!=null&&e.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}}class xa extends jc{close(e){super.close(e),this._chunkedData={}}constructor(e,t,n){super(e,t,n),this.chunker=new Bf,this.serialization=Eo.Binary,this._chunkedData={}}_handleDataMessage({data:e}){const t=rf(e),n=t.__peerData;if(n){if(n.type==="close"){this.close();return}this._handleChunk(t);return}this.emit("data",t)}_handleChunk(e){const t=e.__peerData,n=this._chunkedData[t]||{data:[],count:0,total:e.total};if(n.data[e.n]=new Uint8Array(e.data),n.count++,this._chunkedData[t]=n,n.total===n.count){delete this._chunkedData[t];const i=Ix(n.data);this._handleDataMessage({data:i})}}_send(e,t){const n=of(e);if(n instanceof Promise)return this._send_blob(n);if(!t&&n.byteLength>this.chunker.chunkedMTU){this._sendChunks(n);return}this._bufferedSend(n)}async _send_blob(e){const t=await e;if(t.byteLength>this.chunker.chunkedMTU){this._sendChunks(t);return}this._bufferedSend(t)}_sendChunks(e){const t=this.chunker.chunk(e);Re.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);for(const n of t)this.send(n,!0)}}class Gx extends jc{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,t){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=Eo.None}}class Hx extends jc{_handleDataMessage({data:e}){const t=this.parse(this.decoder.decode(e)),n=t.__peerData;if(n&&n.type==="close"){this.close();return}this.emit("data",t)}_send(e,t){const n=this.encoder.encode(this.stringify(e));if(n.byteLength>=zt.chunkedMTU){this.emitError(Yc.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(n)}constructor(...e){super(...e),this.serialization=Eo.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}}var Ac;const Hs=class Hs extends Wf{get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){const e=Object.create(null);for(const[t,n]of this._connections)e[t]=n;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,t){super(),this._serializers={raw:Gx,json:Hx,binary:xa,"binary-utf8":xa,default:xa},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let n;if(e&&e.constructor==Object?t=e:e&&(n=e.toString()),t={debug:0,host:zt.CLOUD_HOST,port:zt.CLOUD_PORT,path:"/",key:Hs.DEFAULT_KEY,token:zt.randomToken(),config:zt.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...t},this._options=t,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==zt.CLOUD_HOST?this._options.secure=zt.isSecure():this._options.host==zt.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&Re.setLogFunction(this._options.logFunction),Re.logLevel=this._options.debug||0,this._api=new Vx(t),this._socket=this._createServerConnection(),!zt.supports.audioVideo&&!zt.supports.data){this._delayedAbort(mt.BrowserIncompatible,"The current browser does not support WebRTC");return}if(n&&!zt.validateId(n)){this._delayedAbort(mt.InvalidID,`ID "${n}" is invalid`);return}n?this._initialize(n):this._api.retrieveId().then(i=>this._initialize(i)).catch(i=>this._abort(mt.ServerError,i))}_createServerConnection(){const e=new Bx(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(Wn.Message,t=>{this._handleMessage(t)}),e.on(Wn.Error,t=>{this._abort(mt.SocketError,t)}),e.on(Wn.Disconnected,()=>{this.disconnected||(this.emitError(mt.Network,"Lost connection to server."),this.disconnect())}),e.on(Wn.Close,()=>{this.disconnected||this._abort(mt.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){const t=e.type,n=e.payload,i=e.src;switch(t){case Pt.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case Pt.Error:this._abort(mt.ServerError,n.msg);break;case Pt.IdTaken:this._abort(mt.UnavailableID,`ID "${this.id}" is taken`);break;case Pt.InvalidKey:this._abort(mt.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case Pt.Leave:Re.log(`Received leave message from ${i}`),this._cleanupPeer(i),this._connections.delete(i);break;case Pt.Expire:this.emitError(mt.PeerUnavailable,`Could not connect to peer ${i}`);break;case Pt.Offer:{const r=n.connectionId;let o=this.getConnection(i,r);if(o&&(o.close(),Re.warn(`Offer received for existing Connection ID:${r}`)),n.type===Kn.Media){const c=new uo(i,this,{connectionId:r,_payload:n,metadata:n.metadata});o=c,this._addConnection(i,o),this.emit("call",c)}else if(n.type===Kn.Data){const c=new this._serializers[n.serialization](i,this,{connectionId:r,_payload:n,metadata:n.metadata,label:n.label,serialization:n.serialization,reliable:n.reliable});o=c,this._addConnection(i,o),this.emit("connection",c)}else{Re.warn(`Received malformed connection type:${n.type}`);return}const a=this._getMessages(r);for(const c of a)o.handleMessage(c);break}default:{if(!n){Re.warn(`You received a malformed message from ${i} of type ${t}`);return}const r=n.connectionId,o=this.getConnection(i,r);o&&o.peerConnection?o.handleMessage(e):r?this._storeMessage(r,e):Re.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,t){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(t)}_getMessages(e){const t=this._lostMessages.get(e);return t?(this._lostMessages.delete(e),t):[]}connect(e,t={}){if(t={serialization:"default",...t},this.disconnected){Re.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(mt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}const n=new this._serializers[t.serialization](e,this,t);return this._addConnection(e,n),n}call(e,t,n={}){if(this.disconnected){Re.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(mt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!t){Re.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}const i=new uo(e,this,{...n,_stream:t});return this._addConnection(e,i),i}_addConnection(e,t){Re.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(t)}_removeConnection(e){const t=this._connections.get(e.peer);if(t){const n=t.indexOf(e);n!==-1&&t.splice(n,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,t){const n=this._connections.get(e);if(!n)return null;for(const i of n)if(i.connectionId===t)return i;return null}_delayedAbort(e,t){setTimeout(()=>{this._abort(e,t)},0)}_abort(e,t){Re.error("Aborting!"),this.emitError(e,t),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(Re.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(const e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){const t=this._connections.get(e);if(t)for(const n of t)n.close()}disconnect(){if(this.disconnected)return;const e=this.id;Re.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)Re.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)Re.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=t=>{}){this._api.listAllPeers().then(t=>e(t)).catch(t=>this._abort(mt.ServerError,t))}};Ac=new WeakMap,vs(Hs,Ac,Hs.DEFAULT_KEY="peerjs");let po=Hs;const Yh="otoban-makas-v1-room-",Nt=4,Wx=1e4,Ma=8e3,Xx=5e3,jh=12e3,$x=6e3,qx=5,Kx=4e3,mo=[{paint:946076,tag:"#10b981"},{paint:9375776,tag:"#f59e0b"},{paint:15001836,tag:"#38bdf8"},{paint:1513759,tag:"#e879f9"}],bc=[-1.8,1.8,-5.4,5.4],Zh={debug:1,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:stun2.l.google.com:19302"},{urls:"stun:stun.cloudflare.com:3478"}]}},Xi=(s,e)=>String(s||"").trim().slice(0,14)||e,Rt=(s,e=0)=>Number.isFinite(Number(s))?Number(s):e,Jh=()=>`p-${Math.random().toString(36).slice(2,10)}`;class Yx{constructor(e,t,n={}){this.scene=e,this.traffic=t,this.callbacks=n,this.role=null,this.roomCode=null,this.connected=!1,this.playerName=localStorage.getItem("otoban_player_name")||"OYUNCU",this.localId=null,this.localSlot=0,this.hostId=null,this.epoch=0,this.peer=null,this.hostConn=null,this.bc=null,this.players=new Map,this.localWorldDistM=0,this.sendAccum=0,this.trafficSyncAccum=0,this._asleepSince=null,this._lastWake=null;const i=()=>{this._asleepSince===null&&(this._asleepSince=performance.now(),this._guestsAtSleep=this.role==="host"?this.players.size:0)},r=()=>{if(this._asleepSince===null)return;const o=performance.now()-this._asleepSince;this._asleepSince=null,this._lastWake={at:performance.now(),sleptMs:o},this.onWake(o)};document.addEventListener("visibilitychange",()=>document.hidden?i():r()),document.addEventListener("freeze",i),document.addEventListener("resume",r)}onWake(e){e>Ma&&this.role==="host"&&this._guestsAtSleep>0&&this.rejoinRoom()}justWokeFromLongSleep(){const e=this._lastWake;return!!e&&performance.now()-e.at<3e3&&e.sleptMs>Ma}setPlayerName(e){const t=Xi(e,"OYUNCU");this.playerName=t,localStorage.setItem("otoban_player_name",t)}get playerCount(){return this.role?this.players.size+1:0}getRemotePlayers(){return[...this.players.values()]}drawNameplate(e){const{ctx:t,texture:n}=e.badge;t.clearRect(0,0,512,128),t.fillStyle="rgba(6, 12, 24, 0.85)",t.strokeStyle=e.style.tag,t.lineWidth=5,t.beginPath(),t.roundRect(16,14,480,100,26),t.fill(),t.stroke(),t.fillStyle=e.style.tag,t.font="900 34px system-ui, sans-serif",t.textAlign="center",t.fillText(`🏁 ${e.name.toUpperCase()}`,256,56),t.fillStyle="#f8fafc",t.font="800 28px ui-monospace, monospace",t.fillText(`${Math.round(e.speedKmh)} KM/S  •  ${e.combo.toFixed(1)}x KOMBO`,256,96),n.needsUpdate=!0}createPeerCarMesh(e){const t=new ln,n=_x({paintHex:e.paint});t.add(n.group);const i=document.createElement("canvas");i.width=512,i.height=128;const r=new es(i);r.colorSpace=Mt;const o=new Iu({map:r,depthTest:!1,transparent:!0}),a=new xv(o);a.position.set(0,2.35,0),a.scale.set(3.2,.8,1),a.renderOrder=10,t.add(a);const c={group:t,badge:{canvas:i,ctx:i.getContext("2d"),texture:r,spriteMat:o},active:n,lights:{night:!1,braking:!1,highBeam:!1},setLights(l){c.lights=l,c.active.setLights(l)},swapModel(l){n.group.visible=!1,t.add(l.group),c.active=l,l.setLights(c.lights)}};return c}loadA8Model(e){ju(()=>import("./peerA8-Bx9zoBe0.js"),__vite__mapDeps([2,1]),import.meta.url).then(t=>t.loadA8PeerCar({paintHex:e.style.paint})).then(t=>{e.removed||e.car.swapModel(t)}).catch(t=>{console.warn("A8 modeli yüklenemedi, yedek model kullanılıyor:",t)})}addRemotePlayer(e,t,n){const i=mo[n%mo.length],r=this.createPeerCarMesh(i);r.group.visible=!1,this.scene.add(r.group);const o={id:e,name:Xi(t,`OYUNCU ${n+1}`),slot:n,style:i,conn:null,lastRecvTime:performance.now(),x:bc[n]??0,targetX:bc[n]??0,worldDistM:this.localWorldDistM,targetWorldDistM:this.localWorldDistM,speedKmh:95,headingAngle:0,bodyRoll:0,highBeam:!1,horn:!1,braking:!1,score:0,combo:1,relZ:0,car:r,badge:r.badge,lastBadgeUpdate:0,removed:!1};return this.players.set(e,o),this.drawNameplate(o),this.loadA8Model(o),o}removeRemotePlayer(e,{notify:t=!0}={}){var i,r;const n=this.players.get(e);n&&(n.removed=!0,this.players.delete(e),this.scene.remove(n.car.group),n.badge.texture.dispose(),n.badge.spriteMat.dispose(),t&&((r=(i=this.callbacks).onPlayerLeft)==null||r.call(i,{name:n.name})))}removeAllPlayers(){for(const e of[...this.players.keys()])this.removeRemotePlayer(e,{notify:!1})}broadcast(e){const t={...e,from:this.localId,senderRole:this.role,epoch:this.epoch},n=this.role==="host"?this.getRemotePlayers().map(i=>i.conn):[this.hostConn];for(const i of n)if(i&&i.open)try{i.send(t)}catch{}if(this.bc)try{this.bc.postMessage(t)}catch{}}sendTo(e,t,n){const i={...n,to:t,from:this.localId,senderRole:this.role,epoch:this.epoch};if(e&&e.open)try{e.send(i)}catch{}if(this.bc)try{this.bc.postMessage(i)}catch{}}emitStatus(e,t={}){var n,i;(i=(n=this.callbacks).onStatusChange)==null||i.call(n,{connected:this.connected,connecting:!!this.role&&!this.connected,role:this.role,roomCode:this.roomCode,playerCount:this.playerCount,maxPlayers:Nt,message:e,...t})}setupBroadcastChannel(e){typeof BroadcastChannel>"u"||(this.bc=new BroadcastChannel(`${Yh}${e}`),this.bc.onmessage=t=>this.handlePacket(t.data,null))}hostPeerId(e,t){return`${Yh}${e}${t>0?`-e${t}`:""}`}closeLink(e){try{e==null||e.close()}catch{}}stopTimers(){clearInterval(this._helloInterval),clearTimeout(this._connectTimer),this._helloInterval=null,this._connectTimer=null}disconnect({silent:e=!1,notifyOthers:t=!0}={}){t&&this.role==="host"&&this.players.size>0&&this.broadcast({type:"host_left"}),t&&this.role==="guest"&&this.connected&&this.broadcast({type:"leave"}),this.stopTimers();for(const n of[this.hostConn,...this.getRemotePlayers().map(i=>i.conn)])this.closeLink(n);if(this.hostConn=null,this.peer){try{this.peer.destroy()}catch{}this.peer=null}if(this.bc){try{this.bc.close()}catch{}this.bc=null}this.removeAllPlayers(),this.connected=!1,this.role=null,this.roomCode=null,this.localId=null,this.hostId=null,this.epoch=0,this._migrating=!1,this._welcomeReceived=!1,this.traffic.isRemoteControlled=!1,e||this.emitStatus("Bağlantı kesildi.")}hostRoom(e){return this.disconnect({silent:!0}),this.setPlayerName(e),this.role="host",this.localId=Jh(),this.hostId=this.localId,this.localSlot=0,this.epoch=0,this.roomCode=String(Math.floor(1e3+Math.random()*9e3)),this.localWorldDistM=0,this._matchStarted=!1,this.setupBroadcastChannel(this.roomCode),this.emitStatus(`⏳ Oda Kodu: ${this.roomCode} — Arkadaşların kodu girince oyun otomatik başlar (en fazla ${Nt} kişi)!`),this.openHostPeer({readyMessage:`✅ Oda Hazır! Kod: ${this.roomCode} — ${Nt} kişiye kadar arkadaşın katılabilir.`,onTaken:()=>this.hostRoom(this.playerName)}),this.roomCode}openHostPeer({readyMessage:e=null,onTaken:t}){try{const n=new po(this.hostPeerId(this.roomCode,this.epoch),Zh);this.peer=n,n.on("open",()=>{e&&this.peer===n&&!this.connected&&this.emitStatus(e)}),n.on("connection",i=>{i.on("data",r=>this.handlePacket(r,i)),i.on("close",()=>{const r=this.getRemotePlayers().find(o=>o.conn===i);r&&this.onGuestGone(r.id)})}),n.on("error",i=>{console.warn("PeerJS Host Uyarısı:",i),i.type==="unavailable-id"&&this.peer===n&&t()})}catch(n){console.warn("PeerJS başlatılamadı, yerel kanal aktif:",n)}}joinRoom(e,t,{scanRounds:n=1}={}){const i=String(e||"").replace(/\D/g,"").slice(0,4);if(i.length!==4)return this.emitStatus("⚠️ Lütfen 4 haneli oda kodunu girin (Örn: 4829)."),!1;this.disconnect({silent:!0}),this.setPlayerName(t),this.role="guest",this.localId=Jh(),this.hostId=null,this.epoch=0,this.roomCode=i,this.localWorldDistM=0,this._matchStarted=!1,this._welcomeReceived=!1,this._scanEpoch=0,this._scanRoundsLeft=n,this.emitStatus(`⏳ ${i} numaralı odaya bağlanılıyor, lütfen bekleyin...`),this.setupBroadcastChannel(i),this.startHello();try{this.peer=new po(Zh),this.peer.on("open",()=>this.connectToHost(this.hostPeerId(i,0))),this.peer.on("error",r=>this.onGuestPeerError(r))}catch(r){console.warn("PeerJS bağlantı hatası:",r)}return!0}startHello(){clearInterval(this._helloInterval);const e=()=>{if(this._welcomeReceived||this.role!=="guest"){clearInterval(this._helloInterval),this._helloInterval=null;return}this.broadcast({type:"join_hello",name:this.playerName})};e(),this._helloInterval=setInterval(e,450)}connectToHost(e){if(!this.peer||this.role!=="guest")return;this.closeLink(this.hostConn),clearTimeout(this._connectTimer);const t=this.peer.connect(e,{serialization:"json"});this.hostConn=t,t.on("data",n=>this.handlePacket(n,t)),t.on("open",()=>{clearTimeout(this._connectTimer),this.broadcast({type:"join_hello",name:this.playerName})}),t.on("close",()=>{this.hostConn===t&&(this.hostConn=null,this._welcomeReceived&&this.startMigration())}),this._connectTimer=setTimeout(()=>{this.hostConn===t&&!t.open&&this.onConnectFailed()},Kx)}onGuestPeerError(e){console.warn("PeerJS Join Uyarısı:",e),this.role==="guest"&&(e.type==="peer-unavailable"?this.onConnectFailed():this.connected||this.emitStatus(`❌ Oda (${this.roomCode}) bağlantı hatası. Tekrar deneyin.`,{connecting:!1}))}onConnectFailed(){var t;if(clearTimeout(this._connectTimer),this.role!=="guest"||(t=this.hostConn)!=null&&t.open)return;if(this._migrating){this._connectTimer=setTimeout(()=>{this._migrating&&this.role==="guest"&&this.connectToHost(this.hostPeerId(this.roomCode,this.epoch))},1e3);return}if(this._welcomeReceived)return;let e=0;if(this._scanEpoch+=1,this._scanEpoch>qx&&(this._scanEpoch=0,this._scanRoundsLeft-=1,e=1500,this._scanRoundsLeft<=0)){this.emitStatus(`❌ Oda (${this.roomCode}) bulunamadı veya bağlantı hatası. Kodu kontrol edin.`,{connecting:!1});return}this._connectTimer=setTimeout(()=>{this.role==="guest"&&!this._welcomeReceived&&this.connectToHost(this.hostPeerId(this.roomCode,this._scanEpoch))},e)}startMigration(){if(!(this.role!=="guest"||!this._welcomeReceived||this._migrating)){if(this.justWokeFromLongSleep()){this.rejoinRoom();return}this.removeRemotePlayer(this.hostId),this._migrating=!0,this._welcomeReceived=!1,this.closeLink(this.hostConn),this.hostConn=null,this.electNextHost()}}electNextHost(){this.epoch+=1,this._migrationDeadline=performance.now()+jh;let e={id:this.localId,slot:this.localSlot,name:this.playerName};for(const t of this.players.values())t.slot<e.slot&&(e=t);this.hostId=e.id,e.id===this.localId?this.becomeHost():(this.emitStatus(`🔁 Oda kurucusu ayrıldı, yeni kurucu ${e.name} — bağlanılıyor...`),this.startHello(),this.connectToHost(this.hostPeerId(this.roomCode,this.epoch)))}becomeHost(){var n,i;const e=this.peer;this.stopTimers(),this.closeLink(this.hostConn),this.hostConn=null,this._migrating=!1,this.role="host",this.hostId=this.localId,this._matchStarted=!0,this.traffic.isRemoteControlled=!1;const t=performance.now()+$x;for(const r of this.players.values())r.conn=null,r.lastRecvTime=t;this.connected=this.players.size>0;try{e==null||e.destroy()}catch{}this.peer=null,this.openHostPeer({onTaken:()=>this.rejoinRoom()}),this.broadcast({type:"roster",players:this.roster()}),this.emitStatus(`👑 Oda kurucusu ayrıldı, artık oda kurucusu sensin — Kod: ${this.roomCode}`),(i=(n=this.callbacks).onHostChanged)==null||i.call(n,{name:this.playerName,isMe:!0})}rejoinRoom(){const e=this.roomCode,t=this.playerName;this.disconnect({silent:!0,notifyOthers:!1}),this.joinRoom(e,t,{scanRounds:3})}handlePacket(e,t){!e||typeof e!="object"||!this.role||e.from!==this.localId&&(e.to&&e.to!==this.localId||(this.role==="host"?e.senderRole==="guest"&&typeof e.from=="string"&&this.handleGuestPacket(e,t):e.senderRole==="host"&&this.handleHostPacket(e)))}nextFreeSlot(){const e=new Set([this.localSlot,...this.getRemotePlayers().map(t=>t.slot)]);for(let t=0;t<Nt;t++)if(!e.has(t))return t;return-1}roster(){return[{id:this.localId,name:this.playerName,slot:this.localSlot},...this.getRemotePlayers().map(e=>({id:e.id,name:e.name,slot:e.slot}))]}handleGuestPacket(e,t){var r,o,a,c;let n=this.players.get(e.from);const i=e.type==="join_hello";if(i||!n&&e.type==="state"){const l=!n;if(l){const h=this.nextFreeSlot();if(h<0){this.sendTo(t,e.from,{type:"room_full",maxPlayers:Nt}),t&&setTimeout(()=>t.close(),600);return}this._matchStarted||(this.localWorldDistM=0,this.traffic.resetTraffic()),n=this.addRemotePlayer(e.from,e.name,h)}if(t&&(n.conn=t),n.lastRecvTime=Math.max(n.lastRecvTime,performance.now()),this.sendTo(n.conn,n.id,{type:"host_welcome",hostDistM:this.localWorldDistM,name:this.playerName,slot:n.slot,roster:this.roster(),trafficSnapshot:this.traffic.exportSyncState(this.localWorldDistM)}),l&&(this.connected=!0,this.broadcast({type:"roster",players:this.roster()}),this.emitStatus(`🟢 Odada ${this.playerCount}/${Nt} oyuncu — Kod: ${this.roomCode}`),this._matchStarted?(c=(a=this.callbacks).onPlayerJoined)==null||c.call(a,{name:n.name}):(this._matchStarted=!0,(o=(r=this.callbacks).onMatchReady)==null||o.call(r,{role:"host",remoteName:n.name,slot:this.localSlot}))),i)return}if(n)if(n.lastRecvTime=Math.max(n.lastRecvTime,performance.now()),t&&!n.conn&&(n.conn=t),e.type==="state"){const l=n.highBeam;this.applyState(n,e),n.highBeam&&!l&&this.yieldTrafficTo(e.x,e.worldDistM)}else e.type==="peer_selektor"?this.yieldTrafficTo(e.x,e.worldDistM):e.type==="peer_car_hit"?(this.traffic.applyPeerCarHit(e.carId,this.localWorldDistM,Rt(e.carWorldDistM),Rt(e.speedKmh,90)),this.trafficSyncAccum=1):e.type==="leave"&&this.onGuestGone(n.id)}yieldTrafficTo(e,t){const n=this.localWorldDistM-Rt(t,this.localWorldDistM);this.traffic.notifyHighBeamFlash(Rt(e),n)&&(this.trafficSyncAccum=1)}onGuestGone(e){this.players.has(e)&&(this.removeRemotePlayer(e),this.connected=this.players.size>0,this.broadcast({type:"roster",players:this.roster()}),this.emitStatus(this.connected?`🟢 Odada ${this.playerCount}/${Nt} oyuncu — Kod: ${this.roomCode}`:`⏳ Herkes ayrıldı. Oda Kodu: ${this.roomCode} — yeni arkadaşlar katılabilir.`))}handleHostPacket(e){var n,i,r,o,a,c,l,h,u;const t=Rt(e.epoch);if(e.type==="host_welcome"){if(this._welcomeReceived||t<this.epoch)return;this._welcomeReceived=!0,this.hostId=e.from,this.epoch=t,this.hostLastRecv=performance.now();const f=this._migrating;if(f||(this.localSlot=Rt(e.slot,1),this.localWorldDistM=Rt(e.hostDistM)),this.syncRoster(e.roster,{announce:!1}),e.trafficSnapshot&&(this.traffic.applySyncState(e.trafficSnapshot,this.localWorldDistM),e.trafficSnapshot.weatherKey&&((i=(n=this.callbacks).onWeatherSync)==null||i.call(n,e.trafficSnapshot.weatherKey))),this.connected=!0,f){this._migrating=!1;const d=Xi(e.name,"ODA KURUCUSU");this.emitStatus(`🟢 Yeni oda kurucusu: ${d} — Odada ${this.playerCount}/${Nt} oyuncu`),(o=(r=this.callbacks).onHostChanged)==null||o.call(r,{name:d,isMe:!1});return}this.emitStatus(`🟢 Bağlandı! Odada ${this.playerCount}/${Nt} oyuncu — Oda: ${this.roomCode}`),this._matchStarted||(this._matchStarted=!0,(c=(a=this.callbacks).onMatchReady)==null||c.call(a,{role:"guest",remoteName:Xi(e.name,"ODA KURUCUSU"),slot:this.localSlot}));return}if(e.type==="room_full"){const f=this.roomCode;this.disconnect({silent:!0}),this.emitStatus(`⛔ ${f} numaralı oda dolu (${Rt(e.maxPlayers,Nt)}/${Nt}).`);return}if(this._welcomeReceived&&!(e.from!==this.hostId||t!==this.epoch))if(this.hostLastRecv=performance.now(),e.type==="roster")this.syncRoster(e.players,{announce:!0}),this.emitStatus(`🟢 Odada ${this.playerCount}/${Nt} oyuncu — Oda: ${this.roomCode}`);else if(e.type==="states"&&Array.isArray(e.players))for(const f of e.players){if(!f||f.id===this.localId)continue;const d=this.players.get(f.id);d&&this.applyState(d,f)}else e.type==="traffic"?(this.traffic.applySyncState(e.snapshot,this.localWorldDistM),(l=e.snapshot)!=null&&l.weatherKey&&((u=(h=this.callbacks).onWeatherSync)==null||u.call(h,e.snapshot.weatherKey))):e.type==="host_left"&&this.startMigration()}syncRoster(e,{announce:t}){var i,r;if(!Array.isArray(e))return;const n=new Set;for(const o of e.slice(0,Nt)){if(!o||typeof o.id!="string"||o.id===this.localId)continue;n.add(o.id);const a=this.players.get(o.id);if(a)a.name=Xi(o.name,a.name);else{const c=this.addRemotePlayer(o.id,o.name,Rt(o.slot,1));t&&((r=(i=this.callbacks).onPlayerJoined)==null||r.call(i,{name:c.name}))}}for(const o of[...this.players.keys()])n.has(o)||this.removeRemotePlayer(o,{notify:t})}applyState(e,t){var n,i;t.name&&(e.name=Xi(t.name,e.name)),e.targetX=Rt(t.x,e.targetX),e.targetWorldDistM=Rt(t.worldDistM,e.targetWorldDistM),e.speedKmh=Rt(t.speedKmh,e.speedKmh),e.headingAngle=Rt(t.headingAngle),e.bodyRoll=Rt(t.bodyRoll),e.highBeam=!!t.highBeam,e.braking=!!t.braking,e.score=Rt(t.score),e.combo=Rt(t.combo,1),t.horn&&!e.horn&&((i=(n=this.callbacks).onPeerHorn)==null||i.call(n,{name:e.name})),e.horn=!!t.horn}notifyLocalSelektor(e){!this.connected||this.role!=="guest"||this.broadcast({type:"peer_selektor",x:Number(e.toFixed(2)),worldDistM:Number(this.localWorldDistM.toFixed(2))})}notifyLocalCarHit(e){!this.connected||this.role!=="guest"||!e||this.broadcast({type:"peer_car_hit",carId:e.id,carWorldDistM:Number((this.localWorldDistM-e.z-e.pushRemainingZ).toFixed(2)),speedKmh:Math.round(e.speedKmh)})}getTrafficContext(){return{connected:this.connected,role:this.role,localWorldDistM:this.localWorldDistM,peers:this.getRemotePlayers().map(e=>({x:e.x,relZ:e.relZ,speedKmh:e.speedKmh}))}}catchUpToPeer(){if(!this.connected)return null;let e=null;for(const t of this.players.values())(!e||Math.abs(t.relZ)<Math.abs(e.relZ))&&(e=t);return!e||Math.abs(e.relZ)<=12?null:(this.localWorldDistM=e.targetWorldDistM-10,e.worldDistM=e.targetWorldDistM,e.name)}localStatePacket(e){return{name:this.playerName,x:Number(e.playerX.toFixed(2)),worldDistM:Number(this.localWorldDistM.toFixed(2)),speedKmh:Math.round(e.speedKmh),headingAngle:Number(e.headingAngle.toFixed(3)),bodyRoll:Number(e.bodyRoll.toFixed(3)),highBeam:e.highBeam,braking:e.braking,horn:e.horn,score:Math.floor(e.score),combo:Number(e.combo.toFixed(1))}}update(e,t,n=null){var d;const i=t.speedKmh/3.6;if(this.localWorldDistM+=i*e,!this.role)return;const r=performance.now(),a=(this._lastUpdateAt?r-this._lastUpdateAt:0)>Xx;if(this._lastUpdateAt=r,this.role==="host")for(const g of this.getRemotePlayers())a?g.lastRecvTime=r:r-g.lastRecvTime>Wx&&this.onGuestGone(g.id);else this._migrating?a?this._migrationDeadline=r+jh:r>this._migrationDeadline&&(this.removeRemotePlayer(this.hostId),this.electNextHost()):this._welcomeReceived&&(a?this.hostLastRecv=r:r-this.hostLastRecv>Ma&&this.startMigration());if(!this.connected)return;if(this.sendAccum+=e,this.sendAccum>=.04)if(this.sendAccum=0,this.role==="guest")this.broadcast({type:"state",...this.localStatePacket(t)});else{const g=[{id:this.localId,slot:this.localSlot,...this.localStatePacket(t)}];for(const _ of this.players.values())g.push({id:_.id,slot:_.slot,name:_.name,x:_.targetX,worldDistM:Number(_.targetWorldDistM.toFixed(2)),speedKmh:_.speedKmh,headingAngle:_.headingAngle,bodyRoll:_.bodyRoll,highBeam:_.highBeam,braking:_.braking,horn:_.horn,score:_.score,combo:_.combo});this.broadcast({type:"states",players:g})}this.role==="host"&&(this.trafficSyncAccum+=e,this.trafficSyncAccum>=.05&&(this.trafficSyncAccum=0,this.broadcast({type:"traffic",snapshot:this.traffic.exportSyncState(this.localWorldDistM,n==null?void 0:n.weatherKey)})));const c=!!((d=mi[n==null?void 0:n.weatherKey])!=null&&d.streetlightsOn),l=performance.now();let h=this.localWorldDistM;for(const g of this.players.values())g.targetWorldDistM+=(g.speedKmh||90)/3.6*e,g.x=xt.lerp(g.x,g.targetX,Math.min(1,e*14)),Math.abs(g.worldDistM-g.targetWorldDistM)>35?g.worldDistM=g.targetWorldDistM:g.worldDistM=xt.lerp(g.worldDistM,g.targetWorldDistM,Math.min(1,e*10)),h+=g.worldDistM;const f=h/(this.players.size+1)-this.localWorldDistM;Math.abs(f)>165&&(this.localWorldDistM+=(Math.abs(f)-165)*.35*Math.sign(f)*e);for(const g of this.players.values()){const _=this.localWorldDistM-g.worldDistM;g.relZ=_;const m=n?n.getCurveOffsetAtZ(_):0,p=n?n.getCurveYawAtZ(_):0,v=g.car.group;v.visible=_>-290&&_<65,v.position.set(g.x+m,0,_),v.rotation.y=-g.headingAngle+p,v.rotation.z=g.bodyRoll,g.car.setLights({night:c,braking:g.braking,highBeam:g.highBeam}),v.visible&&l-g.lastBadgeUpdate>150&&(g.lastBadgeUpdate=l,this.drawNameplate(g))}}}const jx=[0,5,3.2,2.14,1.72,1.31,1,.82,.64],Zx=2.85,Jx=2.23,Qx=700,$i=[{name:"Standart",offset:new L(0,1.25,.2),baseFov:58,horizonShiftY:.24},{name:"Tam Kabin",offset:new L(0,1.28,.35),baseFov:62,horizonShiftY:.3},{name:"Yakın Sürüş",offset:new L(0,1.22,.05),baseFov:54,horizonShiftY:.18}];class eM{constructor(){this.container=document.getElementById("canvas-container"),this.sound=new Dy,this.scene=new vv,this.renderer=new _v({antialias:!0,powerPreference:"high-performance"}),this.maxPixelRatio=Math.min(window.devicePixelRatio||1,2),this.minPixelRatio=Math.min(1,this.maxPixelRatio),this.pixelRatio=this.maxPixelRatio,this.renderer.setPixelRatio(this.pixelRatio),this.renderer.info.autoReset=!1,this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.toneMapping=nu,this.renderer.toneMappingExposure=1.35,this.container.appendChild(this.renderer.domElement),this.cameraPresetIndex=0,this.camera=new Ot($i[0].baseFov,window.innerWidth/window.innerHeight,.05,360),this.camera.layers.enable(Zu),this.world=new Jy(this.scene),this.cockpit=new pc(this.renderer),this.scene.add(this.cockpit.group),this.traffic=new vx(this.scene),this.multiplayer=new Yx(this.scene,this.traffic,{onStatusChange:e=>this.syncMultiplayerUI(e),onMatchReady:({remoteName:e,slot:t})=>{var i,r;this.playerX=bc[t]??-1.8,this.speedKmh=0,this.lateralVel=0,this.headingAngle=0,this.sound.init(),this.sound.setRainAmbience(this.world.weatherKey==="rain"),this.paused=!1,(i=document.getElementById("menu-overlay"))==null||i.classList.add("hidden"),(r=document.getElementById("btn-reset-car"))==null||r.classList.remove("hidden");const n=document.querySelector("#btn-start-game span");n&&(n.textContent="SÜRÜŞE DEVAM ET"),this.showMakasNotification(`🏁 ${e} BAĞLANDI! BERABER SÜRÜŞ BAŞLADI!`,0,"gold")},onPlayerJoined:({name:e})=>{this.showMakasNotification(`🏁 ${e} ODAYA KATILDI!`,0,"gold")},onPlayerLeft:({name:e})=>{this.showMakasNotification(`👋 ${e} ODADAN AYRILDI`,0,"normal")},onHostChanged:({name:e,isMe:t})=>{this.showMakasNotification(t?"👑 ODA KURUCUSU ARTIK SENSİN":`👑 YENİ ODA KURUCUSU: ${e}`,0,"gold")},onPeerHorn:({name:e})=>{this.showMakasNotification(`📯 ${e} KORNA ÇALDI!`,50,"normal")},onWeatherSync:e=>{if(e&&e!==this.world.weatherKey){const t=this.world.applyWeather(e);this.syncWeatherUI(t)}}}),this.lastTandemTime=0,this.cockpit.group.add(this.camera),this.cockpit.camera=this.camera,this.applyCameraPreset(0),this.paused=!0,this.score=0,this.bestScore=Number(localStorage.getItem("otoban_makas_best")||0),this.combo=1,this.comboTimer=0,this.health=100,this.odometerKm=1428.4,this.playerX=-1.8,this.lateralVel=0,this.yawRate=0,this.headingAngle=0,this.bodyRoll=0,this.rollVel=0,this.bodyPitch=0,this.pitchVel=0,this.speedKmh=0,this.rpm=2200,this.gear=3,this.lastShiftAt=0,this.lateralG=0,this.longitudinalG=0,this.shakeIntensity=0,this.keys={gas:!1,brake:!1,left:!1,right:!1,highBeam:!1,horn:!1},this.touchSteerValue=0,this.touchThrottle=0,this.steerMode="wheel",this.tiltBaseline=null,this.steerInput=0,this.lastTime=performance.now(),this.perf={frames:0,elapsed:0,calls:0,window:0,goodWindows:0,lastRaise:-10,settle:0},this.fpsMeter=null,new URLSearchParams(window.location.search).has("fps")&&this.toggleFpsMeter(),this.bindEvents(),this.setupAppMode(),this.updateHUD(),this.animate()}applyCameraPreset(e){this.cameraPresetIndex=e%$i.length;const t=$i[this.cameraPresetIndex];this.cockpit.setViewPreset(this.cameraPresetIndex),this.camera.position.copy(t.offset),this.camera.fov=t.baseFov,this.updateCameraProjection();const n=document.getElementById("camera-label");n&&(n.textContent=t.name)}updateCameraProjection(){const e=window.innerWidth,t=window.innerHeight,n=$i[this.cameraPresetIndex];this.camera.aspect=e/t,this.camera.setViewOffset(e,t,0,Math.round(t*n.horizonShiftY),e,t),this.camera.updateProjectionMatrix()}bindEvents(){var t,n,i,r,o,a,c,l,h,u,f,d,g;window.addEventListener("resize",()=>{this.updateCameraProjection(),this.renderer.setSize(window.innerWidth,window.innerHeight)}),window.addEventListener("keydown",_=>{if(_.target&&(_.target.tagName==="INPUT"||_.target.tagName==="TEXTAREA")||_.repeat)return;const m=_.code;if((m==="KeyW"||m==="ArrowUp")&&(this.keys.gas=!0),(m==="KeyS"||m==="ArrowDown")&&(this.keys.brake=!0),(m==="KeyA"||m==="ArrowLeft")&&(this.keys.left=!0),(m==="KeyD"||m==="ArrowRight")&&(this.keys.right=!0),(m==="KeyF"||m==="Space")&&this.setHighBeam(!0),m==="KeyH"&&(this.keys.horn=!0,this.sound.setHorn(!0)),m==="KeyR"&&this.catchUpToFriend(),m==="KeyV"&&(this.cockpit.toggleWipers(),this.sound.playSelektorClick()),m==="KeyL"){const p=this.cockpit.cycleAmbientColor();this.syncAmbientUI(this.cockpit.ambientKey,p.css)}if(m==="KeyT"){const p=this.world.cycleWeather();this.syncWeatherUI(p)}m==="KeyC"&&this.applyCameraPreset(this.cameraPresetIndex+1),m==="KeyM"&&this.toggleSound(),m==="KeyP"&&this.toggleFpsMeter(),m==="Escape"&&this.togglePauseMenu()}),window.addEventListener("keyup",_=>{const m=_.code;(m==="KeyW"||m==="ArrowUp")&&(this.keys.gas=!1),(m==="KeyS"||m==="ArrowDown")&&(this.keys.brake=!1),(m==="KeyA"||m==="ArrowLeft")&&(this.keys.left=!1),(m==="KeyD"||m==="ArrowRight")&&(this.keys.right=!1),(m==="KeyF"||m==="Space")&&this.setHighBeam(!1),m==="KeyH"&&(this.keys.horn=!1,this.sound.setHorn(!1))}),(t=document.getElementById("btn-mp-quick"))==null||t.addEventListener("click",()=>{var _;this.paused=!0,(_=document.getElementById("menu-overlay"))==null||_.classList.remove("hidden")}),(n=document.getElementById("btn-mp-catchup"))==null||n.addEventListener("click",()=>this.catchUpToFriend());const e=document.getElementById("mp-player-name");e&&localStorage.getItem("otoban_player_name")&&(e.value=localStorage.getItem("otoban_player_name")),(i=document.getElementById("btn-mp-host"))==null||i.addEventListener("click",()=>{this.enterAppFullscreen();const _=(e==null?void 0:e.value)||"OYUNCU 1";this.multiplayer.hostRoom(_)}),(r=document.getElementById("btn-mp-join"))==null||r.addEventListener("click",()=>{var p;this.enterAppFullscreen();const _=(e==null?void 0:e.value)||"OYUNCU 2",m=((p=document.getElementById("mp-join-code"))==null?void 0:p.value)||"";this.multiplayer.joinRoom(m,_)}),(o=document.getElementById("btn-mp-leave"))==null||o.addEventListener("click",()=>{this.multiplayer.disconnect()}),(a=document.getElementById("btn-weather"))==null||a.addEventListener("click",()=>{const _=this.world.cycleWeather();this.syncWeatherUI(_)}),(c=document.getElementById("btn-ambient"))==null||c.addEventListener("click",()=>{const _=this.cockpit.cycleAmbientColor();this.syncAmbientUI(this.cockpit.ambientKey,_.css)}),(l=document.getElementById("btn-wipers"))==null||l.addEventListener("click",()=>{this.cockpit.toggleWipers(),this.sound.playSelektorClick()}),(h=document.getElementById("btn-camera"))==null||h.addEventListener("click",()=>{this.applyCameraPreset(this.cameraPresetIndex+1)}),(u=document.getElementById("btn-sound"))==null||u.addEventListener("click",()=>{this.toggleSound()}),(f=document.getElementById("btn-pause"))==null||f.addEventListener("click",()=>{this.togglePauseMenu()}),(d=document.getElementById("btn-start-game"))==null||d.addEventListener("click",()=>{var m,p;this.enterAppFullscreen(),e!=null&&e.value&&this.multiplayer.setPlayerName(e.value),this.multiplayer.connected&&this.multiplayer.catchUpToPeer(),this.sound.init(),this.sound.setRainAmbience(this.world.weatherKey==="rain"),this.paused=!1,(m=document.getElementById("menu-overlay"))==null||m.classList.add("hidden"),(p=document.getElementById("btn-reset-car"))==null||p.classList.remove("hidden");const _=document.querySelector("#btn-start-game span");_&&(_.textContent="SÜRÜŞE DEVAM ET")}),(g=document.getElementById("btn-reset-car"))==null||g.addEventListener("click",()=>{var _;this.resetRun(),this.paused=!1,(_=document.getElementById("menu-overlay"))==null||_.classList.add("hidden")}),document.querySelectorAll("#weather-select-group .opt-card").forEach(_=>{_.addEventListener("click",()=>{const m=_.getAttribute("data-weather"),p=this.world.applyWeather(m);this.syncWeatherUI(p)})}),document.querySelectorAll("#ambient-select-group .swatch").forEach(_=>{_.addEventListener("click",()=>{const m=_.getAttribute("data-color"),p=this.cockpit.setAmbientColor(m);this.syncAmbientUI(m,p.css)})}),document.querySelectorAll("#steer-mode-group .seg-btn").forEach(_=>{_.addEventListener("click",()=>{document.querySelectorAll("#steer-mode-group .seg-btn").forEach(m=>m.classList.remove("active")),_.classList.add("active"),this.steerMode=_.getAttribute("data-steermode"),this.updateSteerModeUI(),this.steerMode==="tilt"&&typeof(DeviceOrientationEvent==null?void 0:DeviceOrientationEvent.requestPermission)=="function"&&DeviceOrientationEvent.requestPermission().catch(()=>{})})}),document.querySelectorAll("#traffic-density-group .seg-btn").forEach(_=>{_.addEventListener("click",()=>{document.querySelectorAll("#traffic-density-group .seg-btn").forEach(m=>m.classList.remove("active")),_.classList.add("active"),this.traffic.setDensity(_.getAttribute("data-density"))})}),this.loadCockpit3D(),document.querySelectorAll("#touch-vis-group .seg-btn").forEach(_=>{_.addEventListener("click",()=>{document.querySelectorAll("#touch-vis-group .seg-btn").forEach(v=>v.classList.remove("active")),_.classList.add("active");const m=_.getAttribute("data-touchvis"),p=document.getElementById("touch-controls");p&&(p.style.display=m==="hide"?"none":"flex")})}),this.setupTouchControls()}setupTouchControls(){const e=r=>{r.preventDefault()};document.addEventListener("gesturestart",e,{passive:!1}),document.addEventListener("gesturechange",e,{passive:!1}),document.addEventListener("gestureend",e,{passive:!1}),document.addEventListener("dblclick",e,{passive:!1}),document.addEventListener("contextmenu",r=>{r.target.closest("#menu-overlay")||r.preventDefault()});let t=0;document.addEventListener("touchstart",r=>{r.touches.length>1&&!r.target.closest("#menu-overlay")&&r.preventDefault()},{passive:!1}),document.addEventListener("touchmove",r=>{(r.touches.length>1||r.scale!==void 0&&r.scale!==1||!r.target.closest("#menu-overlay"))&&r.preventDefault()},{passive:!1}),document.addEventListener("touchend",r=>{const o=performance.now();o-t<=350&&!r.target.closest("#menu-overlay")&&r.preventDefault(),t=o},{passive:!1});const n=(r,o,a)=>{const c=document.getElementById(r);if(!c)return;let l=null;const h=f=>{f.preventDefault(),this.sound.init(),l=f.pointerId;try{c.setPointerCapture(f.pointerId)}catch{}c.classList.add("active"),o()},u=f=>{l!==null&&f.pointerId!==void 0&&f.pointerId!==l||(f.preventDefault(),l=null,c.classList.remove("active"),a())};c.addEventListener("pointerdown",h),c.addEventListener("pointerup",u),c.addEventListener("pointercancel",u),c.addEventListener("lostpointercapture",u),c.addEventListener("touchstart",e,{passive:!1}),c.addEventListener("touchmove",e,{passive:!1}),c.addEventListener("touchend",e,{passive:!1})};this.bindAnalogGasPedal(e),n("touch-brake",()=>{this.keys.brake=!0},()=>{this.keys.brake=!1}),n("touch-left-btn",()=>{this.keys.left=!0},()=>{this.keys.left=!1}),n("touch-right-btn",()=>{this.keys.right=!0},()=>{this.keys.right=!1}),n("touch-selektor",()=>{this.setHighBeam(!0)},()=>{this.setHighBeam(!1)}),n("touch-horn",()=>{this.keys.horn=!0,this.sound.setHorn(!0)},()=>{this.keys.horn=!1,this.sound.setHorn(!1)});const i=document.getElementById("cockpit-canvas");if(i){let r=null,o=0;const a=document.createElement("div");a.className="steer-pad hidden",a.innerHTML='<div class="steer-pad-knob"></div>',document.body.appendChild(a);const c=a.firstElementChild,l=()=>Math.max(70,Math.min(120,window.innerWidth*.11));i.addEventListener("touchstart",e,{passive:!1}),i.addEventListener("touchmove",e,{passive:!1}),i.addEventListener("touchend",e,{passive:!1});const h=f=>{const d=l();f-o>d&&(o=f-d),f-o<-d&&(o=f+d);const g=(f-o)/d;this.touchSteerValue=Math.max(-1,Math.min(1,g)),a.style.left=`${o}px`,c.style.transform=`translateX(${this.touchSteerValue*(d/2)}px)`};i.addEventListener("pointerdown",f=>{if(!(this.paused||r!==null)){f.preventDefault(),this.sound.init(),r=f.pointerId,o=f.clientX;try{i.setPointerCapture(f.pointerId)}catch{}a.style.top=`${f.clientY}px`,a.style.setProperty("--pad-w",`${l()}px`),a.classList.toggle("hidden",f.pointerType==="mouse"),h(f.clientX)}}),i.addEventListener("pointermove",f=>{f.pointerId===r&&(f.preventDefault(),h(f.clientX))});const u=f=>{f.pointerId===r&&(r=null,this.touchSteerValue=0,a.classList.add("hidden"))};i.addEventListener("pointerup",u),i.addEventListener("pointercancel",u),i.addEventListener("lostpointercapture",u)}window.addEventListener("deviceorientation",r=>{var h;if(this.steerMode!=="tilt"||this.paused)return;const o=((h=screen.orientation)==null?void 0:h.angle)??window.orientation??0,a=window.innerWidth>window.innerHeight,c=o===270||o===-90?-1:1,l=a?(r.beta||0)*c:r.gamma||0;this.touchSteerValue=Math.max(-1,Math.min(1,l/26))})}setupAppMode(){var o,a;"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch(()=>{});const e=document.getElementById("btn-install-app");let t=null;window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),t=c,e==null||e.classList.remove("hidden")}),e==null||e.addEventListener("click",async()=>{t&&(t.prompt(),await t.userChoice.catch(()=>null),t=null,e.classList.add("hidden"))}),window.addEventListener("appinstalled",()=>e==null?void 0:e.classList.add("hidden")),(/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1)&&!this.isInstalledApp()&&((o=document.getElementById("ios-install-hint"))==null||o.classList.remove("hidden"));const i=window.matchMedia("(orientation: portrait) and (pointer: coarse)");i.addEventListener("change",()=>{i.matches&&!this.paused&&this.togglePauseMenu()});const r=document.getElementById("btn-rotate-landscape");document.documentElement.requestFullscreen&&((a=screen.orientation)!=null&&a.lock)&&(r==null||r.classList.remove("hidden")),r==null||r.addEventListener("click",()=>this.enterAppFullscreen())}isInstalledApp(){return window.matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches||window.navigator.standalone===!0}enterAppFullscreen(){if(!window.matchMedia("(pointer: coarse)").matches)return;const e=()=>{var n,i;return(i=(n=screen.orientation)==null?void 0:n.lock)==null?void 0:i.call(n,"landscape").catch(()=>{})},t=document.documentElement;if(this.isInstalledApp()||document.fullscreenElement||!t.requestFullscreen){e();return}t.requestFullscreen({navigationUI:"hide"}).then(e).catch(()=>{})}bindAnalogGasPedal(e){const t=document.getElementById("touch-gas");if(!t)return;const n=t.querySelector(".pedal-label");let i=null;const r=a=>{const c=t.getBoundingClientRect(),l=Math.max(.15,Math.min(1,(c.bottom-a)/(c.height*.75)));this.touchThrottle=l,t.style.setProperty("--gas-level",l.toFixed(2)),n&&(n.textContent=`%${Math.round(l*100)}`)},o=a=>{i===null||a.pointerId!==i||(a.preventDefault(),i=null,this.touchThrottle=0,t.classList.remove("active"),t.style.setProperty("--gas-level","0"),n&&(n.textContent="GAZ"))};t.addEventListener("pointerdown",a=>{a.preventDefault(),this.sound.init(),i=a.pointerId;try{t.setPointerCapture(a.pointerId)}catch{}t.classList.add("active"),r(a.clientY)}),t.addEventListener("pointermove",a=>{a.pointerId===i&&(a.preventDefault(),r(a.clientY))}),t.addEventListener("pointerup",o),t.addEventListener("pointercancel",o),t.addEventListener("lostpointercapture",o),t.addEventListener("touchstart",e,{passive:!1}),t.addEventListener("touchmove",e,{passive:!1}),t.addEventListener("touchend",e,{passive:!1})}updateSteerModeUI(){const e=document.getElementById("button-steer-zone");this.steerMode==="buttons"?e==null||e.classList.remove("hidden"):e==null||e.classList.add("hidden")}setHighBeam(e){e&&!this.keys.highBeam&&(this.sound.playSelektorClick(),this.traffic.notifyHighBeamFlash(this.playerX,0),this.multiplayer.notifyLocalSelektor(this.playerX)),this.keys.highBeam=e;const t=document.getElementById("ind-highbeam");t&&t.classList.toggle("active",e)}syncWeatherUI(e){const t=document.getElementById("weather-icon"),n=document.getElementById("weather-label");t&&(t.textContent=e.icon),n&&(n.textContent=e.label),document.querySelectorAll("#weather-select-group .opt-card").forEach(i=>{i.classList.toggle("active",i.getAttribute("data-weather")===e.key)}),this.cockpit.toggleWipers(e.rain),this.sound.setRainAmbience(e.rain)}async loadCockpit3D(e=1){await this.cockpit.setMode("3d",$i[0].offset)!=="3d"&&e<3&&setTimeout(()=>this.loadCockpit3D(e+1),e*2e3)}syncAmbientUI(e,t){const n=document.getElementById("ambient-dot");n&&(n.style.background=t,n.style.boxShadow=`0 0 8px ${t}`),document.querySelectorAll("#ambient-select-group .swatch").forEach(i=>{i.classList.toggle("active",i.getAttribute("data-color")===e)})}syncMultiplayerUI({connected:e,connecting:t,role:n,roomCode:i,playerCount:r,message:o}){const a=document.getElementById("mp-status-text"),c=document.getElementById("mp-active-code-badge"),l=document.getElementById("mp-room-code-val"),h=document.getElementById("btn-mp-host"),u=document.getElementById("btn-mp-join"),f=document.getElementById("btn-mp-leave"),d=document.getElementById("mp-hud-card"),g=document.getElementById("btn-mp-quick"),_=document.getElementById("mp-quick-label");a&&o&&(a.textContent=o),c&&l&&(i?(c.classList.remove("hidden"),l.textContent=i):c.classList.add("hidden")),h&&(n==="host"&&e?h.textContent=`🟢 Oda Aktif (${i})`:n==="host"&&t?h.textContent=`⏳ Bekleniyor (${i})...`:h.textContent="🏁 ODA KUR (KOD AL)"),u&&(n==="guest"&&e?u.textContent="🟢 Bağlandı!":n==="guest"&&t?u.textContent="⏳ Bağlanıyor...":u.textContent="🔗 ODAYA KATIL"),f&&f.classList.toggle("hidden",!n),d&&d.classList.toggle("hidden",!e),g&&g.classList.toggle("connected",!!e),_&&(_.textContent=e?`Oda ${i} · ${r}/${Nt}`:`${Nt} Kişilik`)}toggleSound(){const e=this.sound.toggleMute(),t=document.getElementById("sound-icon");t&&(t.textContent=e?"🔇":"🔊")}togglePauseMenu(){this.paused=!this.paused;const e=document.getElementById("menu-overlay");e&&e.classList.toggle("hidden",!this.paused)}resetRun(){this.score=0,this.combo=1,this.comboTimer=0,this.health=100,this.speedKmh=0,this.playerX=-1.8,this.lateralVel=0,this.yawRate=0,this.headingAngle=0,this.bodyRoll=0,this.rollVel=0,this.bodyPitch=0,this.pitchVel=0,this.traffic.resetTraffic(),this.updateHUD()}triggerScreenFlash(e){const t=document.getElementById("screen-vignette");t&&(t.classList.remove("near-miss-flash","double-makas-flash","crash-flash"),t.offsetWidth,t.classList.add(e),setTimeout(()=>{t.classList.remove(e)},320))}showMakasNotification(e,t,n="normal"){const i=document.getElementById("makas-feed");if(!i)return;const r=1600,o=Math.round(t),a=g=>{clearTimeout(g._exitTimer),g._exitTimer=setTimeout(()=>{g.classList.add("leaving"),setTimeout(()=>g.remove(),260)},r)},c=e.replace(/\s*\(.*?\)/g,""),l=i.firstElementChild;if(l&&!l.classList.contains("leaving")&&l.dataset.key===c){l._count+=1,l._pts+=o,l.querySelector(".makas-title").textContent=e,l.querySelector(".makas-count").textContent=`×${l._count}`,l.querySelector(".makas-pts").textContent=l._pts>0?`+${l._pts}`:"",l.classList.remove("bump"),l.offsetWidth,l.classList.add("bump"),a(l);return}const h=document.createElement("div");h.className=`makas-popup ${n}`,h.dataset.key=c,h._count=1,h._pts=o;const u=document.createElement("span");u.className="makas-title",u.textContent=e;const f=document.createElement("span");f.className="makas-count";const d=document.createElement("span");for(d.className="makas-pts",d.textContent=o>0?`+${o}`:"",h.append(u,f,d),i.prepend(h);i.children.length>3;)i.lastElementChild.remove();a(h)}handleMakas({lateralGap:e,speedKmh:t,isRazorClose:n,isDoubleMakas:i}){const r=i?1.5:n?1:.5;this.combo=Math.min(10,this.combo+r),this.comboTimer=1;const o=Math.max(1,(1.8-e)*1.6),a=t/100;let c=250*o*a,l="MAKAS!",h="normal";i?(c*=2.4,l="🔥 ÇİFT MAKAS (İĞNE DELİĞİ)!",h="gold",this.triggerScreenFlash("double-makas-flash")):n?(c*=1.5,l=`⚡ KUSURSUZ MAKAS (${Math.round(e*100)} CM)`,h="gold",this.triggerScreenFlash("near-miss-flash")):this.triggerScreenFlash("near-miss-flash");const u=c*this.combo;this.score+=u,this.score>this.bestScore&&(this.bestScore=Math.floor(this.score),localStorage.setItem("otoban_makas_best",String(this.bestScore))),this.shakeIntensity=Math.min(.45,this.shakeIntensity+(i?.32:.16)),this.cockpit.triggerMakasCockpitPulse(),this.sound.playMakasWhoosh(this.combo,i),this.showMakasNotification(l,u,h)}handleCollision(){this.combo=1,this.comboTimer=0,this.speedKmh*=.58,this.health=Math.max(0,this.health-18),this.shakeIntensity=.85,this.rollVel+=(Math.random()-.5)*.6,this.pitchVel-=.25,this.sound.playCrash(),this.triggerScreenFlash("crash-flash"),this.showMakasNotification("💥 SÜRTME / KAZA! KOMBO SIFIRLANDI",0,"danger"),this.health<=0&&(this.health=100,this.score=Math.max(0,this.score-1e3))}updatePhysics(e){var ie;const t=this.keys.gas?1:this.touchThrottle,n=this.keys.brake?1:0;let i=0;this.keys.left&&(i-=1),this.keys.right&&(i+=1),Math.abs(this.touchSteerValue)>.02&&(i=this.touchSteerValue);const r=Math.min(1,Math.max(0,(this.speedKmh-50)/190)),o=Math.abs(i)<.02,a=i*this.steerInput<-.04;let c;o?c=8.5+r*5:a?c=13.5-r*2.5:c=10.5-r*2.5,this.steerInput=xt.lerp(this.steerInput,i,Math.min(1,e*c));const l=240,h=0,d=27e-5*this.speedKmh*this.speedKmh+1.5;let g=0;t>0?g=Math.min(33,4200/Math.max(1,this.speedKmh))*t-d:n>0?g=-115:g=-(6+d);const _=Math.abs(this.lateralG)*4.2;g-=_;const m=this.speedKmh;this.speedKmh=Math.max(h,Math.min(l,this.speedKmh+g*e)),this.longitudinalG=xt.lerp(this.longitudinalG,(this.speedKmh-m)/(Math.max(.001,e)*90),Math.min(1,e*12));const p=this.speedKmh/3.6/Jx*60,v=ce=>p*jx[ce]*Zx,x=2100+t*3900,y=1150+t*2200,I=performance.now()/1e3;if(I-this.lastShiftAt>.4){let ce=this.gear;if(ce<8&&v(ce)>x)ce+=1;else for(;ce>1&&v(ce)<y&&v(ce-1)<x-300;)ce-=1;ce!==this.gear&&(this.sound.triggerGearShift(ce>this.gear),this.gear=ce,this.lastShiftAt=I)}const A=Math.max(Qx,v(this.gear));this.rpm=xt.lerp(this.rpm,A,Math.min(1,e*10));const R=this.speedKmh/3.6,w=this.world.weatherKey==="rain"?.85:1,M=.19-r*.06,b=this.steerInput*M,P=o?11.5+r*3.5:(8.2+r*2)*w;this.headingAngle=xt.lerp(this.headingAngle,b,Math.min(1,e*P)),o&&Math.abs(this.headingAngle)<8e-4&&(this.headingAngle=0),this.yawRate=(b-this.headingAngle)*P;const k=this.world.getCurrentCurvature(),U=-k*R*21,q=Math.sin(this.headingAngle)*R*.62+this.steerInput*(4.6+r*2)*Math.min(1,this.speedKmh/40)+U,G=this.lateralVel,J=o?12.5*w:(9.2-r*1.4)*w;this.lateralVel=xt.lerp(this.lateralVel,q,Math.min(1,e*J)),o&&Math.abs(k)<3e-4&&Math.abs(this.lateralVel)<.01&&(this.lateralVel=0),this.playerX+=this.lateralVel*e;const V=(this.lateralVel-G)/(Math.max(.001,e)*24),he=(this.lateralVel-U*.75)/9.8+V*.25;this.lateralG=xt.lerp(this.lateralG,he,Math.min(1,e*12)),o&&Math.abs(k)<3e-4&&Math.abs(this.lateralG)<.005&&(this.lateralG=0);const le=fn-1.05;Math.abs(this.playerX)>le&&(this.playerX=Math.sign(this.playerX)*le,this.lateralVel*=-.3,this.headingAngle*=.3,this.rollVel+=-Math.sign(this.playerX)*.2,this.shakeIntensity=Math.max(this.shakeIntensity,.22),this.speedKmh=Math.max(0,this.speedKmh-28*e));const N=(xt.clamp(-this.lateralG*.028,-.042,.042)-this.bodyRoll)*110-this.rollVel*24;this.rollVel+=N*e,this.bodyRoll+=this.rollVel*e,o&&Math.abs(this.bodyRoll)<4e-4&&Math.abs(this.rollVel)<.002&&(this.bodyRoll=0,this.rollVel=0);const X=t>0||n>0?this.longitudinalG:0,_e=(xt.clamp(X*.011,-.022,.018)-this.bodyPitch)*95-this.pitchVel*22;this.pitchVel+=_e*e,this.bodyPitch+=this.pitchVel*e,this.cockpit.group.position.x=this.playerX,this.cockpit.group.rotation.set(0,0,0);const ve=$i[this.cameraPresetIndex],we=(Math.random()-.5)*.024*this.shakeIntensity,Y=(Math.random()-.5)*.024*this.shakeIntensity;this.shakeIntensity=Math.max(0,this.shakeIntensity-e*2.8),this.camera.position.x=ve.offset.x-this.lateralG*.022+we,this.camera.position.y=ve.offset.y+Y,this.camera.position.z=ve.offset.z-Math.max(-.35,Math.min(.35,X))*.018,this.camera.rotation.y=-this.headingAngle*.52,this.camera.rotation.z=this.bodyRoll*.75,this.camera.rotation.x=this.bodyPitch*.65;const ne=Math.max(0,(this.speedKmh-100)/200)*11;this.camera.fov=xt.lerp(this.camera.fov,ve.baseFov+ne,e*6),this.camera.updateProjectionMatrix(),this.odometerKm+=R*e/1e3,this.speedKmh>120&&(this.score+=(this.speedKmh-100)*.35*this.combo*e,this.score>this.bestScore&&(this.bestScore=Math.floor(this.score))),this.combo>1&&(this.comboTimer-=e*.22,this.comboTimer<=0&&(this.combo=1,this.comboTimer=0)),this.health<100&&(this.health=Math.min(100,this.health+e*2.5)),this.multiplayer.update(e,{playerX:this.playerX,speedKmh:this.speedKmh,headingAngle:this.headingAngle,bodyRoll:this.bodyRoll,highBeam:this.keys.highBeam,braking:n>0,horn:this.keys.horn,score:this.score,combo:this.combo},this.world),this.world.update(e,R,this.playerX,this.keys.highBeam,this.multiplayer.localWorldDistM),this.traffic.update(e,this.speedKmh,this.playerX,{onMakas:ce=>this.handleMakas(ce),onCollision:ce=>{this.multiplayer.notifyLocalCarHit(ce),this.handleCollision()}},this.world,this.multiplayer.getTrafficContext());const T=this.traffic.getRadarSnapshot(this.playerX),te=performance.now()/1e3;for(const ce of this.multiplayer.connected?this.multiplayer.getRemotePlayers():[])if(T.push({x:ce.x,relX:ce.x-this.playerX,relZ:ce.relZ,isPeer:!0,color:ce.style.tag}),this.speedKmh>=115&&Math.abs(ce.relZ)<2.8&&Math.abs(ce.x-this.playerX)>1.75&&Math.abs(ce.x-this.playerX)<3.6&&te-this.lastTandemTime>3.5){this.lastTandemTime=te;const me=400*this.combo;this.score+=me,this.combo=Math.min(10,this.combo+.5),this.comboTimer=1,this.sound.playMakasWhoosh(this.combo,!0),this.showMakasNotification(`🤝 ${ce.name} İLE TANDEM MAKAS!`,me,"gold")}const $=T.some(ce=>ce.relZ<0&&ce.relZ>-22&&Math.abs(ce.relX)<1.75),ae=document.getElementById("ind-danger");ae&&ae.classList.toggle("active",$),this.cockpit.update(e,{speedKmh:this.speedKmh,rpm:this.rpm,gear:this.gear,steerInput:this.steerInput,throttle:t,highBeam:this.keys.highBeam,combo:this.combo,comboTimer:this.comboTimer,score:this.score,odometerKm:this.odometerKm,lateralG:this.lateralG,bodyRoll:this.bodyRoll,bodyPitch:this.bodyPitch,cabinNight:!!((ie=mi[this.world.weatherKey])!=null&&ie.streetlightsOn)},T),this.sound.updateEngine(this.rpm,t,this.speedKmh,this.paused,this.lateralG),this.updateHUD()}updateMultiplayerHud(){const e=document.getElementById("mp-peer-list");if(!e)return;this.mpRows??(this.mpRows=new Map);const t=this.multiplayer.connected?this.multiplayer.getRemotePlayers():[],n=new Set(t.map(i=>i.id));for(const[i,r]of this.mpRows)n.has(i)||(r.el.remove(),this.mpRows.delete(i));for(const i of t){let r=this.mpRows.get(i.id);if(!r){const c=document.createElement("div");c.className="mp-peer-row",c.style.setProperty("--tag",mo[i.slot%mo.length].tag);const l=document.createElement("span");l.className="mp-peer-name";const h=document.createElement("span");h.className="mp-peer-dist";const u=document.createElement("span");u.className="mp-peer-stats",c.append(l,h,u),e.appendChild(c),r={el:c,name:l,dist:h,stats:u,text:{}},this.mpRows.set(i.id,r)}const o=Math.round(Math.abs(i.relZ)),a={name:i.name.toUpperCase(),dist:o<=4?"🔥 YAN YANA":i.relZ<0?`▲ ${o}m`:`▼ ${o}m`,stats:`${Math.round(i.speedKmh)} KM/S • ${i.combo.toFixed(1)}x • ${Math.floor(i.score).toLocaleString("tr-TR")} P`};for(const c of["name","dist","stats"])r.text[c]!==a[c]&&(r.text[c]=a[c],r[c].textContent=a[c])}}catchUpToFriend(){const e=this.multiplayer.catchUpToPeer();e&&this.showMakasNotification(`🚀 ${e} YANINA YETİŞTİN!`,0,"normal")}setHudText(e,t){const n=this.hudEls[e]??(this.hudEls[e]=document.getElementById(e));n&&this.hudCache[e]!==t&&(this.hudCache[e]=t,n.textContent=t)}setHudStyle(e,t,n){const i=this.hudEls[e]??(this.hudEls[e]=document.getElementById(e)),r=`${e}.${t}`;i&&this.hudCache[r]!==n&&(this.hudCache[r]=n,i.style[t]=n)}updateHUD(){var t;this.hudEls??(this.hudEls={}),this.hudCache??(this.hudCache={}),this.setHudText("hud-score",Math.floor(this.score).toLocaleString("tr-TR")),this.setHudText("hud-best",Math.floor(this.bestScore).toLocaleString("tr-TR")),this.setHudText("hud-combo",`${this.combo.toFixed(1)}x`),this.setHudStyle("hud-combo-bar","width",`${Math.round(Math.max(0,Math.min(100,this.comboTimer*100)))}%`);const e=this.combo>=4;this.hudCache.comboHot!==e&&(this.hudCache.comboHot=e,(t=document.getElementById("combo-card"))==null||t.classList.toggle("hot",e)),this.setHudStyle("hud-health-bar","width",`${Math.round(this.health)}%`),this.setHudStyle("hud-health-bar","background",this.health>50?"linear-gradient(90deg, #00ff88, #00d4ff)":"linear-gradient(90deg, #ff2a4b, #ffae00)"),this.setHudText("mini-speed",String(Math.round(this.speedKmh))),this.setHudText("mini-gear",`D${this.gear}`),this.updateMultiplayerHud()}toggleFpsMeter(){if(this.fpsMeter){this.fpsMeter.remove(),this.fpsMeter=null;return}this.fpsMeter=document.createElement("div"),this.fpsMeter.className="fps-meter",this.fpsMeter.textContent="… FPS",document.body.appendChild(this.fpsMeter)}adaptRenderScale(e){const t=this.perf;if(e>1||(t.frames+=1,t.elapsed+=e,t.calls+=this.renderer.info.render.calls,t.elapsed<1))return;const n=t.frames/t.elapsed,i=Math.round(t.calls/t.frames);if(t.window+=1,t.frames=0,t.elapsed=0,t.calls=0,this.fpsMeter&&(this.fpsMeter.textContent=`${Math.round(n)} FPS · ${this.pixelRatio.toFixed(2)}x · ${i} çizim`),t.settle>0){t.settle-=1;return}const r=.25;let o=this.pixelRatio;n<48&&this.pixelRatio>this.minPixelRatio?(t.window-t.lastRaise<=3&&(this.maxPixelRatio=Math.max(this.minPixelRatio,this.pixelRatio-r)),o=Math.max(this.minPixelRatio,this.pixelRatio-r),t.goodWindows=0):n>=57?(t.goodWindows+=1,t.goodWindows>=5&&this.pixelRatio<this.maxPixelRatio&&(o=Math.min(this.maxPixelRatio,this.pixelRatio+r),t.lastRaise=t.window,t.goodWindows=0)):t.goodWindows=0,o!==this.pixelRatio&&(this.pixelRatio=o,this.renderer.setPixelRatio(o),t.settle=1)}animate(){var i;requestAnimationFrame(()=>this.animate());const e=performance.now(),t=(e-this.lastTime)/1e3,n=Math.min(.05,t);if(this.lastTime=e,this.adaptRenderScale(t),this.renderer.info.reset(),!this.paused&&this.multiplayer.connected){let r=Math.min(.5,t);for(;r>.001;){const o=Math.min(.05,r);this.updatePhysics(o),r-=o}}else if(!this.paused)this.updatePhysics(n);else{this.multiplayer.update(n,{playerX:this.playerX,speedKmh:0,headingAngle:0,bodyRoll:0,highBeam:!1,braking:!1,horn:!1,score:this.score,combo:this.combo},this.world),this.world.update(n*.35,22,this.playerX,!1,this.multiplayer.localWorldDistM);const r=this.traffic.getRadarSnapshot(this.playerX);this.cockpit.update(n,{speedKmh:88,rpm:2100+Math.sin(e*.004)*80,gear:3,steerInput:Math.sin(e*.0012)*.08,throttle:.2,highBeam:!1,combo:1,comboTimer:0,score:this.score,odometerKm:this.odometerKm,lateralG:0,cabinNight:!!((i=mi[this.world.weatherKey])!=null&&i.streetlightsOn)},r),this.sound.updateEngine(900,0,0,!0),this.updateHUD()}this.cockpit.renderRearMirror(this.scene),this.renderer.render(this.scene,this.camera)}}window.addEventListener("DOMContentLoaded",()=>{new eM});export{sM as $,Sa as A,It as B,$e as C,My as D,$t as E,gt as F,ln as G,Da as H,iM as I,fi as J,ku as K,Qs as L,rt as M,ir as N,ht as O,vi as P,xi as Q,Ws as R,Mt as S,$u as T,Qn as U,L as V,Ev as W,En as X,st as Y,nM as Z,fM as _,bt as a,Ou as a0,rM as a1,Cv as a2,Ot as a3,Cu as a4,Nu as a5,oM as a6,Sv as a7,no as a8,oc as a9,so as aa,Tt as ab,lo as ac,co as ad,bo as ae,je as af,Yn as ag,So as ah,Pn as ai,Id as aj,fl as ak,qe as b,es as c,An as d,Rv as e,wt as f,xt as g,kt as h,Jn as i,qu as j,dM as k,hM as l,qr as m,aM as n,pe as o,us as p,Lh as q,lM as r,mh as s,cM as t,uM as u,yv as v,di as w,Ro as x,wd as y,Zt as z};
