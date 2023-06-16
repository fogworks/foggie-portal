import fontCN from "./zh-wt.js";
import fontUS from "./us.js";
import { createI18n } from "vue-i18n";
const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: window.localStorage.getItem("language_key")
    ? window.localStorage.getItem("language_key")
    : "en",
  messages: {
    "zh-CN": fontCN,
    en: fontUS,
  },
  silentTranslationWarn: true,
});
export default i18n;
