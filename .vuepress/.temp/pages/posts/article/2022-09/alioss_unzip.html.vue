<template><div><h1 id="使用阿里云-oss-云函数-实现-zip-自动解压" tabindex="-1"><a class="header-anchor" href="#使用阿里云-oss-云函数-实现-zip-自动解压" aria-hidden="true">#</a> 使用阿里云 oss + 云函数 实现 zip 自动解压</h1>
<p>前段时间，公司有个需求，商家需要批量编辑商品的图片，图片包括主图、规格图、详情图，而且都有多张；如果单纯的通过人工单个文件编辑需要耗费大量的人力，所以需要使用到批量图片上传，而需要实现该功能需要解决以下问题</p>
<!-- more -->
<h2 id="面临的问题" tabindex="-1"><a class="header-anchor" href="#面临的问题" aria-hidden="true">#</a> 面临的问题</h2>
<ul>
<li>图片数量太多，直接使用 <code v-pre>multiple</code> 在这种情况下不是那么友好</li>
<li>如果上传压缩包，针对大文件上传需要引入分片上传</li>
<li>如果经过自己服务器上传，占用带宽较大，对资源占用较多</li>
<li>如果c端直连oss上传，服务端下载后解压，同样下载浪费不必要的资源</li>
</ul>
<h3 id="怎么解决这些问题" tabindex="-1"><a class="header-anchor" href="#怎么解决这些问题" aria-hidden="true">#</a> 怎么解决这些问题</h3>
<p>如上面的问题，最终可以肯定的是：1、上传压缩包 2、c端直连oss 3、最好能在服务器之外实现解压并将图片关联商品；通过阿里oss的调研，发现在上传时可以触发 <code v-pre>云函数</code> 事件，达到 <code v-pre>自动解压的目的</code></p>
<ul>
<li>使用 阿里oss 的分片上传 sdk，解决大文件上传慢问题</li>
<li>如何才知道解压完成了？-- 云函数内部通过回调解决</li>
<li>如何解决用户上传到一半断开问题？ -- 自动删除分片数据</li>
<li>如何知道上传了哪些商品的图片？ -- 从图片命名上 + 回调列举文件绑定商品</li>
</ul>
<h2 id="如何实施" tabindex="-1"><a class="header-anchor" href="#如何实施" aria-hidden="true">#</a> 如何实施</h2>
<ol>
<li>前端通过临时STS授权直接调用alioss的接口，后端接口提供临时STS验证参数</li>
<li>使用<code v-pre>分片上传</code>方案，加快上传效率，保证成功率</li>
<li>使用oss云函数zip解压缩，商户后台直接上传压缩包即可</li>
<li>添加上传成功回调，后端通过回调处理图片和商品的对应关系, 并且删除压缩包</li>
</ol>
<h3 id="实施步骤" tabindex="-1"><a class="header-anchor" href="#实施步骤" aria-hidden="true">#</a> 实施步骤</h3>
<ol>
<li>创建<code v-pre>创建子用户/STS授权角色</code></li>
</ol>
<p>创建子用户/STS授权角色，通过此步骤可以获取到用于调用 sts临时授权的参数  <code v-pre>accessKeyId</code>，<code v-pre>accessKeySecret</code>，<code v-pre>RoleArn</code></p>
<details class="custom-container details"><summary>授权</summary>
<p><img src="https://oss.itruke.com/doc/202209/1663755427-7f84.png?x-oss-process=image/format,webp" alt="" loading="lazy">
<img src="https://oss.itruke.com/doc/202209/1663755460-0cc0.png?x-oss-process=image/format,webp" alt="" loading="lazy">
<img src="https://oss.itruke.com/doc/202209/1663755491-ef10.png?x-oss-process=image/format,webp" alt="" loading="lazy">
<img src="https://oss.itruke.com/doc/202209/1663755508-0e3e.png?x-oss-process=image/format,webp" alt="" loading="lazy"></p>
</details>
<ol start="2">
<li>开通云函数服务</li>
</ol>
<details class="custom-container details"><summary>云函数开通</summary>
<ol>
<li>开通云函数服务 -- 选择运行内存时请选择大一点的(最好3GB)</li>
<li>oss存储服务找到对应的 buket  测试环境和正式环境为 <code v-pre>xxxx</code>, 开通zip解压缩功能</li>
</ol>
<p><img src="https://oss.itruke.com/doc/202209/1663755635-a517.png?x-oss-process=image/format,webp" alt="" loading="lazy">
<img src="https://oss.itruke.com/doc/202209/1663755659-1d71.png?x-oss-process=image/format,webp" alt="" loading="lazy">
<img src="https://oss.itruke.com/doc/202209/1663755695-a3f2.png?x-oss-process=image/format,webp" alt="" loading="lazy"></p>
<p><code v-pre>前缀</code>：上传时的前缀，比如我要上传一个压缩包xxx.zip, 在代码中就应该添加前缀，objectname=batch_images_zip/IMG_xxx.zip</p>
<p><code v-pre>目标目录</code>：也就是解压出来的目录为  img_unit_goods/IMG_xxx/压缩包解压出来的内容</p>
</details>
<ol start="3">
<li>流程</li>
</ol>
<p><img src="https://oss.itruke.com/doc/202209/1663755789-bbb2.png?x-oss-process=image/format,webp" alt="" loading="lazy"></p>
<ol start="4">
<li>文件上传代码示例</li>
</ol>
<div class="language-html ext-html"><pre v-pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>UTF-8<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>Document<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>submit<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>上传<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>file<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>file<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
    <span class="token comment">&lt;!-- 导入sdk文件 --></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span>
      <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/javascript<span class="token punctuation">"</span></span>
      <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://gosspublic.alicdn.com/aliyun-oss-sdk-6.16.0.min.js<span class="token punctuation">"</span></span>
    <span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/javascript<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">


      <span class="token keyword">function</span> <span class="token function">randomString</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>    
            e <span class="token operator">=</span> e <span class="token operator">||</span> <span class="token number">32</span><span class="token punctuation">;</span>
            <span class="token keyword">var</span> t <span class="token operator">=</span> <span class="token string">"ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"</span><span class="token punctuation">,</span>
            a <span class="token operator">=</span> t<span class="token punctuation">.</span>length<span class="token punctuation">,</span>
            n <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> e<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> n <span class="token operator">+=</span> t<span class="token punctuation">.</span><span class="token function">charAt</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> a<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> n
      <span class="token punctuation">}</span>

      <span class="token keyword">function</span> <span class="token function">getOption</span><span class="token punctuation">(</span><span class="token parameter">config<span class="token punctuation">,</span> unit_id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">let</span> ac <span class="token operator">=</span> <span class="token function">randomString</span><span class="token punctuation">(</span><span class="token number">16</span><span class="token punctuation">)</span>
          <span class="token keyword">let</span> name <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>config<span class="token punctuation">.</span>object_prefix<span class="token interpolation-punctuation punctuation">}</span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>unit_id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ac<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.zip</span><span class="token template-punctuation string">`</span></span>
          <span class="token keyword">const</span> options <span class="token operator">=</span> <span class="token punctuation">{</span>
            <span class="token comment">// 获取分片上传进度、断点和返回值。</span>
            <span class="token function-variable function">progress</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">p<span class="token punctuation">,</span> cpt<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
              console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>p<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token literal-property property">name</span><span class="token operator">:</span>name<span class="token punctuation">,</span>
            <span class="token comment">// 设置并发上传的分片数量。</span>
            <span class="token comment">// parallel: 2,</span>
            <span class="token comment">// 设置分片大小。默认值为1 MB，最小值为100 KB。</span>
            <span class="token literal-property property">partSize</span><span class="token operator">:</span> config<span class="token punctuation">.</span>part_size<span class="token punctuation">,</span>
            <span class="token comment">// headers,</span>
            <span class="token comment">// 自定义元数据，通过HeadObject接口可以获取Object的元数据。</span>
            <span class="token comment">// meta: { year: 2020, people: "test" },</span>
            <span class="token comment">// mime: "text/plain",</span>
            <span class="token comment">// 回调</span>
            <span class="token literal-property property">callback</span><span class="token operator">:</span> <span class="token punctuation">{</span>
                <span class="token comment">// 设置回调请求的服务器地址。</span>
                <span class="token literal-property property">url</span><span class="token operator">:</span> config<span class="token punctuation">.</span>cb_url<span class="token punctuation">,</span>
                <span class="token comment">// 设置回调请求消息头中Host的值，即您的服务器配置Host的值。</span>
                <span class="token literal-property property">host</span><span class="token operator">:</span> config<span class="token punctuation">.</span>cb_host<span class="token punctuation">,</span>
                <span class="token comment">/* eslint no-template-curly-in-string: [0] */</span>
                <span class="token comment">// 设置发起回调时请求body的值。</span>
                <span class="token literal-property property">body</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">bucket=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>config<span class="token punctuation">.</span>oss<span class="token punctuation">.</span>bucket<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&amp;object=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&amp;unit_id=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>unit_id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&amp;unzip_dir=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>config<span class="token punctuation">.</span>unzip_dir<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
                <span class="token comment">// 设置发起回调请求的Content-Type。</span>
                <span class="token literal-property property">contentType</span><span class="token operator">:</span> <span class="token string">"application/x-www-form-urlencoded"</span><span class="token punctuation">,</span>
                <span class="token comment">// customValue: {</span>
                <span class="token comment">//   // 设置发起回调请求的自定义参数。</span>
                <span class="token comment">//   bucket: config.oss.bucket,</span>
                <span class="token comment">//   object_name: name,</span>
                <span class="token comment">//   unit_id: unit_id,</span>
                <span class="token comment">//   unzip_path: config.unzip_dir</span>
                <span class="token comment">// },</span>
              <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
          <span class="token keyword">return</span> options
      <span class="token punctuation">}</span>

      <span class="token keyword">const</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">oss</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token comment">// yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。</span>
          <span class="token literal-property property">region</span><span class="token operator">:</span> <span class="token string">"oss-cn-shenzhen"</span><span class="token punctuation">,</span>
          <span class="token comment">// 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。</span>
          <span class="token literal-property property">accessKeyId</span><span class="token operator">:</span> <span class="token string">"STS.NTrZympmvYwZ9E9Y82HhDbE7p"</span><span class="token punctuation">,</span>
          <span class="token literal-property property">accessKeySecret</span><span class="token operator">:</span> <span class="token string">"HVBJ828jUesudN8dHNLQciSZYsMyLMMfGD9EgYM66DQV"</span><span class="token punctuation">,</span>
          <span class="token comment">// 从STS服务获取的安全令牌（SecurityToken）。</span>
          <span class="token literal-property property">stsToken</span><span class="token operator">:</span> <span class="token string">"CAIS6gF1q6Ft5B2yfSjIr5fHEcPZnbJX7rr3WAGzarOSVjeGpoVpFIXqaIuAoEml2Ihsz5Fdt604zkctz2OSVVov2r4VfomRJwlkt+Q=="</span><span class="token punctuation">,</span>
          <span class="token comment">// 填写Bucket名称，例如examplebucket。</span>
          <span class="token literal-property property">bucket</span><span class="token operator">:</span> <span class="token string">"ruke"</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token literal-property property">object_prefix</span><span class="token operator">:</span> <span class="token string">'batch_images_zip/IMG_'</span><span class="token punctuation">,</span>
        <span class="token literal-property property">part_size</span><span class="token operator">:</span> <span class="token number">1024</span><span class="token operator">*</span><span class="token number">1024</span><span class="token operator">*</span><span class="token number">500</span><span class="token punctuation">,</span> <span class="token comment">// 500M,</span>
        <span class="token literal-property property">cb_url</span><span class="token operator">:</span> <span class="token string">'https://b780-113-88-138-174.ap.ngrok.io/cb.php'</span><span class="token punctuation">,</span>
        <span class="token literal-property property">cb_host</span><span class="token operator">:</span> <span class="token string">'b780-113-88-138-174.ap.ngrok.io'</span><span class="token punctuation">,</span>
        <span class="token literal-property property">unzip_dir</span><span class="token operator">:</span> <span class="token string">'img_unit_goods'</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">const</span> client <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">OSS</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span>oss<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">const</span> unit_id <span class="token operator">=</span> <span class="token number">128</span><span class="token punctuation">;</span> <span class="token comment">//获取当前unit_id</span>

      <span class="token keyword">const</span> headers <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token comment">// 指定该Object被下载时的网页缓存行为。</span>
        <span class="token string-property property">"Cache-Control"</span><span class="token operator">:</span> <span class="token string">"no-cache"</span><span class="token punctuation">,</span>
        <span class="token comment">// 指定该Object被下载时的名称。</span>
        <span class="token comment">// "Content-Disposition": `IMG_${unit_id}.zip`,</span>
        <span class="token comment">// 指定该Object被下载时的内容编码格式。</span>
        <span class="token string-property property">"Content-Encoding"</span><span class="token operator">:</span> <span class="token string">"utf-8"</span><span class="token punctuation">,</span>
        <span class="token comment">// 指定过期时间，单位为毫秒。</span>
        <span class="token comment">// Expires: "1000",</span>
        <span class="token comment">// 指定Object的存储类型。</span>
        <span class="token string-property property">"x-oss-storage-class"</span><span class="token operator">:</span> <span class="token string">"Standard"</span><span class="token punctuation">,</span>
        <span class="token comment">// 指定Object标签，可同时设置多个标签。</span>
        <span class="token comment">// "x-oss-tagging": "Tag1=1&amp;Tag2=2",</span>
        <span class="token comment">// 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。</span>
        <span class="token string-property property">"x-oss-forbid-overwrite"</span><span class="token operator">:</span> <span class="token string">"true"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">;</span>

      <span class="token comment">// 指定上传到examplebucket的Object名称，例如exampleobject.txt。</span>
      

      <span class="token comment">// 获取DOM。</span>
      <span class="token keyword">const</span> submit <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"submit"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 监听按钮。</span>
      submit<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
          <span class="token comment">// 分片上传。</span>
          <span class="token keyword">const</span> data <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"file"</span><span class="token punctuation">)</span><span class="token punctuation">.</span>files<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
          <span class="token keyword">let</span> opt <span class="token operator">=</span> <span class="token function">getOption</span><span class="token punctuation">(</span>config<span class="token punctuation">,</span> <span class="token number">128</span><span class="token punctuation">)</span>
          <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> client<span class="token punctuation">.</span><span class="token function">multipartUpload</span><span class="token punctuation">(</span>opt<span class="token punctuation">.</span>name<span class="token punctuation">,</span> data<span class="token punctuation">,</span> opt<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre></div><h2 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项" aria-hidden="true">#</a> 注意事项</h2>
<ol>
<li>文件上传后，云函数会自动将压缩包解压到 <code v-pre>img_unit_goods/IMG_128_xxdadsdee23d/000644_m_1.jpg</code>这种形式， 而这个文件如何访问呢？ <a href="https://oxxx.com/img_unit_goods/IMG_128_xxdadsdee23d/000644_m_1.jpg" target="_blank" rel="noopener noreferrer">https://oxxx.com/img_unit_goods/IMG_128_xxdadsdee23d/000644_m_1.jpg<ExternalLinkIcon/></a></li>
<li>碎片管理 -- 上传中段的碎片管理，设置为7天过期</li>
</ol>
<p><img src="https://oss.itruke.com/doc/202209/1663756355-b44a.png?x-oss-process=image/format,webp" alt="" loading="lazy"></p>
<ol start="3">
<li>后端接收到上传回调该做哪些操作呢？
<ol>
<li>遍历目录下的文件，将数据更新 <a href="https://help.aliyun.com/document_detail/84841.html" target="_blank" rel="noopener noreferrer">列举文件<ExternalLinkIcon/></a>  <a href="https://help.aliyun.com/document_detail/31860.html" target="_blank" rel="noopener noreferrer">接口示例<ExternalLinkIcon/></a></li>
<li>删除压缩包</li>
</ol>
</li>
</ol>
</div></template>


