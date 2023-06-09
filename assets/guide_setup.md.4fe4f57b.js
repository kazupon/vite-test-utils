import{_ as e,o as t,c as o,O as s}from"./chunks/framework.ea84d15e.js";const g=JSON.parse('{"title":"Setup","description":"","frontmatter":{},"headers":[],"relativePath":"guide/setup.md","filePath":"guide/setup.md","lastUpdated":1686351827000}'),a={name:"guide/setup.md"},i=s(`<h1 id="setup" tabindex="-1">Setup <a class="header-anchor" href="#setup" aria-label="Permalink to &quot;Setup&quot;">​</a></h1><h2 id="setting-up-the-test-context" tabindex="-1">Setting up the test context <a class="header-anchor" href="#setting-up-the-test-context" aria-label="Permalink to &quot;Setting up the test context&quot;">​</a></h2><p>In each describe block where you are taking advantage of the Vite test utils helper APIs, you will need to set up the test context before beginning:</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">setup</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">vite-test-utils</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">setup</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// test context options</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">test</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">test case 1</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// ...</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>Behind the scenes, <code>setup</code> performs a number of tasks in <code>beforeAll</code>, <code>beforeEach</code>, <code>afterEach</code> and <code>afterAll</code> to setup the Vite test environment correctly.</p><p>This means it must be run before any other calls to test or it.</p><h2 id="setup-options" tabindex="-1"><code>setup</code> options <a class="header-anchor" href="#setup-options" aria-label="Permalink to &quot;\`setup\` options&quot;">​</a></h2><h3 id="paths-and-vite-configuration" tabindex="-1">Paths and Vite configuration <a class="header-anchor" href="#paths-and-vite-configuration" aria-label="Permalink to &quot;Paths and Vite configuration&quot;">​</a></h3><h4 id="rootdir" tabindex="-1">rootDir <a class="header-anchor" href="#rootdir" aria-label="Permalink to &quot;rootDir&quot;">​</a></h4><p>The root directory path that is put in your vite application project.</p><p>If Vite test utils could not find vite config in <code>rootdir</code>, it falls back to <code>process.cwd()</code></p><ul><li>Type: <code>string</code></li><li>Default: <code>process.cwd()</code></li></ul><h4 id="configfile" tabindex="-1">configFile <a class="header-anchor" href="#configfile" aria-label="Permalink to &quot;configFile&quot;">​</a></h4><p>The vite config <strong>filename</strong> which is used in test fixture.</p><p>If vite config file is specified with this option, it will be respected over the default config file that will be resolved by vite.</p><p>The file for this option is <strong>relative</strong> to the directory specified in the <code>rootDir</code> option.</p><p>This option is useful if you want to test as the fixture for different enviroment cases with different vite config settings.</p><ul><li>Type: <code>string</code></li><li>Default: <code>&#39;vite.config.ts&#39; | &#39;vite.config.js&#39; | &#39;vite.config.mjs&#39; | &#39;vite.config.mts&#39; | &#39;vite.config.cjs&#39; | &#39;vite.config.cts&#39;</code></li></ul><h4 id="viteconfig" tabindex="-1">viteConfig <a class="header-anchor" href="#viteconfig" aria-label="Permalink to &quot;viteConfig&quot;">​</a></h4><p>The vite config that is overrided the config resolved.</p><p>Simply, use that option if you hope override the vite config with <strong>javascript premitive value</strong> such as object or string.</p><p>If you hope set up programmaticaly overrides using like <code>import</code> syntax, you must prepare the vite config for the override and specify it with <code>viteConfigPath</code>.</p><ul><li>Type: <code>UserConfig</code></li><li>Default: <code>{}</code></li></ul><h4 id="viteconfigfile" tabindex="-1">viteConfigFile <a class="header-anchor" href="#viteconfigfile" aria-label="Permalink to &quot;viteConfigFile&quot;">​</a></h4><p>The vite config file path that is overrided the config resolved.</p><p>If that option is specified, it&#39;s respected than <code>viteConfig</code> option.</p><ul><li>Type: <code>string</code> | <code>undefined</code></li><li>Default: <code>undefined</code></li></ul><h3 id="features-to-enable" tabindex="-1">Features to enable <a class="header-anchor" href="#features-to-enable" aria-label="Permalink to &quot;Features to enable&quot;">​</a></h3><h4 id="mode" tabindex="-1">mode <a class="header-anchor" href="#mode" aria-label="Permalink to &quot;mode&quot;">​</a></h4><p>The vite server working mode.</p><p>If you use <code>&#39;dev&#39;</code>, Vite test utils will start dev server, else you use <code>&#39;preview&#39;</code>. Vite test utils will build fixture and start preview server.</p><ul><li>Type: <code>string</code></li><li>Default: <code>&#39;dev&#39;</code></li></ul><h4 id="server" tabindex="-1">server <a class="header-anchor" href="#server" aria-label="Permalink to &quot;server&quot;">​</a></h4><p>Whether to launch a server to respond to requests in the test suite.</p><ul><li>Type: <code>boolean</code></li><li>Default: <code>false</code></li></ul><h4 id="browser" tabindex="-1">browser <a class="header-anchor" href="#browser" aria-label="Permalink to &quot;browser&quot;">​</a></h4><p>Under the hood, Vite test utils uses <a href="https://playwright.dev/" target="_blank" rel="noreferrer"><code>playwright</code></a> to do browser testing.</p><p>If this option is set, a browser will be launched and can be controlled in the subsequent test suite. (More info can be found <a href="/vite-test-utils/guide/browser.html">here</a>.)</p><ul><li>Type: <code>boolean</code></li><li>Default: <code>false</code></li></ul><h4 id="browseroptions" tabindex="-1">browserOptions <a class="header-anchor" href="#browseroptions" aria-label="Permalink to &quot;browserOptions&quot;">​</a></h4><ul><li>Type: <code>object</code> with the following properties <ul><li><strong>type</strong>: The type of browser to launch - either <code>chromium</code>, <code>firefox</code> or <code>webkit</code></li><li><strong>launch</strong>: <code>object</code> of options that will be passed to playwright when launching the browser. See <a href="https://playwright.dev/docs/api/class-browsertype#browser-type-launch" target="_blank" rel="noreferrer">full API reference</a>.</li></ul></li></ul>`,41),n=[i];function l(r,c,p,d,h,u){return t(),o("div",null,n)}const y=e(a,[["render",l]]);export{g as __pageData,y as default};
