const logger = require('./logger')('FileService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const config = require('config');
const process = require('node:process');
const path = require('path');
const dbConfig = config.get('dbConfig');
const fileTableName = dbConfig.get('fileTableName');
const fileDB = new NeDB({
    filename: process.env.HOME + path.sep + fileTableName,
    autoload: true,
})

const codebookTableName = dbConfig.get('codebookTableName');
const codeBookDB = new NeDB({
    filename: process.env.HOME + path.sep + codebookTableName,
    autoload: true
})

module.exports = {
    saveFileProp: async (orderId, username, filePath, fileSize) => {
        // save file prop into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            fileDB.find({
                primary_key: orderId,
                username: username,
                file_path: filePath
            }, function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(null);
                    return;
                }
                if (docs.length === 0) {
                    fileDB.insert({
                        primary_key: orderId,
                        username: username,
                        file_path: filePath,
                        file_size: fileSize,
                        update_time: currentTime,
                        create_time: currentTime
                    }, function (err, doc) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(null);
                            return;
                        }
                        resolve(doc._id);
                    })
                }
                else {
                    logger.info('update file, orderId:{}, filePath: {}', orderId, filePath);
                    fileDB.update({
                        primary_key: orderId,
                        username: username,
                        file_path: filePath
                    }, {
                        $set: {
                            file_size: fileSize,
                            update_time: currentTime
                        }
                    }, function (err, numReplaced) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(null);
                            return;
                        }
                        resolve(docs[0]._id);
                    });
                }
            })
        });
    },
    queryFileList: async (orderId, username, skip, limit) => {

        return new Promise((resolve, reject) => {
            // query file list from NeDB
            fileDB.find({
                primary_key: orderId,
                username: username
            }).skip(skip).limit(limit).sort({ create_time: -1 }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_FILE_FAILED);
                    return;
                }
                resolve(data);
            });
        });
    },
    queryFileCount: async (orderId, username) => {

        return new Promise((resolve, reject) => {
            // query file list from NeDB
            fileDB.find({
                primary_key: orderId,
                username: username
            }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_FILE_FAILED);
                    return;
                }
                resolve(data.length);
            });
        });
    },
    saveFileCodeBook: async (orderId, username, filePath, cid, partId, database64, hashVaule) => {
        // save file codeBook into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            codeBookDB.find({
                primary_key: orderId,
                username: username,
                file_path: filePath
            }, function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(null);
                    return;
                }
                if (docs.length === 0) {
                    codeBookDB.insert({
                        primary_key: orderId,
                        username: username,
                        file_path: filePath,
                        cid: cid,
                        part_id: partId,
                        data : database64,
                        hash_vaule: hashVaule,
                        update_time: currentTime,
                        create_time: currentTime
                    }, function (err, doc) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(null);
                            return;
                        }
                        resolve(doc._id);
                    })
                }
            })
        });
    },
    getFileCodeBook: async (orderId, username, filePath, cid) => {
        // get file codeBook into NeDB
        return new Promise((resolve, reject) => {
            codeBookDB.find({
                primary_key: orderId,
                username: username,
                file_path: filePath,
                cid: cid
            }, function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_FILE_CODEBOOK_FAILED);
                    return;
                }
                if (docs.length === 0) {
                    resolve(resolve(BizResultCode.GET_FILE_CODEBOOK_FAILED));
                }
                else{
                    resolve(docs);
                }
            })
        });
    }
}