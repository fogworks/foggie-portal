const config = require('config');
const fs = require('fs');
const BizResult = require('./BizResult')
const BizResultCode = require('./BaseResultCode');
const logger = require('./logger')('FileController.js');
const net_proto = require('./grpc/net');
const pow_proto = require('./grpc/pow');
const grpc = require('@grpc/grpc-js');
const DMC = require('dmc.js');
const userService = require('./UserService');
const fileService = require('./FileService');
const zlib = require('zlib');
// 32 KB buffer size
const fileConfig = config.get('fileConfig');
const bufferSize = fileConfig.get('bufferSize');
const buffer = Buffer.alloc(bufferSize);
const crypto = require('crypto');

class FileController {

    /**
     * 存储文件属性，包含 订单id，文件路径，用户名
     * @param {*} orderId   订单id
     * @param {*} username      用户名
     * @param {*} filePath  文件的绝对路径
     * @param {*} fileSize  文件大小，单位：字节
     * @param {*} res       HTTP的response
     * @returns 
     */
    static async saveFileProp(orderId, username, filePath, fileSize, res) {

        if (!orderId || !username || !filePath || !fileSize) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }

        var resultData = await fileService.saveFileProp(orderId, username, filePath, fileSize);
        if (!resultData) {
            res.send(BizResult.fail(BizResultCode.SAVE_FILE_FAILED));
            return;
        }

