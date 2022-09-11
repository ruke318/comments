export const categoryMap = {"category":{"/":{"path":"/category/","map":{"vuepress":{"path":"/category/vuepress/","keys":["v-0a1c5cb7"]},"blog":{"path":"/category/blog/","keys":["v-0a1c5cb7"]}}}},"tag":{"/":{"path":"/tag/","map":{"博客":{"path":"/tag/%E5%8D%9A%E5%AE%A2/","keys":["v-0a1c5cb7"]}}}}}

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
