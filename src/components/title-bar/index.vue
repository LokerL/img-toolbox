<script setup>
  import SwitchMode from '@/components/switch-mode/index.vue';
</script>

<template>
  <div class="title-bar">
    <div class="title">图片工具箱</div>
    <switch-mode />
  </div>
</template>

<style scoped>
  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    padding: 0 20px;
    width: 100%;
    height: 35px;
    z-index: 9999;
    background: var(--color-bg-3);
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text-2);

    user-select: none;
    /* 设置该属性表明这是可拖拽区域，用来移动窗口 */
    -webkit-app-region: drag;
  }
</style>
