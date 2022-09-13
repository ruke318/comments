<template><div><h1 id="使用-vuepress-搭建博客-专注文档内容" tabindex="-1"><a class="header-anchor" href="#使用-vuepress-搭建博客-专注文档内容" aria-hidden="true">#</a> 使用 vuepress 搭建博客，专注文档内容</h1>
<p>由于近期在开发一个外部对接的项目，公司也没有提供统一对外提供的<code v-pre>文档平台</code>，就得靠自己去找个简单明了的工具了, 一共用过两个工具 <code v-pre>gitbook</code>, <code v-pre>vuepress</code>; 两个工具都有使用，我简单介绍下这两个工具的使用</p>
<!-- more -->
<h2 id="gitbook" tabindex="-1"><a class="header-anchor" href="#gitbook" aria-hidden="true">#</a> gitbook</h2>
<div class="custom-container tip">
<p class="custom-container-title">gitbook</p>
<p>gitbook <a href="http://Gitbook.com" target="_blank" rel="noopener noreferrer">http://Gitbook.com<ExternalLinkIcon/></a> 是一个写作和出版的平台，他们使用的系统是开源的。支持Markdown和AsciiDoc格式，最后输出的是静态网页。还可以通过calibre把书转成pdf、epub、mobi等常用格式，方便在各种设备上阅读。也是静态博客网站的一个选择</p>
</div>
<h3 id="gitbook安装" tabindex="-1"><a class="header-anchor" href="#gitbook安装" aria-hidden="true">#</a> gitbook安装</h3>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> gitbook-cli <span class="token parameter variable">-g</span>
</code></pre></div><p>此时 <code v-pre>gitbook</code> 已经全局安装完成，可以在命令行使用了</p>
<h3 id="新建一本书" tabindex="-1"><a class="header-anchor" href="#新建一本书" aria-hidden="true">#</a> 新建一本书</h3>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code>gitbook init
</code></pre></div><h3 id="预览" tabindex="-1"><a class="header-anchor" href="#预览" aria-hidden="true">#</a> 预览</h3>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code>gitbook serve
</code></pre></div><p>此时，你可以在浏览器访问 <a href="http://localhost:4000" target="_blank" rel="noopener noreferrer">http://localhost:4000<ExternalLinkIcon/></a> 预览你的电子书页面</p>
<h3 id="各种输出" tabindex="-1"><a class="header-anchor" href="#各种输出" aria-hidden="true">#</a> 各种输出</h3>
<p>gitbook生成其他格式的书是借助calibre的转换功能实现的(<mark>ebook-convert</mark>)，安装完calibre后，修改系统$PATH定义，把转换程序的路径加到系统PATH里，要不然会找不到转换程序。打开Terminal（终端），按照下面的操作步骤修改PATH。</p>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token function">vi</span> ~/.bash_profile
</code></pre></div><p>把下面这句附加到.bash_profile文件里，然后保存退出。</p>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token environment constant">$PATH</span>:/Applications/calibre.app/Contents/MacOS/
</code></pre></div><p>使用source命令使文件立即生效</p>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">source</span> ~/.bash_profile
<span class="token builtin class-name">echo</span> <span class="token environment constant">$PATH</span>
</code></pre></div><CodeTabs :data='[{"title":"编译成静态html"},{"title":"输出PDF"},{"title":"输出 epub"},{"title":"输出 mobi"}]' tab-id="bash">

<template #tab0="{ title, value, isActive }">
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code>gitbook build
</code></pre></div></template>
<template #tab1="{ title, value, isActive }">
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code>gitbook pdf ./ mybook.pdf
</code></pre></div></template>
<template #tab2="{ title, value, isActive }">
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code>gitbook epub ./ mybook.epub
</code></pre></div></template>
<template #tab3="{ title, value, isActive }">
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code>gitbook mobi ./ mybook.mobi
</code></pre></div></template>
</CodeTabs>
<h2 id="vuepress" tabindex="-1"><a class="header-anchor" href="#vuepress" aria-hidden="true">#</a> vuepress</h2>
<div class="custom-container tip">
<p class="custom-container-title">vepress</p>
<p>VuePress 由两部分组成：第一部分是一个极简静态网站生成器 (opens new window)，它包含由 Vue 驱动的主题系统和插件 API，另一个部分是为书写技术文档而优化的默认主题，它的诞生初衷是为了支持 Vue 及其子项目的文档需求。</p>
<p>每一个由 VuePress 生成的页面都带有预渲染好的 HTML，也因此具有非常好的加载性能和搜索引擎优化（SEO）。同时，一旦页面被加载，Vue 将接管这些静态内容，并将其转换成一个完整的单页应用（SPA），其他的页面则会只在用户浏览到的时候才按需加载。</p>
</div>
<div class="custom-container warning">
<p class="custom-container-title">前提条件</p>
<p>VuePress 需要 Node.js (opens new window)&gt;= 8.6</p>
</div>
<h3 id="创建目录" tabindex="-1"><a class="header-anchor" href="#创建目录" aria-hidden="true">#</a> 创建目录</h3>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token function">mkdir</span> vuepress-starter <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> vuepress-starter
</code></pre></div><h3 id="init" tabindex="-1"><a class="header-anchor" href="#init" aria-hidden="true">#</a> init</h3>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token function">yarn</span> init <span class="token comment"># npm init</span>
</code></pre></div><h3 id="将-vuepress-安装为本地依赖" tabindex="-1"><a class="header-anchor" href="#将-vuepress-安装为本地依赖" aria-hidden="true">#</a> 将 VuePress 安装为本地依赖</h3>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token function">yarn</span> <span class="token function">add</span> <span class="token parameter variable">-D</span> vuepress <span class="token comment"># npm install -D vuepress</span>
</code></pre></div><h3 id="在-package-json-中添加一些-scripts" tabindex="-1"><a class="header-anchor" href="#在-package-json-中添加一些-scripts" aria-hidden="true">#</a> 在 <code v-pre>package.json</code> 中添加一些 scripts</h3>
<div class="language-javascript ext-js"><pre v-pre class="language-javascript"><code><span class="token punctuation">{</span>
  <span class="token string-property property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">"docs:dev"</span><span class="token operator">:</span> <span class="token string">"vuepress dev docs"</span><span class="token punctuation">,</span>
    <span class="token string-property property">"docs:build"</span><span class="token operator">:</span> <span class="token string">"vuepress build docs"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><h3 id="在本地启动服务器" tabindex="-1"><a class="header-anchor" href="#在本地启动服务器" aria-hidden="true">#</a> 在本地启动服务器</h3>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token function">yarn</span> docs:dev <span class="token comment"># npm run docs:dev</span>
</code></pre></div><p>这里是内容。</p>
</div></template>


