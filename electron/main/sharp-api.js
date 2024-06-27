import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/**
 * 创建图片水印
 * @param waterMark {width: number, height: number, src: string}
 * @returns {Promise<{input: Buffer}>}
 */
const createImageWatermark = async (waterMark) => {
  const { width, height, src } = waterMark;
  if (!fs.existsSync(src)) return null;
  const buffer = await sharp(src)
    .resize({
      width,
      height,
      fit: 'fill',
    })
    .toBuffer();
  return { input: buffer };
};

/**
 * 创建文字水印
 * @param waterMark {text: string, width: number, height: number, dpi: number}
 * @returns {Promise<Buffer>}
 */
const createTextWatermark = async (waterMark) => {
  const { src, top, left, gravity, dpi } = waterMark;
  return {
    input: {
      text: {
        text: src,
        rgba: true,
        dpi,
      },
    },
    top,
    left,
    gravity,
  };
};

/**
 * 获取图片的base64
 * @param e IpcMainEvent
 * @param options {filePath: string, fileType: string}
 * @returns {Promise<String | {}>}
 */
const apiGetImgUrl = (e, options) => {
  return new Promise(async (resolve, reject) => {
    const { filePath, fileType } = options;
    if (!filePath) {
      reject({ message: '请传入文件路径' });
    }
    if (!fs.existsSync(filePath)) {
      reject({ message: '文件不存在' });
    }
    const bitmap = fs.readFileSync(filePath);
    const b64 = Buffer.from(bitmap).toString('base64');
    resolve(b64);
  });
};

/**
 * 格式转换
 * @param e IpcMainEvent
 * @param options {id: string, path: string, formatType: string, outputFolder: string}
 * @returns {Promise<{}>} {outputFilePath: string, id: string, ...info}
 */
const apiFormat = (e, options) => {
  return new Promise((resolve, reject) => {
    const { id, name, path, formatType, outputFolder } = options;
    if (!path) {
      reject({ message: '请传入文件路径' });
    }
    if (!fs.existsSync(path)) {
      reject({ message: '文件不存在' });
    }
    const toFileName = `${outputFolder}\\format_${name.replace(/\.\w+$/, `.${formatType}`)}`;
    sharp(path)
      .toFormat(formatType)
      .toFile(toFileName, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve({
          outputFilePath: toFileName,
          id,
          ...info,
        });
      });
  });
};

/**
 * 图片缩放
 * @param e IpcMainEvent
 * @param options {id: string, filePath: string, width: number, height: number, fit: string, background: string, fileOut: string}
 * @returns {Promise<{}>} {outputFilePath: string, id: string, ...info}
 */
const apiResize = (e, options) => {
  return new Promise((resolve, reject) => {
    const { id, filePath, width, height, fit, background, fileOut } = options;
    if (!filePath) {
      reject({ message: '请传入文件路径' });
    }
    if (!fs.existsSync(filePath)) {
      reject({ message: '文件不存在' });
    }
    const fileName = path.basename(filePath);
    const toFileName = `${fileOut}\\${fileName}`;
    sharp(filePath)
      .resize({
        width,
        height,
        fit,
        background,
      })
      .toFile(toFileName, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve({
          outputFilePath: toFileName,
          id,
          ...info,
        });
      });
  });
};

/**
 * 添加水印，图片合成
 * @param e IpcMainEvent
 * @param options {watermarks: Array, files: Array, fileOut: string}
 */
const apiWatermark = async (e, options) => {
  const { watermarks, name, path, outputFolder } = options;
  console.log(options);
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(path)) {
      reject({ message: '请传入文件路径' });
    }
    if (!watermarks || !watermarks.length) {
      reject({ message: '请传入水印' });
    }
    const watermarkBuffers = await Promise.all(
      watermarks
        .filter((mark) => mark.enabled)
        .map(async (watermark) => {
          if (watermark.type === 'image') {
            return await createImageWatermark(watermark);
          } else {
            return await createTextWatermark(watermark);
          }
        })
    );
    const toFileName = `${outputFolder}\\watermark_${name}`;
    sharp(path)
      .composite(watermarkBuffers)
      .toFile(toFileName, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve({
          outputFilePath: toFileName,
          ...info,
        });
      });

    // const allResult = await Promise.allSettled(
    //   files.map(async (file) => {
    //     const fileName = file.name;
    //     const toFileName = `${fileOut}\\watermark_${fileName}`;
    //     return sharp(file.path)
    //       .composite(watermarkBuffers)
    //       .toFile(toFileName, (err, info) => {
    //         if (err) {
    //           return err;
    //         }
    //         return {
    //           outputFilePath: toFileName,
    //           ...info,
    //         };
    //       });
    //   })
    // );
    // resolve(
    //   allResult.map((item) => {
    //     if (item.status === 'rejected') {
    //       return item.reason;
    //     }
    //     return item.value;
    //   })
    // );
  });
};
export default {
  apiGetImgUrl,
  apiFormat,
  apiWatermark,
};
