const config = require('config');
const fs = require('fs');
const BizResult = require('./BizResult')
const BizResultCode = require('./BaseResultCode');
const logger = require('./logger')('FileController.js');
const userService = require('./UserService');
const fileService = require('./FileService');
const orderService = require('./OrderService');
const zlib = require('zlib');
const fileConfig = config.get('fileConfig');
const uploadFileBufferSize = fileConfig.get('uploadFileBufferSize');
const merkleBufferSize = fileConfig.get('merkleBufferSize');
const merkleBuffer = Buffer.alloc(merkleBufferSize);
const crypto = require('crypto');

class FileController {

    /**
     * 存储文件属性，包含 订单id，文件路径，foggie邮箱地址，文件大小，文件md5
     * @param {*} req       HTTP的request
     * @param {*} res       HTTP的response
     * @returns 
     */
    static async saveFileProp(req, res) {

        var orderId = req.body.orderId;
        // foggie的邮箱地址
        var email = req.body.email;
        // 文件的路径
        var filePath = req.body.filePath;
        // 文件大小，单位：字节
        var fileSize = req.body.fileSize;
        // 文件内容的md5
        var md5 = req.body.md5;

        // 设备类型 1 foggie 2 foggieMax 3 用户客户端
        var deviceType = req.body.deviceType;

        if (!orderId || !email || !filePath || !fileSize || !md5 || !deviceType) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }

        orderService.updateOrderUsedSpace(email, orderId, fileSize);

        var codebooks = await fileService.getFileCodeBookByMd5(orderId, email, md5);
        if (codebooks instanceof BizResultCode) {
            res.send(BizResult.fail(codebooks));
            return;
        }

        var codebook = codebooks[0];

        await fileService.saveFileProp(orderId, email, filePath, fileSize, md5, codebook.cid, deviceType);

        // 根据文件的上传记录，重读一次文件，生成merkle树后 提交
        var fileUploadRecordRes = await fileService.getFileUploadRecord(orderId, email, md5);

        if (fileUploadRecordRes instanceof BizResultCode) {
            res.send(BizResult.fail(fileUploadRecordRes));
            return;
        }

        for (const file of fileUploadRecordRes) {
            const filename = file.file_path;
            fs.unlinkSync(filename);
            logger.info("delete file, file path:{}", filename);
        }

