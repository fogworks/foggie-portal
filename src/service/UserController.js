const BizResult = require('./BizResult');
const BizResultCode = require('./BaseResultCode');
const logger = require('./logger')('UserController.js');
const Encrypt = require('./Encrypt');
const userService = require('./UserService');
const DMC = require('dmc.js');
const config = require('config');
const orderService = require('./OrderService');

class UserController {

    /**
     * validate user login
     * @param {*} req   HTTP request
     * @param {*} res   HTTP response
     * @returns 10001 password is not exists 10002 password is exists
     */
    static async validateUserLogin(req, res) {
        var email = req.body.email;
        if (!email) {
            res.send(BizResult.validateFailed());
            return;
        }
        var result = await userService.getUserInfo(email);

        if (result instanceof BizResultCode) {
            if (result == BizResultCode.USER_NOT_EXIST) {
                res.send(BizResult.fail(BizResultCode.PASSWORD_NOT_EXIST));
                return;
            }
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

    static async getUsername(req, res) {

        var privateKey = req.body.privateKey;

        var username = await userService.getUsername(privateKey);
        if (username instanceof BizResultCode) {
            res.send(BizResult.fail(username));
            return;
        }
        res.send(BizResult.success(username));
    }

    /**
     * check account
     * @param {*} req   HTTP request
     * @param {*} res   HTTP response
     */
    static checkAccount(req, res) {
        var username = req.body.username;
        if (!username) {
            res.send(BizResult.validateFailed());
            return;
        }
        var result = userService.checkAccount(username);
        if (result !== username) {
            res.send(BizResult.fail(BizResultCode.ACCOUNT_NOT_EXIST));
            return;
        }
        res.send(BizResult.success(result));
    }

    /**
     * save user password
     * @param {*} req       HTTP request
     * @param {*} res       HTTP response
     * @returns
     */
    static async saveUserPassword(req, res) {

        var email = req.body.email;
        var password = req.body.password;

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
     * @param {*} req    HTTP request
     * @param {*} res    HTTP response
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
     * @param {*} req    HTTP request
     * @param {*} res    HTTP response
     */
    static async validateUserPassword(req, res) {

        var password = req.body.password;
        var email = req.body.email;
        if (!password || !email) {
            res.send(BizResult.validateFailed());
            return;
        }

        var userInfo = await userService.getUserInfo(email);

        if (userInfo instanceof BizResultCode) {
            res.send(BizResult.fail(BizResultCode.PASSWORD_VALID_FAILED));
            return;
        }
        var nonce = userInfo.nonce;
        var encryptedPassword = Encrypt.encrypt(password, nonce);
        // get password from NeDB
        if (encryptedPassword === userInfo.password) {
            var result = {};
            result['encryptedPassword'] = encryptedPassword;
            res.send(BizResult.success(result));
        }
        else {
            res.send(BizResult.fail(BizResultCode.PASSWORD_VALID_FAILED));
        }
    }

    /**
     * get user private key
     * @param {*} req       HTTP request
     * @param {*} res       HTTP response
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
     * @param {*} req    HTTP request
     * @param {*} res    HTTP response
     * @returns
     */
    static async saveUserPrivateKey(req, res) {
        var privateKey = req.body.privateKey;
        var email = req.body.email;
        if (!privateKey || !email) {
            res.send(BizResult.validateFailed());
            return;
        }

        if (!DMC.ecc.isValidPrivate(privateKey)) {
            res.send(BizResult.fail(BizResultCode.PRIVATE_KEY_INVALID));
            return;
        }

        var result = await userService.saveUserPrivateKey(email, privateKey);
        if (result instanceof BizResultCode) {
            res.send(BizResult.fail(result));
            return;
        }
        res.send(BizResult.success(result));
    }

    /**
     * encrypt order info,
     * source data contains user private key,username,order id
     * @param {*} req       HTTP request
     * @param {*} res       HTTP response
     * @returns encrypted character
     */
    static async getToken4UploadFile(req, res) {
        var orderId = req.body.orderId;
        if (!orderId) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }

        var email = await orderService.getEmailByOrderId(orderId);
        var token = await userService.getToken4UploadFile(email, orderId);
        if (token instanceof BizResultCode) {
            res.send(BizResult.fail(token));
            return;
        }
        res.send(BizResult.success(token));
    }

    /**
     * user claim order
     * @param {*} req   HTTP request
     * @param {*} res   HTTP response
     * @returns 
     */
    static async claimOrder(req, res) {
        var email = req.body.email;
        var orderId = req.body.orderId;
        var chainId = req.body.chainId;

        if (!email || !orderId || !chainId) {
            res.send(BizResult.validateFailed());
            return;
        }

        var privateKey = await userService.getPrivateKeyByEmail(email);
        if (privateKey instanceof BizResultCode) {
            res.send(BizResult.fail(privateKey));
            return;
        }
        var chainConfig = config.get('chainConfig');
        var httpEndpoint = chainConfig.get("httpEndpoint");

        var userInfo = await userService.getUserInfo(email);
        if (userInfo instanceof BizResultCode) {
            logger.info('userInfo is null');
            res.send(BizResult.fail(userInfo));
            return;
        }
        var username = userInfo.username;
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
        }).then((result) => {
            res.send(BizResult.success(result));
        }).catch((err) => {
            logger.error('err:', err);
            res.send(BizResult.fail(BizResultCode.CLAIM_ORDER_FAILED));
        })
    }

    static async dividendList(req, res) {
        var email = req.body.email;

        var pageSize = req.body.pageSize;
        var pageNo = req.body.pageNo;

        var limit = 10;
        if (typeof (pageSize) !== "undefined") {
            limit = pageSize
        }

        var skip = 0;
        if (typeof (pageNo) !== "undefined") {
            skip = (pageNo - 1) * limit
        }

        if (!email) {
            res.send(BizResult.validateFailed());
            return;
        }

        var userInfo = await userService.getUserInfo(email);
        if (userInfo instanceof BizResultCode) {
            logger.info('userInfo is null');
            res.send(BizResult.fail(userInfo));
            return;
        }
        var username = userInfo.username;

        var list = userService.dividendList(username, skip, limit);
        if (list instanceof BizResultCode) {
            res.send(BizResult.fail(list));
            return;
        }

        var count = userService.dividendCount(username);
        if (count instanceof BizResultCode) {
            res.send(BizResult.fail(count));
            return;
        }

        var result = {};
        result['list'] = list;
        result['count'] = count;
        res.send(BizResult.success(result));
    }
}

module.exports = UserController