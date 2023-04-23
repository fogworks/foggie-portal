const logger = require('./logger')('UserService.js');
const BizResultCode = require('./BaseResultCode');
const NeDB = require('nedb');
const moment = require('moment');
const config = require('config');
const process = require('node:process');
const path = require('path');
const dbConfig = config.get('dbConfig');
const userTableName = dbConfig.get('userTableName');
const Encrypt = require('./Encrypt');

const db = new NeDB({
    filename: process.env.HOME + path.sep + userTableName,
    autoload: true
});

module.exports = {
    getUserInfo: async () => {
        // get userInfo from NeDB
        return new Promise((resolve, reject) => {
            db.find({
                primary_key: 'password',
            }, function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.VALIDATE_LOGIN_FAILED);
                    return;
                }
                if (docs.length === 0) {
                    resolve(null);
                }
                else {
                    resolve(docs[0].password);
                }
            })
        });
    },
    removeUserInfo: async () => {
        return new Promise((resolve, reject) => {
            // delete password from NeDB
            db.remove({
                primary_key: 'password',
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
    saveUserInfo: async (password) => {
        return new Promise((resolve, reject) => {
            // encrypt password
            let encryptd = Encrypt.encrypt(password, '6a4de5');
            var currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
            db.find({
                primary_key: 'password',
            }, function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(BizResultCode.SAVE_PASSWORD_FAILED);
                    return;
                }
                if (docs.length === 0) {
                    // save password to NeDB
                    db.insert({
                        primary_key: 'password',
                        password: encryptd,
                        private_key: "",
                        update_time: currentTime,
                        create_time: currentTime
                    }, function (err, doc) {
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
                    resolve(docs[0].password);
                }
            });
        });
    },
    getPrivateKeyByPassword: async (password) => {
        if (!password) {
            return null;
        }
        const query = {
            $and: [
                { primary_key: 'password' },
                { password, password }
            ]
        };

        // use Promise to get private key
        return new Promise((resolve, reject) => {
            db.find(query, function (err, docs) {
                if (err) {
                    logger.error('err:', err);
                    resolve(null);
                    return;
                }
                if (docs.length === 0) {
                    resolve(null);
                }
                else {
                    var privateKey = docs[0].private_key;
                    if (privateKey) {
                        // decrypt private key
                        resolve(Encrypt.decrypt(privateKey, 'a3f452'));
                    }
                    else {
                        resolve(null);
                    }
                }
            });
        });
    },
    saveUserPrivateKey: async (privateKey) => {
        return new Promise((resolve, reject) => {
            // encrypt private key
            privateKey = Encrypt.encrypt(privateKey, 'a3f452');
            // get password from NeDB
            db.update({
                primary_key: 'password',
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
        });
    },
    name: 'zhangsan',
}

// 获取用户信息
// module.export.GetUserInfo = async function () {
//     // get userInfo from NeDB
//     return new Promise((resolve, reject) => {
//         db.find({
//             primary_key: 'password',
//         }, function (err, docs) {
//             if (err) {
//                 logger.error('err:', err);
//                 resolve(BizResultCode.VALIDATE_LOGIN_FAILED);
//                 return;
//             }
//             if (docs.length === 0) {
//                 resolve(BizResultCode.PASSWORD_NOT_EXIST);
//             }
//             else {
//                 resolve(BizResultCode.PASSWORD_EXIST);
//             }
//         })
//     });
// };

