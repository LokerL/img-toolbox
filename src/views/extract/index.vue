<template>
  <img-table
    :startHandleObj="startHandleObj"
    startText="裁剪"
    @checkInputs="checkInputs"
    title="图片裁剪"
  >
    <template v-slot:tools>
      <a-input-group>
        <a-tooltip :content="topTooltip">
          <a-input-number
            :style="{ width: '60px' }"
            v-model="top"
            placeholder="上边距"
            hide-button
            @input="numberInputHandle($event, '上边距')"
          />
        </a-tooltip>
        <a-tooltip :content="leftTooltip">
          <a-input-number
            :style="{ width: '60px' }"
            v-model="left"
            placeholder="左边距"
            hide-button
            @input="numberInputHandle($event, '左边距')"
          />
        </a-tooltip>

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
  const left = ref(0);
  const leftTooltip = ref(`左边距: ${left.value}`);
  const top = ref(0);
  const topTooltip = ref(`上边距: ${top.value}`);

  const numberInputHandle = (e, key) => {
    if (key === '宽度') widthTooltip.value = `${key}: ${e}`;
    if (key === '高度') heightTooltip.value = `${key}: ${e}`;
    if (key === '左边距') leftTooltip.value = `${key}: ${e}`;
    if (key === '上边距') topTooltip.value = `${key}: ${e}`;
  };

  const startHandleObj = {
    args: {
      width,
      height,
      left,
      top,
    },
    handleName: 'extract',
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
