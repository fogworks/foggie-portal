const BizResult = require('./BizResult')
const BizResultCode = require('./BaseResultCode');
const request = require('sync-request')
const config = require('config')
const logger = require('./logger')('OrderController.js')
const DMC = require('dmc.js')
const userService = require('./UserService')
const orderService = require('./OrderService')
const pow_proto = require('./grpc/pow');
const grpc = require('@grpc/grpc-js');

class OrderController {

    /**
     * 买单
     * @param {*} req    HTTP的请求
     * @param {*} response      HTTP的响应
     * @returns 
     */
    static async buy(req, response) {

        // 用户名
        var username = req.body.username;
        // chainId
        var chainId = req.body.chainId;
        // 挂单的id
        var billId = req.body.billId;
        // 购买周期，单位周
        var period = req.body.period;
        // 基准价格，单位 DMC
        var benchmarkPrice = req.body.benchmarkPrice;
        // 价格区间 1 基准价格正负浮动20%；2 基准价格正负浮动30%
        var priceRange = req.body.priceRange;
        // 购买PST的数量
        var unmatchedAmount = req.body.unmatchedAmount;
        // 订单总价，单位 DMC
        var totalPrice = req.body.totalPrice;
        // foggie的邮箱
        var email = req.body.email;

        var chainConfig = config.get('chainConfig')
        var httpEndpoint = chainConfig.get('httpEndpoint')

        if (!chainId || !billId || !period || !benchmarkPrice || !priceRange || !unmatchedAmount || !totalPrice || !username || !email) {
            response.send(BizResult.validateFailed());
            return;
        }

        var keyProvider = await userService.getPrivateKeyByEmail(email);
        if (keyProvider instanceof BizResultCode) {
            response.send(BizResult.fail(keyProvider));
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
                        actor: username,
                        permission: 'active'
                    }
                ],
                data: {
                    owner: username,
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
        }).then(async (res) => {
            // 根据买单的返回数据获取订单的基本信息，包含订单的id、矿工、用户
            var orderBasic = await orderService.getOrderBasicByBuyRes(res);
            if (orderBasic instanceof BizResultCode) {
                response.send(BizResult.fail(orderBasic));
                return;
            }
            // 保存订单到neDB
            var saveRes = await orderService.saveOrder(email, orderBasic.orderId, orderBasic.miner, orderBasic.user, billId, unmatchedAmount, totalPrice, res.transaction_id);
            if (saveRes instanceof BizResultCode) {
                response.send(BizResult.fail(saveRes));
                return;
            }
            // 同步订单到注册中心
            var syncOrderRes = await orderService.syncOrder2RegisterCenter(email, orderBasic.orderId,
                billId, unmatchedAmount * 1024 * 1024 * 1024, 0, res.transaction_id);
            if (syncOrderRes instanceof BizResultCode) {
                response.send(BizResult.fail(BizResultCode.SYNC_ORDER_2_REGISTER_CENTER_FAILED));
                return;
            }
            response.send(BizResult.success(res.transaction_id))
        }).catch((err) => {
            logger.error(err)
            response.send(BizResult.fail(BizResultCode.ORDER_BUY_FAILED))
        })
    }

    static async syncOrder(req, res) {
        var email = req.body.email;
        var billId = req.body.billId;
        var order = await orderService.getOrderByBillId(email, billId);
        if (order instanceof BizResultCode) {
            res.send(BizResult.fail(BizResultCode.SYNC_ORDER_2_REGISTER_CENTER_FAILED));
            return;
        }
        // 同步订单到注册中心
        var syncOrderRes = await orderService.syncOrder2RegisterCenter(email, order.order_id,
            order.bill_id, order.pst * 1024 * 1024 * 1024, 0, order.transaction_id);
        if (syncOrderRes instanceof BizResultCode) {
            res.send(BizResult.fail(BizResultCode.SYNC_ORDER_2_REGISTER_CENTER_FAILED));
            return;
        }
        return res.send(BizResult.success());
    }

    /**
     * 获取筛选的订单列表
     * 筛选条件的价格范围是 左闭右闭
     * @param {*} username  用户名
     * @param {*} unmatchedAmount 购买PST的数量
     * @param {*} period    购买周期，单位 周
     * @param {*} minPrice  最低价，单位 DMC
     * @param {*} maxPrice  最高价，单位 DMC
     * @param {*} res       HTTP的响应
     * @returns 订单列表
     */
    static outstandingOrders(username, unmatchedAmount, period, minPrice, maxPrice, res) {

        if (!username || !unmatchedAmount || !period) {
            res.send(BizResult.validateFailed())
            return;
        }

        var moment = require('moment')
        var expireTime = moment().add(period, "weeks").utc().format()

        var chainConfig = config.get('chainConfig')
        var createTime = chainConfig.get('createTime')
        var transactionAddress = chainConfig.get('transactionAddress')
        var getOutstandingOrders = chainConfig.get('getOutstandingOrders')

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
            '                    owner: { ne : "' + username + '"}\n' +
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
        let outstandingOrders = JSON.parse(request('POST', transactionAddress + getOutstandingOrders, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: body
        }).getBody('utf-8')).data.find_bill
        res.send(BizResult.success(outstandingOrders));
    }

    /**
     * 获取用户的订单列表
     * @param {*} username  用户名 
     * @param {*} pageNum   页数
     * @param {*} limit     每页展示的条数
     * @param {*} res       HTTP的响应
     * @returns 订单列表
     */
    static orderList(username, pageNum, limit, res) {

        if (!username) {
            res.send(BizResult.validateFailed())
            return;
        }

        var chainConfig = config.get('chainConfig')
        var transactionAddress = chainConfig.get('transactionAddress')
        var getOrders = chainConfig.get('getOrders')

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
            '                    user_id: "' + username + '",\n' +
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
        let orderList = JSON.parse(request('POST', transactionAddress + getOrders, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: body
        }).getBody('utf-8')).data.find_order
        // 获取用户订单总数
        let num = '{count_order(\n' +
            '            where:{and:[{user_id:"' + username + '" }]}\n' +
            '        )\n' +
            '    }'
        let orderCount = JSON.parse(request('POST', transactionAddress + getOrders, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: num
        }).getBody('utf-8')).data.count_order
        var result = {}
        result['count'] = orderCount
        result['list'] = orderList

        res.send(BizResult.success(result));
    }

    /**
     * 获取用户的订单列表
     * @param {*} orderId   订单id
     * @param {*} res       HTTP的响应
     * @returns 订单列表
     */
    static getOrderById(orderId, res) {

        if (!orderId) {
            res.send(BizResult.validateFailed())
            return;
        }

        var chainConfig = config.get('chainConfig')
        var transactionAddress = chainConfig.get('transactionAddress')
        var getOrders = chainConfig.get('getOrders')

        let body = '{\n' +
            '        find_order(\n' +
            '                where: {\n' +
            '                    id: "' + orderId + '",\n' +
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
        // let request = ;
        let order = JSON.parse(request('POST', transactionAddress + getOrders, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: body
        }).getBody('utf-8')).data.find_order;

        res.send(BizResult.success(order));
    }

    /**
     * 上传merkle树
     * @param {*} req HTTP的request 
     * @param {*} res HTTP的response
     * @returns 
     */
    static async pushMerkle(req, res) {

        var chainId = req.body.chainId;
        var username = req.body.username;
        var orderId = req.body.orderId;
        var email = req.body.email;

        if (!chainId || !username || !orderId || !email) {
            res.send(BizResult.validateFailed());
            return;
        }

        var privateKey = await userService.getPrivateKeyByEmail(email);
        if (privateKey instanceof BizResultCode) {
            logger.info('private key is null');
            res.send(BizResult.fail(privateKey));
            return;
        }

        var chainConfig = config.get('chainConfig');
        var httpEndpoint = chainConfig.get("httpEndpoint");
        var dmcClient = DMC({
            chainId: chainId,
            keyProvider: privateKey,
            httpEndpoint: httpEndpoint,
            logger: {
                log: null,
                error: null
            }
        });

        const getMerkleRequest = {
            id: orderId
        };

        var powClient = OrderController.getPowGrpcClient();
        powClient.GetMerkleRoot(getMerkleRequest, function (err, data) {
            if (err) {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.GET_MERKLE_FAILED));
                return;
            }
            logger.info("GetMerkleRoot, data:{}", data.root);
            var merkleRootBytes = data.root.normalRoot;
            var merkleRoot = Buffer.from(merkleRootBytes).toString('hex');
            var dataBlockCount = data.root.totalBlocks;
            logger.info('pushMerkle orderId{},merkleRoot{},blockCount:{}', orderId, merkleRoot, dataBlockCount);
            dmcClient.transact({
                actions: [{
                    account: "dmc.token",
                    name: 'addmerkle',
                    authorization: [
                        {
                            actor: username,
                            permission: 'active'
                        }
                    ],
                    data: {
                        sender: username,
                        order_id: orderId,
                        merkle_root: merkleRoot,
                        data_block_count: dataBlockCount
                    }
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then(async (result) => {
                var savePushMerkleRecordRes = await orderService.savePuskMerkleRecord(orderId, username, merkleRoot, dataBlockCount, result.transaction_id);
                if (savePushMerkleRecordRes instanceof BizResultCode) {
                    res.send(BizResult.fail(savePushMerkleRecordRes));
                    return;
                }
                res.send(BizResult.success(result.transaction_id));
            }).catch((err) => {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
            })
        });
    }

    static getPowGrpcClient() {
        var grpcConfig = config.get('grpcConfig');
        var ip = grpcConfig.get("ip");
        var port = grpcConfig.get("port");
        return new pow_proto.PowService(ip + ':' + port, grpc.credentials.createInsecure());
    }

    /**
     * 查询，包含 订单id，merkleRoot，dataBlockCount，transactionId
     * @param {*} orderId       订单id
     * @param {*} username      用户名
     * @param {*} pageSize      每页条数
     * @param {*} pageNo        页数
     * @param {*} res HTTP的response
     * @returns 
     */
    static async getPushMerkleRecord(orderId, username, pageSize, pageNo, res) {

        if (!orderId || !username) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }

        var limit = 10;
        if (typeof (pageSize) !== "undefined") {
            limit = pageSize
        }

        var skip = 0;
        if (typeof (pageNo) !== "undefined") {
            skip = (pageNo - 1) * limit
        }

        var resultData = await orderService.getPuskMerkleRecord(orderId, username, skip, limit);
        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }

        var total = await orderService.getPuskMerkleRecordCount(orderId, username);
        if (total instanceof BizResultCode) {
            res.send(BizResult.fail(total));
            return;
        }

        var result = {};
        result['list'] = resultData;
        result['count'] = total;
        res.send(BizResult.success(result));
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

        if (!orderId) {
            res.send(BizResult.validateFailed());
            return;
        }
        var chainConfig = config.get('chainConfig')
        var transactionAddress = chainConfig.get('transactionAddress')
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
        let challengeList = JSON.parse(request('POST', transactionAddress + getChallengeList, {
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
        var httpEndpoint = chainConfig.get('httpEndpoint')
        var getChainInfo = chainConfig.get('getChainInfo')
        let chainId = JSON.parse(request('POST', httpEndpoint + getChainInfo, {}).getBody('utf-8')).chain_id

        return BizResult.success(chainId);
    }

    /**
     * 获取基准价格
     * @returns 基准价格
     */
    static getBenchmarkPrice() {
        var chainConfig = config.get('chainConfig')
        var httpEndpoint = chainConfig.get('httpEndpoint')
        var getTableRows = chainConfig.get('getTableRows')
        let benchmarkPrice = JSON.parse(request('POST', httpEndpoint + getTableRows, {
            json: { "json": true, "code": "dmc.token", "scope": "dmc.token", "table": "bcprice" }
        }).getBody('utf-8')).rows[0].benchmark_price

        return BizResult.success(benchmarkPrice);
    }
}

module.exports = OrderController