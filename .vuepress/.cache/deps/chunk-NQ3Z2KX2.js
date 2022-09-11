import {
  client_exports
} from "./chunk-JDJQ3254.js";
import {
  h,
  resolveComponent
} from "./chunk-3JL2R52N.js";
import {
  isLinkHttp
} from "./chunk-LS4IQIE6.js";

// node_modules/vuepress-theme-hope/lib/client/components/Icon.js
var Icon = (props) => {
  const { icon = "" } = props;
  return isLinkHttp(icon) ? h("img", { class: "icon", src: icon }) : icon.startsWith("/") ? h("img", { class: "icon", src: (0, client_exports.withBase)(icon) }) : h(resolveComponent("FontIcon"), props);
};
Icon.displayName = "Icon";
var Icon_default = Icon;

export {
  Icon_default
};
//# sourceMappingURL=chunk-NQ3Z2KX2.js.map
