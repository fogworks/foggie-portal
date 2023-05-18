const logger = require('./logger')('UserService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const request = require('sync-request')
const axios = require('axios');
const config = require('config');
const DMC = require('dmc.js');
const common = require('./common');
const path = require('path');
const dbConfig = config.get('dbConfig');
const userTableName = dbConfig.get('userTableName');
const Encrypt = require('./Encrypt');

const db = new NeDB({
    filename: common.getHomePath() + path.sep + userTableName,
    autoload: true
});

module.exports = {
    checkAccount: (username) => {
        var chainConfig = config.get('chainConfig');
        var httpEndpoint = chainConfig.get("httpEndpoint");
        var getAccount = chainConfig.get("getAccount");

        var url = httpEndpoint + getAccount;
        try {
            let account = JSON.parse(request('POST', url, {
                json: { "account_name": username }
            }).getBody('utf-8')).account_name
            return account;
        } catch (err) {
            logger.error('err:', err);
            return BizResultCode.CHECK_ACCOUNT_FAILED;
        }
    },
    getUsername: async (privateKey) => {
        
        var chainConfig = config.get('chainConfig');
        var httpEndpoint = chainConfig.get("httpEndpoint");
        var getAccounts = chainConfig.get("getAccounts");

        var url = httpEndpoint + getAccounts
        return new Promise((resolve, reject) => {

            var public = DMC.ecc.privateToPublic(privateKey);
            logger.info('public key: ', public);
            axios.get(url, {
                data: {
                    accounts: [""],
                    keys: [public]
                }
            })
            .then(response => {
                var accounts = response.data.accounts;
                if(accounts == null || accounts.length == 0){
                    resolve(BizResultCode.GET_USERNAME_FAILED);
                    return;
                }
                var account = accounts.find(item => item.authorizing_key == public);
                resolve(account.account_name);
            })
            .catch(error => {
                logger.error(error);
                resolve(BizResultCode.GET_USERNAME_FAILED);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.GET_USERNAME_FAILED;
        });
    },
    getUserInfo: async (email) => {
        // get userInfo from NeDB
        return new Promise((resolve, reject) => {
            db.findOne({
                email: email,
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_USERINFO_FAILED);
                    return;
                }
                if (!doc) {
                    logger.info('userInfo is null, email:{}', email);
                    resolve(BizResultCode.USER_NOT_EXIST);
                }
                else {
                    resolve(doc);
                }
            })
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.GET_USERINFO_FAILED;
        });
    },
    removeUserInfo: async (email) => {
        return new Promise((resolve, reject) => {
            // delete password from NeDB
            db.remove({
                email: email,
            }, function (err, numRemoved) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.RESET_PASSWORD_FAILED);
                    return;
                }
                resolve(numRemoved);
            })
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.RESET_PASSWORD_FAILED;
        });
    },
    saveUserInfo: async (email, password) => {
        return new Promise((resolve, reject) => {
            var nonce = Encrypt.randomString(6);
            // encrypt password
            let encryptd = Encrypt.encrypt(password, nonce);
            var currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
            db.findOne({
                email: email,
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.SAVE_PASSWORD_FAILED);
                    return;
                }
                if (!doc) {
                    // save password to NeDB
                    db.insert({
                        email: email,
                        username: '',
                        password: encryptd,
                        nonce: nonce,
                        private_key: '',
                        update_time: currentTime,
                        create_time: currentTime
                    }, function (err, doc2) {
                        if (err) {
                            logger.error('err:', err);
                            resolve(BizResultCode.SAVE_PASSWORD_FAILED);
                            return;
                        }
                        resolve(encryptd);
                    });
                }
                else {
                    logger.info('password is exist');
                    resolve(encryptd);
                }
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.SAVE_PASSWORD_FAILED;
        });
    },
    getPrivateKeyByEmail: async (email) => {
        if (!email) {
            return BizResultCode.GET_PRIVATE_KEY_FAILED;
        }

        // use Promise to get private key
        return new Promise((resolve, reject) => {
            db.findOne({
                email: email,
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.GET_PRIVATE_KEY_FAILED);
                    return;
                }
                if (!doc) {
                    resolve(BizResultCode.GET_PRIVATE_KEY_FAILED);
                }
                else {
                    var privateKey = doc.private_key;
                    if (privateKey) {
                        // decrypt private key
                        resolve(Encrypt.decrypt(privateKey, doc.nonce));
                    }
                    else {
                        resolve(BizResultCode.GET_PRIVATE_KEY_FAILED);
                    }
                }
            });
        })
            .catch((err) => {
                logger.error('err:', err);
                return BizResultCode.GET_PRIVATE_KEY_FAILED;
            });
    },
    saveUserPrivateKey: async (email, privateKey) => {
        return new Promise(async (resolve, reject) => {
            var userInfo = await module.exports.getUserInfo(email);
            if (userInfo instanceof BizResultCode) {
                resolve(userInfo);
                return;
            }
            var username = await module.exports.getUsername(privateKey);
            // encrypt private key
            privateKey = Encrypt.encrypt(privateKey, userInfo.nonce);
            // get password from NeDB
            db.update({
                email: email,
            }, {
                $set: {
                    private_key: privateKey,
                    username: username,
                    update_time: moment().format("YYYY-MM-DD HH:mm:ss")
                }
            }, function (err, n) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.SAVE_PRIVATE_KEY_FAILED);
                    return;
                }
                if (n === 0) {
                    logger.error('save private key failed');
                    resolve(BizResultCode.SAVE_PRIVATE_KEY_FAILED);
                    return;
                }
                logger.info('save private key success');
                resolve(username);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.SAVE_PRIVATE_KEY_FAILED;
        });
    },
    getToken4UploadFile: async (email, orderId) => {

        var privateKey = await module.exports.getPrivateKeyByEmail(email);
        if (privateKey instanceof BizResultCode) {
            logger.info('private key is null');
            return privateKey;
        }
        return DMC.ecc.sign(Buffer.from(orderId, 'utf8'), privateKey)
    },
    dividendList: (username, skip, limit) => {
        try {
            var chainConfig = config.get('chainConfig');
            var transactionAddress = chainConfig.get('transactionAddress');
            var getDividend = chainConfig.get('getDividend');

            let body = '{\n' +
                '        find_order(\n' +
                '                skip: ' + skip + ',\n' +
                '                limit: ' + limit + ',\n' +
                '                order: "latest_settlement_date",\n' +
                '                where: {\n' +
                '                    and: [\n' +
                '                        {\n' +
                '                            or: [\n' +
                '                                {\n' +
                '                                    miner_id: "' + username + '",\n' +
                '                                },\n' +
                '                                {\n' +
                '                                    user_id: "' + username + '",\n' +
                '                                }\n' +
                '                            ],\n' +
                '                        },\n' +
                '                        {\n' +
                '                            or: [\n' +
                '\n' +
                '                                {\n' +
                '                                    state: {\n' +
                '                                        ne: 4\n' +
                '                                    },\n' +
                '                                },\n' +
                '                                {\n' +
                '                                    and:[\n' +
                '                                            {\n' +
                '                                                state: 4,\n' +
                '                                            },\n' +
                '                                            {\n' +
                '                                                settlement_pledge_amount: {\n' +
                '                                                ne: "0.0000"\n' +
                '                                            }\n' +
                '                                        }\n' +
                '                                    ]\n' +
                '                                },\n' +
                '                            ]\n' +
                '                        },\n' +
                '                        {\n' +
                '                            latest_settlement_date: {\n' +
                '                                ne : "1970-01-01T00:00:00.000Z"\n' +
                '                            }\n' +
                '                        }\n' +
                '                    ],\n' +
                '                },\n' +
                '        ){   \n' +
                '            id\n' +
                '            user{\n' +
                '                id\n' +
                '            }\n' +
                '            miner{\n' +
                '                id\n' +
                '            }\n' +
                '            bill{\n' +
                '                id\n' +
                '            }\n' +
                '            user_pledge_amount\n' +
                '            miner_lock_pst_amount\n' +
                '            miner_lock_dmc_amount\n' +
                '            price_amount\n' +
                '            created_time\n' +
                '            epoch\n' +
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
                '            challenge {\n' +
                '                state\n' +
                '                miner_pay_amount\n' +
                '            }\n' +
                '            maker_snapshot {\n' +
                '                rate\n' +
                '            }\n' +
                '        }\n' +
                '    }'
            var dividendList = JSON.parse(request('POST', transactionAddress + getDividend, {
                headers: {
                    'Content-Type': 'application/graphql'
                },
                body: body
            }).getBody('utf-8')).data.find_order

            var chainConfig = config.get('chainConfig')
            var httpEndpoint = chainConfig.get('httpEndpoint')
            var getTableRows = chainConfig.get('getTableRows')
            var innermarker = JSON.parse(request('POST', httpEndpoint + getTableRows, {
                json: { "json": true, "code": "dmc.token", "scope": "dmc.token", "table": "innermarker" }
            }).getBody('utf-8')).rows[0]

            var x = innermarker.tokenx.quantity;
            var y = innermarker.tokeny.quantity;

            var rsi = module.exports.getAmount(x, y, 'RSI');
            var dmc = module.exports.getAmount(x, y, 'DMC');

            var resultList = [];
            for (dividend of dividendList) {
                var userRsi = dividend.user_rsi_amount;
                var epoch = 1;
                var estimated = module.exports.calcEstimated(dmc, rsi, userRsi, epoch);
                dividend['estimated'] = estimated;
                resultList.push(dividend);
            }

            return resultList;
        }
        catch (e) {
            logger.error('err:', e);
            return BizResultCode.GET_DIVIDEND_LIST_FAILED;
        }
    },
    dividendCount: (username) => {
        try {
            var chainConfig = config.get('chainConfig');
            var transactionAddress = chainConfig.get('transactionAddress');
            var getDividend = chainConfig.get('getDividend');

            let body = '{\n' +
                '        count_order(\n' +
                '    where:{and:[{or:[{miner_id:"' + username + '"},{user_id:"' + username + '"}]},{or:[{state:{ne:4}},{and:[{state:4},{settlement_pledge_amount:{ne:"0.0000"}}]}]},{latest_settlement_date:{ne:"1970-01-01T00:00:00.000Z"}}]}\n' +
                '        )\n' +
                '    }'
            return JSON.parse(request('POST', transactionAddress + getDividend, {
                headers: {
                    'Content-Type': 'application/graphql'
                },
                body: body
            }).getBody('utf-8')).data.count_order
        }
        catch (e) {
            logger.error('err:', e);
            return BizResultCode.GET_DIVIDEND_COUNT_FAILED;
        }
    },
    /**
     * 
     * @param {*} x  2.1903 RSI
     * @param {*} y  455988.8667 DMC
     * @param {*} unit  DMC/RSI
     */
    getAmount: (x, y, unit) => {
        var xIndex = x.indexOf(unit);
        var yIndex = y.indexOf(unit);

        if (xIndex > -1) {
            return x.substring(0, xIndex).trim();
        }

        if (yIndex > -1) {
            return y.substring(0, yIndex).trim();
        }
        return 0;
    },
    calcEstimated: (dmc, rsi, changeRsi, epoch) => {
        var dmc = parseFloat(dmc);
        var rsi = parseFloat(rsi);
        var changeRsi = parseFloat(changeRsi);
        var epoch = parseInt(epoch);
        var tmp = (dmc * rsi) / (rsi + changeRsi)
        return ((dmc - tmp) * epoch).toFixed(4).padEnd(5, '0')
    }
}
