const logger = require('./logger')('OrderService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const config = require('config');
const pow_proto = require('./grpc/pow');
const grpc = require('@grpc/grpc-js');
const _ = require('lodash');
const Joi = require('joi');
const common = require('./common');
const path = require('path');
const request = require('sync-request');
const { log } = require('console');
const dbConfig = config.get('dbConfig');
const pushMerkleRecordTableName = dbConfig.get('pushMerkleRecordTableName');
const pushMerkleRecordDB = new NeDB({
    filename: common.getHomePath() + path.sep + pushMerkleRecordTableName,
    autoload: true,
})

const challengeRecordTableName = dbConfig.get('challengeRecordTableName');
const challengeRecordDB = new NeDB({
    filename: common.getHomePath() + path.sep + challengeRecordTableName,
    autoload: true,
})


const orderTableName = dbConfig.get('orderTableName');
const orderDB = new NeDB({
    filename: common.getHomePath() + path.sep + orderTableName,
    autoload: true,
})

module.exports = {
    savePuskMerkleRecord: async (orderId, email, merkleRoot, blockNum, transactionId, chainBlockNum) => {
        // save push merkle record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            pushMerkleRecordDB.insert({
                order_id: orderId,
                email: email,
                merkle_root: merkleRoot,
                block_num: blockNum,
                transaction_id: transactionId,
                chain_block_num: chainBlockNum,
                update_time: currentTime,
                create_time: currentTime
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.SAVE_PUSH_MERKLE_RECORD_FAILED);
                    return;
                }
                resolve(doc._id);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.SAVE_PUSH_MERKLE_RECORD_FAILED;
        });
    },
    getPuskMerkleRecord: async (orderId, email, skip, limit) => {

        return new Promise((resolve, reject) => {
            // query push merkle record from NeDB
            pushMerkleRecordDB.find({
                order_id: orderId,
                email: email
            }).skip(skip).limit(limit).sort({ create_time: -1 }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_PUSH_MERKLE_RECORD_FAILED);
                    return;
                }
                resolve(data);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_PUSH_MERKLE_RECORD_FAILED;
        });
    },
    getPuskMerkleRecordCount: async (orderId, email) => {

        return new Promise((resolve, reject) => {
            // query push merkle record count from NeDB
            pushMerkleRecordDB.find({
                order_id: orderId,
                email: email
            }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_PUSH_MERKLE_RECORD_FAILED);
                    return;
                }
                resolve(data.length);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_PUSH_MERKLE_RECORD_FAILED;
        });
    },
    saveChallengeRecord: async (orderId, email, username, cid, partId, dataHash, nonce, transactionId, blockNum) => {

        // save chanllenge record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            challengeRecordDB.insert({
                order_id: orderId,
                email: email,
                username: username,
                cid: cid,
                part_id: partId,
                data_hash: dataHash,
                nonce: nonce,
                state: 3,
                transaction_id: transactionId,
                block_num: blockNum,
                update_time: currentTime,
                create_time: currentTime
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.SAVE_CHANLLLENGE_RECORD_FAILED);
                    return;
                }
                resolve(doc._id);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.SAVE_CHANLLLENGE_RECORD_FAILED;
        });
    },
    getChallengeFromDB: async (state, orderId, email) => {

        // save chanllenge record into NeDB
        return new Promise((resolve, reject) => {
            challengeRecordDB.find({
                state: state,
                order_id: orderId,
                email: email
            }).sort({create_time: -1}).exec(function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_CHANLLENGE_RECORD_FAILED);
                    return;
                }
                if(doc == null || doc.length == 0){
                    logger.error("getChallengeFromDB doc is null, state:{}, orderId:{}, email:{}", state, orderId, email);
                    resolve(BizResultCode.GET_CHANLLENGE_RECORD_FAILED);
                    return;
                }
                resolve(doc);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.GET_CHANLLENGE_RECORD_FAILED;
        });
    },
    getChallengeAllFromDB: async (orderId, email) => {

        // save chanllenge record into NeDB
        return new Promise((resolve, reject) => {
            challengeRecordDB.find({
                order_id: orderId,
                email: email
            }).sort({create_time: -1}).exec(function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_CHANLLENGE_RECORD_FAILED);
                    return;
                }
                if(doc == null || doc.length == 0){
                    logger.error("getChallengeFromDB doc is null, orderId:{}, email:{}", orderId, email);
                    resolve(BizResultCode.GET_CHANLLENGE_RECORD_FAILED);
                    return;
                }
                resolve(doc);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.GET_CHANLLENGE_RECORD_FAILED;
        });
    },
    getChallengeExpire: async (orderId, email) => {
        var challengeListFromChain = module.exports.getChallengeByState(orderId, [3,4,5,6,7]);
        if(challengeListFromChain instanceof BizResultCode){
            logger.info("getChallengeByState failed, orderId:{}", orderId);
            return false;
        }
        if(challengeListFromChain.length == 0){
            logger.info("getChallengeByState challengeList is null, orderId:{}", orderId);
            return false;
        }

        var challengeList = await module.exports.getChallengeFromDB(3, orderId, email);
        if (challengeList instanceof BizResultCode) {
            logger.info("get challenge from db failed, orderId:{}", orderId);
            return false;
        }

        var challenge = challengeList[0];
        // db and chain both have challenge, update challenge state by chain data
        var challengeState = challengeListFromChain[0].state;
        if(challengeState !=3){
            module.exports.updateChallenge(challenge._id, challengeState);
            return false;
        }
        else{
            var challengeTime = challenge.create_time;
            var period = new Date().getTime() - new Date(challengeTime).getTime();
            var challengeConfig = config.get("challengeConfig");
            var payChallengeTimeout = challengeConfig.get("payChallengeTimeout");
            if (period < payChallengeTimeout) {
                logger.info("challenge is not timeout, orderId:{}", orderId);
                return false;
            }
            return true;
        }
    },
    updateChallenge: async (id, state) => {

        // save chanllenge record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            challengeRecordDB.update({
                _id: id
            }, {
                $set: {
                    state: state,
                    update_time: currentTime,
                }
            }, {}, function (err, num) {
                if (err) {
                    logger.error("err:" , err);
                    resolve(BizResultCode.UPDATE_CHANLLENGE_RECORD_FAILED);
                    return;
                }
                if (num.length == 0) {
                    resolve(BizResultCode.UPDATE_CHANLLENGE_RECORD_FAILED);
                    return;
                }
                resolve(num);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.UPDATE_CHANLLENGE_RECORD_FAILED;
        });
    },
    payChallenge4Timer: async (chanllenge, dmc_client) => {

        var username = chanllenge.username;
        var orderId = chanllenge.order_id;

        var challengeCount = await module.exports.getChallengeCountByState(orderId, [3]);
        if (challengeCount instanceof BizResultCode) {
            logger.info("get challenge count failed, orderId:{}", orderId);
            return;
        }
        if(challengeCount == 0){
            logger.info("not exist no response challenge, orderId:{}", orderId);
            // update challenge record state 
            await module.exports.updateChallenge(chanllenge._id, 8);
            return;
        }

        return new Promise((resolve, reject) => {

            dmc_client.transact({
                actions: [{
                    account: "dmc.token",
                    name: 'paychallenge',
                    authorization: [
                        {
                            actor: username,
                            permission: 'active'
                        }
                    ],
                    data: {
                        sender: username,
                        order_id: parseInt(orderId)
                    }
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then(async (res) => {
                logger.info("pay challenge is success, orderId:{}", orderId);
                // update challenge record
                var updateRes = await module.exports.updateChallenge(chanllenge._id, 7);
                if (updateRes instanceof BizResultCode) {
                    resolve(updateRes);
                    return;
                }
                resolve(res.transaction_id);

            }).catch((err) => {
                logger.error('err:', err);
                resolve(BizResultCode.PAY_CHALLENGE_FAILED);
            })
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.PAY_CHALLENGE_FAILED;
        });
    },
    payChallenge: async (chanllenge, dmc_client) => {

        var username = chanllenge.username;
        var orderId = chanllenge.order_id;

        return new Promise((resolve, reject) => {

            dmc_client.transact({
                actions: [{
                    account: "dmc.token",
                    name: 'paychallenge',
                    authorization: [
                        {
                            actor: username,
                            permission: 'active'
                        }
                    ],
                    data: {
                        sender: username,
                        order_id: parseInt(orderId)
                    }
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then(async (res) => {
                logger.info("pay challenge is success, orderId:{}", orderId);
                // update challenge record
                var updateRes = await module.exports.updateChallenge(chanllenge._id, 7);
                if (updateRes instanceof BizResultCode) {
                    resolve(updateRes);
                    return;
                }
                resolve(res.transaction_id);

            }).catch((err) => {
                logger.error('err:', err);
                resolve(BizResultCode.PAY_CHALLENGE_FAILED);
            })
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.PAY_CHALLENGE_FAILED;
        });
    },
    getChallengeRecord: (orderId, skip, limit) => {

        try {
            var chainConfig = config.get('chainConfig');
            var transactionAddress = chainConfig.get('transactionAddress');
            var getChallengeList = chainConfig.get('getChallengeList');

            let body = '{\n' +
                '        find_challenge(\n' +
                '                skip: ' + skip + ',\n' +
                '                limit: ' + limit + ',\n' +
                '                where: {\n' +
                '                    order_id: ' + orderId + ',\n' +
                '                },\n' +
                '                order: "-id",\n' +
                '        ){\n' +
                '            pre_merkle_root\n' +
                '            pre_data_block_count\n' +
                '            merkle_root\n' +
                '            data_block_count\n' +
                '            merkle_submitter\n' +
                '            data_id\n' +
                '            hash_data\n' +
                '            challenge_times\n' +
                '            nonce\n' +
                '            state\n' +
                '            user_lock_amount\n' +
                '            miner_pay_amount\n' +
                '            challenge_date\n' +
                '            created_time\n' +
                '            order {\n' +
                '                id\n' +
                '            }\n' +
                '            challenger {\n' +
                '                id\n' +
                '            }\n' +
                '        }\n' +
                '    }'
            return JSON.parse(request('POST', transactionAddress + getChallengeList, {
                headers: {
                    'Content-Type': 'application/graphql'
                },
                body: body
            }).getBody('utf-8')).data.find_challenge;
        }
        catch (err) {
            logger.error('err:', err);
            return BizResultCode.GET_CHANLLENGE_RECORD_FAILED;
        }
    },
    getChallengeCount: (orderId) => {

        try {
            var chainConfig = config.get('chainConfig');
            var transactionAddress = chainConfig.get('transactionAddress');
            var getChallengeList = chainConfig.get('getChallengeList');

            let body = '{\n' +
                '        count_challenge(\n' +
                '                where: {\n' +
                '                    order_id: ' + orderId + ',\n' +
                '                },\n' +
                '        )\n' +
                '    }'
            return JSON.parse(request('POST', transactionAddress + getChallengeList, {
                headers: {
                    'Content-Type': 'application/graphql'
                },
                body: body
            }).getBody('utf-8')).data.count_challenge;
        }
        catch (err) {
            logger.error('err:', err);
            return BizResultCode.GET_CHANLLENGE_RECORD_FAILED;
        }
    },
    getOrderFromChain: (orderId) => {
        var chainConfig = config.get('chainConfig')
        var transactionAddress = chainConfig.get('transactionAddress')
        var getOrders = chainConfig.get('getOrders')
        try {
            let body = '{\n' +
                '        find_order(\n' +
                '                where: {\n' +
                '                    id: "' + orderId + '",\n' +
                '                },\n' +
                '                order: "-created_time,id",\n' +
                '        ){\n' +
                '            id\n' +
                '            user {\n' +
                '                id\n' +
                '            }\n' +
                '            miner {\n' +
                '                id\n' +
                '            }\n' +
                '            bill {\n' +
                '                id\n' +
                '            }\n' +
                '            created_time\n' +
                '            epoch\n' +
                '            user_pledge_amount\n' +
                '            miner_lock_pst_amount\n' +
                '            miner_lock_dmc_amount\n' +
                '            price_amount\n' +
                '            settlement_pledge_amount\n' +
                '            lock_pledge_amount\n' +
                '            state\n' +
                '            deliver_start_date\n' +
                '            latest_settlement_date\n' +
                '            miner_lock_rsi_amount\n' +
                '            miner_rsi_amount\n' +
                '            user_rsi_amount\n' +
                '            deposit_amount\n' +
                '            deposit_valid\n' +
                '            cancel_date\n' +
                '            createdAt\n' +
                '        }\n' +
                '    }'
            let order = JSON.parse(request('POST', transactionAddress + getOrders, {
                headers: {
                    'Content-Type': 'application/graphql'
                },
                body: body
            }).getBody('utf-8')).data.find_order;

            if (order.length == 0) {
                return BizResultCode.GET_ORDER_FROM_CHAIN_FAILED;
            }
            return order;
        }
        catch (err) {
            logger.error('err:', err);
            return BizResultCode.GET_ORDER_FROM_CHAIN_FAILED;
        }
    },
    getChallengeCountByState: (orderId, state) => {
        var schema = Joi.array().items(Joi.number());
        var result = schema.validate(state)
        if (result.error) {
            logger.error(result.error);
            return BizResultCode.VALIDATE_FAILED;
        }

        var stateCondition = state.join(',');

        try {
            var chainConfig = config.get('chainConfig');
            var transactionAddress = chainConfig.get('transactionAddress');
            var getChallengeList = chainConfig.get('getChallengeList');

            let body = '{\n' +
                '        count_challenge(\n' +
                '                where: {\n' +
                '                    order_id: ' + orderId + ',\n' +
                '                    state: [' + stateCondition + '],\n' +
                '                },\n' +
                '        )\n' +
                '    }'
            return JSON.parse(request('POST', transactionAddress + getChallengeList, {
                headers: {
                    'Content-Type': 'application/graphql'
                },
                body: body
            }).getBody('utf-8')).data.count_challenge;
        }
        catch (err) {
            logger.error('err:', err);
            return BizResultCode.GET_CHANLLENGE_RECORD_FAILED;
        }
    },
    getChallengeByState: (orderId, state) => {

        var schema = Joi.array().items(Joi.number());
        var result = schema.validate(state)
        if (result.error) {
            logger.error(result.error);
            return BizResultCode.VALIDATE_FAILED;
        }

        var stateCondition = state.join(',');
        try {
            var chainConfig = config.get('chainConfig');
            var transactionAddress = chainConfig.get('transactionAddress');
            var getChallengeList = chainConfig.get('getChallengeList');

            let body = '{\n' +
                '        find_challenge(\n' +
                '                where: {\n' +
                '                    order_id: ' + orderId + ',\n' +
                '                    state: [' + stateCondition + '],\n' +
                '                },\n' +
                '                order: "-id",\n' +
                '        ){\n' +
                '            pre_merkle_root\n' +
                '            pre_data_block_count\n' +
                '            merkle_root\n' +
                '            data_block_count\n' +
                '            merkle_submitter\n' +
                '            data_id\n' +
                '            hash_data\n' +
                '            challenge_times\n' +
                '            nonce\n' +
                '            state\n' +
                '            user_lock_amount\n' +
                '            miner_pay_amount\n' +
                '            challenge_date\n' +
                '            created_time\n' +
                '            order {\n' +
                '                id\n' +
                '            }\n' +
                '            challenger {\n' +
                '                id\n' +
                '            }\n' +
                '        }\n' +
                '    }'
            return JSON.parse(request('POST', transactionAddress + getChallengeList, {
                headers: {
                    'Content-Type': 'application/graphql'
                },
                body: body
            }).getBody('utf-8')).data.find_challenge;
        }
        catch (err) {
            logger.error('err:', err);
            return BizResultCode.GET_CHANLLENGE_RECORD_FAILED;
        }
    },
    saveOrder: async (email, orderId, miner, user, billId, pst, totalPrice, transactionId, blockNum) => {
        // save buy order record into NeDB
        return new Promise((resolve, reject) => {

            orderDB.findOne({
                email: email,
                order_id: orderId,
                bill_id: billId
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.SAVE_ORDER_FAILED);
                    return;
                }
                var now = moment();
                var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
                if (doc) {
                    orderDB.update({
                        email: email,
                        order_id: orderId,
                        bill_id: billId
                    }, {
                        $set: {
                            miner: miner,
                            user: user,
                            pst: pst,
                            peer_id: '',
                            rpc: '',
                            used_space: '',
                            total_space: '',
                            expire: '',
                            foggie_id: '',
                            total_price: totalPrice,
                            transaction_id: transactionId,
                            block_num: blockNum,
                            update_time: currentTime,
                        }
                    }, {}, function (err, num) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(BizResultCode.UPDTAE_ORDER_FAILED);
                        }
                        resolve(doc._id);
                    });
                }
                else {
                    orderDB.insert({
                        email: email,
                        order_id: orderId,
                        miner: miner,
                        user: user,
                        bill_id: billId,
                        pst: pst,
                        peer_id: '',
                        rpc: '',
                        used_space: '',
                        total_space: '',
                        expire: '',
                        foggie_id: '',
                        total_price: totalPrice,
                        transaction_id: transactionId,
                        block_num: blockNum,
                        update_time: currentTime,
                        create_time: currentTime
                    }, function (err, doc) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(BizResultCode.SAVE_ORDER_FAILED);
                            return;
                        }
                        resolve(doc._id);
                    });
                }
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.SAVE_ORDER_FAILED;
        });
    },
    saveDevice2Order: async (email, orderId) => {
        // save device info into NeDB order table
        // this orderID is unique device id
        var deviceUniqueId = orderId;
        return new Promise((resolve, reject) => {

            orderDB.findOne({
                email: email,
                order_id: deviceUniqueId
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.SAVE_ORDER_FAILED);
                    return;
                }
                var now = moment();
                var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
                if (!doc) {
                    // get peerId，rpc，foggieId, foggieToken
                    var registerCenterConfig = config.get('registerCenterConfig');
                    var registerCenterUrl = registerCenterConfig.get('url');
                    var getFoggieInfo = registerCenterConfig.get('getFoggieInfo');
                    var getFoggie = request('GET', registerCenterUrl + getFoggieInfo + '?device_id=' + deviceUniqueId)
                    var foggieTypeRes = JSON.parse(getFoggie.getBody('utf-8'));
                    var peerId = foggieTypeRes.data.peer_id;
                    var rpc = foggieTypeRes.data.rpc;
                    var foggieId = foggieTypeRes.data.foggie_id;
                    var foggieToken = foggieTypeRes.data.foggie_token;

                    orderDB.insert({
                        email: email,
                        order_id: deviceUniqueId,
                        miner: '',
                        user: '',
                        bill_id: '',
                        pst: '',
                        peer_id: peerId,
                        rpc: rpc,
                        used_space: '',
                        total_space: '',
                        expire: '',
                        total_price: '',
                        transaction_id: '',
                        block_num: '',
                        foggie_id: foggieId,
                        foggie_token: foggieToken,
                        update_time: currentTime,
                        create_time: currentTime
                    }, function (err, doc) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(BizResultCode.SAVE_ORDER_FAILED);
                            return;
                        }
                        logger.info("save device to order, deviceUniqueId:{}, peerId:{}, rpc:{}, foggieId:{}, foggieToken:{}", deviceUniqueId, peerId, rpc, foggieId, foggieToken);
                        resolve(doc._id);
                    });
                }
                else {
                    resolve(doc._id);
                }
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.SAVE_ORDER_FAILED;
        });
    },
    updateOrder: async (email, orderId, billId, peerId, rpc, usedSpace, totalSpace, expire, foggieId) => {
        // update buy order record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            orderDB.update({
                email: email,
                order_id: orderId,
                bill_id: billId,
            }, {
                $set: {
                    peer_id: peerId,
                    rpc: rpc,
                    used_space: usedSpace,
                    total_space: totalSpace,
                    expire: expire,
                    foggie_id: foggieId,
                    update_time: currentTime
                }
            }, {}, function (err, num) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.UPDTAE_ORDER_FAILED);
                    return;
                }
                logger.info("update order success, usedSpace:{}, totalSpace:{}, expire:{}", usedSpace, totalSpace, expire);
                resolve(num);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.UPDTAE_ORDER_FAILED;
        });
    },
    updateOrderUsedSpace: async (email, orderId, usedSpace) => {
        // update buy order record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            orderDB.update({
                email: email,
                order_id: orderId,
            }, {
                $set: {
                    update_time: currentTime
                },
                $inc: {
                    used_space: usedSpace
                }
            }, {}, function (err, num) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.UPDTAE_ORDER_FAILED);
                    return;
                }
                resolve(num);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.UPDTAE_ORDER_FAILED;
        });
    },
    getPowGrpcClient: () => {
        var grpcConfig = config.get('grpcConfig');
        var ip = grpcConfig.get("ip");
        var port = grpcConfig.get("port");
        return new pow_proto.PowService(ip + ':' + port, grpc.credentials.createInsecure());
    },
    syncOrder2RegisterCenter: async (email, orderId, billId, totalSpace, usedSpace, transactionId) => {
        // foggieID
        async function getFoggieId(orderId) {
            const getIDRequest = {
                id: orderId,
                tid: 3,
                typ: 0x20
            };

            return new Promise((resolve, reject) => {
                var powClient = module.exports.getPowGrpcClient();
                powClient.GetID(getIDRequest, function (err, data) {
                    if (err) {
                        logger.error('err:', err);
                        resolve(BizResultCode.GET_FOGGIE_ID_FAILED);
                        return;
                    }
                    logger.info("get foggie id success, foggieId:{}", data.fogId);
                    resolve(data.fogId);
                });
            })
                .catch((err) => {
                    logger.error('err:', err);
                    return BizResultCode.GET_FOGGIE_ID_FAILED;
                });
        }

        try {

            var foggieId = await getFoggieId(orderId);
            if (foggieId instanceof BizResultCode) {
                logger.error('foggieId is null, orderId:{}', orderId);
                return foggieId;
            }

            var bill = module.exports.getBillById(billId);
            if (bill instanceof BizResultCode) {
                logger.error('bill is null, orderId:{}', orderId);
                return bill;
            }
            // get bill transaction_id
            var transactionId = bill[0].action[0].trx_id;
            if (!transactionId) {
                logger.error('transactionId is null, orderId:{}', orderId);
                return BizResultCode.GET_TRANSACTION_ID_FAILED;
            }
            logger.info("get transactionId success, transactionId:{}", transactionId);
            var expire = bill[0].expire_on;
            if (!expire) {
                logger.error('expire is null, orderId:{}', orderId);
                return BizResultCode.GET_EXPIRE_FAILED;
            }
            // get bill info by transaction_id
            var transaction = module.exports.getTransactionById(transactionId);
            if (transaction instanceof BizResultCode) {
                logger.error('transaction is null, orderId:{}', orderId);
                return transaction;
            }
            // get memo by transaction
            var memo = await module.exports.getMemoByRawData(transaction[0].rawData);
            if (memo instanceof BizResultCode) {
                logger.error('memo is null, orderId:{}', orderId);
                return memo;
            }
            var memoArr = memo.split('$');
            var peerId = memoArr[1];
            if (!peerId) {
                logger.error('peerId is null, orderId:{},memo:{}', orderId, memo);
                return BizResultCode.GET_PEER_ID_FAILED;
            }
            var rpc = memoArr[0];
            if (!rpc) {
                logger.error('rpc is null, orderId:{}', orderId);
                return BizResultCode.GET_RPC_FAILED;
            }
            // sync order to register center
            var registerCenterConfig = config.get('registerCenterConfig');
            var registerCenterUrl = registerCenterConfig.get('url');
            var syncOrder = registerCenterConfig.get('syncOrder');
            var expire = new Date(expire).toISOString();
            var orderInfo = await module.exports.getOrderById(email, orderId);
            if (orderInfo instanceof BizResultCode) {
                logger.error('orderInfo is null, orderId:{}', orderId);
                return orderInfo;
            }
            let body = {};
            body['email'] = email;
            body['bill_id'] = billId;
            body['order_id'] = orderId;
            body['transaction_id'] = transactionId;
            body['peer_id'] = peerId;
            body['rpc'] = rpc;
            body['total_space'] = totalSpace;
            body['used_space'] = usedSpace;
            body['expire'] = expire;
            body['foggie_id'] = foggieId;
            body['space_created_time'] = new Date(orderInfo.create_time).getTime();
            let result = JSON.parse(request('POST', registerCenterUrl + syncOrder, {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).getBody('utf-8'))
            if (result.code == 200) {
                // sync success，update peer_id and rpc in order
                logger.info('sync order to register center success, orderId:{}', orderId);
                var updateBuyOrderRes = await module.exports.updateOrder(email, orderId, billId, peerId, rpc, usedSpace, totalSpace, expire, foggieId);
                if (updateBuyOrderRes instanceof BizResultCode) {
                    return updateBuyOrderRes;
                }
                return orderId;
            }
            return BizResultCode.SYNC_ORDER_2_REGISTER_CENTER_FAILED;
        }
        catch (e) {
            logger.error('err:', e);
            return BizResultCode.SYNC_ORDER_2_REGISTER_CENTER_FAILED;
        }
    },
    getOrder: async (email, skip, limit) => {

        return new Promise((resolve, reject) => {
            // query buy order record from NeDB
            orderDB.find({
                email: email
            }).skip(skip).limit(limit).sort({ create_time: -1 }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_ORDER_FAILED);
                    return;
                }
                resolve(data);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_ORDER_FAILED;
        });
    },
    getOrdersFromDB: async (email) => {

        return new Promise((resolve, reject) => {
            // query buy order record from NeDB
            orderDB.find({
                email: email
            }, function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_ORDER_FAILED);
                    return;
                }
                resolve(data);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_ORDER_FAILED;
        });
    },
    getOrderById: async (email, orderId) => {

        return new Promise((resolve, reject) => {
            // query buy order record from NeDB
            orderDB.findOne({
                email: email,
                order_id: orderId
            }, function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_ORDER_FAILED);
                    return;
                }
                if (!data) {
                    resolve(BizResultCode.ORDER_NOT_EXIST);
                    return;
                }
                resolve(data);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_ORDER_FAILED;
        });
    },
    getEmailByOrderId: async (orderId) => {
        return new Promise((resolve, reject) => {
            // query buy order record from NeDB
            orderDB.findOne({
                order_id: orderId
            }, function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_ORDER_FAILED);
                    return;
                }
                if (!data) {
                    resolve(BizResultCode.ORDER_NOT_EXIST);
                    return;
                }
                resolve(data.email);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_ORDER_FAILED;
        });
    },
    getOrderByBillId: async (email, billId) => {
        return new Promise((resolve, reject) => {
            orderDB.findOne({
                email: email,
                bill_id: billId
            }, function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_ORDER_FAILED);
                    return;
                }
                if (!data) {
                    resolve(BizResultCode.ORDER_NOT_EXIST);
                    return;
                }
                resolve(data);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_ORDER_FAILED;
        });
    },
    getOrderCount: async (email) => {

        return new Promise((resolve, reject) => {
            // query buy order record count from NeDB
            orderDB.find({
                email: email
            }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_ORDER_FAILED);
                    return;
                }
                resolve(data.length);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_ORDER_FAILED;
        });
    },
    getBillById: (billId) => {
        try {
            var chainConfig = config.get('chainConfig');
            var transactionAddress = chainConfig.get('transactionAddress');
            var getBill = chainConfig.get('getBill');

            let body = '{\n' +
                '        find_bill(\n' +
                '                order: "-created_time",\n' +
                '                where: {\n' +
                '                    id:  "' + billId + '"\n' +
                '                },\n' +
                '        ){\n' +
                '            owner\n' +
                '            state\n' +
                '            created_time\n' +
                '            unmatched_amount\n' +
                '            matched_amount\n' +
                '            id\n' +
                '            action (\n' +
                '                where: {\n' +
                '                },\n' +
                '            ){\n' +
                '            trx_id\n' +
                '            }\n' +
                '            price\n' +
                '            createdAt\n' +
                '            expire_on\n' +
                '            deposit_ratio\n' +
                '            maker {\n' +
                '                benchmark_stake_rate\n' +
                '            }\n' +
                '        }\n' +
                '    }'
            return JSON.parse(request('POST', transactionAddress + getBill, {
                headers: {
                    'Content-Type': 'application/graphql'
                },
                body: body
            }).getBody('utf-8')).data.find_bill
        }
        catch (e) {
            logger.error('err:', e);
            return BizResultCode.QUERY_BILL_FAILED;
        }
    },
    getTransactionById: (transactionId) => {
        try {
            var chainConfig = config.get('chainConfig');
            var transactionAddress = chainConfig.get('transactionAddress');
            var getTransaction = chainConfig.get('getTransaction');

            let body = '{\n' +
                '        find_fibos_transactions(\n' +
                '                order: "-createdAt"\n' +
                '                where: {\n' +
                '                    and:[\n' +
                '                     {trx_id: "' + transactionId + '"},\n' +
                '                     { and: [ { contract_action: { ne: "dmc/onblock" } } ] } \n' +
                '                   ]\n' +
                '                },\n' +
                '        ){\n' +
                '            id\n' +
                '            rawData\n' +
                '        }\n' +
                '    }'
            let transactions = JSON.parse(request('POST', transactionAddress + getTransaction, {
                headers: {
                    'Content-Type': 'application/graphql'
                },
                body: body
            }).getBody('utf-8')).data
            return transactions.find_fibos_transactions;
        }
        catch (e) {
            logger.error('err:', e);
            return BizResultCode.GET_TRANSACTION_FAILED;
        }
    },
    getOrderBasicByBuyRes: async (buyRes) => {
        var actionTraces = buyRes.processed.action_traces;
        var actionTrace = actionTraces[actionTraces.length - 1];
        var inlineTraces = actionTrace.inline_traces;
        return new Promise((resolve, reject) => {
            inlineTraces.forEach((item) => {
                var orderInfo = _.get(item, 'act.data.order_info');
                var basicInfo = {};
                if (orderInfo !== undefined) {
                    basicInfo['orderId'] = orderInfo.order_id.toString();
                    basicInfo['user'] = orderInfo.user;
                    basicInfo['miner'] = orderInfo.miner;
                    resolve(basicInfo);
                    return;
                }
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.GET_ORDER_BASIC_INFO_FAILED;
        });
    },
    getMemoByRawData: async (rawData) => {
        var actionTraces = rawData.action_traces;
        return new Promise((resolve, reject) => {
            actionTraces.forEach((item) => {
                var memo = _.get(item, 'act.data.memo');
                if (memo !== undefined) {
                    resolve(memo);
                    return;
                }
                resolve(BizResultCode.GET_BILL_MEMO_FAILED);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.GET_BILL_MEMO_FAILED;
        });
    },
    release: async (dmc_client, username, orderId, amount) => {
        var amount = amount + " DMC";
        // transfer dmc
        return new Promise((resolve, reject) => {
            dmc_client.transact({
                actions: [{
                    account: "dmc.token",
                    name: 'subordasset',
                    authorization: [
                        {
                            actor: username,
                            permission: 'active'
                        }
                    ],
                    data: {
                        sender: username,
                        order_id: orderId,
                        quantity: { quantity: amount, contract: "datamall" }
                    }
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then((res) => {
                resolve(res.transaction_id);
            }).catch((err) => {
                logger.error('err:', err);
                resolve(BizResultCode.RELEASE_FAILED);
            })
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.RELEASE_FAILED;
        });
    },
    append: async (dmc_client, username, orderId, amount) => {
        var amount = amount + " DMC";
        // transfer dmc
        return new Promise((resolve, reject) => {
            dmc_client.transact({
                actions: [{
                    account: "dmc.token",
                    name: 'addordasset',
                    authorization: [
                        {
                            actor: username,
                            permission: 'active'
                        }
                    ],
                    data: {
                        sender: username,
                        order_id: orderId,
                        quantity: { quantity: amount, contract: "datamall" }
                    }
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then((res) => {
                resolve(res.transaction_id);
            }).catch((err) => {
                logger.error('err:', err);
                resolve(BizResultCode.APPEND_FAILED);
            })
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.APPEND_FAILED;
        });
    },
    cancel: async (dmc_client, username, orderId) => {
        // transfer dmc
        return new Promise((resolve, reject) => {
            dmc_client.transact({
                actions: [{
                    account: "dmc.token",
                    name: 'cancelorder',
                    authorization: [
                        {
                            actor: username,
                            permission: 'active'
                        }
                    ],
                    data: {
                        sender: username,
                        order_id: orderId,
                    }
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then((res) => {
                resolve(res.transaction_id);
            }).catch((err) => {
                logger.error('err:', err);
                resolve(BizResultCode.CANCEL_FAILED);
            })
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.CANCEL_FAILED;
        });
    },
    getPartIdByCidAndPartId: async (orderId, cid, partId) => {

        var merkleIDRequest = {
            id: orderId,
            cid: cid,
            idx: partId
        }
        return new Promise((resolve, reject) => {
            var powClient = module.exports.getPowGrpcClient();
            powClient.GetMerkleID(merkleIDRequest, function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_FILE_IDX_FAILED);
                    return;
                }
                logger.info("get idx in order space success, idx:{}", data.idx);
                resolve(data.idx);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.GET_FILE_IDX_FAILED;
        });
    },
    getChainId: () => {
        try{
            var chainConfig = config.get('chainConfig')
            var httpEndpoint = chainConfig.get('httpEndpoint')
            var getChainInfo = chainConfig.get('getChainInfo')
    
            return JSON.parse(request('POST', httpEndpoint + getChainInfo, {}).getBody('utf-8')).chain_id
        }
        catch(e){
            logger.error('err:', e);
            return BizResultCode.GET_CHAIN_ID_FAILED;
        }
    },
    getBenchmarkPrice: () => {
        try{
            var chainConfig = config.get('chainConfig')
            var httpEndpoint = chainConfig.get('httpEndpoint')
            var getTableRows = chainConfig.get('getTableRows')
            return JSON.parse(request('POST', httpEndpoint + getTableRows, {
                json: { "json": true, "code": "dmc.token", "scope": "dmc.token", "table": "bcprice" }
            }).getBody('utf-8')).rows[0].benchmark_price
        }
        catch(e){
            logger.error('err:', e);
            return BizResultCode.GET_BENCHMARK_PRICE_FAILED;
        }
    }
}