import { createRouter, createWebHistory } from 'vue-router';
import Conversion from '../views/conversion/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      path: '/cut',
      name: 'cut',
      component: () => import('../views/cut/index.vue'),
      meta: {
        title: '裁剪',
        description: '图片裁剪',
        icon: 'icon-scissor',
      },
    },
    {
      path: '/ocr',
      name: 'ocr',
      component: () => import('../views/ocr/index.vue'),
      meta: {
        title: '识别',
        description: 'OCR文字识别',
        icon: 'icon-translate',
      },
    },
  ],
});

export default router;
