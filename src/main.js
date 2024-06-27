import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue';
import router from './router';
import '@arco-design/web-vue/dist/arco.css';
import './style.css';

createApp(App)
  .use(router)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
