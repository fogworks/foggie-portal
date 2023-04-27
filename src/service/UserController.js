const BizResult = require('./BizResult');
const BizResultCode = require('./BaseResultCode');
const logger = require('./logger')('UserController.js');
const Encrypt = require('./Encrypt');
const userService = require('./UserService');
const DMC = require('dmc.js');
const config = require('config');

class UserController {

    /**
     * validate user login
     * @param {*} res   HTTP响应
     * @returns 10001 密码不存在 10002 密码存在
     */
    static async validateUserLogin(res) {
        var result = await userService.getUserInfo();
        if (result === null) {
            res.send(BizResult.fail(BizResultCode.PASSWORD_NOT_EXIST));
            return;
        }
        else if (result === BizResultCode.VALIDATE_LOGIN_FAILED) {
            res.send(BizResult.fail(result));
            return;
        }
        res.send(BizResult.fail(BizResultCode.PASSWORD_EXIST));
    }

    /**
     * save user password
     * @param {*} password  用户的密码
     * @param {*} res       HTTP响应
     * @returns
     */
    static async saveUserPassword(password, res) {
        if (!password) {
            res.send(BizResult.validateFailed(password));
            return;
        }
        var resultCode = await userService.saveUserInfo(password);
        if (resultCode === BizResultCode.SAVE_PASSWORD_FAILED) {
            res.send(BizResult.fail(resultCode));
            return;
        }
        res.send(BizResult.success(resultCode));
    }

    /**
     * reset user password
     * 
     * @param {*} password  用户的密码
     * @param {*} res       HTTP响应
     * @returns
     */
    static async resetUserPassword(password, res) {
        if (!password) {
            res.send(BizResult.validateFailed(password));
            return;
        }
        var resultCode = await userService.removeUserInfo();
        if (resultCode === BizResultCode.SUCCESS) {
            UserController.saveUserPassword(password, res);
            return;
        }
        res.send(BizResult.fail(resultCode));
    }

    /**
     * validate user password
     * @param {*} password  用户的密码
     * @param {*} res       HTTP响应
     * @returns 10003 密码错误 10004 密码正确
     */
    static async validateUserPassword(password, res) {
        if (!password) {
            res.send(BizResult.validateFailed(password));
            return;
        }
        var encryptedPassword = Encrypt.encrypt(password, '6a4de5');
        var passwordFromDB = await userService.getUserInfo();
        // get password from NeDB
        if (encryptedPassword === passwordFromDB) {
            var privateKey = await userService.getPrivateKeyByPassword(encryptedPassword);
            let username = await userService.getUsername(privateKey);
            var result = {};
            result['username'] = username;
            result['encryptedPassword'] = encryptedPassword;
            res.send(BizResult.success(result));
        }
        else {
            res.send(BizResult.fail(BizResultCode.PASSWORD_VALID_FAILED));
        }
    }

    /**
     * 获取用户的私钥
     * @param {*} password  用户的密码
     * @param {*} res       HTTP响应
     * @returns 用户的私钥
     */
    static async getUserPrivateKey(password, res) {

        if (!password) {
            res.send(BizResult.validateFailed(password));
            return;
        }

        var privateKey = await userService.getPrivateKeyByPassword(password);
        if (!privateKey) {
            logger.info('private key is null');
            res.send(BizResult.fail(BizResultCode.GET_PRIVATE_KEY_FAILED));
            return;
        }
        res.send(BizResult.success(privateKey));
    }

    /** 
     * save user keystore
     * @param {*} privateKey  用户的私钥
     * @param {*} res       HTTP响应
     * @returns
     */
    static async saveUserPrivateKey(privateKey, res) {
        if (!privateKey) {
            res.send(BizResult.validateFailed(privateKey));
            return;
        }

        if(!DMC.ecc.isValidPrivate(privateKey)){
            res.send(BizResult.fail(BizResultCode.PRIVATE_KEY_INVALID));
            return;
        }
        
        var resultCode = await userService.saveUserPrivateKey(privateKey);
        if (resultCode === BizResultCode.SUCCESS) {
            var username = await userService.getUsername(privateKey);
            res.send(BizResult.success(username));
            return;
        }
        res.send(BizResult.fail(resultCode));
    }

    /**
     * 加密 用户的订单信息
     * 源数据格式 用户私钥:用户名:订单id
     * @param {*} orderId   订单id
     * @param {*} password  用户的密码
     * @param {*} username  用户名
     * @param {*} res       HTTP响应
     * @returns 加密后的字符串
     */
    static async encodeUserOrder(orderId, password, username, res) {

        if (!orderId || !password || !username) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }

        var privateKey = await userService.getPrivateKeyByPassword(password);
        if (!privateKey) {
            logger.info('private key is null');
            res.send(BizResult.fail(BizResultCode.GET_PRIVATE_KEY_FAILED));
            return;
        }
        let base64Data = Buffer.from(privateKey + ':' + username + ':' + orderId).toString('base64');
        res.send(BizResult.success(base64Data));
    }

    // 用户领取奖励
    static claimOrder(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var orderId = req.body.orderId;
        var chainId = req.body.chainId;

        if (!username || !password || !orderId || !chainId) {
            res.send(BizResult.validateFailed());
            return;
        }

        var privateKey = userService.getPrivateKeyByPassword(password);
        var chainConfig = config.get('chainConfig');
        var httpEndpoint = chainConfig.get("httpEndpoint");

        var dmc_client = DMC({
            chainId: chainId,
            keyProvider: privateKey,
            httpEndpoint: httpEndpoint,
            logger: {
                log: null,
                error: null
            }
        });

        dmc_client.transact({
            actions: [{
                account: "dmc.token",
                name: 'claimorder',
                authorization: [
                    {
                        actor: username,
                        permission: 'active'
                    }
                ],
                data: {
                    payer: username,
                    order_id: parseInt(orderId)
                }
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        }).then((res) => {
            res.send(BizResult.success());
        }).catch((err) => {
            logger.error('err:', err);
            res.send(BizResult.fail(BizResultCode.CLAIM_ORDER_FAILED));
        })
    }
}

module.exports = UserController