        res.send(BizResult.success());
    }

    /**
     * 查询，包含 订单id，文件路径，用户名
     * @param {*} orderId       订单id
     * @param {*} email         foggie的邮箱地址
     * @param {*} deviceType    设备类型 1 foggie 2 foggieMax 3 用户客户端
     * @param {*} pageSize      每页条数
     * @param {*} pageNo        页数
     * @param {*} res HTTP的response
     * @returns 
     */
    static async list(orderId, email, deviceType, pageSize, pageNo, res) {

        if (!orderId || !email || !deviceType) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }

        var limit = 10;
        if (typeof (pageSize) !== "undefined") {
            limit = pageSize
        }

        var skip = 0;
        if (typeof (pageNo) !== "undefined") {
            skip = (pageNo - 1) * limit
        }

        var resultData = await fileService.getFileList(orderId, email, deviceType, skip, limit);
        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }

        var total = await fileService.getFileCount(orderId, email, deviceType);
        if (total instanceof BizResultCode) {
            res.send(BizResult.fail(total));
            return;
        }

        var result = {};
        result['list'] = resultData;
        result['count'] = total;
        res.send(BizResult.success(result));
    }

    /**
     * 上传文件
     * 大于10M的文件，使用流的方式
     * 
     * @param {*} req HTTP的request
     * @param {*} res HTTP的response
     * @returns
     */
    static async upload(req, res) {

        // 上传文件的类别 1：小文件 2：大文件
        var fileCategory = req.body.fileCategory;
        // 设备类型 1 foggie 2 foggieMax 3 用户客户端
        var deviceType = req.body.deviceType;
        var fileName = req.body.fileName;
        var md5 = req.body.md5;
        var fileType = req.body.fileType;
        var fileSize = req.body.fileSize;
        var orderId = req.body.orderId;
        var email = req.body.email;
        // 大文件新增的入参
        var partId = req.body.partId;
        var uploadId = req.body.uploadId;
        var minOffset = req.body.minOffset;
        var maxOffset = req.body.maxOffset;
        var wholeMd5 = req.body.wholeMd5;
        var wholeFileSize = req.body.wholeFileSize;

        if (!fileCategory || !fileName || !md5 || !fileSize || !orderId ||!email || !wholeMd5 || !deviceType) {
            res.send(BizResult.validateFailed());
            return;
        }

        // 校验相同的文件是否已经上传过
        var resultData = await fileService.getFileByMd5(orderId, email, fileName, wholeMd5, deviceType)

        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }
        if (resultData > 0) {
            res.send(BizResult.success());
            return;
        }

        // 获取token
        var token = await userService.getToken4UploadFile(email, orderId);
        if(token instanceof BizResultCode) {
            res.send(BizResult.fail(token));
            return;
        }

        // 获取peerId
        var orderInfo = await orderService.getOrderById(email, orderId);
        
        // test
        orderInfo.peer_id = "12D3KooWEJTLsHbP6Q1ybC1u49jFi77tQ8hYtraqGtKTHCXFzLnA";
        if(orderInfo instanceof BizResultCode){
            res.send(BizResult.fail(orderInfo));
            return;
        }
        var peerId = orderInfo.peer_id;

        const header = {
            peerId: peerId,
            Id: orderId,
            token: token
        };
        var file = req.files.file;
        // 测试文件服务器端联通性
        var rpc = orderInfo.rpc;

        // 小文件上传
        if (parseInt(fileCategory) == 1) {
            if (!fileType) {
                res.send(BizResult.validateFailed());
                return;
            }
            await smallFileUpload(fileName, md5, fileSize, fileType, rpc, header, res, fileCategory, orderId, email, peerId, file);
        }
        // 大文件上传
        else if (parseInt(fileCategory) == 2) {
            if (!partId || !uploadId || !minOffset || !maxOffset || !wholeFileSize) {
                res.send(BizResult.validateFailed());
                return;
            }

            const request = {
                key: fileName,
                md5: md5,
                contentLength: fileSize,
                partId: partId,
                uploadId: uploadId
            };
            const putObjectPartReq = {
                header: header,
                request: request
            };

            var netClient = await fileService.getProxGrpcClient(rpc, header);
            let stream = netClient.PutObjectPart(async function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    res.send(BizResult.fail(BizResultCode.UPLOAD_FILE_FAILED));
                    return;
                }

                // 分片文件上传文件后，需要记录分片文件的临时路径以及整个大文件的md5，用于提交接口中生成merkle树
                var saveFileUploadRecordRes = await fileService.saveFileUploadRecord(orderId, email, file.path, wholeMd5, partId)
                if (saveFileUploadRecordRes instanceof BizResultCode) {
                    res.send(BizResult.fail(saveFileUploadRecordRes));
                    return;
                }

                // 根据文件的大小，merkle树的块大小 计算密码本的偏移量数组
                var offsetArray = await fileService.getCodebookOffset(fileCategory, orderId, email, fileName, wholeMd5, wholeFileSize, merkleBufferSize, 2)
                if (offsetArray instanceof BizResultCode) {
                    res.send(BizResult.fail(offsetArray));
                    return;
                }

                logger.info('big file codebookOffset,md5:{},offsetArray:{}', wholeMd5, offsetArray);
                var fd = fs.openSync(file.path, 'r');
                offsetArray.forEach(async (offset) => {
                    // 判断当前的分片文件offset范围是否需要记录密码本
                    if (offset >= minOffset && offset < maxOffset) {
                        fs.readSync(fd, merkleBuffer, 0, merkleBufferSize, offset);
                        var hashVaule = crypto.createHash('md5').update(merkleBuffer).digest('hex');
                        logger.info('saveFileCodeBook, file_path:{}, partNum:{}, md5:{}, offset:{}, minOffset:{}, maxOffset:{}', file.path, partId, hashVaule, offset, minOffset, maxOffset);
                        var compressedData = zlib.gzipSync(merkleBuffer);
                        var base64data = Buffer.from(compressedData).toString('base64');
                        // 大文件的cid在上传成功后，还没有生成，先记录一个空字符串，后续提交接口中会更新
                        await fileService.saveFileCodeBook(orderId, email, wholeMd5, wholeFileSize, '', offset / merkleBufferSize, base64data, hashVaule);
                    }
                });
                fs.closeSync(fd);

                res.send(BizResult.success(data.etag));
            });

            stream.write({ req: putObjectPartReq });

            const readStream = fs.createReadStream(file.path, { highWaterMark: uploadFileBufferSize });

            readStream.on('data', (chunk) => {
                stream.write({ chunk: chunk });
            });

            readStream.on('end', () => {
                stream.end();
                return;
            });

            readStream.on('error', (err) => {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.READ_FILE_FAILED));
                return;
            });
        }
        else {
            res.send(BizResult.fail(BizResultCode.NOT_SUPPORT_FILE_TYPE));
        }
    }

    /**
     * 删除生成的密码本偏移数组
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteFileCodebookOffset(req, res) {
        var email = req.body.email;
        var orderId = req.body.orderId;
        var md5 = req.body.md5;

        if (!orderId || !md5 || !email) {
            res.send(BizResult.validateFailed());
            return;
        }

        var resultData = await fileService.deleteCodebookOffset(orderId, email, md5)
        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }

        res.send(BizResult.success());
    }

    /**
     * 创建文件
     * @param {*} email    foggie邮箱地址
     * @param {*} fileName 文件名
     * @param {*} md5      文件md5
     * @param {*} fileType 文件类型
     * @param {*} fileSize 文件大小，单位 Bytes
     * @param {*} orderId  订单id
     * @param {*} token    文件token 
     * @param {*} peerId   peerId
     * @param {*} res      HTTP的response
     * @returns 
     */
    static async create(email, fileName, md5, fileType, fileSize, orderId, deviceType, res) {
        
        if (!fileName || !fileType || !fileSize || !orderId || !md5 || !email || !deviceType) {
            res.send(BizResult.validateFailed());
            return;
        }

        // 获取token
        var token = await userService.getToken4UploadFile(email, orderId);
        if(token instanceof BizResultCode) {
            res.send(BizResult.fail(token));
            return;
        }

        // 获取peerId
        var orderInfo = await orderService.getOrderById(email, orderId);
        if(orderInfo instanceof BizResultCode){
            res.send(BizResult.fail(orderInfo));
            return;
        }
        var peerId = orderInfo.peer_id;
        var rpc = orderInfo.rpc;
        
        // 校验相同的文件是否已经上传过
        var resultData = await fileService.getFileByMd5(orderId, email, fileName, md5, deviceType)

        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }
        var duplicateRes = {};
        if (resultData > 0) {
            duplicateRes['duplicateUpload'] = true;
            res.send(BizResult.success(duplicateRes));
            return;
        }
        const header = {
            peerId: peerId,
            Id: orderId,
            token: token
        };
        const request = {
            key: fileName,
            md5: md5,
            contentLength: fileSize,
            contentType: fileType
        };
        const putObjectReq = {
            header: header,
            request: request
        };
        var client = await fileService.getProxGrpcClient(rpc, header);

        client.NewMultipartObject(putObjectReq, function (err, data) {
            if (err) {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.CREATE_FILE_FAILED));
                return;
            }
            var duplicateRes = {};
            duplicateRes['duplicateUpload'] = false;
            duplicateRes['uploadId'] = data.uploadId;
            res.send(BizResult.success(duplicateRes));
        });
    }

    // 删除文件
    static async removeFileProp(req, res) {
        var orderId = req.body.orderId;
        var email = req.body.email;
        var md5 = req.body.md5;
        var deviceType = req.body.deviceType;
        var resultData = await fileService.removeFileByMd5(orderId, email, deviceType, md5)

        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }
        res.send(BizResult.success());
    }

    /**
     * 获取密码本
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getCodebook(req, res){
        var orderId = req.body.orderId;
        var email = req.body.email;
        var md5 = req.body.md5;
        if (!orderId || !email || !md5) {
            res.send(BizResult.validateFailed());
            return;
        }
        var codebook = await fileService.getCodeBookByOrderId(orderId, email, md5);
        if (codebook instanceof BizResultCode) {
            res.send(BizResult.fail(codebook));
            return;
        }
        res.send(BizResult.success(codebook));
    }

    /**
     * 完成文件传输后的提交
     * 
     * @param {*} req HTTP的request
     * @param {*} res HTTP的response
     * @returns
     */
    static async complete(req, res) {

        var fileName = req.body.fileName;
        var orderId = req.body.orderId;
        var parts = req.body.parts;
        var uploadId = req.body.uploadId;
        var md5 = req.body.md5;
        var fileSize = req.body.fileSize;
        var email = req.body.email;

        if (!fileName || !orderId || !parts || !uploadId || !md5 || !fileSize || !email) {
            res.send(BizResult.validateFailed());
            return;
        }

        // 获取token
        var token = await userService.getToken4UploadFile(email, orderId);
        if(token instanceof BizResultCode) {
            res.send(BizResult.fail(token));
            return;
        }

        // 获取peerId
        var orderInfo = await orderService.getOrderById(email, orderId);
        if(orderInfo instanceof BizResultCode){
            res.send(BizResult.fail(orderInfo));
            return;
        }
        var peerId = orderInfo.peer_id;
        var rpc = orderInfo.rpc;

        // 根据文件的上传记录，重读一次文件，生成merkle树后 提交
        var fileUploadRecordRes = await fileService.getFileUploadRecord(orderId, email, md5);

        if (fileUploadRecordRes instanceof BizResultCode) {
            res.send(BizResult.fail(fileUploadRecordRes));
            return;
        }

        var powClient = fileService.getPowGrpcClient();
        let merkleStream = powClient.BuildMerkelLeaf(async function (err, data) {
            if (err) {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.BUILD_MERKLE_FAILED));
                return;
            }
            logger.info('generate merkle success, orderId{}, data:', data);
            // 生成merkle树后 更新cid
            var updateCodebookRes = await fileService.updateFileCodeBook(orderId, email, md5, data.cid)

            if (updateCodebookRes instanceof BizResultCode) {
                res.send(BizResult.fail(updateCodebookRes));
                return;
            }

            // 生成merkle树后 提交
            const header = {
                peerId: peerId,
                Id: orderId,
                token: token
            };
            const completeUpload = {
                parts: parts
            };
            const request = {
                key: fileName,
                uploadId: uploadId,
                completeUpload: completeUpload
            };
            const completeMultipartReq = {
                header: header,
                request: request
            };

            var netClient = await fileService.getProxGrpcClient(rpc, header);
            netClient.CompleteMultipart(completeMultipartReq, function (err2, data2) {
                if (err2) {
                    logger.error('err:', err2);
                    res.send(BizResult.fail(BizResultCode.COMPLETE_FILE_FAILED));
                    return;
                }

                res.send(BizResult.success(data2.cid));
            });
        });
        const mkHeader = {
            peerId: peerId,
            Id: orderId
        };
        const putObjectMKRequest = {
            key: fileName,
            size: fileSize
        };
        const putObjectMKReq = {
            header: mkHeader,
            request: putObjectMKRequest
        };
        merkleStream.write({ req: putObjectMKReq });

        await readFileSequentially(fileUploadRecordRes, merkleStream).catch(err => {
            logger.error('read file error, err: {}', err);
            res.send(BizResult.fail(BizResultCode.READ_FILE_FAILED));
            return;
        });
        async function readFileSequentially(fileUploadRecordRes, merkleStream) {
            try {
                for (const file of fileUploadRecordRes) {
                    const filename = file.file_path;
                    const readStream = fs.createReadStream(filename, { highWaterMark: uploadFileBufferSize });
                    // 将文件内容写入流
                    for await (const chunk of readStream) {
                        merkleStream.write({ chunk: chunk });
                    }
                }
            } catch (err) {
                logger.error('read file error, fileUploadRecordRes:{}, err: {}', fileUploadRecordRes, err);
                res.send(BizResult.fail(BizResultCode.READ_FILE_FAILED));
                return;
            }
            merkleStream.end();
        }
    }
}

