export const filters = [
  {
    name: 'Images',
    extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
  },
];

export const columns = [
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
    title: '路径',
    dataIndex: 'path',
    slotName: 'path',
  },
  {
    title: '操作',
    slotName: 'action',
    width: 150,
  },
];
