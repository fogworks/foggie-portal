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

const orderTableName = dbConfig.get('orderTableName');
const orderDB = new NeDB({
    filename: common.getHomePath() + path.sep + orderTableName,
    autoload: true,
})

module.exports = {
    savePuskMerkleRecord: async (orderId, email, merkleRoot, blockNum, transactionId) => {
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
    saveOrder: async (email, orderId, miner, user, billId, pst, totalPrice, transactionId) => {
        // save buy order record into NeDB
        return new Promise((resolve, reject) => {

            orderDB.findOne({
                email: email,
                order_id: orderId,
                bill_id: billId
            }, async function (err, doc) {
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
                            total_price: totalPrice,
                            transaction_id: transactionId,
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
                        total_price: totalPrice,
                        transaction_id: transactionId,
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
    updateOrder: async (email, orderId, billId, peerId, rpc) => {
        // update buy order record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            orderDB.update({
                email: email,
                order_id: parseInt(orderId),
                bill_id: billId,
            }, {
                $set: {
                    peer_id: peerId,
                    rpc: rpc,
                    update_time: currentTime
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
    updateOrderUsedSpace: async (email, orderId, usedSpace) => {
        // update buy order record into NeDB
        return new Promise((resolve, reject) => {
            var now = moment();
            var currentTime = now.format("YYYY-MM-DD HH:mm:ss");
            orderDB.update({
                email: email,
                order_id: parseInt(orderId),
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
    syncOrder2RegisterCenter: async (email, orderId, billId, totalSpace, usedSpace, transactionId) => {

        try {
            var bill = module.exports.getBillById(billId);
            if (bill instanceof BizResultCode) {
                return bill;
            }
            // 获取挂单时的transaction_id
            var transactionId = bill[0].action[0].trx_id;
            if (!transactionId) {
                return BizResultCode.GET_TRANSACTION_ID_FAILED;
            }
            var expire = bill[0].expire_on;
            if (!expire) {
                return BizResultCode.GET_EXPIRE_FAILED;
            }
            // 根据挂单时的tranaction_id获取挂单信息
            var transaction = module.exports.getTransactionById(transactionId);
            if (transaction instanceof BizResultCode) {
                return transaction;
            }
            // 根据挂单信息，获取memo
            var memo = await module.exports.getMemoByRawData(transaction[0].rawData);
            if (memo instanceof BizResultCode) {
                return memo;
            }
            var memoArr = memo.split('$');
            var peerId = memoArr[1];
            if (!peerId) {
                return BizResultCode.GET_PEER_ID_FAILED;
            }
            var rpc = memoArr[0];
            if (!rpc) {
                return BizResultCode.GET_RPC_FAILED;
            }
            // sync order to register center
            var registerCenterConfig = config.get('registerCenterConfig');
            var registerCenterUrl = registerCenterConfig.get('url');
            var syncOrder = registerCenterConfig.get('syncOrder');
            var expire = new Date(expire).getTime();

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
                // 同步成功后，更新订单中的peer_id和rpc
                logger.info('sync order to register center success, orderId:{}', orderId);
                var updateBuyOrderRes = await module.exports.updateOrder(email, orderId, billId, peerId, rpc);
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
    getOrderById: async (email, orderId) => {

        return new Promise((resolve, reject) => {
            // query buy order record from NeDB
            orderDB.findOne({
                email: email,
                order_id: parseInt(orderId)
            }, function (err, data) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.QUERY_ORDER_FAILED);
                    return;
                }
                if(!data){
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
                if(!data){
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
                    basicInfo['orderId'] = orderInfo.order_id;
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
    }
}