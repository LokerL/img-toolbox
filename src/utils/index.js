import { isProxy, isRef, toRaw, toRef, unref } from 'vue';

export const imageTypes = [
  'jpeg',
  'png',
  'webp',
  'gif',
  'jp2',
  'tiff',
  'avif',
  'heif',
  'jxl',
];

export const formatSize = (size) => {
  if (size < 1024) {
    return size + 'B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + 'KB';
  } else {
    return (size / 1024 / 1024).toFixed(1) + 'MB';
  }
};

export const selectImgFile = async (multiple) => {
  return window.dialog.openFile({
    accept: imageTypes.map((type) => `.${type}`).join(','),
    multiple,
  });
};

export const selectDir = async () => {
  return window.dialog.openFile({
    properties: ['openDirectory'],
  });
};

const _chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function randomString(length, chars = _chars) {
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export const getID = (length = 10) => {
  return randomString(length);
};

// 去除响应式
export const removeReactive = (obj) => {
  const res = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = toRaw(unref(obj[key]));
    }
  }
  return JSON.parse(JSON.stringify(res));
};
