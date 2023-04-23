const BizResult = require('./BizResult')
const BizResultCode = require('./BaseResultCode');
const request = require('sync-request')
const config = require('config')
const logger = require('./logger')('OrderController.js')
const DMC = require('dmc.js')

class OrderController {

    /**
     * 买单
     * @param {*} username 用户名
     * @param {*} chainId  chainId
     * @param {*} billId   挂单的id
     * @param {*} period    购买周期，单位周
     * @param {*} benchmarkPrice 基准价格，单位 DMC
     * @param {*} priceRange    价格区间 1 基准价格正负浮动20%；2 基准价格正负浮动30%
     * @param {*} unmatchedAmount 购买PST的数量
     * @param {*} totalPrice 订单总价，单位 DMC
     * @param {*} response      HTTP的响应
     * @returns 
     */
    static buy(username, chainId, billId, period, benchmarkPrice, priceRange, unmatchedAmount, totalPrice, response) {

        var userConfig = config.get('userConfig')
        var user = userConfig.get('username')
        var keyProvider = userConfig.get('keyProvider')
        var chainConfig = config.get('chainConfig')
        var httpEndpoint = chainConfig.get('httpEndpoint')
        var owner = user
        // 如果没有传入用默认配置的用户名 for test
        if (!username) {
            owner = username
        }

        if (!chainId || !billId || !period || !benchmarkPrice || !priceRange || !unmatchedAmount || !totalPrice) {
            response.send(BizResult.validateFailed());
            return;
        }

        // 基准价格*10000
        var benchmark = (benchmarkPrice * 10000).toString()
        var dmc_client = DMC({
            chainId: chainId,
            keyProvider: keyProvider,
            httpEndpoint: httpEndpoint,
            logger: {
                log: null,
                error: null
            }
        });

        dmc_client.transact({
            actions: [{
                account: "dmc.token",
                name: 'order',
                authorization: [
                    {
                        actor: owner,
                        permission: 'active'
                    }
                ],
                data: {
                    owner: owner,
                    bill_id: billId,
                    benchmark_price: benchmark,
                    epoch: period,
                    price_range: priceRange,
                    asset: {
                        quantity: unmatchedAmount + " PST",
                        contract: "datamall"
                    },
                    reserve: {
                        quantity: totalPrice + " DMC",
                        contract: "datamall"
                    },
                    memo: ""
                }
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        }).then((res) => {
            response.send(BizResult.success(res))
        }).catch((err) => {
            logger.error(err)
            response.send(BizResult.fail(BizResultCode.ORDER_BUY_FAILED))
        })
    }

    /**
     * 获取筛选的订单列表
     * 筛选条件的价格范围是 左闭右闭
     * @param {*} username  用户名
     * @param {*} unmatchedAmount 购买PST的数量
     * @param {*} period    购买周期，单位 周
     * @param {*} minPrice  最低价，单位 DMC
     * @param {*} maxPrice  最高价，单位 DMC
     * @returns 订单列表
     */
    static outstandingOrders(username, unmatchedAmount, period, minPrice, maxPrice) {
        var moment = require('moment')
        var expireTime = moment().add(period, "weeks").utc().format()

        var chainConfig = config.get('chainConfig')
        var createTime = chainConfig.get('createTime')
        var chainUrl = chainConfig.get('chainUrl')
        var getOutstandingOrders = chainConfig.get('getOutstandingOrders')

        var userConfig = config.get('userConfig')
        var user = userConfig.get('username')
        var owner = user
        // 如果没有传入用默认配置的用户名 for test
        if (!username) {
            owner = username
        }

        // minPrice & maxPrice同时有值
        var price = ""
        if (typeof (minPrice) !== "undefined" && typeof (maxPrice) !== "undefined") {
            price = "price: { between: [" + parseInt(minPrice * 10000) + "," + parseInt(maxPrice * 10000) + "]}";
        }
        let body = '{\n' +
            '        find_bill(\n' +
            '                skip: 0,\n' +
            '                limit: 10,\n' +
            '                order: "price,-expire_on,-created_time",\n' +
            '                where: {\n' +
            '                    owner: { ne : "' + owner + '"}\n' +
            '                    state: "active",\n' +
            '                    unmatched_amount: { gte: ' + unmatchedAmount + ' },\n' +
            '                    expire_on: {\n' +
            '                        gte: "' + expireTime + '"\n' +
            '                    },\n' +
            '                    created_time: {\n' +
            '                        gte: "' + createTime + '"\n' +
            '                    },\n' +
            '                    ' + price + '\n' +
            '                }\n' +
            '        ){\n' +
            '            owner\n' +
            '            state\n' +
            '            created_time\n' +
            '            unmatched_amount\n' +
            '            matched_amount\n' +
            '            id\n' +
            '            price\n' +
            '            createdAt\n' +
            '            expire_on\n' +
            '            deposit_ratio\n' +
            '            maker {\n' +
            '                benchmark_stake_rate\n' +
            '            }\n' +
            '        }\n' +
            '    }'
        let outstandingOrders = JSON.parse(request('POST', chainUrl + getOutstandingOrders, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: body
        }).getBody('utf-8')).data.find_bill
        return BizResult.success(outstandingOrders);
    }

    /**
     * 获取用户的订单列表
     * @param {*} username  用户名 
     * @param {*} pageNum   页数
     * @param {*} limit     每页展示的条数
     * @returns 订单列表
     */
    static orderList(username, pageNum, limit) {
        var chainConfig = config.get('chainConfig')
        var chainUrl = chainConfig.get('chainUrl')
        var getOrders = chainConfig.get('getOrders')
        var userConfig = config.get('userConfig')
        var user = userConfig.get('username')
        var owner = user
        // 如果没有传入用默认配置的用户名 for test
        if (!username) {
            owner = username
        }

        var pageSize = 10;
        if (typeof (limit) !== "undefined") {
            pageSize = limit
        }

        var skip = 0;
        if (typeof (pageNum) !== "undefined") {
            skip = (pageNum - 1) * pageSize
        }

        let body = '{\n' +
            '        find_order(\n' +
            '                skip: ' + skip + ',\n' +
            '                limit: ' + pageSize + ',\n' +
            '                where: {\n' +
            '                    user_id: "' + owner + '",\n' +
            '                },\n' +
            '                order: "-created_time,id",\n' +
            '        ){\n' +
            '            id\n' +
            '            user {\n' +
            '                id\n' +
            '            }\n' +
            '            miner {\n' +
            '                id\n' +
            '            }\n' +
            '            bill {\n' +
            '                id\n' +
            '            }\n' +
            '            created_time\n' +
            '            epoch\n' +
            '            user_pledge_amount\n' +
            '            miner_lock_pst_amount\n' +
            '            miner_lock_dmc_amount\n' +
            '            price_amount\n' +
            '            settlement_pledge_amount\n' +
            '            lock_pledge_amount\n' +
            '            state\n' +
            '            deliver_start_date\n' +
            '            latest_settlement_date\n' +
            '            miner_lock_rsi_amount\n' +
            '            miner_rsi_amount\n' +
            '            user_rsi_amount\n' +
            '            deposit_amount\n' +
            '            deposit_valid\n' +
            '            cancel_date\n' +
            '            createdAt\n' +
            '        }\n' +
            '    }'
        let orderList = JSON.parse(request('POST', chainUrl + getOrders, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: body
        }).getBody('utf-8')).data.find_order
        // 获取用户订单总数
        let num = '{count_order(\n' +
            '            where:{and:[{user_id:"' + owner + '" }]}\n' +
            '        )\n' +
            '    }'
        let orderCount = JSON.parse(request('POST', chainUrl + getOrders, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: num
        }).getBody('utf-8')).data.count_order
        var result = {}
        result['count'] = orderCount
        result['list'] = orderList

