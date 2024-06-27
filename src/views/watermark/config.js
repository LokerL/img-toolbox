//'左上', '左下', '右上', '右下', '居中'
export const autoCompleteData = [
  {
    value: 'northwest',
    label: '左上',
  },
  {
    value: 'southwest',
    label: '左下',
  },
  {
    value: 'northeast',
    label: '右上',
  },
  {
    value: 'southeast',
    label: '右下',
  },
  {
    value: 'center',
    label: '居中',
  },
];

export const typeOptions = [
  {
    label: '文本',
    value: 'text',
  },
  {
    label: '图片',
    value: 'image',
  },
];
export const columns = [
  {
    title: '启用',
    dataIndex: 'enabled',
    slotName: 'enabled',
    width: 55,
  },
  {
    title: '类型',
    dataIndex: 'type',
    slotName: 'type',
    width: 110,
  },
  {
    title: '资源',
    dataIndex: 'src',
    slotName: 'src',
    width: 200,
  },
  {
    title: '上边距',
    dataIndex: 'top',
    slotName: 'top',
    width: 60,
  },
  {
    title: '左边距',
    dataIndex: 'left',
    slotName: 'left',
    width: 60,
  },
  {
    title: '位置',
    dataIndex: 'gravity',
    slotName: 'gravity',
    width: 105,
  },
  {
    title: '大小',
    slotName: 'size',
    width: 100,
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 55,
  },
];
