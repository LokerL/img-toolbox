import { createRouter, createWebHashHistory } from 'vue-router';
import Conversion from '../views/conversion/index.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/conversion',
    },
    {
      path: '/conversion',
      name: 'conversion',
      component: Conversion,
      meta: {
        title: '转换',
        description: '图片格式转换',
        icon: 'icon-swap',
      },
    },
    {
      path: '/watermark',
      name: 'watermark',
      component: () => import('../views/watermark/index.vue'),
      meta: {
        title: '水印',
        description: '图片添加水印',
        icon: 'icon-mosaic',
      },
    },
    {
      path: '/resize',
      name: 'resize',
      component: () => import('../views/resize/index.vue'),
      meta: {
        title: '调整',
        description: '图片尺寸调整',
        icon: 'icon-fullscreen-exit',
      },
    },
    // {
    //   path: '/ocr',
    //   name: 'ocr',
    //   component: () => import('../views/ocr/index.vue'),
    //   meta: {
    //     title: '识别',
    //     description: 'OCR文字识别',
    //     icon: 'icon-translate',
    //   },
    // },
  ],
});

export default router;
