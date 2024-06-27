<template>
  <a-card :title class="table-card">
    <a-row class="tool-bar">
      <div class="tool-bar-left">
        <file-selector v-model:selectorResult="fileSelectorResult" :filters />
        <div class="tools">
          <div style="margin-right: 10px">
            <slot name="tools" />
          </div>
          <file-selector
            v-model:selectorResult="outputFolder"
            element="input"
            type="folder"
            :multiple="false"
          />
        </div>
      </div>
      <a-button type="primary" status="warning" @click="startBtnClick">
        <template #icon>
          <component :is="startIcon" />
        </template>
        {{ startText }}
      </a-button>
    </a-row>
    <a-divider style="margin-top: 0; margin-bottom: 5px" />
    <a-table
      :columns="columns"
      :data="tableData"
      :scroll="scroll"
      :pagination="false"
      size="small"
      class="data-table"
    >
      <template #type="{ record }">
        <a-tag size="small">{{ record.type }}</a-tag>
      </template>
      <template #path="{ record }">
        <a-tooltip :content="record.path" placement="top" :mini="true">
          <span class="path-span">{{ record.path }}</span>
        </a-tooltip>
      </template>
      <template #action="{ record }">
        <a-button-group size="mini">
          <a-button
            v-if="record.status === 'success'"
            type="primary"
            status="success"
            @click="preview(record)"
          >
            <template #icon>
              <icon-eye />
            </template>
            <template #default>查看</template>
          </a-button>
          <a-button
            type="primary"
            status="danger"
            @click="deleteFile(record.id)"
          >
            <template #icon>
              <icon-delete />
            </template>
            <template #default>移除</template>
          </a-button>
        </a-button-group>
      </template>
    </a-table>
    <a-image-preview :src="imgSrc" v-model:visible="visible" />
  </a-card>
</template>

<script setup>
  import {
    reactive,
    ref,
    onMounted,
    onUnmounted,
    watch,
    toRaw,
    callWithErrorHandling,
  } from 'vue';
  import { getID, removeReactive } from '@/utils';
  import FileSelector from '@/components/file-selector/index.vue';
  import { columns, filters } from './config';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps({
    title: {
      type: String,
      default: '格式转换',
    },
    startIcon: {
      type: String,
      default: 'icon-swap',
    },
    startText: {
      type: String,
      default: '处理',
    },
    startHandleObj: {
      type: Object,
      default: () => {},
    },
  });

  const outputFolder = defineModel('outputFolder', {
    type: String,
    default: '',
  });

  const emit = defineEmits(['checkInputs']);

  const tableData = reactive([]);
  const scroll = reactive({ y: `${window.innerHeight - 160}px` });
  onMounted(() => {
    window.addEventListener('resize', () => {
      const windowInfo = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      scroll.y = `${windowInfo.height - 160}px`;
    });
  });

  onUnmounted(() => {
    window.removeEventListener('resize', () => {});
  });

  const fileSelectorResult = ref([]);

  watch(fileSelectorResult, (newVal) => {
    if (newVal.length) {
      // 获取文件名和文件路径
      const uploadRes = newVal.map((item) => {
        return {
          id: getID(),
          name: item.split('\\').pop(),
          type: item.split('.').pop(),
          path: item,
          status: 'ready',
        };
      });
      tableData.push(...uploadRes);
    }
  });

  const deleteFile = (id) => {
    const index = tableData.findIndex((item) => item.id === id);
    if (index !== -1) {
      tableData.splice(index, 1);
    }
  };

  // 图片预览相关
  const visible = ref(false);
  const imgSrc = ref('');
  const preview = async (record) => {
    if (!record.url) {
      const base64Image = await window.api.getImgUrl({
        filePath: record.outputFilePath,
        fileType: record.type,
      });
      record.url = `data:${record.type};base64,${base64Image}`;
    }
    imgSrc.value = record.url;
    visible.value = true;
  };

  const startBtnClick = () => {
    // 检查输入
    let checkResult = true;
    emit('checkInputs', (result) => {
      checkResult = result;
    });
    if (!checkResult) return;

    const { args, handleName } = props.startHandleObj;
    // 去除args属性的响应式 args: { RefImpl, RefImpl }
    const toRawArgs = removeReactive(args);
    // 判断是否有未填写的参数
    const hasEmpty = Object.values(toRawArgs).some((item) => !item);
    if (hasEmpty) {
      Message.error('请填写完整参数');
      return;
    }

    if (!outputFolder.value) {
      Message.error('请选择输出文件夹');
      return;
    }
    if (tableData.length === 0) {
      Message.error('请上传文件');
      return;
    }
    console.log(toRawArgs);
    Promise.allSettled(
      tableData.map((item) => {
        return window.api[handleName]({
          ...toRawArgs,
          ...item,
          outputFolder: outputFolder.value,
        });
      })
    ).then((res) => {
      const total = res.length;
      const success = res.filter((item) => item.status === 'fulfilled').length;
      res.forEach((item, index) => {
        if (item.status === 'fulfilled') {
          Object.assign(tableData[index], item.value);
          tableData[index].status = 'success';
        } else {
          console.error(item);
          tableData[index].status = 'error';
          Message.error(`文件 ${tableData[index].name} 转换失败`);
        }
      });
      Message.success(
        `共处理 ${total} 个文件，成功转换 ${success} 个, 失败 ${total - success} 个`
      );
    });
    // emit('startHandle', tableData);
  };
</script>
<style scoped>
  .table-card {
    height: calc(100vh - 50px);
    border-radius: 10px;
  }
  :deep(.arco-card-header) {
    border-bottom: none;
  }
  .tool-bar {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tool-bar-left {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .data-table {
    height: calc(100% - 80px);
    overflow: hidden;
  }
  .tools {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .path-span {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    line-height: 12px;
  }
</style>
