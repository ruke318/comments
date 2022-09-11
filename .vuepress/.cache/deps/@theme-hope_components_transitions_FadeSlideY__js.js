import {
  useScrollPromise
} from "./chunk-MA3DN5KS.js";
import "./chunk-A7R5LFMA.js";
import "./chunk-JDJQ3254.js";
import "./chunk-SWQ4XTYF.js";
import "./chunk-I5UX3BFI.js";
import {
  Transition,
  defineComponent,
  h
} from "./chunk-3JL2R52N.js";
import "./chunk-YACYAO4R.js";
import "./chunk-XYQ66V4O.js";
import "./chunk-KKNQZGBY.js";

// node_modules/vuepress-theme-hope/lib/client/components/transitions/FadeSlideY.js
import "/Users/chenrenhuan/own/node_modules/vuepress-theme-hope/lib/client/styles/fade-slide-y.scss";
var FadeSlideY_default = defineComponent({
  name: "FadeSlideY",
  setup(_props, { slots }) {
    const scrollPromise = useScrollPromise();
    const onBeforeEnter = scrollPromise.resolve;
    const onBeforeLeave = scrollPromise.pending;
    return () => h(Transition, {
      name: "fade-slide-y",
      mode: "out-in",
      onBeforeEnter,
      onBeforeLeave
    }, () => {
      var _a;
      return (_a = slots["default"]) == null ? void 0 : _a.call(slots);
    });
  }
});

// dep:@theme-hope_components_transitions_FadeSlideY__js
var theme_hope_components_transitions_FadeSlideY_js_default = FadeSlideY_default;
export {
  theme_hope_components_transitions_FadeSlideY_js_default as default
};
//# sourceMappingURL=@theme-hope_components_transitions_FadeSlideY__js.js.map
