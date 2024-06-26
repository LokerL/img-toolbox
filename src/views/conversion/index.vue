<template>
  <a-card title="格式转换" class="table-card">
    <a-row class="tool-bar">
      <div>
        <file-selector @fileChange="uploadBtnClick" :multiple="true" :accept />
        <a-select
          :style="{ width: '160px', margin: '0 10px' }"
          v-model="conversionType"
          placeholder="选择要转换的格式"
          allow-search
          allow-clear
          :options="imageTypes"
        >
        </a-select>
        <a-tooltip :content="outputFolder" position="top" mini>
          <a-input
            :style="{ width: '250px', fontsize: '12px' }"
            v-model="outputFolder"
            placeholder="输出文件夹"
            allow-clear
            readonly
            @click="openFolder"
          >
            <template #prefix>
              <icon-folder />
            </template>
          </a-input>
        </a-tooltip>
      </div>
      <a-button type="primary" status="warning" @click="formatAll">
        <template #icon>
          <icon-swap />
        </template>
        转换
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
        <a-tag size="small">{{ record.type.replace('image/', '') }}</a-tag>
      </template>
      <template #size="{ record }">
        {{ formatSize(record.size) }}
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
            @click="deleteFile(record.uid)"
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
  import { reactive, ref, onMounted, onUnmounted } from 'vue';
  import { Message, Notification } from '@arco-design/web-vue';
  import { dayjs } from '@arco-design/web-vue/es/_utils/date';
  import { formatSize, generateRandomString, imageTypes } from '@/utils';
  import FileSelector from '@/components/file-selector/index.vue';

  const accept = imageTypes.map((type) => `image/${type}`);
  const tableData = reactive([]);
  const scroll = reactive({ y: `${window.innerHeight - 160}px` });

  const conversionType = ref('');
  const outputFolder = ref('');
  const openFolder = async () => {
    const folder = await window.dialog.openFile({
      title: '选择输出文件夹',
      properties: ['openDirectory'],
    });
    if (folder) {
      outputFolder.value = folder[0];
    }
  };

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

  const uploadBtnClick = (files) => {
    console.log(files);
    for (const file of files) {
      const { name, path, size, type, lastModifiedDate } = file;
      const lmd = dayjs(lastModifiedDate).format('YYYY-MM-DD HH:mm:ss');
      const imgObj = {
        id: generateRandomString(10),
        name,
        path,
        size,
        type,
        lastModifiedDate: lmd,
        status: 'ready',
      };
      tableData.push(imgObj);
    }
  };

  const deleteFile = (uid) => {
    const index = tableData.findIndex((item) => item.uid === uid);
    if (index !== -1) {
      tableData.splice(index, 1);
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      slotName: 'type',
      width: 80,
    },
    {
      title: '大小',
      dataIndex: 'size',
      slotName: 'size',
      ellipsis: true,
      width: 110,
    },
    {
      title: '修改时间',
      dataIndex: 'lastModifiedDate',
    },
    {
      title: '操作',
      slotName: 'action',
    },
  ];

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

  const formatAll = async () => {
    if (!conversionType.value) {
      Message.error('请选择转换格式');
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

    Promise.allSettled(
      tableData.map((item) => {
        return window.api.format({
          id: item.id,
          filePath: item.path,
          formatType: conversionType.value,
          fileOut: outputFolder.value,
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
          tableData[index].status = 'error';
          Message.error('转换失败');
        }
      });
      Notification.success(
        `共处理 ${total} 个文件，成功转换 ${success} 个, 失败 ${total - success} 个`
      );
    });
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
  }
  .data-table {
    height: calc(100% - 80px);
    overflow: hidden;
  }
</style>