        res.send(BizResult.success(resultData));
    }

    /**
     * 查询，包含 订单id，文件路径，用户名
     * @param {*} orderId       订单id
     * @param {*} username      用户名
     * @param {*} pageSize      每页条数
     * @param {*} pageNo        页数
     * @param {*} res HTTP的response
     * @returns 
     */
    static async list(orderId, username, pageSize, pageNo, res) {

        if (!orderId || !username) {
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

        var resultData = await fileService.queryFileList(orderId, username, skip, limit);
        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }

        var total = await fileService.queryFileCount(orderId, username);
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
    static upload(req, res) {

        // 上传文件的类别 1：小文件 2：大文件
        var fileCategory = req.body.fileCategory;
        var fileName = req.body.fileName;
        var md5 = req.body.md5;
        var fileType = req.body.fileType;
        var fileSize = req.body.fileSize;
        var orderId = req.body.orderId;
        var token = req.body.token;
        var peerId = req.body.peerId;
        var username = req.body.username;
        // 大文件新增的入参
        var partId = req.body.partId;
        var uploadId = req.body.uploadId;

        if (!fileCategory || !fileName || !md5 || !fileSize || !orderId || !token || !peerId) {
            res.send(BizResult.validateFailed());
            return;
        }
        const header = {
            peerId: peerId,
            Id: orderId,
            token: token
        };
        // 小文件上传
        if (parseInt(fileCategory) == 1) {
            if (!fileType) {
                res.send(BizResult.validateFailed());
                return;
            }
            var client = FileController.getNetGrpcClient();
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

            let stream = client.PutObject(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    res.send(BizResult.fail(BizResultCode.UPLOAD_FILE_FAILED));
                    return;
                }
                res.send(BizResult.success(data.cid));
            });

            stream.write({ req: putObjectReq });

            // 根据文件的大小，计算密码本的分片id 以及 分片的hash值
            var file = req.files.file;
            let rOffset = 0;
            // sharding read file
            fs.open(file.path, "r", function (err, rfd) {
                if (err) {
                    logger.error('err:', err);
                    res.send(BizResult.fail(BizResultCode.OPEN_FILE_FAILED));
                    return;
                }
                next(rOffset);
                function next(rOffset) {
                    fs.read(rfd, buffer, 0, bufferSize, rOffset, function (err, bytesRead, buffer) {
                        if (err) {
                            logger.error('err:', err);
                            res.send(BizResult.fail(BizResultCode.READ_FILE_FAILED));
                            return;
                        }
                        // 如果全部读取完毕，则关闭当前 读写操作
                        if (bytesRead == 0) {
                            fs.close(rfd);
                            stream.end();
                            return;
                        }

                        var transferData = buffer;
                        if(bytesRead < buffer.length){
                            transferData = Buffer.alloc(bytesRead);
                            transferData.fill(buffer);
                        }
                        stream.write({ chunk: transferData });

                        // 先记录第一个分片作为密码本
                        if (rOffset == 0) {
                            var hashVaule = crypto.createHash('md5').update(transferData).digest('hex');
                            var compressedData = zlib.gzipSync(transferData);
                            var base64data = Buffer.from(compressedData).toString('base64');
                            fileService.saveFileCodeBook(orderId, username, fileName, "cid", 1, base64data, hashVaule);
                        }
                        rOffset += bytesRead;
                        next(rOffset);
                    });
                }
            });
        }
        // 大文件上传
        else if (parseInt(fileCategory) == 2) {
            if (!partId || !uploadId) {
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

            var client = FileController.getNetGrpcClient();
            let stream = client.PutObjectPart(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    res.send(BizResult.fail(BizResultCode.UPLOAD_FILE_FAILED));
                    return;
                }
                res.send(BizResult.success(data.etag));
            });

            stream.write({ req: putObjectPartReq });
            var file = req.files.file;
            let rOffset = 0;
            // sharding read file
            fs.open(file.path, "r", function (err, rfd) {
                if (err) {
                    logger.error('err:', err);
                    res.send(BizResult.fail(BizResultCode.OPEN_FILE_FAILED));
                    return;
                }
                next(rOffset);
                function next(rOffset) {
                    fs.read(rfd, buffer, 0, bufferSize, rOffset, function (err, bytesRead, buffer) {
                        if (err) {
                            logger.error('err:', err);
                            res.send(BizResult.fail(BizResultCode.READ_FILE_FAILED));
                            return;
                        }
                        // 如果全部读取完毕，则关闭当前 读写操作
                        if (bytesRead == 0) {
                            fs.close(rfd);
                            stream.end();
                            return;
                        }

                        var transferData = buffer;
                        if(bytesRead < buffer.length){
                            transferData = Buffer.alloc(bytesRead);
                            transferData.fill(buffer);
                        }
                        stream.write({ chunk: transferData });

                        // 先记录第一个分片作为密码本
                        if (rOffset == 0) {
                            var hashVaule = crypto.createHash('md5').update(transferData).digest('hex');
                            var compressedData = zlib.gzipSync(transferData);
                            var base64data = Buffer.from(compressedData).toString('base64');
                            fileService.saveFileCodeBook(orderId, username, fileName, "cid", 1, base64data, hashVaule);
                        }
                        rOffset += bytesRead;
                        next(rOffset);
                    });
                }
            });
        }
        else {
            res.send(BizResult.fail(BizResultCode.NOT_SUPPORT_FILE_TYPE));
        }
    }

    /**
     * 创建文件
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
    static create(fileName, md5, fileType, fileSize, orderId, token, peerId, res) {
        if (!fileName || !fileType || !fileSize || !orderId || !token || !peerId) {
            res.send(BizResult.validateFailed());
            return;
        }
        var client = FileController.getNetGrpcClient();
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

        client.newMultipartObject(putObjectReq, function (err, data) {
            if (err) {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.CREATE_FILE_FAILED));
                return;
            }

            res.send(BizResult.success(data.uploadId));
        });
    }

    /**
     * 完成文件传输后的提交
     * 
     * @param {*} req HTTP的request
     * @param {*} res HTTP的response
     * @returns
     */
    static complete(req, res) {

        var fileName = req.body.fileName;
        var orderId = req.body.orderId;
        var token = req.body.token;
        var peerId = req.body.peerId;
        var parts = req.body.parts;
        var uploadId = req.body.uploadId;

        if (!fileName || !orderId || !token || !peerId || !parts || !uploadId) {
            res.send(BizResult.validateFailed());
            return;
        }
        const header = {
            peerId: peerId,
            Id: orderId,
            token: token
        };
        const partArr = parts;
        const completeUpload = {
            parts: partArr
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

        var client = FileController.getNetGrpcClient();
        client.CompleteMultipart(completeMultipartReq, function (err, data) {
            if (err) {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.COMPLETE_FILE_FAILED));
                return;
            }

            res.send(BizResult.success(data.cid));
        });
    }

    static getNetGrpcClient() {
        var grpcConfig = config.get('grpcConfig');
        var ip = grpcConfig.get("ip");
        var port = grpcConfig.get("port");
        return new net_proto.API(ip + ':' + port, grpc.credentials.createInsecure());
    }

    static getPowGrpcClient() {
        var grpcConfig = config.get('grpcConfig');
        var ip = grpcConfig.get("ip");
        var port = grpcConfig.get("port");
        return new pow_proto.PowService(ip + ':' + port, grpc.credentials.createInsecure());
    }

    /**
     * 上传merkle树
     * @param {*} req HTTP的request 
     * @param {*} res HTTP的response
     * @returns 
     */
    static async pushMerkle(req, res) {

        var chainId = req.body.chainId;
        var username = req.body.username;
        var orderId = req.body.orderId;
        var password = req.body.password;

        if (!chainId || !username || !orderId || !password) {
            res.send(BizResult.validateFailed());
            return;
        }

        var privateKey = await userService.getPrivateKeyByPassword(password);
        if (!privateKey) {
            logger.info('private key is null');
            res.send(BizResult.fail(BizResultCode.GET_PRIVATE_KEY_FAILED));
            return;
        }

        var chainConfig = config.get('chainConfig');
        var httpEndpoint = chainConfig.get("httpEndpoint");
        var dmcClient = DMC({
            chainId: chainId,
            keyProvider: privateKey,
            httpEndpoint: httpEndpoint,
            logger: {
                log: null,
                error: null
            }
        });

        const getMerkleRequest = {
            id: orderId
        };

        var powClient = FileController.getPowGrpcClient();
        powClient.GetMerkleRoot(getMerkleRequest, function (err, data) {
            if (err) {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.GET_MERKLE_FAILED));
                return;
            }
            var merkleRootBytes = data.root.rootBytes;
            var merkleRoot = Buffer.from(merkleRootBytes).toString('hex');
            var dataBlockCount = data.root.blocks;
            console.log('merkleRoot:', merkleRoot);
            console.log('dataBlockCount:', dataBlockCount);
            dmcClient.transact({
                actions: [{
                    account: "dmc.token",
                    name: 'addmerkle',
                    authorization: [
                        {
                            actor: username,
                            permission: 'active'
                        }
                    ],
                    data: {
                        sender: username,
                        order_id: orderId,
                        merkle_root: merkleRoot,
                        data_block_count: dataBlockCount
                    }
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then((result) => {
                res.send(BizResult.success(result.transaction_id));
            }).catch((err) => {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
            })
        });
    }

    /**
     * 发起挑战
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async reqChallenge(req, res) {
        var orderId = req.body.orderId;
        var username = req.body.username;
        var password = req.body.password;
        var chainId = req.body.chainId;
        var filePath = req.body.filePath;
        var cid = req.body.cid;

        if (!orderId || !username || !password || !chainId || !filePath || !cid) {
            res.send(BizResult.validateFailed());
            return;
        }

        var privateKey = await userService.getPrivateKeyByPassword(password);
        if (!privateKey) {
            logger.info('private key is null');
            res.send(BizResult.fail(BizResultCode.GET_PRIVATE_KEY_FAILED));
            return;
        }

        var chainConfig = config.get('chainConfig');
        var httpEndpoint = chainConfig.get("httpEndpoint");
        var dmc_client = DMC({
            chainId: chainId,
            keyProvider: privateKey,
            httpEndpoint: httpEndpoint,
            logger: {
                log: null,
                error: null
            }
        });

        var codebooks = await fileService.getFileCodeBook(orderId.toString(), username, filePath, cid);
        if (codebooks instanceof BizResultCode) {
            logger.info('codebooks is null');
            res.send(BizResult.fail(codebooks));
            return;
        }

        var codebook = codebooks[0];
        let data = zlib.unzipSync(Buffer.from(codebook.data, 'base64'));
        let nonce = codebook.cid;
        let pre_data_hash = DMC.ecc.sha256(data + nonce);
        let data_hash = Buffer.from(pre_data_hash).toString('hex');
    
        dmc_client.transact({
            actions: [{
                account: "dmc.token",
                name: 'reqchallenge',
                authorization: [
                    {
                        actor: username,
                        permission: 'active'
                    }
                ],
                data: {
                    sender: username,
                    order_id: orderId,
                    data_id: codebook.part_id,
                    hash_data: data_hash,
                    nonce: nonce
                }
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        }).then((res) => {
            res.send(BizResult.success());
        }).catch((err) => {
            logger.error('err:', err);
            res.send(BizResult.fail(BizResultCode.REQ_CHALLENGE_FAILED));
        })

    }
}

module.exports = FileController