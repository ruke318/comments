---
date: 2022-09-10
category:
  - golang
  - oss
tag:
  - 自动解压
  - oss
  - 分片上传
  - 云函数
---

# 使用阿里云 oss + 云函数 实现 zip 自动解压
前段时间，公司有个需求，商家需要批量编辑商品的图片，图片包括主图、规格图、详情图，而且都有多张；如果单纯的通过人工单个文件编辑需要耗费大量的人力，所以需要使用到批量图片上传，而需要实现该功能需要解决以下问题

<!-- more -->

## 面临的问题
- 图片数量太多，直接使用 `multiple` 在这种情况下不是那么友好
- 如果上传压缩包，针对大文件上传需要引入分片上传
- 如果经过自己服务器上传，占用带宽较大，对资源占用较多
- 如果c端直连oss上传，服务端下载后解压，同样下载浪费不必要的资源

### 怎么解决这些问题

如上面的问题，最终可以肯定的是：1、上传压缩包 2、c端直连oss 3、最好能在服务器之外实现解压并将图片关联商品；通过阿里oss的调研，发现在上传时可以触发 `云函数` 事件，达到 `自动解压的目的`

- 使用 阿里oss 的分片上传 sdk，解决大文件上传慢问题
- 如何才知道解压完成了？-- 云函数内部通过回调解决
- 如何解决用户上传到一半断开问题？ -- 自动删除分片数据
- 如何知道上传了哪些商品的图片？ -- 从图片命名上 + 回调列举文件绑定商品

## 如何实施

1. 前端通过临时STS授权直接调用alioss的接口，后端接口提供临时STS验证参数
2. 使用`分片上传`方案，加快上传效率，保证成功率
3. 使用oss云函数zip解压缩，商户后台直接上传压缩包即可
4. 添加上传成功回调，后端通过回调处理图片和商品的对应关系, 并且删除压缩包

### 实施步骤

1. 创建`创建子用户/STS授权角色`

创建子用户/STS授权角色，通过此步骤可以获取到用于调用 sts临时授权的参数  `accessKeyId`，`accessKeySecret`，`RoleArn`

