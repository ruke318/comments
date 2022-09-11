import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  lang: "zh-CN",
  title: "技术宅男子",
  description: "乐于分享，乐于学习，乐于成长",

  base: "/",
  markdown: {
    code: {lineNumbers: false},
  },

  theme,
});
