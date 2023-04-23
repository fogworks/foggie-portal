const process = require('node:process');
const path = require('path');
const log4js = require('log4js');
const config = require('config');
const logConfig = config.get('logConfig');
const logFileName = logConfig.get('logFileName');

/**
 * 日志文件配置
 */
log4js.configure({

    appenders: {
        out: {
            type: 'stdout'
        },
        // 每个日志文件 size 200MB，保留10个文件
        app: {
            type: 'file',
            filename: process.env.HOME + path.sep + logFileName,
            maxLogSize: 100485760,
            backups: 10
        }
    },
    categories: { default: { appenders: ['out', 'app'], level: 'info' } }
});

module.exports = function (name) {
    return log4js.getLogger(name)
}