::: details 授权
![](https://oss.itruke.com/doc/202209/1663755427-7f84.png?x-oss-process=image/format,webp)
![](https://oss.itruke.com/doc/202209/1663755460-0cc0.png?x-oss-process=image/format,webp)
![](https://oss.itruke.com/doc/202209/1663755491-ef10.png?x-oss-process=image/format,webp)
![](https://oss.itruke.com/doc/202209/1663755508-0e3e.png?x-oss-process=image/format,webp)
:::

2. 开通云函数服务

::: details 云函数开通
1. 开通云函数服务 -- 选择运行内存时请选择大一点的(最好3GB)
2. oss存储服务找到对应的 buket  测试环境和正式环境为 `xxxx`, 开通zip解压缩功能

![](https://oss.itruke.com/doc/202209/1663755635-a517.png?x-oss-process=image/format,webp)
![](https://oss.itruke.com/doc/202209/1663755659-1d71.png?x-oss-process=image/format,webp)
![](https://oss.itruke.com/doc/202209/1663755695-a3f2.png?x-oss-process=image/format,webp)

`前缀`：上传时的前缀，比如我要上传一个压缩包xxx.zip, 在代码中就应该添加前缀，objectname=batch_images_zip/IMG_xxx.zip

`目标目录`：也就是解压出来的目录为  img_unit_goods/IMG_xxx/压缩包解压出来的内容
:::

3. 流程

![](https://oss.itruke.com/doc/202209/1663755789-bbb2.png?x-oss-process=image/format,webp)

4. 文件上传代码示例
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>

  <body>
    <button id="submit">上传</button>
    <input id="file" type="file" />
    <!-- 导入sdk文件 -->
    <script
      type="text/javascript"
      src="https://gosspublic.alicdn.com/aliyun-oss-sdk-6.16.0.min.js"
    ></script>
    <script type="text/javascript">


      function randomString(e) {    
            e = e || 32;
            var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
            a = t.length,
            n = "";
            for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
            return n
      }

      function getOption(config, unit_id) {
          let ac = randomString(16)
          let name = `${config.object_prefix}${unit_id}${ac}.zip`
          const options = {
            // 获取分片上传进度、断点和返回值。
            progress: (p, cpt, res) => {
              console.log(p);
            },
            name:name,
            // 设置并发上传的分片数量。
            // parallel: 2,
            // 设置分片大小。默认值为1 MB，最小值为100 KB。
            partSize: config.part_size,
            // headers,
            // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
            // meta: { year: 2020, people: "test" },
            // mime: "text/plain",
            // 回调
            callback: {
                // 设置回调请求的服务器地址。
                url: config.cb_url,
                // 设置回调请求消息头中Host的值，即您的服务器配置Host的值。
                host: config.cb_host,
                /* eslint no-template-curly-in-string: [0] */
                // 设置发起回调时请求body的值。
                body: `bucket=${config.oss.bucket}&object=${name}&unit_id=${unit_id}&unzip_dir=${config.unzip_dir}`,
                // 设置发起回调请求的Content-Type。
                contentType: "application/x-www-form-urlencoded",
                // customValue: {
                //   // 设置发起回调请求的自定义参数。
                //   bucket: config.oss.bucket,
                //   object_name: name,
                //   unit_id: unit_id,
                //   unzip_path: config.unzip_dir
                // },
              }
          }
          return options
      }

      const config = {
        oss: {
            // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
          region: "oss-cn-shenzhen",
          // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
          accessKeyId: "STS.NTrZympmvYwZ9E9Y82HhDbE7p",
          accessKeySecret: "HVBJ828jUesudN8dHNLQciSZYsMyLMMfGD9EgYM66DQV",
          // 从STS服务获取的安全令牌（SecurityToken）。
          stsToken: "CAIS6gF1q6Ft5B2yfSjIr5fHEcPZnbJX7rr3WAGzarOSVjeGpoVpFIXqaIuAoEml2Ihsz5Fdt604zkctz2OSVVov2r4VfomRJwlkt+Q==",
          // 填写Bucket名称，例如examplebucket。
          bucket: "ruke",
        },
        object_prefix: 'batch_images_zip/IMG_',
        part_size: 1024*1024*500, // 500M,
        cb_url: 'https://b780-113-88-138-174.ap.ngrok.io/cb.php',
        cb_host: 'b780-113-88-138-174.ap.ngrok.io',
        unzip_dir: 'img_unit_goods'
      }
      const client = new OSS(config.oss);

      const unit_id = 128; //获取当前unit_id

      const headers = {
        // 指定该Object被下载时的网页缓存行为。
        "Cache-Control": "no-cache",
        // 指定该Object被下载时的名称。
        // "Content-Disposition": `IMG_${unit_id}.zip`,
        // 指定该Object被下载时的内容编码格式。
        "Content-Encoding": "utf-8",
        // 指定过期时间，单位为毫秒。
        // Expires: "1000",
        // 指定Object的存储类型。
        "x-oss-storage-class": "Standard",
        // 指定Object标签，可同时设置多个标签。
        // "x-oss-tagging": "Tag1=1&Tag2=2",
        // 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
        "x-oss-forbid-overwrite": "true",
      };

      // 指定上传到examplebucket的Object名称，例如exampleobject.txt。
      

      // 获取DOM。
      const submit = document.getElementById("submit");
      // 监听按钮。
      submit.addEventListener("click", async () => {
        try {
          // 分片上传。
          const data = document.getElementById("file").files[0];
          let opt = getOption(config, 128)
          const res = await client.multipartUpload(opt.name, data, opt);
        } catch (err) {
          console.log(err);
        }
      });
    </script>
  </body>
</html>
```

## 注意事项

1. 文件上传后，云函数会自动将压缩包解压到 `img_unit_goods/IMG_128_xxdadsdee23d/000644_m_1.jpg`这种形式， 而这个文件如何访问呢？ https://oxxx.com/img_unit_goods/IMG_128_xxdadsdee23d/000644_m_1.jpg
2. 碎片管理 -- 上传中段的碎片管理，设置为7天过期

![](https://oss.itruke.com/doc/202209/1663756355-b44a.png?x-oss-process=image/format,webp)

3. 后端接收到上传回调该做哪些操作呢？
    1. 遍历目录下的文件，将数据更新 [列举文件](https://help.aliyun.com/document_detail/84841.html)  [接口示例](https://help.aliyun.com/document_detail/31860.html)
    2. 删除压缩包