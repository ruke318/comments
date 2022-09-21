export const categoryMap = {"category":{"/":{"path":"/category/","map":{"golang":{"path":"/category/golang/","keys":["v-6c023efa"]},"oss":{"path":"/category/oss/","keys":["v-6c023efa"]},"vuepress":{"path":"/category/vuepress/","keys":["v-0a1c5cb7"]},"blog":{"path":"/category/blog/","keys":["v-0a1c5cb7"]}}}},"tag":{"/":{"path":"/tag/","map":{"自动解压":{"path":"/tag/%E8%87%AA%E5%8A%A8%E8%A7%A3%E5%8E%8B/","keys":["v-6c023efa"]},"oss":{"path":"/tag/oss/","keys":["v-6c023efa"]},"分片上传":{"path":"/tag/%E5%88%86%E7%89%87%E4%B8%8A%E4%BC%A0/","keys":["v-6c023efa"]},"云函数":{"path":"/tag/%E4%BA%91%E5%87%BD%E6%95%B0/","keys":["v-6c023efa"]},"博客":{"path":"/tag/%E5%8D%9A%E5%AE%A2/","keys":["v-0a1c5cb7"]}}}}}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateBlogCategory) {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoryMap)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ categoryMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoryMap)
  })
}
