const logger = require('./logger')('OrderService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const config = require('config');
const common = require('./common');
const path = require('path');
const dbConfig = config.get('dbConfig');
const pushMerkleRecordTableName = dbConfig.get('pushMerkleRecordTableName');
const pushMerkleRecordDB = new NeDB({
    filename: common.getHomePath() + path.sep + pushMerkleRecordTableName,
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
    }
}