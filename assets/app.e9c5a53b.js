import{a1 as p,d as u,I as s,a2 as c,u as l,h as d,l as f,a3 as m,a4 as h,a5 as A,a6 as g,a7 as v,a8 as y,a9 as P,aa as w,ab as C,ac as R,ad as _,ae as b,af as E}from"./chunks/framework.5ae1f804.js";import{t as r}from"./chunks/theme.4e9f518c.js";const D={...r,Layout(){return p(r.Layout,null,{})},enhanceApp({app:e}){}};function i(e){if(e.extends){const a=i(e.extends);return{...a,...e,async enhanceApp(t){a.enhanceApp&&await a.enhanceApp(t),e.enhanceApp&&await e.enhanceApp(t)}}}return e}const n=i(D),L=u({name:"VitePressApp",setup(){const{site:e}=l();return d(()=>{f(()=>{document.documentElement.lang=e.value.lang,document.documentElement.dir=e.value.dir})}),m(),h(),A(),n.setup&&n.setup(),()=>p(n.Layout)}});async function T(){const e=S(),a=O();a.provide(g,e);const t=v(e.route);return a.provide(y,t),a.component("Content",P),a.component("ClientOnly",w),Object.defineProperties(a.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),n.enhanceApp&&await n.enhanceApp({app:a,router:e,siteData:C}),{app:a,router:e,data:t}}function O(){return R(L)}function S(){let e=s,a;return _(t=>{let o=b(t);return e&&(a=o),(e||a===o)&&(o=o.replace(/\.js$/,".lean.js")),s&&(e=!1),E(()=>import(o),[])},n.NotFound)}s&&T().then(({app:e,router:a,data:t})=>{a.go().then(()=>{c(a.route,t.site),e.mount("#app")})});export{T as createApp};
