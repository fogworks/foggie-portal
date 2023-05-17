const BizResult = require('./BizResult');
const BizResultCode = require('./BaseResultCode');
const logger = require('./logger')('DeviceController.js');
const config = require('config');

class DeviceController {

    // get used space from foggie
  static async getUsedSpace(req, res) {

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

module.exports = DeviceController