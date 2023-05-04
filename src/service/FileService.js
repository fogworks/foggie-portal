const logger = require('./logger')('FileService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const config = require('config');
const retry = require('retry');
const common = require('./common');
const net_proto = require('./grpc/net');
const pow_proto = require('./grpc/pow');
const prox_proto = require('./grpc/prox');
const grpc = require('@grpc/grpc-js');
const path = require('path');
const dbConfig = config.get('dbConfig');
const fileTableName = dbConfig.get('fileTableName');
const fileDB = new NeDB({
    filename: common.getHomePath() + path.sep + fileTableName,
    autoload: true,
})

const codebookTableName = dbConfig.get('codebookTableName');
const codeBookDB = new NeDB({
    filename: common.getHomePath() + path.sep + codebookTableName,
    autoload: true
})

const codebookOffsetTableName = dbConfig.get('codebookOffsetTableName');
const codeBookOffsetDB = new NeDB({
    filename: common.getHomePath() + path.sep + codebookOffsetTableName,
    autoload: true
})

const fileUploadRecordTableName = dbConfig.get('fileUploadRecordTableName');
const fileUploadRecordDB = new NeDB({
    filename: common.getHomePath() + path.sep + fileUploadRecordTableName,
    autoload: true
})

module.exports = {
    saveFileProp: async (orderId, email, filePath, fileSize, md5, deviceType) => {
        // save file prop into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            fileDB.find({
                order_id: orderId,
                email: email,
                file_path: filePath,
                md5: md5,
                device_type: deviceType
            }, function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(null);
                    return;
                }
                if (docs.length === 0) {
                    fileDB.insert({
                        order_id: orderId,
                        email: email,
                        file_path: filePath,
                        file_size: fileSize,
                        md5: md5,
                        device_type: deviceType,
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
                    resolve(docs[0]._id);
                }
            })
        });
    },
    getFileList: async (orderId, email, deviceType, skip, limit) => {
        return new Promise((resolve, reject) => {
            // query file list from NeDB
            fileDB.find({
                order_id: orderId,
                email: email,
                device_type: deviceType
            }).skip(skip).limit(limit).sort({ create_time: -1 }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_FILE_FAILED);
                    return;
                }
                resolve(data);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_FILE_FAILED;
        });
    },
    getFileCount: async (orderId, email, deviceType) => {

        return new Promise((resolve, reject) => {
            // query file list from NeDB
            fileDB.find({
                order_id: orderId,
                email: email,
                device_type: deviceType
            }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_FILE_FAILED);
                    return;
                }
                resolve(data.length);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_FILE_FAILED;
        });
    },
    getFileByMd5: async (orderId, email, fileName, md5, deviceType) => {

        return new Promise((resolve, reject) => {
            // query file list from NeDB
            fileDB.find({
                order_id: orderId,
                email: email,
                file_path: fileName,
                md5: md5,
                device_type: deviceType
            }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_FILE_BY_MD5_FAILED);
                    return;
                }
                resolve(data.length);
            });
        }).catch(err => {
            logger.error(err);
            return BizResultCode.GET_FILE_BY_MD5_FAILED;
        });
    },
    removeFileByMd5: async (orderId, email, deviceType, md5) => {

        return new Promise((resolve, reject) => {
            // query file list from NeDB
            fileDB.remove({
                order_id: orderId,
                email: email,
                md5: md5,
                device_type: deviceType
            }, { multi: true }, function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.REMOVE_FILE_FAILED);
                    return;
                }
                resolve(data);
            });
        }).catch(err => {
            logger.error(err);
            return BizResultCode.REMOVE_FILE_FAILED;
        });
    },
    saveFileCodeBook: async (orderId, email, md5, fileSize, cid, partId, database64, hashVaule) => {
        // save file codeBook into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            codeBookDB.findOne({
                order_id: orderId,
                email: email,
                md5: md5,
                part_id: partId
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(null);
                    return;
                }
                if (doc) {
                    codeBookDB.update({
                        order_id: orderId,
                        email: email,
                        md5: md5,
                        part_id: partId
                    }, {
                        $set: {
                            cid: cid,
                            data: database64,
                            hash_vaule: hashVaule,
                            update_time: currentTime
                        }
                    }, function (err, numReplaced) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(null);
                            return;
                        }
                        resolve(doc._id);
                    });
                }
                else {
                    codeBookDB.insert({
                        order_id: orderId,
                        email: email,
                        md5: md5,
                        file_size: fileSize,
                        cid: cid,
                        part_id: partId,
                        data: database64,
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
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.SAVE_CODEBOOK_FAILED;
        });
    },
    updateFileCodeBook: async (orderId, email, md5, cid) => {

        return new Promise((resolve, reject) => {

            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            // update file codeBook cid into NeDB
            codeBookDB.update({
                order_id: orderId,
                email: email,
                md5: md5
            }, {
                $set: {
                    cid: cid,
                    update_time: currentTime
                }
            }, { multi: true }, function (err, numReplaced) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.UPDATE_FILE_CODEBOOK_FAILED);
                    return;
                }

                if (numReplaced == 0) {
                    resolve(BizResultCode.UPDATE_FILE_CODEBOOK_FAILED);
                    return;
                }

                resolve(numReplaced);
            });
        }).catch(err => {
            logger.error(err);
            return BizResultCode.UPDATE_FILE_CODEBOOK_FAILED;
        });
    },
    getFileCodeBook: async (orderId, email, blockSize) => {
        // get file codeBook into NeDB
        return new Promise((resolve, reject) => {
            codeBookDB.find({
                order_id: orderId,
                email: email,
                file_size: {$gte: blockSize}
            }, function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_FILE_CODEBOOK_FAILED);
                    return;
                }
                if (docs.length === 0) {
                    resolve(BizResultCode.GET_FILE_CODEBOOK_FAILED);
                }
                else {
                    resolve(docs);
                }
            })
        }).catch(err => {
            logger.error(err);
            return BizResultCode.GET_FILE_CODEBOOK_FAILED;
        });
    },
    /**
     * 计算密码本的偏移量
     * 文件大小小于分块大小，返回 []
     * 完整的分块数量 小于等于3，则随机取一个分块的偏移量
     * 完整的分块数量 大于3，则先随机从前3个中取一个分块的偏移量，
     * 然后根据增长因子，计算出后续的分块，每次增长一次offset = offset + blockSize * growthFactor
     * 增长的次数N 越大，存入偏移量数组的概率越小
     * 
     * @param {*} fileCategory  文件类型 1:小文件 2:大文件
     * @param {*} orderId   订单号
     * @param {*} email     foggie邮箱
     * @param {*} fileName  文件名
     * @param {*} fileSize  文件大小
     * @param {*} blockSize     分块大小
     * @param {*} growthFactor  增长因子
     * @returns 偏移量的数组
     */
    getCodebookOffset: async (fileCategory, orderId, email, fileName, md5, fileSize, blockSize, growthFactor) => {

        return new Promise((resolve, reject) => {
            codeBookOffsetDB.find({
                order_id: orderId,
                email: email,
                md5: md5
            }, function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_CODEBOOK_OFFSET_FAILED);
                    return;
                }
                if (docs.length === 0) {
                    var offsetArr = [];
                    var offset = 0;
                    // 如果文件大小小于分块大小，则直接返回[]
                    if (fileSize < blockSize) {
                        return offsetArr;
                    }
                    // 计算完整的分块数量
                    var blockNum = Math.floor(fileSize / blockSize);

                    // 如果 完整的分块数量 小于等于3，则随机取一个分块
                    if (blockNum <= 3) {
                        var rand = Math.floor(Math.random() * blockNum);
                        offsetArr.push(rand * blockSize);
                        return offsetArr;
                    }

                    // 如果 完整的分块数量 大于3，则先随机从前3个 中 取一个分块
                    var rand = Math.floor(Math.random() * 3);
                    offset = rand * blockSize;
                    offsetArr.push(offset);

                    var i = 1;
                    // 然后根据增长因子，计算出后续的分块，每次增长一次offset = offset + blockSize * growthFactor
                    while (true) {
                        blockSize *= growthFactor;
                        offset += blockSize;
                        if (offset > fileSize) {
                            break;
                        }
                        // 增长的次数N 越大，存入偏移量数组的概率越小
                        if (Math.random() < 1 / i) {
                            offsetArr.push(offset);
                        }
                        i++;

                    }
                    // 小文件不插入数据库，直接返回
                    if (fileCategory === 1) {
                        resolve(offsetArr);
                        return;
                    }
                    var now = moment();
                    var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
                    codeBookOffsetDB.insert({
                        order_id: orderId,
                        email: email,
                        file_path: fileName,
                        md5: md5,
                        data: offsetArr,
                        update_time: currentTime,
                        create_time: currentTime
                    }, function (err, doc) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(BizResultCode.SAVE_CODEBOOK_OFFSET_FAILED);
                            return;
                        }
                        resolve(offsetArr);
                    })
                }
                else {
                    resolve(docs[0].data);
                }
            })
        }).catch(err => {
            logger.error(err);
            return BizResultCode.GET_CODEBOOK_OFFSET_FAILED;
        });
    },
    deleteCodebookOffset: async (orderId, email, md5) => {

        return new Promise((resolve, reject) => {
            // delete codeBookOffset from NeDB
            codeBookOffsetDB.remove({
                order_id: orderId,
                email: email,
                md5: md5
            }, function (err, numRemoved) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.DELETE_CODEBOOK_OFFSET_FAILED);
                }
                if (numRemoved === 0) {
                    logger.error('delete codebook offset failed');
                    resolve(BizResultCode.DELETE_CODEBOOK_OFFSET_FAILED);
                }
                resolve(numRemoved);
            });
        }).catch(err => {
            logger.error(err);
            return BizResultCode.DELETE_CODEBOOK_OFFSET_FAILED;
        });

    },
    saveFileUploadRecord: async (orderId, email, filePath, md5, partNum) => {
        // save file upload record into NeDB
        return new Promise((resolve, reject) => {

            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            fileUploadRecordDB.findOne({
                order_id: orderId,
                email: email,
                md5: md5,
                part_num: partNum
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.SAVE_FILE_UPLOAD_RECORD_FAILED);
                    return;
                }
                // 如果已经存在，则更新数据
                if (doc) {
                    fileUploadRecordDB.update
                        ({
                            _id: doc._id,
                        }, {
                            $set: {
                                file_path: filePath,
                                update_time: currentTime
                            }
                        }, {}, function (err, numReplaced) {
                            if (err) {
                                logger.error('err:', err);
                                resolve(BizResultCode.SAVE_FILE_UPLOAD_RECORD_FAILED);
                                return;
                            }
                            if (numReplaced === 0) {
                                logger.error('update file upload record failed');
                                resolve(BizResultCode.SAVE_FILE_UPLOAD_RECORD_FAILED);
                                return;
                            }
                            resolve(doc._id);
                            return;
                        });
                }
                else {
                    fileUploadRecordDB.insert({
                        order_id: orderId,
                        email: email,
                        file_path: filePath,
                        md5: md5,
                        part_num: partNum,
                        update_time: currentTime,
                        create_time: currentTime
                    }, function (err, doc) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(BizResultCode.SAVE_FILE_UPLOAD_RECORD_FAILED);
                            return;
                        }
                        resolve(doc._id);
                    })
                }
            });
        }).catch(err => {
            logger.error(err);
            return BizResultCode.SAVE_FILE_UPLOAD_RECORD_FAILED;
        });
    },
    getFileUploadRecord: async (orderId, email, md5) => {
        // save file upload record into NeDB
        return new Promise((resolve, reject) => {
            fileUploadRecordDB.find({
                order_id: orderId,
                email: email,
                md5: md5
            }).sort({ part_num: 1 }).exec(function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_FILE_UPLOAD_RECORD_FAILED);
                    return;
                }
                if (docs.length === 0) {
                    resolve(BizResultCode.GET_FILE_UPLOAD_RECORD_FAILED);
                    return;
                }
                resolve(docs);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.GET_FILE_UPLOAD_RECORD_FAILED;
        });
    },
    getNetGrpcClient: () => {
        var grpcConfig = config.get('grpcConfig');
        var ip = grpcConfig.get("ip");
        var port = grpcConfig.get("port");
        return new net_proto.API(ip + ':' + port, grpc.credentials.createInsecure());

    },
    getPowGrpcClient: () => {
        var grpcConfig = config.get('grpcConfig');
        var ip = grpcConfig.get("ip");
        var port = grpcConfig.get("port");
        return new pow_proto.PowService(ip + ':' + port, grpc.credentials.createInsecure());
    },
    getProxGrpcClient: async (rpc, header) => {
        var proxClient = new prox_proto.Service(rpc, grpc.credentials.createInsecure());
        var proxPingRequest = {
            header: header
        }
        return new Promise((resolve, reject) => {
            proxClient.Ping(proxPingRequest, function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    var grpcConfig = config.get('grpcConfig');
                    var ip = grpcConfig.get("ip");
                    var port = grpcConfig.get("port");
                    logger.info('grpc address:', ip + ':' + port);
                    resolve(new net_proto.API(ip + ':' + port, grpc.credentials.createInsecure()));
                    return;
                }
                logger.info('grpc address:', rpc);
                resolve(proxClient);
            });
        });
    }
}