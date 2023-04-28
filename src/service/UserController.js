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
     * @param {*} req   HTTP请求
     * @param {*} res   HTTP响应
     * @returns 10001 密码不存在 10002 密码存在
     */
    static async validateUserLogin(req, res) {
        var email = req.body.email;
        if(!email){
            res.send(BizResult.validateFailed());
            return;
        }
        var result = await userService.getUserInfo(email);

        if(result instanceof BizResultCode){
            res.send(BizResult.fail(result));
            return;
        }

        if (!result.password) {
            res.send(BizResult.fail(BizResultCode.PASSWORD_NOT_EXIST));
            return;
        }
        if (!result.private_key) {
            res.send(BizResult.fail(BizResultCode.PRIVATE_KEY_NOT_EXIST));
            return;
        }
        res.send(BizResult.fail(BizResultCode.PASSWORD_EXIST));
    }

    /**
     * save user password
     * @param {*} email     foggie的邮箱
     * @param {*} password  用户的密码
     * @param {*} res       HTTP响应
     * @returns
     */
    static async saveUserPassword(email, password, res) {
        if (!password || !email) {
            res.send(BizResult.validateFailed());
            return;
        }
        var resultCode = await userService.saveUserInfo(email, password);
        if (resultCode instanceof BizResultCode) {
            res.send(BizResult.fail(resultCode));
            return;
        }
        res.send(BizResult.success(resultCode));
    }

    /**
     * reset user password
     * 
     * @param {*} req   HTTP请求
     * @param {*} res       HTTP响应
     * @returns
     */
    static async resetUserPassword(req, res) {
        var password = req.body.password;
        var email = req.body.email;

        if (!password || !email) {
            res.send(BizResult.validateFailed());
            return;
        }
        var resultCode = await userService.removeUserInfo(email);
        if (resultCode instanceof BizResultCode) {
            res.send(BizResult.fail(resultCode));
            return;
        }
        UserController.saveUserPassword(email, password, res);
    }

    /**
     * validate user password
     * @param {*} req    HTTP请求
     * @param {*} res       HTTP响应
     * @returns 10003 密码错误 10004 密码正确
     */
    static async validateUserPassword(req, res) {

        var password = req.body.password;
        var email = req.body.email;
        if (!password || !email) {
            res.send(BizResult.validateFailed());
            return;
        }
        var encryptedPassword = Encrypt.encrypt(password, '6a4de5');
        var passwordFromDB = await userService.getUserInfo(email);
        // get password from NeDB
        if (encryptedPassword === passwordFromDB.password) {
            var result = {};
            result['encryptedPassword'] = encryptedPassword;
            res.send(BizResult.success(result));
        }
        else {
            res.send(BizResult.fail(BizResultCode.PASSWORD_VALID_FAILED));
        }
    }

    /**
     * 获取用户的私钥
     * @param {*} req       HTTP请求
     * @param {*} res       HTTP响应
     * @returns 用户的私钥
     */
    static async getUserPrivateKey(req, res) {
        var email = req.body.email;
        if (!email) {
            res.send(BizResult.validateFailed(email));
            return;
        }

        var privateKey = await userService.getPrivateKeyByEmail(email);
        if (privateKey instanceof BizResultCode) {
            logger.info('private key is null');
            res.send(BizResult.fail(privateKey));
            return;
        }
        res.send(BizResult.success(privateKey));
    }

    /** 
     * save user keystore
     * @param {*} req    HTTP请求
     * @param {*} res       HTTP响应
     * @returns
     */
    static async saveUserPrivateKey(req, res) {
        var privateKey = req.body.privateKey;
        var email = req.body.email;
        if (!privateKey || !email) {
            res.send(BizResult.validateFailed());
            return;
        }

        if(!DMC.ecc.isValidPrivate(privateKey)){
            res.send(BizResult.fail(BizResultCode.PRIVATE_KEY_INVALID));
            return;
        }
        
        var resultCode = await userService.saveUserPrivateKey(email, privateKey);
        if (resultCode === BizResultCode.SUCCESS) {
            res.send(BizResult.success());
            return;
        }
        res.send(BizResult.fail(resultCode));
    }

    /**
     * 加密 用户的订单信息
     * 源数据格式 用户私钥:用户名:订单id
     * @param {*} req       HTTP请求
     * @param {*} res       HTTP响应
     * @returns 加密后的字符串
     */
    static async encodeUserOrder(req, res) {
        var orderId = req.body.orderId;
        var email = req.body.email;
        var username = req.body.username;
        if (!orderId || !email || !username) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }

        var privateKey = await userService.getPrivateKeyByEmail(email);
        if (privateKey instanceof BizResultCode) {
            logger.info('private key is null');
            res.send(BizResult.fail(privateKey));
            return;
        }
        let base64Data = Buffer.from(privateKey + ':' + username + ':' + orderId).toString('base64');
        res.send(BizResult.success(base64Data));
    }

    // 用户领取奖励
    static claimOrder(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var orderId = req.body.orderId;
        var chainId = req.body.chainId;

        if (!username || !email || !orderId || !chainId) {
            res.send(BizResult.validateFailed());
            return;
        }

        var privateKey = userService.getPrivateKeyByEmail(email);
        if(privateKey instanceof BizResultCode){
            res.send(BizResult.fail(privateKey));
            return;
        }
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