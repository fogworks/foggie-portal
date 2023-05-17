const logger = require('./logger')('AssetsService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const config = require('config');
const request = require('sync-request');
const common = require('./common');
const path = require('path');
const dbConfig = config.get('dbConfig');
const tradeRecordTableName = dbConfig.get('tradeRecordTableName');
const tradeValidTableName = dbConfig.get('tradeValidTableName');

const tradeRecordDb = new NeDB({
    filename: common.getHomePath() + path.sep + tradeRecordTableName,
    autoload: true
});

const tradeValidDb = new NeDB({
    filename: common.getHomePath() + path.sep + tradeValidTableName,
    autoload: true
});

module.exports = {
    transfer: async (dmc_client, email, userToken, from, to, amount, memo) => {
        var amount = amount + ' DMC';
        // transfer dmc
        return new Promise((resolve, reject) => {

            tradeValidDb.findOne({ email: email }, (err, doc) => {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.TRANSFER_FAILED);
                    return;
                }
                if (!doc) {
                    resolve(BizResultCode.TRANSFER_FAILED);
                    return;
                }
                // Verify the TOTP password
                const verified = speakeasy.totp.verify({
                    secret: doc.secret,
                    encoding: 'base32',
                    token: userToken
                });

                if (verified) {
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
                        module.exports.saveTradeRecord(from, to, amount, memo, 1, res.transaction_id, res.processed.block_num);
                        resolve(res.transaction_id);
                    }).catch((err) => {
                        logger.error('err:', err);
                        resolve(BizResultCode.TRANSFER_FAILED);
                    })
                } else {
                    logger.error('transfer failed, userToken is invalid');
                    resolve(BizResultCode.TRANSFER_VALID_FAILED);
                }
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.TRANSFER_FAILED;
        });
    },
    transferValid: async (email) => {

        return new Promise((resolve, reject) => {
            tradeValidDb.findOne({ email: email }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_TRANSFER_VALID_FAILED);
                    return;
                }
                if (!doc) {
                    // Generate a secret key
                    const secret = speakeasy.generateSecret({ length: 10, name: 'Foggie(' + email + ')' });
                    // Save the secret key in your database
                    logger.log('secret:', secret);

                    // Generate a QR code for the secret key
                    QRCode.toDataURL(secret.otpauth_url, function (err, imageUrl) {
                        if (err) {
                            logger.error("Error generating QR code , err:{}", err);
                            resolve(BizResultCode.GENERATE_QR_CODE_FAILED);
                            return;
                        } else {
                            // Display the QR code to the user
                            logger.info("imageUrl:", imageUrl);
                            var validState = {};
                            validState['imageUrl'] = imageUrl;
                            validState['secret'] = secret.base32;
                            validState['account'] = 'Foggie(' + email + ')';
                            resolve(validState);
                        }
                    });
                }
                else {
                    resolve(null);
                }
            });
        })
            .catch((err) => {
                logger.error('err:', err);
                return BizResultCode.GET_TRANSFER_VALID_FAILED;
            });

    },
    bindValid: async (email, secret, userToken) => {

        return new Promise((resolve, reject) => {
            // Verify the TOTP password
            const verified = speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: userToken
            });
            if (verified) {
                // save to db
                var now = moment().format('YYYY-MM-DD HH:mm:ss');
                tradeValidDb.insert({ email: email, secret: secret, update_time: now, create_time: now }, function (err, newDoc) {
                    if (err) {
                        logger.error('save transfer valid err:', err);
                        resolve(BizResultCode.SAVE_TRANSFER_VALID_FAILED);
                        return;
                    }
                    resolve(newDoc._id);
                });
            }
            else {
                resolve(BizResultCode.TRANSFER_VALID_FAILED);
            }
        })
            .catch((err) => {
                logger.error('err:', err);
                return BizResultCode.SAVE_TRANSFER_VALID_FAILED;
            });
    },
    saveTradeRecord: (from, to, amount, memo, type, transactionId, blockNum) => {
        var now = moment().format('YYYY-MM-DD HH:mm:ss');
        var tradeRecord = {
            from: from,
            to: to,
            amount: amount,
            memo: memo,
            type: type,
            transaction_id: transactionId,
            block_num: blockNum,
            update_time: now,
            create_time: now
        }
        tradeRecordDb.insert(tradeRecord, function (err, newDoc) {
            if (err) {
                logger.error('saveTradeRecord err:', err);
            }
        });
    },
    getUserAssets: (username) => {
        var scope = common.walletNameToNumber(username);
        var chainConfig = config.get('chainConfig')
        var httpEndpoint = chainConfig.get('httpEndpoint')
        var getTableRows = chainConfig.get('getTableRows')
        try {
            let userAssets = JSON.parse(request('POST', httpEndpoint + getTableRows, {
                json: { "json": true, "code": "dmc.token", "scope": scope, "table": "accounts" }
            }).getBody('utf-8')).rows

            if (!userAssets) {
                logger.error('userAssets is null');
                return BizResultCode.GET_USER_ASSET_FAILED;
            }

            if (userAssets.length == 0) {
                logger.error('userAssets.length is 0');
                return BizResultCode.GET_USER_ASSET_FAILED;
            }

            return userAssets;

        }
        catch (err) {
            logger.error('err:', err);
            return BizResultCode.GET_USER_ASSET_FAILED;
        }
    },
    getAssetsAmount: (arr, unit) => {

        try{
            for (const asset of arr) {
                var quantity = asset.balance.quantity;
                var index = quantity.indexOf(unit);
    
                if (index > -1) {
                    return quantity.substring(0, index).trim();
                }
            }
        }
        catch(err){
            logger.error('err:', err);
        }
        return 0;
    }
}