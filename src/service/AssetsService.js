const logger = require('./logger')('AssetsService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const config = require('config');
const common = require('./common');
const path = require('path');
const dbConfig = config.get('dbConfig');
const tradeRecordTableName = dbConfig.get('tradeRecordTableName');
const Encrypt = require('./Encrypt');

const db = new NeDB({
    filename: common.getHomePath() + path.sep + tradeRecordTableName,
    autoload: true
});

module.exports = {
    transfer: async (dmc_client, from, to, amount, memo) => {
        var amount = amount + ' DMC';
        // transfer dmc
        return new Promise((resolve, reject) => {
            dmc_client.transact({
                actions: [{
                    account: "dmc.token",
                    name: 'transfer',
                    authorization: [
                        {
                            actor: from,
                            permission: 'active'
                        }
                    ],
                    data: {
                        from: from,
                        to: to,
                        quantity: amount,
                        memo: memo
                    }
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then((res) => {
                module.exports.saveTradeRecord(from, to, amount, memo, 1);
                resolve(res.transaction_id);
            }).catch((err) => {
                logger.error('err:', err);
                resolve(BizResultCode.TRANSFER_FAILED);
            })
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.TRANSFER_FAILED;
        });
    },
    saveTradeRecord(from, to, amount, memo, type){
        var now = moment().format('YYYY-MM-DD HH:mm:ss');
        var tradeRecord = {
            from: from,
            to: to,
            amount: amount,
            memo: memo,
            type: type,
            update_time: now,
            create_time: now
        }
        db.insert(tradeRecord, function (err, newDoc) {
            if (err) {
                logger.error('saveTradeRecord err:', err);
            }
        });
    }
}