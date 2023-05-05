const BizResult = require('./BizResult');
const BizResultCode = require('./BaseResultCode');
const logger = require('./logger')('AssetsController.js');
const assetsService = require('./AssetsService');
const userService = require('./UserService');
const DMC = require('dmc.js');
const config = require('config');
const request = require('sync-request');

class AssetsController {

    /**
     * 转账
     * @param {*} req HTTP请求 
     * @param {*} res HTTP响应
     * @returns 
     */
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
        if (!regex.test(amount)) {
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

    /**
     * 获取订单中的资产记录
     * @param {*} req 
     * @param {*} res 
     */
    static getAssetsOfOrder(req, res) {

        var pageNum = req.body.pageNum;
        var limit = req.body.limit;
        var orderId = req.body.orderId;

        var chainConfig = config.get('chainConfig')
        var transactionAddress = chainConfig.get('transactionAddress')
        var getAssets = chainConfig.get('getAssets')

        var pageSize = 10;
        if (typeof (limit) !== "undefined") {
            pageSize = limit
        }

        var skip = 0;
        if (typeof (pageNum) !== "undefined") {
            skip = (pageNum - 1) * pageSize
        }

        let body = '{\n' +
            '        find_order_asset_record(\n' +
            '    limit: ' + pageSize + ',\n' +
            '    skip: ' + skip + ',\n' +
            '    order: "-create_time,id",\n' +
            '    where: {\n' +
            '        order_id: "'+order+'",\n' +
            '        acc_type: 1,\n' +
            '        rec_type: {ne: 5},\n' +
            '        change_amount: {\n' +
            '            ne: "0.0000", \n' +
            '        },\n' +
            '    },\n' +
            '){ \n' +
            '    change_amount\n' +
            '    change_symbol\n' +
            '    acc_type\n' +
            '    rec_type\n' +
            '    create_time\n' +
            '    createdAt\n' +
            '    updatedAt\n' +
            '    id\n' +
            '}\n' +
            '    }'
        var assetsReq = request('POST', transactionAddress + getAssets, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: body
        }).getBody('utf-8')
        let assetsList = JSON.parse(assetsReq).data.find_order_asset_record
        // 获取用户订单总数
        let num = '{count_order_asset_record(\n' +
            '            where:{order_id:"' + orderId + '",acc_type:1,rec_type:{ne:5},change_amount:{ne:0.0000}}\n' +
            '        )\n' +
            '    }'
        let assetsCount = JSON.parse(request('POST', transactionAddress + getAssets, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: num
        }).getBody('utf-8')).data.count_order_asset_record
        var result = {}
        result['count'] = assetsCount
        result['list'] = assetsList

        res.send(BizResult.success(result));
    }
}

module.exports = AssetsController