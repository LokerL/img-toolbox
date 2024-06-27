<template>
  <img-table
    :startHandleObj="startHandleObj"
    startText="转换"
    @checkInputs="checkInputs"
  >
    <template v-slot:tools>
      <a-select
        :style="{ width: '140px' }"
        v-model="formatType"
        placeholder="选择转换格式"
        allow-search
        allow-clear
        :options="imageTypes"
      >
      </a-select>
    </template>
  </img-table>
</template>

<script setup>
  import { ref } from 'vue';
  import ImgTable from '@/components/img-table/index.vue';
  import { imageTypes } from '@/utils';
  import { Message } from '@arco-design/web-vue';

  const formatType = ref('');

  const startHandleObj = {
    args: {
      formatType,
    },
    handleName: 'format',
  };

  const checkInputs = (callback) => {
    if (!formatType.value) {
      Message.error('请选择转换格式');
      callback(false);
    } else {
      callback(true);
    }
  };
</script>
<style scoped></style>
