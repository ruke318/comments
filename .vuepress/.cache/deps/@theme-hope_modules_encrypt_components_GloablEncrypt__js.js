import {
  PasswordModal_default,
  useGlobalEcrypt
} from "./chunk-DHWFN4S5.js";
import "./chunk-7X4GYTRI.js";
import "./chunk-MA3DN5KS.js";
import "./chunk-A7R5LFMA.js";
import "./chunk-JDJQ3254.js";
import "./chunk-SWQ4XTYF.js";
import "./chunk-I5UX3BFI.js";
import {
  defineComponent,
  h
} from "./chunk-3JL2R52N.js";
import "./chunk-BGOVVDTY.js";
import "./chunk-YACYAO4R.js";
import "./chunk-XYQ66V4O.js";
import "./chunk-KKNQZGBY.js";

// node_modules/vuepress-theme-hope/lib/client/modules/encrypt/components/GloablEncrypt.js
var GloablEncrypt_default = defineComponent({
  name: "GlobalEncrypt",
  setup(_props, { slots }) {
    const { isGlobalEncrypted, validateGlobalToken } = useGlobalEcrypt();
    return () => {
      var _a;
      return isGlobalEncrypted.value ? h(PasswordModal_default, { full: true, onVerify: validateGlobalToken }) : ((_a = slots["default"]) == null ? void 0 : _a.call(slots)) || null;
    };
  }
});

// dep:@theme-hope_modules_encrypt_components_GloablEncrypt__js
var theme_hope_modules_encrypt_components_GloablEncrypt_js_default = GloablEncrypt_default;
export {
  theme_hope_modules_encrypt_components_GloablEncrypt_js_default as default
};
//# sourceMappingURL=@theme-hope_modules_encrypt_components_GloablEncrypt__js.js.map
