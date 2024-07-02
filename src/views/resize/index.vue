<template>
  <img-table
    :startHandleObj="startHandleObj"
    startText="转换"
    @checkInputs="checkInputs"
    title="图片尺寸调整"
  >
    <template v-slot:tools>
      <a-input-group>
        <a-tooltip :content="widthTooltip">
          <a-input-number
            :style="{ width: '60px' }"
            v-model="width"
            placeholder="宽度"
            hide-button
            @input="numberInputHandle($event, '宽度')"
          />
        </a-tooltip>
        <a-tooltip :content="heightTooltip">
          <a-input-number
            :style="{ width: '60px' }"
            v-model="height"
            placeholder="高度"
            hide-button
            @input="numberInputHandle($event, '高度')"
          />
        </a-tooltip>
        <a-tooltip content="适应方式">
          <a-select
            :options="fitOptions"
            :style="{ width: '80px' }"
            v-model="fit"
            placeholder="first"
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

  const width = ref(0);
  const widthTooltip = ref(`宽度: ${width.value}`);
  const height = ref(0);
  const heightTooltip = ref(`高度: ${height.value}`);
  const fit = ref('cover');
  const fitOptions = [
    {
      label: '覆盖',
      value: 'cover',
    },
    {
      label: '包含',
      value: 'contain',
    },
    {
      label: '拉伸',
      value: 'fill',
    },
    {
      label: '内部',
      value: 'inside',
    },
    {
      label: '外部',
      value: 'outside',
    },
  ];

  const numberInputHandle = (e, key) => {
    if (key === '宽度') widthTooltip.value = `${key}: ${e}`;
    if (key === '高度') heightTooltip.value = `${key}: ${e}`;
  };

  const startHandleObj = {
    args: {
      width,
      height,
      fit,
    },
    handleName: 'resize',
  };

  const checkInputs = (callback) => {
    if (!width.value || !height.value) {
      Message.error('请输入宽度和高度');
      callback(false);
    } else {
      callback(true);
    }
  };
</script>
