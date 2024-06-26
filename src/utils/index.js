export const imageTypes = [
  'jpeg',
  'png',
  'webp',
  'gif',
  // 'jp2',
  // 'tiff',
  // 'avif',
  // 'heif',
  // 'jxl',
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

export const generateRandomString = (length) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
