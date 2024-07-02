import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import log from './log';

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
          log.error(options, err);
          reject(err);
        }
        log.info(options, info);
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
  const { name, path, width, height, fit, outputFolder } = options;
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      reject({ message: '请传入文件路径' });
    }
    const toFileName = `${outputFolder}\\resize_${name}`;
    sharp(path)
      .resize(width, height, {
        fit,
      })
      .toFile(toFileName, (err, info) => {
        if (err) {
          log.error(options, err);
          reject(err);
        }
        log.info(options, info);
        resolve({
          outputFilePath: toFileName,
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
          log.error(options, err);
          reject(err);
        }
        log.info(options, info);
        resolve({
          outputFilePath: toFileName,
          ...info,
        });
      });
  });
};

const apiExtract = (e, options) => {
  const { name, path, outputFolder, left, top, width, height } = options;
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      reject({ message: '请传入文件路径' });
    }
    const toFileName = `${outputFolder}\\extract_${name}`;
    sharp(path)
      .extract({ left, top, width, height })
      .toFile(toFileName, (err, info) => {
        if (err) {
          log.error(options, err);
          reject(err);
        }
        log.info(options, info);
        resolve({
          outputFilePath: toFileName,
          ...info,
        });
      });
  });
};

export default {
  'api:getImgUrl': apiGetImgUrl,
  'api:format': apiFormat,
  'api:watermark': apiWatermark,
  'api:resize': apiResize,
  'api:extract': apiExtract,
};
