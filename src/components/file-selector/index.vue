<script setup>
  const props = defineProps({
    // 触发的元素，按钮或者输入框 button | input
    element: {
      type: String,
      default: 'button',
    },
    // 选择类型 file | folder
    type: {
      type: String,
      default: 'file',
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true,
    },
    // 文件类型
    filters: {
      type: Array,
      default: [],
    },
    style: {
      type: Object,
      default: () => ({
        fontsize: '12px',
      }),
    },
    size: {
      type: String,
      default: 'medium',
    },
  });
  let selectorResult = defineModel('selectorResult');

  const handleClick = async () => {
    const p = [];
    props.type === 'folder' ? p.push('openDirectory') : p.push('openFile');
    props.multiple && p.push('multiSelections');
    const title = props.type === 'folder' ? '选择文件夹' : '选择文件';
    const res = await window.dialog.openFile({
      title,
      properties: p,
      filters: props.filters,
    });
    if (res) {
      if (props.multiple) {
        selectorResult.value = res;
      } else {
        selectorResult.value = res[0];
      }
    }
  };
</script>

<template>
  <div class="file-selector-wrapper">
    <a-tooltip
      v-if="element === 'input'"
      :content="selectorResult"
      position="top"
      mini
    >
      <a-input
        :style="style"
        v-model="selectorResult"
        placeholder="输出文件夹"
        allow-clear
        readonly
        @click="handleClick"
        :size="size"
      >
        <template #prefix>
          <icon-folder />
        </template>
      </a-input>
    </a-tooltip>

    <a-button v-else type="primary" @click="handleClick">
      <template #icon> <icon-upload /> </template>
      <template #default>选择</template>
    </a-button>
  </div>
</template>

<style scoped>
  .file-selector-wrapper {
    margin-right: 10px;
    display: inline-block;
  }
</style>
