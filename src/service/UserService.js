const logger = require('./logger')('UserService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const config = require('config');
const common = require('./common');
const path = require('path');
const dbConfig = config.get('dbConfig');
const userTableName = dbConfig.get('userTableName');
const Encrypt = require('./Encrypt');
// const DMC = require('dmc.js');
// const axios = require('axios')

const db = new NeDB({
    filename: common.getHomePath() + path.sep + userTableName,
    autoload: true
});

module.exports = {
    getUserInfo: async (email) => {
        // get userInfo from NeDB
        return new Promise((resolve, reject) => {
            db.findOne({
                email: email,
            }, function (err, doc) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.VALIDATE_LOGIN_FAILED);
                    return;
                }
                if (!doc) {
                    resolve(BizResultCode.GET_USERINFO_FAILED);
                }
                else {
                    resolve(doc);
                }
            })
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
                resolve(BizResultCode.SUCCESS);
            })
        });
    },
    saveUserInfo: async (email, password) => {
        return new Promise((resolve, reject) => {
            // encrypt password
            let encryptd = Encrypt.encrypt(password, '6a4de5');
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
                        password: encryptd,
                        private_key: "",
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
                        resolve(Encrypt.decrypt(privateKey, 'a3f452'));
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
        return new Promise((resolve, reject) => {
            // encrypt private key
            privateKey = Encrypt.encrypt(privateKey, 'a3f452');
            // get password from NeDB
            db.update({
                email: email,
            }, {
                $set: {
                    private_key: privateKey,
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
                resolve(BizResultCode.SUCCESS);
            });
        }).catch((err) => {
            logger.error('err:', err);
            return BizResultCode.SAVE_PRIVATE_KEY_FAILED;
        });
    },
    // getUsername: async (privateKey) => {

    //     let pubKey = DMC.ecc.privateToPublic(privateKey);
    //     var chainConfig = config.get('chainConfig');
    //     var httpEndpoint = chainConfig.get('httpEndpoint');
    //     var getAccountsUrl = httpEndpoint + chainConfig.get('getAccounts');

    //     let body = JSON.stringify({
    //         accounts: [''],
    //         keys: [pubKey]
    //     });

    //     return new Promise((resolve, reject) => {
    //         axios({
    //             method: 'post',
    //             url: getAccountsUrl,
    //             data: body,
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         }).then((res) => {
    //             var accounts = res.data.accounts;
    //             var account = accounts.filter(item => item.permission_name == 'active');
    //             resolve(account[0].account_name);
    //         }).catch((err) => {
    //             logger.error(err);
    //             resolve(null);
    //         });
    //     });
    // }
}