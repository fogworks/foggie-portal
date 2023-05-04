const BizResult = require('./BizResult');
const BizResultCode = require('./BaseResultCode');
const logger = require('./logger')('AssetsController.js');
const assetsService = require('./AssetsService');
const userService = require('./UserService');
const DMC = require('dmc.js');
const config = require('config');

class AssetsController {

    // 转账
    static async transfer(req, res) {
        var email = req.body.email;
        var chainId = req.body.chainId;
        var to = req.body.to;
        var amount = req.body.amount;
        var memo = req.body.memo;

        if (!email || !chainId || !to || !amount) {
            res.send(BizResult.validateFailed());
            return;
        }
        const regex = /^\d+(\.\d{4})$/;
        if(!regex.test(amount)) {
            res.send(BizResult.validateFailed(amount));
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
        var result = await assetsService.transfer(dmc_client, username, to, amount, memo);
        if (result instanceof BizResultCode) {
            res.send(BizResult.fail(result));
            return;
        }
        res.send(BizResult.success(result));
    }
}

module.exports = AssetsController