var qn=Array.isArray,Jt=Array.prototype.indexOf,Pn=Array.from,Fn=Object.defineProperty,vt=Object.getOwnPropertyDescriptor,Qt=Object.getOwnPropertyDescriptors,Ln=Object.prototype,Mn=Array.prototype,Wt=Object.getPrototypeOf;function Yn(t){return typeof t=="function"}const Hn=()=>{};function jn(t){return typeof(t==null?void 0:t.then)=="function"}function Bn(t){return t()}function yt(t){for(var n=0;n<t.length;n++)t[n]()}const y=2,wt=4,H=8,ot=16,m=32,z=64,nt=128,D=256,V=512,E=1024,O=2048,J=4096,b=8192,q=16384,Xt=32768,Tt=65536,Un=1<<17,tn=1<<19,mt=1<<20,pt=Symbol("$state"),Vn=Symbol("legacy props"),Gn=Symbol("");function At(t){return t===this.v}function nn(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function It(t){return!nn(t,this.v)}function rn(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function en(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function sn(t){throw new Error("https://svelte.dev/e/effect_orphan")}function ln(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Kn(){throw new Error("https://svelte.dev/e/hydration_failed")}function $n(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function Zn(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function zn(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function an(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function on(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let Q=!1;function Jn(){Q=!0}const Qn=1,Wn=2,Xn=4,tr=8,nr=16,rr=1,er=2,sr=4,lr=8,ar=16,or=1,ur=2,ir=4,fr=1,_r=2,un="[",fn="[!",_n="]",gt={},cr=Symbol();function ut(t,n){var r={f:0,v:t,reactions:null,equals:At,version:0};return r}function vr(t){return cn(ut(t))}function pr(t,n=!1){var e;const r=ut(t);return n||(r.equals=It),Q&&f!==null&&f.l!==null&&((e=f.l).s??(e.s=[])).push(r),r}function cn(t){return u!==null&&u.f&y&&(T===null?On([t]):T.push(t)),t}function hr(t,n){return u!==null&&_t()&&u.f&(y|ot)&&(T===null||!T.includes(t))&&on(),vn(t,n)}function vn(t,n){return t.equals(n)||(t.v,t.v=n,t.version=Vt(),Rt(t,O),_t()&&o!==null&&o.f&E&&!(o.f&m)&&(h!==null&&h.includes(t)?(A(o,O),tt(o)):I===null?Sn([t]):I.push(t))),n}function Rt(t,n){var r=t.reactions;if(r!==null)for(var e=_t(),s=r.length,l=0;l<s;l++){var a=r[l],i=a.f;i&O||!e&&a===o||(A(a,n),i&(E|D)&&(i&y?Rt(a,J):tt(a)))}}function Ot(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let S=!1;function dr(t){S=t}let w;function F(t){if(t===null)throw Ot(),gt;return w=t}function Er(){return F(N(w))}function yr(t){if(S){if(N(w)!==null)throw Ot(),gt;w=t}}function wr(t=1){if(S){for(var n=t,r=w;n--;)r=N(r);w=r}}function Tr(){for(var t=0,n=w;;){if(n.nodeType===8){var r=n.data;if(r===_n){if(t===0)return n;t-=1}else(r===un||r===fn)&&(t+=1)}var e=N(n);n.remove(),n=e}}var ht,pn,St,kt;function mr(){if(ht===void 0){ht=window,pn=document;var t=Element.prototype,n=Node.prototype;St=vt(n,"firstChild").get,kt=vt(n,"nextSibling").get,t.__click=void 0,t.__className="",t.__attributes=null,t.__styles=null,t.__e=void 0,Text.prototype.__t=void 0}}function rt(t=""){return document.createTextNode(t)}function et(t){return St.call(t)}function N(t){return kt.call(t)}function Ar(t,n){if(!S)return et(t);var r=et(w);if(r===null)r=w.appendChild(rt());else if(n&&r.nodeType!==3){var e=rt();return r==null||r.before(e),F(e),e}return F(r),r}function Ir(t,n){if(!S){var r=et(t);return r instanceof Comment&&r.data===""?N(r):r}return w}function gr(t,n=1,r=!1){let e=S?w:t;for(var s;n--;)s=e,e=N(e);if(!S)return e;var l=e==null?void 0:e.nodeType;if(r&&l!==3){var a=rt();return e===null?s==null||s.after(a):e.before(a),F(a),a}return F(e),e}function Rr(t){t.textContent=""}function hn(t){var n=y|O;o===null?n|=D:o.f|=mt;var r=u!==null&&u.f&y?u:null;const e={children:null,ctx:f,deps:null,equals:At,f:n,fn:t,reactions:null,v:null,version:0,parent:r??o};return r!==null&&(r.children??(r.children=[])).push(e),e}function Or(t){const n=hn(t);return n.equals=It,n}function Dt(t){var n=t.children;if(n!==null){t.children=null;for(var r=0;r<n.length;r+=1){var e=n[r];e.f&y?it(e):k(e)}}}function dn(t){for(var n=t.parent;n!==null;){if(!(n.f&y))return n;n=n.parent}return null}function Nt(t){var n,r=o;Z(dn(t));try{Dt(t),n=Gt(t)}finally{Z(r)}return n}function xt(t){var n=Nt(t),r=(R||t.f&D)&&t.deps!==null?J:E;A(t,r),t.equals(n)||(t.v=n,t.version=Vt())}function it(t){Dt(t),Y(t,0),A(t,q),t.v=t.children=t.deps=t.ctx=t.reactions=null}function Ct(t){o===null&&u===null&&sn(),u!==null&&u.f&D&&en(),ft&&rn()}function En(t,n){var r=n.last;r===null?n.last=n.first=t:(r.next=t,t.prev=r,n.last=t)}function P(t,n,r,e=!0){var s=(t&z)!==0,l=o,a={ctx:f,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:t|O,first:null,fn:n,last:null,next:null,parent:s?null:l,prev:null,teardown:null,transitions:null,version:0};if(r){var i=x;try{dt(!0),X(a),a.f|=Xt}catch(c){throw k(a),c}finally{dt(i)}}else n!==null&&tt(a);var _=r&&a.deps===null&&a.first===null&&a.nodes_start===null&&a.teardown===null&&(a.f&mt)===0;if(!_&&!s&&e&&(l!==null&&En(a,l),u!==null&&u.f&y)){var p=u;(p.children??(p.children=[])).push(a)}return a}function Sr(t){const n=P(H,null,!1);return A(n,E),n.teardown=t,n}function kr(t){Ct();var n=o!==null&&(o.f&m)!==0&&f!==null&&!f.m;if(n){var r=f;(r.e??(r.e=[])).push({fn:t,effect:o,reaction:u})}else{var e=bt(t);return e}}function Dr(t){return Ct(),yn(t)}function Nr(t){const n=P(z,t,!0);return(r={})=>new Promise(e=>{r.outro?mn(n,()=>{k(n),e(void 0)}):(k(n),e(void 0))})}function bt(t){return P(wt,t,!1)}function yn(t){return P(H,t,!0)}function xr(t){return wn(t)}function wn(t,n=0){return P(H|ot|n,t,!0)}function Cr(t,n=!0){return P(H|m,t,!0,n)}function qt(t){var n=t.teardown;if(n!==null){const r=ft,e=u;Et(!0),$(null);try{n.call(null)}finally{Et(r),$(e)}}}function Pt(t){var n=t.deriveds;if(n!==null){t.deriveds=null;for(var r=0;r<n.length;r+=1)it(n[r])}}function Ft(t,n=!1){var r=t.first;for(t.first=t.last=null;r!==null;){var e=r.next;k(r,n),r=e}}function Tn(t){for(var n=t.first;n!==null;){var r=n.next;n.f&m||k(n),n=r}}function k(t,n=!0){var r=!1;if((n||t.f&tn)&&t.nodes_start!==null){for(var e=t.nodes_start,s=t.nodes_end;e!==null;){var l=e===s?null:N(e);e.remove(),e=l}r=!0}Ft(t,n&&!r),Pt(t),Y(t,0),A(t,q);var a=t.transitions;if(a!==null)for(const _ of a)_.stop();qt(t);var i=t.parent;i!==null&&i.first!==null&&Lt(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function Lt(t){var n=t.parent,r=t.prev,e=t.next;r!==null&&(r.next=e),e!==null&&(e.prev=r),n!==null&&(n.first===t&&(n.first=e),n.last===t&&(n.last=r))}function mn(t,n){var r=[];Mt(t,r,!0),An(r,()=>{k(t),n&&n()})}function An(t,n){var r=t.length;if(r>0){var e=()=>--r||n();for(var s of t)s.out(e)}else n()}function Mt(t,n,r){if(!(t.f&b)){if(t.f^=b,t.transitions!==null)for(const a of t.transitions)(a.is_global||r)&&n.push(a);for(var e=t.first;e!==null;){var s=e.next,l=(e.f&Tt)!==0||(e.f&m)!==0;Mt(e,n,l?r:!1),e=s}}}function br(t){Yt(t,!0)}function Yt(t,n){if(t.f&b){j(t)&&X(t),t.f^=b;for(var r=t.first;r!==null;){var e=r.next,s=(r.f&Tt)!==0||(r.f&m)!==0;Yt(r,s?n:!1),r=e}if(t.transitions!==null)for(const l of t.transitions)(l.is_global||n)&&l.in()}}const In=typeof requestIdleCallback>"u"?t=>setTimeout(t,1):requestIdleCallback;let G=!1,K=!1,st=[],lt=[];function Ht(){G=!1;const t=st.slice();st=[],yt(t)}function jt(){K=!1;const t=lt.slice();lt=[],yt(t)}function qr(t){G||(G=!0,queueMicrotask(Ht)),st.push(t)}function Pr(t){K||(K=!0,In(jt)),lt.push(t)}function gn(){G&&Ht(),K&&jt()}const Bt=0,Rn=1;let B=!1,U=Bt,L=!1,M=null,x=!1,ft=!1;function dt(t){x=t}function Et(t){ft=t}let g=[],C=0;let u=null;function $(t){u=t}let o=null;function Z(t){o=t}let T=null;function On(t){T=t}let h=null,d=0,I=null;function Sn(t){I=t}let Ut=1,R=!1,f=null;function Fr(t){f=t}function Vt(){return++Ut}function _t(){return!Q||f!==null&&f.l===null}function j(t){var p;var n=t.f;if(n&O)return!0;if(n&J){var r=t.deps,e=(n&D)!==0;if(r!==null){var s,l,a=(n&V)!==0,i=e&&o!==null&&!R,_=r.length;if(a||i){for(s=0;s<_;s++)l=r[s],(a||!((p=l==null?void 0:l.reactions)!=null&&p.includes(t)))&&(l.reactions??(l.reactions=[])).push(t);a&&(t.f^=V)}for(s=0;s<_;s++)if(l=r[s],j(l)&&xt(l),l.version>t.version)return!0}(!e||o!==null&&!R)&&A(t,E)}return!1}function kn(t,n){for(var r=n;r!==null;){if(r.f&nt)try{r.fn(t);return}catch{r.f^=nt}r=r.parent}throw B=!1,t}function Dn(t){return(t.f&q)===0&&(t.parent===null||(t.parent.f&nt)===0)}function W(t,n,r,e){if(B){if(r===null&&(B=!1),Dn(n))throw t;return}r!==null&&(B=!0);{kn(t,n);return}}function Gt(t){var ct;var n=h,r=d,e=I,s=u,l=R,a=T,i=f,_=t.f;h=null,d=0,I=null,u=_&(m|z)?null:t,R=!x&&(_&D)!==0,T=null,f=t.ctx;try{var p=(0,t.fn)(),c=t.deps;if(h!==null){var v;if(Y(t,d),c!==null&&d>0)for(c.length=d+h.length,v=0;v<h.length;v++)c[d+v]=h[v];else t.deps=c=h;if(!R)for(v=d;v<c.length;v++)((ct=c[v]).reactions??(ct.reactions=[])).push(t)}else c!==null&&d<c.length&&(Y(t,d),c.length=d);return p}finally{h=n,d=r,I=e,u=s,R=l,T=a,f=i}}function Nn(t,n){let r=n.reactions;if(r!==null){var e=Jt.call(r,t);if(e!==-1){var s=r.length-1;s===0?r=n.reactions=null:(r[e]=r[s],r.pop())}}r===null&&n.f&y&&(h===null||!h.includes(n))&&(A(n,J),n.f&(D|V)||(n.f^=V),Y(n,0))}function Y(t,n){var r=t.deps;if(r!==null)for(var e=n;e<r.length;e++)Nn(t,r[e])}function X(t){var n=t.f;if(!(n&q)){A(t,E);var r=o,e=f;o=t;try{n&ot?Tn(t):Ft(t),Pt(t),qt(t);var s=Gt(t);t.teardown=typeof s=="function"?s:null,t.version=Ut;var l=t.deps,a}catch(i){W(i,t,r,e||t.ctx)}finally{o=r}}}function Kt(){if(C>1e3){C=0;try{ln()}catch(t){if(M!==null)W(t,M,null);else throw t}}C++}function $t(t){var n=t.length;if(n!==0){Kt();var r=x;x=!0;try{for(var e=0;e<n;e++){var s=t[e];s.f&E||(s.f^=E);var l=[];Zt(s,l),xn(l)}}finally{x=r}}}function xn(t){var n=t.length;if(n!==0)for(var r=0;r<n;r++){var e=t[r];if(!(e.f&(q|b)))try{j(e)&&(X(e),e.deps===null&&e.first===null&&e.nodes_start===null&&(e.teardown===null?Lt(e):e.fn=null))}catch(s){W(s,e,null,e.ctx)}}}function Cn(){if(L=!1,C>1001)return;const t=g;g=[],$t(t),L||(C=0,M=null)}function tt(t){U===Bt&&(L||(L=!0,queueMicrotask(Cn))),M=t;for(var n=t;n.parent!==null;){n=n.parent;var r=n.f;if(r&(z|m)){if(!(r&E))return;n.f^=E}}g.push(n)}function Zt(t,n){var r=t.first,e=[];t:for(;r!==null;){var s=r.f,l=(s&m)!==0,a=l&&(s&E)!==0,i=r.next;if(!a&&!(s&b))if(s&H){if(l)r.f^=E;else try{j(r)&&X(r)}catch(v){W(v,r,null,r.ctx)}var _=r.first;if(_!==null){r=_;continue}}else s&wt&&e.push(r);if(i===null){let v=r.parent;for(;v!==null;){if(t===v)break t;var p=v.next;if(p!==null){r=p;continue t}v=v.parent}}r=i}for(var c=0;c<e.length;c++)_=e[c],n.push(_),Zt(_,n)}function zt(t){var n=U,r=g;try{Kt();const s=[];U=Rn,g=s,L=!1,$t(r);var e=t==null?void 0:t();return gn(),(g.length>0||s.length>0)&&zt(),C=0,M=null,e}finally{U=n,g=r}}async function Lr(){await Promise.resolve(),zt()}function Mr(t){var c;var n=t.f,r=(n&y)!==0;if(r&&n&q){var e=Nt(t);return it(t),e}if(u!==null){T!==null&&T.includes(t)&&an();var s=u.deps;h===null&&s!==null&&s[d]===t?d++:h===null?h=[t]:h.push(t),I!==null&&o!==null&&o.f&E&&!(o.f&m)&&I.includes(t)&&(A(o,O),tt(o))}else if(r&&t.deps===null)for(var l=t,a=l.parent,i=l;a!==null;)if(a.f&y){var _=a;i=_,a=_.parent}else{var p=a;(c=p.deriveds)!=null&&c.includes(i)||(p.deriveds??(p.deriveds=[])).push(i);break}return r&&(l=t,j(l)&&xt(l)),t.v}function Yr(t){const n=u;try{return u=null,t()}finally{u=n}}const bn=-7169;function A(t,n){t.f=t.f&bn|n}function Hr(t,n=!1,r){f={p:f,c:null,e:null,m:!1,s:t,x:null,l:null},Q&&!n&&(f.l={s:null,u:null,r1:[],r2:ut(!1)})}function jr(t){const n=f;if(n!==null){const a=n.e;if(a!==null){var r=o,e=u;n.e=null;try{for(var s=0;s<a.length;s++){var l=a[s];Z(l.effect),$(l.reaction),bt(l.fn)}}finally{Z(r),$(e)}}f=n.p,n.m=!0}return{}}function Br(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(pt in t)at(t);else if(!Array.isArray(t))for(let n in t){const r=t[n];typeof r=="object"&&r&&pt in r&&at(r)}}}function at(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let e in t)try{at(t[e],n)}catch{}const r=Wt(t);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const e=Qt(r);for(let s in e){const l=e[s].get;if(l)try{l.call(t)}catch{}}}}}export{pn as $,Ar as A,yr as B,gr as C,Q as D,Tt as E,_r as F,o as G,tn as H,Er as I,Ln as J,Mn as K,ut as L,Zn as M,hr as N,vt as O,zn as P,Wt as Q,qn as R,pt as S,fr as T,cr as U,fn as V,Tr as W,br as X,mn as Y,bt as Z,yn as _,Cr as a,qr as a0,$n as a1,Un as a2,sr as a3,It as a4,m as a5,z as a6,Z as a7,rr as a8,er as a9,Wn as aA,Mt as aB,An as aC,Xn as aD,tr as aE,nr as aF,nn as aG,Pr as aH,Qt as aI,Gn as aJ,ot as aK,Xt as aL,Yn as aM,or as aN,ur as aO,ir as aP,ht as aQ,wr as aR,lr as aa,Vn as ab,Or as ac,pr as ad,ar as ae,$ as af,u as ag,Sr as ah,Fn as ai,mr as aj,gt as ak,_n as al,Ot as am,Kn as an,Rr as ao,Pn as ap,Nr as aq,zt as ar,Lr as as,vr as at,_t as au,jn as av,vn as aw,Fr as ax,b as ay,Qn as az,wn as b,w as c,k as d,Jn as e,rt as f,un as g,S as h,N as i,F as j,et as k,kr as l,f as m,Hn as n,Yr as o,Mr as p,Bn as q,yt as r,dr as s,Br as t,Dr as u,hn as v,Hr as w,Ir as x,xr as y,jr as z};