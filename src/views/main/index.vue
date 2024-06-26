<template>
  <a-layout-header>
    <title-bar />
  </a-layout-header>
  <a-layout class="layout-main">
    <a-layout-sider collapsible :default-collapsed="true" showCollapseButton :width="110">
      <a-menu :defaultSelectedKeys="['conversion']">
        <router-link v-for="route in routes" :key="route.name" :to="route.path">
          <a-menu-item :key="route.name">
            <component :is="route.meta.icon" />
            {{ route.meta.title }}
          </a-menu-item>
        </router-link>
      </a-menu>
    </a-layout-sider>
    <a-layout class="main-content">
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
  import { RouterView, RouterLink } from 'vue-router';
  import router from '@/router';
  import TitleBar from '@/components/title-bar/index.vue';

  const routes = router.getRoutes();
</script>

<style scoped>
  .layout-main {
    height: 100vh;
    background: var(--color-fill-2);
    border: 1px solid var(--color-border);
  }

  .layout-main :deep(.arco-layout-sider) {
    height: calc(100vh - 35px);
  }

  .layout-main :deep(.arco-layout-content) {
    color: var(--color-text-2);
    font-weight: 400;
    font-size: 14px;
    background: var(--color-bg-3);
  }

  .layout-main .main-content {
    overflow: hidden;
    border-right: 2px solid var(--color-border);
    padding: 5px;
    background: var(--color-bg-3);
  }
</style>
