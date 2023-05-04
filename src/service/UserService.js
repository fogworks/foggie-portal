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
    saveUserInfo: async (email, password, username) => {
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
                        username: username,
                        password: encryptd,
                        nonce: nonce,
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
            if(userInfo instanceof BizResultCode){
                resolve(userInfo);
                return;
            }
            // encrypt private key
            privateKey = Encrypt.encrypt(privateKey, userInfo.nonce);
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
    getToken4UploadFile: async(email, orderId) =>{

        var privateKey = await module.exports.getPrivateKeyByEmail(email);
        if (privateKey instanceof BizResultCode) {
            logger.info('private key is null');
            return privateKey;
        }
        var userInfo = await module.exports.getUserInfo(email);
        if (userInfo instanceof BizResultCode) {
            logger.info('userInfo is null');
            return userInfo;
        }
        return Buffer.from(privateKey + ':' + userInfo.username + ':' + orderId).toString('base64');
    }
}