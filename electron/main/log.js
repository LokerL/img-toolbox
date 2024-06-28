import logger from 'electron-log';
import { app } from 'electron';
import path from 'path';

logger.transports.file.level = 'debug';
logger.transports.file.maxSize = 1002430;
logger.transports.file.format =
  '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
const date = new Date();
const now_date =
  date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
// 日志保存到安装目录下的logs文件夹
logger.transports.file.resolvePathFn = () => {
  return path.join(app.getPath('userData'), 'logs', now_date + '.log');
};

export default logger;
