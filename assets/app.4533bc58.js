import{a2 as p,d as u,K as s,a3 as c,u as l,p as d,k as f,a4 as m,a5 as h,a6 as A,a7 as g,a8 as v,a9 as y,aa as P,ab as w,ac as C,ad as R,ae as _,af as b,ag as E}from"./chunks/framework.33c6aeb1.js";import{t as r}from"./chunks/theme.2c145ceb.js";const D={...r,Layout(){return p(r.Layout,null,{})},enhanceApp({app:e}){}};function i(e){if(e.extends){const a=i(e.extends);return{...a,...e,async enhanceApp(t){a.enhanceApp&&await a.enhanceApp(t),e.enhanceApp&&await e.enhanceApp(t)}}}return e}const n=i(D),L=u({name:"VitePressApp",setup(){const{site:e}=l();return d(()=>{f(()=>{document.documentElement.lang=e.value.lang,document.documentElement.dir=e.value.dir})}),m(),h(),A(),n.setup&&n.setup(),()=>p(n.Layout)}});async function T(){const e=S(),a=O();a.provide(g,e);const t=v(e.route);return a.provide(y,t),a.component("Content",P),a.component("ClientOnly",w),Object.defineProperties(a.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),n.enhanceApp&&await n.enhanceApp({app:a,router:e,siteData:C}),{app:a,router:e,data:t}}function O(){return R(L)}function S(){let e=s,a;return _(t=>{let o=b(t);return e&&(a=o),(e||a===o)&&(o=o.replace(/\.js$/,".lean.js")),s&&(e=!1),E(()=>import(o),[])},n.NotFound)}s&&T().then(({app:e,router:a,data:t})=>{a.go().then(()=>{c(a.route,t.site),e.mount("#app")})});export{T as createApp};
