import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; // 引入element-plus的样式
import * as ElementPlusIconsVue from "@element-plus/icons-vue"; // 引入字体图标
import router from "./router/index";

const app = createApp(App).use(router).use(ElementPlus);

// 注册element-plus的字体图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.config.globalProperties.$filters = {
  prefix(url: string) {
    if (url && url.startsWith("http")) {
      // 当 url 以 http 开头时候，我们返回原路径
      return url;
    } else {
      // 否则，我们给路径添加 host，如下
      url = `http://backend-api-02.newbee.ltd${url}`;
      return url;
    }
  },
};
app.config.globalProperties.goTop = function () {
  const main = document.querySelector(".main") as Element;
  main.scrollTop = 0;
};

app.mount("#app");
