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
     * save file info, contains order_id,file_path,email,file_size,md5,device_type
     * @param {*} req       HTTP request
     * @param {*} res       HTTP response
     * @returns 
     */
    static async saveFileProp(req, res) {

        var orderId = req.body.orderId;
        var email = req.body.email;
        var filePath = req.body.filePath;
        var fileSize = req.body.fileSize;
        var md5 = req.body.md5;

        //  1 foggie 2 foggieMax 3 client
        var deviceType = req.body.deviceType;

        if (!orderId || !email || !filePath || !fileSize || !md5 || !deviceType) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }

        // check file is exist
        var resultData = await fileService.getFileByMd5(orderId, email, filePath, md5, deviceType)

        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }
        if (resultData > 0) {
            logger.info("file is exist, orderId:{}, md5:{}", orderId, md5);
            res.send(BizResult.success());
            return;
        }

        orderService.updateOrderUsedSpace(email, orderId, fileSize);

        var codebooks = await fileService.getFileCodeBookByMd5(orderId, email, md5);
        if (codebooks instanceof BizResultCode) {
            res.send(BizResult.fail(codebooks));
            return;
        }

        if (codebooks.length == 0) {
            res.send(BizResult.fail(BizResultCode.GET_FILE_CODEBOOK_FAILED));
            return;
        }

        var codebook = codebooks[0];

        fileService.saveFileProp(orderId, email, filePath, fileSize, md5, codebook.cid, deviceType);

        var fileUploadRecordRes = await fileService.getFileUploadRecord(orderId, email, md5);

        if (fileUploadRecordRes instanceof BizResultCode) {
            res.send(BizResult.fail(fileUploadRecordRes));
            return;
        }

        try {
            for (const file of fileUploadRecordRes) {
                const filename = file.file_path;
                fs.unlinkSync(filename);
                logger.info("delete file, file path:{}", filename);
            }
        } catch (error) {
            logger.error("delete file error:{}", error);
        }

        res.send(BizResult.success());
    }

    /**
     * file list
     * @param {*} orderId       
     * @param {*} email         
     * @param {*} deviceType    1 foggie 2 foggieMax 3 client
     * @param {*} pageSize      
     * @param {*} pageNo        
     * @param {*} res HTTP response
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

    static async uploadValid(req, res) {

        var orderId = req.body.orderId;

        if (!orderId) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }

        // valid order state
        var orderInfo = orderService.getOrderFromChain(orderId);
        if (orderInfo instanceof BizResultCode) {
            logger.info("get order from chain failed, orderId:{} ", orderId);
            res.send(BizResult.fail(orderInfo));
            return;
        }
        if (orderInfo.state == 4 || orderInfo.state == 5) {
            logger.info("order state is invalid, can't upload file, orderId:{}", orderId);
            res.send(BizResult.fail(BizResultCode.ORDER_STATE_INVALID_UPLOAD));
            return;
        }

        // upload file valid challenge is end
        var challengeList = orderService.getChallengeByState(orderId, [0, 1, 3, 7]);
        if (challengeList instanceof BizResultCode) {
            res.send(BizResult.fail(challengeList));
            return;
        }
        if (challengeList.length > 0) {
            for (const chanllenge of challengeList) {
                if (chanllenge.state === 3) {
                    logger.info("challenge is not response, orderId:{}", orderId);
                    res.send(BizResult.fail(BizResultCode.ORDER_CHALLENGE_NOT_RESPONSE));
                    return;
                }
                if (chanllenge.state === 7) {
                    logger.info("order is end, orderId:{}", orderId);
                    res.send(BizResult.fail(BizResultCode.ORDER_STATE_END));
                    return;
                }
                if (chanllenge.state === 0 && chanllenge.pre_merkle_root != chanllenge.merkle_root) {
                    logger.info("merkle is inconsistent, orderId:{}", orderId);
                    res.send(BizResult.fail(BizResultCode.MERKLE_INCONSISTENT));
                    return;
                }
                if (chanllenge.state === 1 && parseInt(chanllenge.pre_merkle_root) != 0) {
                    logger.info("merkle is inconsistent, orderId:{}", orderId);
                    res.send(BizResult.fail(BizResultCode.MERKLE_INCONSISTENT));
                    return;
                }
            }
        }
        res.send(BizResult.success(true));
    }

    /**
     * upload file
     * 
     * @param {*} req HTTP request
     * @param {*} res HTTP response
     * @returns
     */
    static async upload(req, res) {

        // 1 small 2 big
        var fileCategory = req.body.fileCategory;
        // deviceType 1 foggie 2 foggieMax 3 client
        var deviceType = req.body.deviceType;
        var fileName = req.body.fileName;
        var md5 = req.body.md5;
        var fileType = req.body.fileType;
        var fileSize = req.body.fileSize;
        var orderId = req.body.orderId;
        var email = req.body.email;
        // the following are big file parameter
        var partId = req.body.partId;
        var uploadId = req.body.uploadId;
        var minOffset = req.body.minOffset;
        var maxOffset = req.body.maxOffset;
        var wholeMd5 = req.body.wholeMd5;
        var wholeFileSize = req.body.wholeFileSize;

        if (!fileCategory || !fileName || !md5 || !fileSize || !orderId || !email || !wholeMd5 || !deviceType) {
            res.send(BizResult.validateFailed());
            return;
        }

        // valid order state
        var orderInfo = orderService.getOrderFromChain(orderId);
        if (orderInfo instanceof BizResultCode) {
            logger.info("get order from chain failed, orderId:{} ", orderId);
            res.send(BizResult.fail(orderInfo));
            return;
        }
        if (orderInfo.state == 4 || orderInfo.state == 5) {
            logger.info("order state is invalid, can't upload file, orderId:{}", orderId);
            res.send(BizResult.fail(BizResultCode.ORDER_STATE_INVALID_UPLOAD));
            return;
        }

        // upload file valid challenge is end
        var challengeList = orderService.getChallengeByState(orderId, [0, 1, 3, 7]);
        if (challengeList instanceof BizResultCode) {
            res.send(BizResult.fail(challengeList));
            return;
        }
        if (challengeList.length > 0) {

            for (const chanllenge of challengeList) {
                if (chanllenge.state === 3) {
                    logger.info("challenge is not response, orderId:{}", orderId);
                    res.send(BizResult.fail(BizResultCode.ORDER_CHALLENGE_NOT_RESPONSE));
                    return;
                }
                if (chanllenge.state === 7) {
                    logger.info("order is end, orderId:{}", orderId);
                    res.send(BizResult.fail(BizResultCode.ORDER_STATE_END));
                    return;
                }
                if (chanllenge.state === 0 && chanllenge.pre_merkle_root != chanllenge.merkle_root) {
                    logger.info("merkle is inconsistent, orderId:{}", orderId);
                    res.send(BizResult.fail(BizResultCode.MERKLE_INCONSISTENT));
                    return;
                }
                if (chanllenge.state === 1 && parseInt(chanllenge.pre_merkle_root) != 0) {
                    logger.info("merkle is inconsistent, orderId:{}", orderId);
                    res.send(BizResult.fail(BizResultCode.MERKLE_INCONSISTENT));
                    return;
                }
            }
        }

        // check file is exist
        var resultData = await fileService.getFileByMd5(orderId, email, fileName, wholeMd5, deviceType)

        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }
        if (resultData > 0) {
            res.send(BizResult.success());
            return;
        }

        // token
        var token = await userService.getToken4UploadFile(email, orderId);
        if (token instanceof BizResultCode) {
            res.send(BizResult.fail(token));
            return;
        }



        // peerId
        var orderFromDB = await orderService.getOrderById(email, orderId);

        if (orderFromDB instanceof BizResultCode) {
            res.send(BizResult.fail(orderFromDB));
            return;
        }
        var peerId = orderFromDB.peer_id;
        var foggieId = orderFromDB.foggie_id;

        const header = {
            peerId: peerId,
            Id: foggieId,
            token: token
        };
        var file = req.files.file;
        var rpc = orderFromDB.rpc;

        logger.info("upload file, file:{}", file);

        logger.info("upload file, header:{}", header);

        //small file upload
        if (parseInt(fileCategory) == 1) {
            await smallFileUpload(fileName, md5, fileSize, fileType, orderFromDB, header, res, fileCategory, orderId, email, peerId, file, foggieId);
        }
        // big file upload
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

                // After uploading the sharded file, 
                // it is necessary to record the temporary path of the sharded file 
                // and the MD5 of the entire large file, 
                //which is used to generate a merkle tree in the commit interface
                var saveFileUploadRecordRes = await fileService.saveFileUploadRecord(orderId, email, file.path, wholeMd5, partId)
                if (saveFileUploadRecordRes instanceof BizResultCode) {
                    res.send(BizResult.fail(saveFileUploadRecordRes));
                    return;
                }

                // Calculate the offset array of the password book 
                // based on the size of the file and the block size of 
                // the merkle tree
                var offsetArray = await fileService.getCodebookOffset(fileCategory, orderId, email, fileName, wholeMd5, wholeFileSize, merkleBufferSize, 2)
                if (offsetArray instanceof BizResultCode) {
                    res.send(BizResult.fail(offsetArray));
                    return;
                }

                logger.info('big file codebookOffset,md5:{},offsetArray:{}', wholeMd5, offsetArray);
                var fd = fs.openSync(file.path, 'r');
                offsetArray.forEach(async (offset) => {
                    // Determine whether the offset range of the current shard file 
                    // needs to be recorded in a password book
                    if (offset >= minOffset && offset < maxOffset) {
                        fs.readSync(fd, merkleBuffer, 0, merkleBufferSize, offset);
                        var hashVaule = crypto.createHash('md5').update(merkleBuffer).digest('hex');
                        logger.info('saveFileCodeBook, file_path:{}, partNum:{}, md5:{}, offset:{}, minOffset:{}, maxOffset:{}', file.path, partId, hashVaule, offset, minOffset, maxOffset);
                        var compressedData = zlib.gzipSync(merkleBuffer);
                        var base64data = Buffer.from(compressedData).toString('base64');
                        //After successfully uploading the big file's cid, 
                        //it has not yet been generated. 
                        //First, an empty string will be recorded and updated in the subsequent submission interface
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
     * Delete the generated password book offset array
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
     * create file
     * @param {*} email    
     * @param {*} fileName 
     * @param {*} md5      
     * @param {*} fileType 
     * @param {*} fileSize 
     * @param {*} orderId  
     * @param {*} token     
     * @param {*} peerId   
     * @param {*} res     
     * @returns 
     */
    static async create(email, fileName, md5, fileType, fileSize, orderId, deviceType, res) {

        if (!fileName || !fileSize || !orderId || !md5 || !email || !deviceType) {
            res.send(BizResult.validateFailed());
            return;
        }

        // token
        var token = await userService.getToken4UploadFile(email, orderId);
        if (token instanceof BizResultCode) {
            res.send(BizResult.fail(token));
            return;
        }

        // peerId
        var orderInfo = await orderService.getOrderById(email, orderId);
        if (orderInfo instanceof BizResultCode) {
            res.send(BizResult.fail(orderInfo));
            return;
        }

        // valid used space
        var usedSpace = orderInfo.used_space;
        var totalSpace = orderInfo.total_space;
        if (usedSpace + parseInt(fileSize) > totalSpace) {
            logger.error("used space is over, orderId:{}, usedSpace:{}, fileSize:{} totalSpace:{}", orderId, usedSpace, fileSize, totalSpace);
            res.send(BizResult.fail(BizResultCode.ORDER_REMAINING_SPACE_NOT_ENOUGH));
            return;
        }
        var peerId = orderInfo.peer_id;
        var rpc = orderInfo.rpc;
        var foggieId = orderInfo.foggie_id;

        // valid the same as file
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
            Id: foggieId,
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
     * get code book
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getCodebook(req, res) {
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
     * complete upload file
     * 
     * @param {*} req HTTP request
     * @param {*} res HTTP response
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

        // token
        var token = await userService.getToken4UploadFile(email, orderId);
        if (token instanceof BizResultCode) {
            res.send(BizResult.fail(token));
            return;
        }

        // peerId
        var orderInfo = await orderService.getOrderById(email, orderId);
        if (orderInfo instanceof BizResultCode) {
            res.send(BizResult.fail(orderInfo));
            return;
        }
        var peerId = orderInfo.peer_id;
        var rpc = orderInfo.rpc;
        var foggieId = orderInfo.foggie_id;

        // According to the upload record of the file, reread the file once
        var fileUploadRecordRes = await fileService.getFileUploadRecord(orderId, email, md5);

        if (fileUploadRecordRes instanceof BizResultCode) {
            res.send(BizResult.fail(fileUploadRecordRes));
            return;
        }

        var powClient = fileService.getPowGrpcClient();
        var merkleStream = powClient.BuildMerkelLeaf(async function (err, data) {
            if (err) {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.BUILD_MERKLE_FAILED));
                return;
            }
            logger.info('generate merkle success, orderId{}, data:', data);
            // Update cid after generating merkle tree
            var updateCodebookRes = await fileService.updateFileCodeBook(orderId, email, md5, data.cid)

            if (updateCodebookRes instanceof BizResultCode) {
                res.send(BizResult.fail(updateCodebookRes));
                return;
            }

            // Generate Merkle Tree and Submit
            const header = {
                peerId: peerId,
                Id: foggieId,
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

                logger.info('complete upload success, orderId{}, data:', data2);

                res.send(BizResult.success(data2.cid));
            });
        });
        const mkHeader = {
            peerId: peerId,
            Id: foggieId
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

async function smallFileUpload(fileName, md5, fileSize, fileType, orderFromDB, header, res, fileCategory, orderId, email, peerId, file, foggieId) {

    // valid used space
    var usedSpace = orderFromDB.used_space;
    var totalSpace = orderFromDB.total_space;
    if (usedSpace + parseInt(fileSize) > totalSpace) {
        logger.error("used space is over, orderId:{}, usedSpace:{}, fileSize:{} totalSpace:{}", orderId, usedSpace, fileSize, totalSpace);
        res.send(BizResult.fail(BizResultCode.ORDER_REMAINING_SPACE_NOT_ENOUGH));
        return;
    }

    var rpc = orderFromDB.rpc;
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
        // After successful upload, save the file upload record. 
        // The small file does not have shards, so partNum is 0
        fileService.saveFileUploadRecord(orderId, email, file.path, md5, 0)
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
            Id: foggieId
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

        for (const offset of offsetArray) {
            fs.readSync(fd, merkleBuffer, 0, merkleBufferSize, offset);
            var hashVaule = crypto.createHash('md5').update(merkleBuffer).digest('hex');
            var compressedData = zlib.gzipSync(merkleBuffer);
            var base64data = Buffer.from(compressedData).toString('base64');
            fileService.saveFileCodeBook(orderId, email, md5, fileSize, data.cid, offset / merkleBufferSize, base64data, hashVaule);
        }
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
