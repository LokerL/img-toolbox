<script setup>
  import { onMounted, ref } from 'vue';

  defineProps({
    multiple: {
      type: Boolean,
      default: true,
    },
    accept: {
      type: Array,
      default: ['image/png'],
    },
    isDirectory: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['fileChange']);
  const fileInputEle = ref(null);

  const uploadBtnClick = () => {
    fileInputEle.value.click();
  };
  const fileChangeHandler = (e) => {
    emit('fileChange', e.target.files);
  };
</script>

<template>
  <div class="file-selector-wrapper">
    <input
      ref="fileInputEle"
      type="file"
      :multiple="multiple"
      :accept="accept.join(',')"
      style="display: none"
      :webkitdirectory="isDirectory"
      @change="fileChangeHandler"
    />
    <a-button type="primary" size="small" @click="uploadBtnClick">
      <template #icon> <icon-upload /> </template>
      <template #default>选择</template>
    </a-button>
  </div>
</template>

<style scoped>
  .file-selector-wrapper {
    display: inline-block;
  }
</style>
