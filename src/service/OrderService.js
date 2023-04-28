const logger = require('./logger')('OrderService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const config = require('config');
const _ = require('lodash');
const common = require('./common');
const path = require('path');
const request = require('sync-request');
const dbConfig = config.get('dbConfig');
const pushMerkleRecordTableName = dbConfig.get('pushMerkleRecordTableName');
const pushMerkleRecordDB = new NeDB({
    filename: common.getHomePath() + path.sep + pushMerkleRecordTableName,
    autoload: true,
})

const buyOrderRecordTableName = dbConfig.get('buyOrderRecordTableName');
const buyOrderRecordDB = new NeDB({
    filename: common.getHomePath() + path.sep + buyOrderRecordTableName,
    autoload: true,
})

const syncOrderRetryTableName = dbConfig.get('syncOrderRetryTableName');
const syncOrderRetryDB = new NeDB({
    filename: common.getHomePath() + path.sep + syncOrderRetryTableName,
    autoload: true,
})

module.exports = {
    savePuskMerkleRecord: async (orderId, username, merkleRoot, blockNum, transactionId) => {
        // save push merkle record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            pushMerkleRecordDB.insert({
                order_id: orderId,
                username: username,
                merkle_root: merkleRoot,
                block_num: blockNum,
                transaction_id: transactionId,
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
    getPuskMerkleRecord: async (orderId, username, skip, limit) => {

        return new Promise((resolve, reject) => {
            // query push merkle record from NeDB
            pushMerkleRecordDB.find({
                order_id: orderId,
                username: username
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
    getPuskMerkleRecordCount: async (orderId, username) => {

        return new Promise((resolve, reject) => {
            // query push merkle record count from NeDB
            pushMerkleRecordDB.find({
                order_id: orderId,
                username: username
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
    saveBuyOrderRecord: async (email, orderId, miner, user, billId, pst, totalPrice, transactionId) => {
        // save buy order record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            buyOrderRecordDB.insert({
                email: email,
                order_id: orderId,
                miner: miner,
                user: user,
                bill_id: billId,
                pst: pst,
                peer_id: '',
                rpc: '',
                total_price: totalPrice,
                transaction_id: transactionId,
                update_time: currentTime,
                create_time: currentTime
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.SAVE_BUY_ORDER_RECORD_FAILED);
                    return;
                }
                resolve(doc._id);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.SAVE_BUY_ORDER_RECORD_FAILED;
        });
    },
    updateBuyOrderRecord: async (email, orderId, billId, peerId, rpc, transactionId) => {
        // save buy order record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            buyOrderRecordDB.update({
                email: email,
                order_id: orderId,
                bill_id: billId,
                transaction_id: transactionId,
            }, {
                $set: {
                    peer_id: peerId,
                    rpc: rpc,
                    update_time: currentTime
                }
            }, {}, function (err, num) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.UPDTAE_BUY_ORDER_RECORD_FAILED);
                    return;
                }
                resolve(num);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.UPDTAE_BUY_ORDER_RECORD_FAILED;
        });
    },
    syncOrder2RegisterCenter: async (email, orderId, billId, peerId, rpc, totalSpace, usedSpace, expire, transactionId) => {
        // sync order to register center
        var registerCenterConfig = config.get('registerCenterConfig');
        var registerCenterUrl = registerCenterConfig.get('url');
        var syncOrder = registerCenterConfig.get('syncOrder');
        var expire = moment(expire).valueOf().toString();

        try {
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
            let result = JSON.parse(request('POST', registerCenterUrl + syncOrder, {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).getBody('utf-8'))
            if (result.code == 200) {
                resolve(orderId);
            }
        }
        catch (e) {
            logger.error('err:', e);
            return new Promise((resolve, reject) => {
                var now = moment();
                var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
                // 同步订单到注册中心失败，需要写入同步失败记录表，后续再加
                syncOrderRetryDB.insert({
                    email: email,
                    order_id: orderId,
                    bill_id: billId,
                    transaction_id: transactionId,
                    peer_id: peerId,
                    rpc: rpc,
                    total_space: totalSpace,
                    used_space: usedSpace,
                    expire: expire,
                    state: 0,
                    update_time: currentTime,
                    create_time: currentTime
                }, function (err, doc) {
                    if (err) {
                        logger.error('err:', err);
                        resolve(BizResultCode.SAVE_SNYC_ORDER_RETRY_FAILED);
                        return;
                    }
                    resolve(doc._id);

                });
            }).catch((err) => {
                logger.error('err:', err);
                return BizResultCode.SAVE_SNYC_ORDER_RETRY_FAILED;
            });
        }
    },
    getBuyOrderRecord: async (email, skip, limit) => {

        return new Promise((resolve, reject) => {
            // query buy order record from NeDB
            buyOrderRecordDB.find({
                email: email
            }).skip(skip).limit(limit).sort({ create_time: -1 }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_BUY_ORDER_RECORD_FAILED);
                    return;
                }
                resolve(data);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_BUY_ORDER_RECORD_FAILED;
        });
    },
    getBuyOrderRecordCount: async (email) => {

        return new Promise((resolve, reject) => {
            // query buy order record count from NeDB
            buyOrderRecordDB.find({
                email: email
            }).exec(function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_BUY_ORDER_RECORD_FAILED);
                    return;
                }
                resolve(data.length);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.QUERY_BUY_ORDER_RECORD_FAILED;
        });
    },
    getBillById: (billId) => {
        var chainConfig = config.get('chainConfig');
        var transactionAddress = chainConfig.get('transactionAddress');
        var getBill = chainConfig.get('getBill');

        let body = '{\n' +
            '        find_bill(\n' +
            '                order: "-created_time",\n' +
            '                where: {\n' +
            '                    id: { ne : "' + billId + '"}\n' +
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
    },
    getTransactionById: (transactionId) => {
        var chainConfig = config.get('chainConfig');
        var transactionAddress = chainConfig.get('transactionAddress');
        var getTransaction = chainConfig.get('getTransaction');

        let body = '{\n' +
            '        find_fibos_transactions(\n' +
            '                order: "-createdAt"\n' +
            '                where: {\n' +
            '                    and:[\n' +
            '                     {trx_id: "' + transactionId + '"},\n' +
            '                     { and: [ { contract_action: { ne: "dmc/onblock" } } ] \n' +
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
        }).getBody('utf-8')).data.find_fibos_transactions
        return transactions;
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
                    basicInfo['orderId'] = orderInfo.order_id;
                    basicInfo['user'] = orderInfo.user;
                    basicInfo['miner'] = orderInfo.miner;
                }
                resolve(basicInfo);
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
    }
}