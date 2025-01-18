<template>
  <img-table
    :startHandleObj="startHandleObj"
    startText="拼接"
    title="图片拼接"
    @checkInputs="checkInputs"
    @handleBtnClick="handleBtnClick"
    :cancelDefaultStart="true"
  >
    <template v-slot:tools>
      <a-input-group>
        <a-tooltip content="方向">
          <a-select
            :style="{ width: '80px' }"
            v-model="direction"
            placeholder="选择拼接形式"
            :options="directionOptions"
          />
        </a-tooltip>
        <a-tooltip content="文件名">
          <a-input
            :style="{ width: '140px' }"
            v-model="fileName"
            placeholder="文件名"
          />
        </a-tooltip>
      </a-input-group>
    </template>
  </img-table>
</template>

<script setup>
  import { ref } from 'vue';
  import ImgTable from '@/components/img-table/index.vue';
  import { Message } from '@arco-design/web-vue';

  const directionOptions = [
    {
      label: '水平',
      value: 'horizontal',
    },
    {
      label: '垂直',
      value: 'vertical',
    },
  ];

  const direction = ref(directionOptions[0].value);
  // 获取当前yyyyMMddHHmmss
  const fileName = ref(`combine.png`);
  const startHandleObj = {
    args: {
      direction,
    },
  };

  const handleBtnClick = ({ tableData, outputFolder }) => {
    window.api
      .combine({
        files: tableData,
        direction: direction.value,
        name: fileName.value,
        outputFolder: outputFolder,
      })
      .then((res) => {
        Message.success('合成成功:' + res.outputFilePath);
      })
      .catch((err) => {
        Message.error('合成失败:' + err.message);
      });
  };

  const checkInputs = (callback) => {
    if (!fileName.value) {
      Message.error('请输入文件名');
      callback(false);
    }

    if (!direction.value) {
      Message.error('请选择拼接方向');
      callback(false);
    }

    callback(true);
  };
</script>
<style scoped></style>
