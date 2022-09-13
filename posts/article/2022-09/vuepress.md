---
date: 2022-09-10
category:
  - vuepress
  - blog
tag:
  - 博客
---

# 使用 vuepress 搭建博客，专注文档内容

由于近期在开发一个外部对接的项目，公司也没有提供统一对外提供的`文档平台`，就得靠自己去找个简单明了的工具了, 一共用过两个工具 `gitbook`, `vuepress`; 两个工具都有使用，我简单介绍下这两个工具的使用

<!-- more -->

##  gitbook

::: tip gitbook
gitbook http://Gitbook.com 是一个写作和出版的平台，他们使用的系统是开源的。支持Markdown和AsciiDoc格式，最后输出的是静态网页。还可以通过calibre把书转成pdf、epub、mobi等常用格式，方便在各种设备上阅读。也是静态博客网站的一个选择
:::

### gitbook安装

```bash
npm install gitbook-cli -g
```

此时 `gitbook` 已经全局安装完成，可以在命令行使用了

### 新建一本书

```bash
gitbook init
```

### 预览

```bash
gitbook serve
```
此时，你可以在浏览器访问 http://localhost:4000 预览你的电子书页面

### 各种输出

gitbook生成其他格式的书是借助calibre的转换功能实现的(==ebook-convert==)，安装完calibre后，修改系统$PATH定义，把转换程序的路径加到系统PATH里，要不然会找不到转换程序。打开Terminal（终端），按照下面的操作步骤修改PATH。


```bash
vi ~/.bash_profile
```

把下面这句附加到.bash_profile文件里，然后保存退出。
```bash
export PATH=$PATH:/Applications/calibre.app/Contents/MacOS/
```

使用source命令使文件立即生效
```bash
source ~/.bash_profile
echo $PATH
```

::: code-tabs#bash

@tab 编译成静态html
```bash
gitbook build
```

@tab 输出PDF
```bash
gitbook pdf ./ mybook.pdf
```

@tab 输出 epub
```bash
gitbook epub ./ mybook.epub
```

@tab 输出 mobi
```bash
gitbook mobi ./ mybook.mobi
```

:::


## vuepress

::: tip  vepress
VuePress 由两部分组成：第一部分是一个极简静态网站生成器 (opens new window)，它包含由 Vue 驱动的主题系统和插件 API，另一个部分是为书写技术文档而优化的默认主题，它的诞生初衷是为了支持 Vue 及其子项目的文档需求。

每一个由 VuePress 生成的页面都带有预渲染好的 HTML，也因此具有非常好的加载性能和搜索引擎优化（SEO）。同时，一旦页面被加载，Vue 将接管这些静态内容，并将其转换成一个完整的单页应用（SPA），其他的页面则会只在用户浏览到的时候才按需加载。
:::

::: warning 前提条件
VuePress 需要 Node.js (opens new window)>= 8.6
:::

### 创建目录
```bash
mkdir vuepress-starter && cd vuepress-starter
```

### init
```bash
yarn init # npm init
```

### 将 VuePress 安装为本地依赖
```bash
yarn add -D vuepress # npm install -D vuepress
```
### 在 `package.json` 中添加一些 scripts
```js
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

### 在本地启动服务器
```bash
yarn docs:dev # npm run docs:dev
```


这里是内容。
