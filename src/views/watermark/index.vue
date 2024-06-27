<template>
  <div class="watermark-wrapper">
    <img-table
      start-icon="icon-mosaic"
      title="添加水印"
      @check-inputs="checkInputs"
      :startHandleObj="startHandleObj"
    >
      <template v-slot:tools>
        <div class="tools">
          <a-button type="outline" status="success" @click="visible = true">
            水印
          </a-button>
        </div>
      </template>
    </img-table>
    <a-modal
      v-model:visible="visible"
      :render-to-body="false"
      :width="790"
      modal-class="watermark-modal"
      body-class="watermark-modal-body"
      hide-cancel
      @close="onModalClose"
      :closable="false"
      :footer="false"
    >
      <template #title>
        <a-button type="primary" size="mini" @click="addRow">
          <template #icon>
            <icon-plus />
          </template>
        </a-button>

        <span style="flex: auto; text-align: center">添加水印</span>

        <a-button type="primary" status="danger" size="mini" @click="deleteAll">
          <template #icon>
            <icon-delete />
          </template>
        </a-button>
      </template>
      <a-table
        :columns="columns"
        :data="watermarks"
        :pagination="false"
        size="mini"
        style="width: 790px"
        :scroll="{ x: 0, y: 300 }"
      >
        <template #enabled="{ record, rowIndex }">
          <a-switch v-model="record.enabled" size="mini" />
        </template>
        <template #type="{ record, rowIndex }">
          <a-select :options="typeOptions" v-model="record.type" size="mini" />
        </template>
        <!--   资源设置    -->
        <template #src="{ record, rowIndex }">
          <a-input
            v-if="record.type === 'text'"
            size="mini"
            v-model="record.src"
            placeholder="请输入显示的文本"
            :allow-clear="record.type === 'text'"
          >
          </a-input>
          <file-selector
            v-else
            v-model:selectorResult="record.src"
            element="input"
            type="file"
            :multiple="false"
            size="mini"
          />
        </template>
        <!--   位置设置    -->
        <template #top="{ record, rowIndex }">
          <a-input-number
            size="mini"
            v-model="record.top"
            hide-button
            :style="{ width: '50px', padding: '3px' }"
          />
        </template>
        <template #left="{ record, rowIndex }">
          <a-input-number
            size="mini"
            v-model="record.left"
            hide-button
            :style="{ width: '50px', padding: '3px' }"
          />
        </template>
        <template #gravity="{ record, rowIndex }">
          <a-tooltip content="与'距上'、'据左'同时设置时此项不会生效">
            <a-select
              size="mini"
              allow-clear
              v-model="record.gravity"
              :options="autoCompleteData"
            />
          </a-tooltip>
        </template>
        <!--   大小设置    -->
        <template #size="{ record, rowIndex }">
          <a-tooltip
            v-if="record.type === 'text'"
            :content="`文字DPI:${record.dpi}`"
          >
            <a-input-number
              size="mini"
              v-model="record.dpi"
              hide-button
              :style="{ width: '50px', padding: '3px' }"
            />
          </a-tooltip>
          <div v-else style="display: flex">
            <a-tooltip :content="`宽度:${record.width}`">
              <a-input-number
                size="mini"
                v-model="record.width"
                hide-button
                :style="{ width: '30px', padding: '0' }"
              />
            </a-tooltip>
            <a-tooltip :content="`高度:${record.height}`">
              <a-input-number
                size="mini"
                v-model="record.height"
                hide-button
                :style="{ width: '30px', padding: '0' }"
              />
            </a-tooltip>
          </div>
        </template>
        <!--   操作    -->
        <template #operation="{ record, rowIndex }">
          <a-button size="mini" status="danger" @click="deleteRow(record)">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script setup>
  import ImgTable from '@/components/img-table/index.vue';
  import { reactive, ref, toRaw } from 'vue';
  import { getID } from '@/utils';

  import { typeOptions, autoCompleteData, columns } from './config';
  import FileSelector from '@/components/file-selector/index.vue';
  import { Message, Notification } from '@arco-design/web-vue';

  const visible = ref(false);
  const localWatermarks = localStorage.getItem('watermarks');
  const watermarks = reactive(
    localWatermarks ? JSON.parse(localWatermarks) : []
  );

  const addRow = () => {
    watermarks.push({
      id: getID(),
      enabled: false,
      type: 'text',
      src: `水印${watermarks.length + 1}`,
      // dpi: 0,
      // width: 0,
      // height: 0,
      //
      // top: 0,
      // left: 0,
      // gravity: '',
    });
  };
  const deleteRow = (record) => {
    const index = watermarks.findIndex((item) => item.id === record.id);
    if (index !== -1) {
      watermarks.splice(index, 1);
    }
  };
  const deleteAll = () => {
    watermarks.splice(0, watermarks.length);
  };

  const onModalClose = () => {
    localStorage.setItem('watermarks', JSON.stringify(watermarks));
  };

  const startHandleObj = {
    args: { watermarks },
    handleName: 'watermark',
  };

  const checkInputs = (callback) => {
    if (watermarks.filter((item) => item.enabled).length === 0) {
      Message.error('请添加或启用水印');
      callback(false);
    } else {
      callback(true);
    }
  };
</script>
<style scoped>
  .tools {
    display: flex;
    justify-content: space-between;
  }
  :deep(.arco-modal-header) {
    height: 30px;
    padding: 0 10px;
  }
  :deep(.watermark-modal-body) {
    border: 0;
    padding: 0;
    border-radius: var(--border-radius-medium);
  }
  :deep(.arco-table-size-mini .arco-table-cell) {
    padding: 2px 5px;
  }
</style>
