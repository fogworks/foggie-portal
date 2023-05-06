const BizResult = require('./BizResult');
const BizResultCode = require('./BaseResultCode');
const logger = require('./logger')('AssetsController.js');
const assetsService = require('./AssetsService');
const userService = require('./UserService');
const DMC = require('dmc.js');
const config = require('config');
const request = require('sync-request');
const common = require('./common');

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
            '        order_id: "' + orderId + '",\n' +
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
        // 获取订单资产记录总数
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

    /**
     * 获取订单的收益列表
     * @param {*} req 
     * @param {*} res 
     */
    static getIncomeOfOrder(req, res) {

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
            '        order_id: "' + orderId + '",\n' +
            '        acc_type: 1,\n' +
            '        rec_type: {in: [4,5]},\n' +
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
        // 获取订单收益记录总数
        let num = '{count_order_asset_record(\n' +
            '            where:{order_id:"' + orderId + '",acc_type:1,rec_type:{in: [4,5]},change_amount:{ne:0.0000}}\n' +
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

    /**
     * 获取用户资产记录
     * @param {*} req 
     * @param {*} res 
     */
    static async getAssetsOfUser(req, res) {
        var email = req.body.email;
        var pageNum = req.body.pageNum;
        var limit = req.body.limit;

        if (!email) {
            res.send(BizResult.validateFailed(email));
            return;
        }

        var userInfo = await userService.getUserInfo(email);
        if (userInfo instanceof BizResultCode) {
            logger.info('userInfo is null');
            res.send(BizResult.fail(userInfo));
            return;
        }
        var username = userInfo.username;

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
            'find_tokens_action(\n' +
            '        skip: ' + skip + ',\n' +
            '        limit: ' + pageSize + ',\n' +
            '        order: "-createdAt,id",\n' +
            '        where: {\n' +
            '            or: [{\n' +
            '                and:[{\n' +
            '                    or:[\n' +
            '                         {\n' +
            '                           account_from_id: "' + username + '"\n' +
            '                         },\n' +
            '                         {\n' +
            '                           account_to_id: "' + username + '"\n' +
            '                         }\n' +
            '                    ]},\n' +
            '                    {\n' +
            '                      contract_action:{\n' +
            '                          in:[\n' +
            '                            "dmc.token/transfer",\n' +
            '                            "dmc.token/extransfer",\n' +
            '                            "dmc.token/exchange",\n' +
            '                            "dmc.token/addreserves",\n' +
            '                            "dmc.token/withdraw",\n' +
            '                            "dmc.token/outreceipt",\n' +
            '                            "dmc.token/orderchange",\n' +
            '                            "dmc.token/incentiverec",\n' +
            '                            "dmc.token/incentiverec1",\n' +
            '                            "dmc.token/mint",\n' +
            '                            "dmc.token/exlocktrans",\n' +
            '                            "dmc.token/exunlock",\n' +
            '                            "dmc.token/exretire",\n' +
            '                            "dmc.token/orderclarec",\n' +
            '                            "dmc.token/redeemrec",\n' +
            '                            "dmc.token/traderecord",\n' +
            '                            "dmc/undelegatebw",\n' +
            '                            "dmc.token/liqrec",\n' +
            '                            "dmc.token/subordasset",\n' +
            '                            "dmc.token/addordasset",\n' +
            '                            "dmc.token/assetcharec",\n' +
            '                            "dmc.token/assetrec",\n' +
            '                          ]\n' +
            '                    }\n' +
            '                    }\n' +
            '                ]\n' +
            '            },\n' +
            '            {\n' +
            '            and:[{\n' +
            '                or:[\n' +
            '                     {\n' +
            '                       account_from_id: "' + username + '"\n' +
            '                     },\n' +
            '                ]},\n' +
            '                {\n' +
            '                  contract_action:{\n' +
            '                      in:[\n' +
            '                        "dmc.token/increase",\n' +
            '                        "dmc.token/orderrec1",\n' +
            '                      ]\n' +
            '                }\n' +
            '                }\n' +
            '            ]\n' +
            '            },\n' +
            '            ]\n' +
            '        },\n' +
            '){\n' +
            '    account_from{\n' +
            '      id\n' +
            '    }\n' +
            '    account_to{\n' +
            '      id\n' +
            '    }\n' +
            '    contract_action\n' +
            '    action{\n' +
            '      rawData\n' +
            '    }\n' +
            '    id\n' +
            '    createdAt\n' +
            '  }\n' +
            '    }'
        var assetsReq = request('POST', transactionAddress + getAssets, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: body
        }).getBody('utf-8')
        let assetsList = JSON.parse(assetsReq).data.find_tokens_action
        // 获取用户订单总数
        let num = '{\n' +
            'count_tokens_action(\n' +
            '    where:{or:[{and:[{or:[{account_from_id:"' + username + '"},{account_to_id:"' + username + '"}]},{contract_action:{in:["dmc.token/transfer","dmc.token/extransfer","dmc.token/exchange","dmc.token/addreserves","dmc.token/withdraw","dmc.token/outreceipt","dmc.token/orderchange","dmc.token/incentiverec","dmc.token/incentiverec1","dmc.token/mint","dmc.token/exlocktrans","dmc.token/exunlock","dmc.token/exretire","dmc.token/orderclarec","dmc.token/redeemrec","dmc.token/traderecord","dmc/undelegatebw","dmc.token/liqrec","dmc.token/subordasset","dmc.token/addordasset","dmc.token/assetcharec","dmc.token/assetrec"]}}]},{and:[{or:[{account_from_id:"' + username + '"}]},{contract_action:{in:["dmc.token/increase","dmc.token/orderrec1"]}}]}]}\n' +
            '  )\n' +
            '    }'
        let assetsCount = JSON.parse(request('POST', transactionAddress + getAssets, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: num
        }).getBody('utf-8')).data.count_tokens_action
        var result = {}
        result['count'] = assetsCount
        result['list'] = assetsList

        res.send(BizResult.success(result));
    }

    /**
     * 用户资产概览
     * @param {*} req   HTTP请求
     * @param {*} res   HTTP响应
     */
    static async userOverview(req, res) {
        var email = req.body.email
        if (!email) {
            res.send(BizResult.validateFailed(email));
            return;
        }

        var userInfo = await userService.getUserInfo(email);
        if (userInfo instanceof BizResultCode) {
            logger.info('userInfo is null');
            res.send(BizResult.fail(userInfo));
            return;
        }
        var username = userInfo.username;
        var scope = common.walletNameToNumber(username);

        var chainConfig = config.get('chainConfig')
        var httpEndpoint = chainConfig.get('httpEndpoint')
        var getTableRows = chainConfig.get('getTableRows')
        let userAssets = JSON.parse(request('POST', httpEndpoint + getTableRows, {
            json: { "json": true, "code": "dmc.token", "scope": scope, "table": "accounts" }
        }).getBody('utf-8')).rows

        res.send(BizResult.success(userAssets));
    }
}

module.exports = AssetsController