        return BizResult.success(result);
    }

    /**
     * 获取订单的挑战记录
     * @param {*} orderId   订单id
     * @param {*} pageNum   页数
     * @param {*} limit     每页展示的条数
     * @param {*} res       HTTP响应
     * @returns 挑战记录列表
     */
    static getChallengeList(orderId, pageNum, limit, res) {

        if(!orderId){
             res.send(BizResult.validateFailed());
             return;
        }
        var chainConfig = config.get('chainConfig')
        var chainUrl = chainConfig.get('chainUrl')
        var getChallengeList = chainConfig.get('getChallengeList')

        var pageSize = 10;
        if (typeof (limit) !== "undefined") {
            pageSize = limit
        }

        var skip = 0;
        if (typeof (pageNum) !== "undefined") {
            skip = (pageNum - 1) * pageSize
        }
        let body = '{\n' +
            '        find_challenge(\n' +
            '                skip: ' + skip + ',\n' +
            '                limit: ' + pageSize + ',\n' +
            '                where: {\n' +
            '                    order_id: ' + orderId + ',\n' +
            '                },\n' +
            '                order: "-id",\n' +
            '        ){\n' +
            '            pre_merkle_root\n' +
            '            pre_data_block_count\n' +
            '            merkle_root\n' +
            '            data_block_count\n' +
            '            merkle_submitter\n' +
            '            data_id\n' +
            '            hash_data\n' +
            '            challenge_times\n' +
            '            nonce\n' +
            '            state\n' +
            '            user_lock_amount\n' +
            '            miner_pay_amount\n' +
            '            challenge_date\n' +
            '            created_time\n' +
            '            order {\n' +
            '                id\n' +
            '            }\n' +
            '            challenger {\n' +
            '                id\n' +
            '            }\n' +
            '        }\n' +
            '    }'
        let challengeList = JSON.parse(request('POST', chainUrl + getChallengeList, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: body
        }).getBody('utf-8')).data.find_challenge;
        res.send(BizResult.success(challengeList));
    }

    /**
     * 获取chainId
     * @returns chainId
     */
    static getChainId() {
        var chainConfig = config.get('chainConfig')
        var chainUrl = chainConfig.get('chainUrl')
        var getChainInfo = chainConfig.get('getChainInfo')
        let chainId = JSON.parse(request('POST', chainUrl + getChainInfo, {}).getBody('utf-8')).chain_id

        return BizResult.success(chainId);
    }

    /**
     * 获取基准价格
     * @returns 基准价格
     */
    static getBenchmarkPrice() {
        var chainConfig = config.get('chainConfig')
        var chainUrl = chainConfig.get('chainUrl')
        var getTableRows = chainConfig.get('getTableRows')
        let benchmarkPrice = JSON.parse(request('POST', chainUrl + getTableRows, {
            json: { "json": true, "code": "dmc.token", "scope": "dmc.token", "table": "bcprice" }
        }).getBody('utf-8')).rows[0].benchmark_price

        return BizResult.success(benchmarkPrice);
    }
}

module.exports = OrderController