module.exports = FileController

async function smallFileUpload(fileName, md5, fileSize, fileType, rpc, header, res, fileCategory, orderId, email, peerId, file) {
    var netClient = await fileService.getProxGrpcClient(rpc, header);
    const request = {
        key: fileName,
        md5: md5,
        contentLength: fileSize,
        contentType: fileType
    };
    const putObjectReq = {
        header: header,
        request: request
    };

    let uploadFileStream = netClient.PutObject(async function (err, data) {
        if (err) {
            logger.error('err:', err);
            res.send(BizResult.fail(BizResultCode.UPLOAD_FILE_FAILED));
            return;
        }

        // 上传成功后，保存文件上传记录 小文件不存在分片，所以partNum为0
        fileService.saveFileUploadRecord(orderId, email, file.path, md5, 0)

        // 根据文件的大小，merkle树的块大小 计算密码本的偏移量数组
        var offsetArray = await fileService.getCodebookOffset(fileCategory, orderId, email, fileName, md5, fileSize, merkleBufferSize, 2);
        if (offsetArray instanceof BizResultCode) {
            res.send(BizResult.fail(offsetArray));
            return;
        }

        var powClient = fileService.getPowGrpcClient();
        let merkleStream = powClient.BuildMerkelLeaf(function (err, data2) {
            if (err) {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.BUILD_MERKLE_FAILED));
                return;
            }
            res.send(BizResult.success(data.cid));
        });
        const mkHeader = {
            peerId: peerId,
            Id: orderId
        };
        const putObjectMKRequest = {
            key: fileName,
            cid: data.cid,
            size: fileSize
        };
        const putObjectMKReq = {
            header: mkHeader,
            request: putObjectMKRequest
        };
        merkleStream.write({ req: putObjectMKReq });

        var fd = fs.openSync(file.path, 'r');
        offsetArray.forEach(async (offset) => {
            fs.readSync(fd, merkleBuffer, 0, merkleBufferSize, offset);
            var hashVaule = crypto.createHash('md5').update(merkleBuffer).digest('hex');
            var compressedData = zlib.gzipSync(merkleBuffer);
            var base64data = Buffer.from(compressedData).toString('base64');
            await fileService.saveFileCodeBook(orderId, email, md5, fileSize, data.cid, offset / merkleBufferSize, base64data, hashVaule);
        });
        fs.closeSync(fd);
        merkleStream.write({ chunk: fs.readFileSync(file.path) });
        merkleStream.end();
    });

    uploadFileStream.write({ req: putObjectReq });

    const readStream = fs.createReadStream(file.path, { highWaterMark: uploadFileBufferSize });

    readStream.on('data', (chunk) => {
        uploadFileStream.write({ chunk: chunk });
    });

    readStream.on('end', () => {
        uploadFileStream.end();
        return;
    });

    readStream.on('error', (err) => {
        logger.error('err:', err);
        res.send(BizResult.fail(BizResultCode.READ_FILE_FAILED));
        return;
    });
    return netClient;
}
