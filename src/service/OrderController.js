const BizResult = require('./BizResult')
const BizResultCode = require('./BaseResultCode');
const request = require('sync-request')
const config = require('config')
const logger = require('./logger')('OrderController.js')
const DMC = require('dmc.js')
const zlib = require('zlib')
const userService = require('./UserService')
const orderService = require('./OrderService')
const fileService = require('./FileService')
const assetsService = require('./AssetsService')
const Encrypt = require('./Encrypt');

const fileConfig = config.get('fileConfig');
const merkleBufferSize = fileConfig.get('merkleBufferSize');

class OrderController {

    /**
     * buy order
     * @param {*} req    HTTP request
     * @param {*} response   HTTP response
     * @returns 
     */
    static async buy(req, response) {

        var chainId = req.body.chainId;
        var billId = req.body.billId;
        // buy period, unit week
        var period = req.body.period;
        // benchmark price,unit DMC
        var benchmarkPrice = req.body.benchmarkPrice;
        // 1 fluctuates by 20% plus or minus ,
        // 2 fluctuates by 30% plus or minus
        // 3 no limit
        var priceRange = req.body.priceRange;
        // PST number
        var unmatchedAmount = req.body.unmatchedAmount;
        // total price, unit DMC
        var totalPrice = req.body.totalPrice;
        var email = req.body.email;

        var chainConfig = config.get('chainConfig')
        var httpEndpoint = chainConfig.get('httpEndpoint')

        if (!chainId || !billId || !period || !benchmarkPrice || !priceRange || !unmatchedAmount || !totalPrice || !email) {
            response.send(BizResult.validateFailed());
            return;
        }

        var keyProvider = await userService.getPrivateKeyByEmail(email);
        if (keyProvider instanceof BizResultCode) {
            response.send(BizResult.fail(keyProvider));
            return;
        }
        var userInfo = await userService.getUserInfo(email);
        if (userInfo instanceof BizResultCode) {
            logger.info('userInfo is null');
            response.send(BizResult.fail(userInfo));
            return;
        }
        var username = userInfo.username;

        // valid balance
        var userAssets = assetsService.getUserAssets(username);
        if (userAssets instanceof BizResultCode) {
            response.send(BizResult.fail(userAssets));
            return;
        }

        var dmc = assetsService.getAssetsAmount(userAssets, 'DMC');
        if(parseFloat(dmc) < parseFloat(totalPrice)){
            response.send(BizResult.fail(BizResultCode.BALANCE_NOT_ENOUGH));
            return;
        }

        // benchmarkPrice*10000
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
            // Obtain basic information about the order based on the returned data
            // of the purchase order, including the order ID, miner, and user
            var orderBasic = await orderService.getOrderBasicByBuyRes(res);
            if (orderBasic instanceof BizResultCode) {
                response.send(BizResult.fail(orderBasic));
                return;
            }
            // save order into neDB
            var saveRes = await orderService.saveOrder(email, orderBasic.orderId, orderBasic.miner, orderBasic.user, billId, unmatchedAmount, totalPrice, res.transaction_id, res.processed.block_num);
            if (saveRes instanceof BizResultCode) {
                response.send(BizResult.fail(saveRes));
                return;
            }
            // sync order to register center
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

    /**
     * sync order to register center
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async syncOrder(req, res) {
        var email = req.body.email;
        var billId = req.body.billId;
        var order = await orderService.getOrderByBillId(email, billId);
        if (order instanceof BizResultCode) {
            res.send(BizResult.fail(BizResultCode.SYNC_ORDER_2_REGISTER_CENTER_FAILED));
            return;
        }
        // sync order to register center
        var syncOrderRes = await orderService.syncOrder2RegisterCenter(email, order.order_id,
            order.bill_id, order.pst * 1024 * 1024 * 1024, 0, order.transaction_id);
        if (syncOrderRes instanceof BizResultCode) {
            res.send(BizResult.fail(BizResultCode.SYNC_ORDER_2_REGISTER_CENTER_FAILED));
            return;
        }
        return res.send(BizResult.success());
    }

    /**
     * Obtain filtered order list
     * The price range of the filtering criteria is left closed and right closed
     * @param {*} req       HTTP request
     * @param {*} res       HTTP response
     * @returns order list
     */
    static async outstandingOrders(req, res) {

        var email = req.body.email;
        var unmatchedAmount = req.body.unmatchedAmount;
        var period = req.body.period;
        var minPrice = req.body.minPrice;
        var maxPrice = req.body.maxPrice;

        if (!email || !unmatchedAmount || !period) {
            res.send(BizResult.validateFailed())
            return;
        }

        var moment = require('moment')
        var expireTime = moment().add(period, "weeks").utc().format();

        var chainConfig = config.get('chainConfig')
        var createTime = chainConfig.get('createTime')
        var transactionAddress = chainConfig.get('transactionAddress')
        var getOutstandingOrders = chainConfig.get('getOutstandingOrders')

        var userInfo = await userService.getUserInfo(email);
        if (userInfo instanceof BizResultCode) {
            logger.info('userInfo is null');
            res.send(BizResult.fail(userInfo));
            return;
        }
        var username = userInfo.username;
        // minPrice & maxPrice is not null
        var price = ""
        if (minPrice && maxPrice) {
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
        var outstandingOrders = JSON.parse(request('POST', transactionAddress + getOutstandingOrders, {
            headers: {
                'Content-Type': 'application/graphql'
            },
            body: body
        }).getBody('utf-8')).data.find_bill;

        var orderConfig = config.get('orderConfig');
        var outstandinglimit = orderConfig.get('outstandinglimit');
        var sortOrders = outstandingOrders.sort((a, b) => parseFloat(b.deposit_ratio) - parseFloat(a.deposit_ratio)).slice(0, outstandinglimit);

        res.send(BizResult.success(sortOrders));
    }

    static getChallengeCount(req, res) {
        var orderId = req.body.orderId;
        var state = req.body.state;
        if (!orderId || !state) {
            res.send(BizResult.validateFailed())
            return;
        }
        var result = orderService.getChallengeCountByState(orderId, state);
        if (result instanceof BizResultCode) {
            res.send(BizResult.fail(result));
            return;
        }
        res.send(BizResult.success(result));
    }

    static async orderListAll(req, res) {

        var email = req.body.email;

        if (!email) {
            res.send(BizResult.validateFailed())
            return;
        }
        var resultData = await orderService.getOrdersFromDB(email);
        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }

        res.send(BizResult.success(resultData));

    }

    static async orderList(req, res) {

        var email = req.body.email;
        var limit = req.body.limit;
        var pageNum = req.body.pageNum;

        if (!email) {
            res.send(BizResult.validateFailed())
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
        // get count
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

    static async getOrderById(req, res) {

        var orderId = req.body.orderId;
        var email = req.body.email;
        var deviceType = req.body.deviceType;

        if (!orderId || !email || !deviceType) {
            res.send(BizResult.validateFailed());
            return;
        }

        var order = orderService.getOrderFromChain(orderId);
        if (order instanceof BizResultCode) {
            logger.info("get order from chain failed, orderId:{}", orderId);
            res.send(BizResult.fail(order));
            return;
        }

        var orderInfo = await orderService.getOrderById(email, orderId);
        order['used_space'] = orderInfo.used_space;
        order['total_space'] = orderInfo.total_space;
        order['foggie_id'] = orderInfo.foggie_id;
        var fileCount = await fileService.getFileCount(orderId, email, deviceType);
        order['file_count'] = fileCount;

        var chainConfig = config.get('chainConfig')
        var httpEndpoint = chainConfig.get('httpEndpoint')
        var getTableRows = chainConfig.get('getTableRows')
        try {
            var innermarker = JSON.parse(request('POST', httpEndpoint + getTableRows, {
                json: { "json": true, "code": "dmc.token", "scope": "dmc.token", "table": "innermarker" }
            }).getBody('utf-8')).rows[0]

            var x = innermarker.tokenx.quantity;
            var y = innermarker.tokeny.quantity;

            var rsi = userService.getAmount(x, y, 'RSI');
            var dmc = userService.getAmount(x, y, 'DMC');

            var userRsi = order.miner_lock_pst_amount;
            var epoch = 1;
            var estimated = userService.calcEstimated(dmc, rsi, userRsi, epoch);
            order['estimated'] = estimated;
        }
        catch (e) {
            logger.info('get innermarker failed, error: {}', e);
        }

        var challengeList = await orderService.getChallengeAllFromDB(orderId, email)
        if (challengeList instanceof BizResultCode) {
            res.send(BizResult.success(order));
            return;
        }
        if (challengeList.length == 0) {
            res.send(BizResult.success(order));
            return;
        }

        var challengeFailed = challengeList.reduce((acc, cur) => {
            if (cur.state === 6) {
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);

        var challengeSuccess = challengeList.reduce((acc, cur) => {
            if (cur.state === 5) {
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);
        order['challenge_num'] = challengeList.length;
        order['challenge_sccess'] = challengeSuccess;
        order['challenge_failed'] = challengeFailed;
        order['challenge_other'] = challengeList.length - challengeSuccess - challengeFailed;
        order['challenge_period'] = new Date().getTime() - new Date(challengeList[0].create_time).getTime();

        var challengePeriod = await orderService.getChallengeExpire(orderId, email);
        if (challengePeriod) {
            order['challenge_timeout'] = true;
        }
        res.send(BizResult.success(order));
    }

    static async payChallenge(req, res) {

        var orderId = req.body.orderId;
        var email = req.body.email;
        var chainId = req.body.chainId;

        if (!orderId || !email || !chainId) {
            res.send(BizResult.validateFailed());
            return;
        }

        var challengeList = await orderService.getChallengeFromDB(3, orderId, email);
        if (challengeList instanceof BizResultCode) {
            res.send(BizResult.fail(challengeList));
            return;
        }

        var chanllenge = challengeList[0];

        var privateKey = await userService.getPrivateKeyByEmail(email);
        if (privateKey instanceof BizResultCode) {
            logger.error("get privateKey is error, email:{}", email);
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

        var result = await orderService.payChallenge(chanllenge, dmc_client);
        if (result instanceof BizResultCode) {
            logger.info('payChallenge is error, orderId:{}', orderId);
            res.send(BizResult.fail(result));
            return;
        }
        res.send(BizResult.success(result));
    }

    static async pushMerkle(req, res) {
        var chainId = req.body.chainId;
        var orderId = req.body.orderId;
        var email = req.body.email;

        if (!chainId || !orderId || !email) {
            res.send(BizResult.validateFailed());
            return;
        }

        var fileConfig = config.get('fileConfig');
        var pushMerkleUsedSpaceRate = fileConfig.get('pushMerkleUsedSpaceRate');

        // valid used space > total space * 5% 
        var orderInfo = await orderService.getOrderById(email, orderId);
        if (orderInfo instanceof BizResultCode) {
            res.send(BizResult.fail(orderInfo));
            return;
        }

        var usedSpace = orderInfo.used_space ? orderInfo.used_space : 0;
        var totalSpace = orderInfo.total_space ? orderInfo.total_space : 0;
        if (usedSpace < totalSpace * pushMerkleUsedSpaceRate) {
            res.send(BizResult.fail(BizResultCode.ORDER_USED_SPACE_NOT_ENOUGH));
            return;
        }

        // valid challenge state
        // get user challenge count miner not response challenge count
        var challengeState = orderService.getChallengeCountByState(orderId, [3]);
        if (challengeState instanceof BizResultCode) {
            res.send(BizResult.fail(challengeState));
            return;
        }

        if (challengeState > 0) {
            res.send(BizResult.fail(BizResultCode.CHALLENGE_NO_RESPONSE));
            return;
        }

        var userInfo = await userService.getUserInfo(email);
        if (userInfo instanceof BizResultCode) {
            logger.info('userInfo is null');
            res.send(BizResult.fail(userInfo));
            return;
        }
        var username = userInfo.username;

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

        var foggieId = orderInfo.foggie_id;

        const getMerkleRequest = {
            id: foggieId,
            version: 0
        };

        var powClient = orderService.getPowGrpcClient();
        powClient.GetMerkleRoot(getMerkleRequest, function (err, data) {
            if (err) {
                logger.error('err:', err);
                res.send(BizResult.fail(BizResultCode.GET_MERKLE_FAILED));
                return;
            }
            var merkleRootBytes = data.root.normalRoot;
            var merkleRoot = Buffer.from(merkleRootBytes).toString('hex');
            var dataBlockCount = data.root.totalBlocks;
            var merkleVersion = data.root.version;
            logger.info('pushMerkle orderId{},merkleRoot{},merkleVersion:{},blockCount:{}', orderId, merkleRoot, merkleVersion, dataBlockCount);
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
                var savePushMerkleRecordRes = await orderService.savePuskMerkleRecord(orderId, email, merkleRoot, merkleVersion, dataBlockCount, result.transaction_id, result.processed.block_num);
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

    static async getPushMerkleRecord(req, res) {

        var orderId = req.body.orderId;
        var email = req.body.email;
        var pageSize = req.body.pageSize;
        var pageNo = req.body.pageNo;

        if (!orderId || !email) {
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

        var resultData = await orderService.getPuskMerkleRecord(orderId, email, skip, limit);
        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }

        var total = await orderService.getPuskMerkleRecordCount(orderId, email);
        if (total instanceof BizResultCode) {
            res.send(BizResult.fail(total));
            return;
        }

        var result = {};
        result['list'] = resultData;
        result['count'] = total;
        res.send(BizResult.success(result));
    }

    static async reqChallenge(req, response) {
        var orderId = req.body.orderId;
        var email = req.body.email;
        var chainId = req.body.chainId;

        if (!orderId || !email || !chainId) {
            response.send(BizResult.validateFailed());
            return;
        }

        var orderInfo = orderService.getOrderFromChain(orderId);
        if (orderInfo instanceof BizResultCode) {
            logger.info("get order from chain failed, orderId:{}", orderId);
            response.send(BizResult.fail(orderInfo));
            return;
        }
        if (orderInfo.state == 0 || orderInfo.state == 4) {
            logger.info("order state is invalid, can't reqchallenge, orderId:{}", orderId);
            response.send(BizResult.fail(BizResultCode.ORDER_STATE_INVALID_CHALLENGE));
            return;
        }

        // valid balance
        var balance = orderInfo.user_pledge_amount;
        var pstNumber = orderInfo.miner_lock_pst_amount;
        var amount = orderInfo.price_amount;
        var price = parseFloat(amount) / parseFloat(pstNumber);
        if((price * 10) > parseFloat(balance)){
            logger.info("dmc is not enough, can't reqchallenge, orderId:{}", orderId);
            response.send(BizResult.fail(BizResultCode.ORDER_DMC_NOT_ENOUGH));
            return;
        }

        // valid challenge status
        var challenge = orderService.getChallengeByOrderId(orderId);
        if (challenge instanceof BizResultCode) {
            logger.info("get challenge failed, orderId:{}", orderId);
            response.send(BizResult.fail(challenge));
            return;
        }
        if (challenge.state == 0 || challenge.state == 3 || challenge.state == 7) {
            logger.info("challenge state is invalid, can't reqchallenge, orderId:{}", orderId);
            response.send(BizResult.fail(BizResultCode.CHANLLENGE_STATE_INVALID_CHALLENGE));
            return;
        }

        var merkleRoot = challenge.merkle_root;
        var merkleRecord = await orderService.getPuskMerkleByRoot(orderId, email, merkleRoot);
        if (merkleRecord instanceof BizResultCode) {
            response.send(BizResult.fail(merkleRecord));
            return;
        }

        var merkleVersion = merkleRecord.merkle_version;

        var privateKey = await userService.getPrivateKeyByEmail(email);
        if (privateKey instanceof BizResultCode) {
            logger.info('private key is null');
            response.send(BizResult.fail(privateKey));
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

        var codebooks = await fileService.getFileCodeBook(orderId.toString(), email, merkleBufferSize);
        if (codebooks instanceof BizResultCode) {
            logger.info('codebooks is null');
            response.send(BizResult.fail(codebooks));
            return;
        }

        var codebook = codebooks[Math.floor(Math.random() * codebooks.length)];
        let originData = zlib.unzipSync(Buffer.from(codebook.data, 'base64'));
        let randomCharacter = Encrypt.randomString(4);
        let nonce = randomCharacter + "#" + codebook.cid + "#" + codebook.part_id + "#" + merkleVersion;

        // test user do evil
        var challengeConfig = config.get("challengeConfig");
        var userDoEvil = challengeConfig.get("userDoEvil");
        if (userDoEvil == 1) {
            var doEvilPartId = codebook.part_id + 1;
            nonce = randomCharacter + "#" + codebook.cid + "#" + doEvilPartId + "#" + merkleVersion + "#";
        }

        var containRandomData = Buffer.concat([originData, Buffer.from(randomCharacter)]);
        let preDataHash = DMC.ecc.sha256(containRandomData);
        let dataHash = Buffer.from(DMC.ecc.sha256(Buffer.from(preDataHash))).toString("hex");
        logger.info("challenge, orderId:{},cid:{},partId:{},data_hash:{},nonce:{}", orderId, codebook.cid, codebook.part_id, dataHash, nonce);
        var userInfo = await userService.getUserInfo(email);
        if (userInfo instanceof BizResultCode) {
            response.send(BizResult.fail(userInfo));
            return;
        }
        var username = userInfo.username;

        var orderInfo = await orderService.getOrderById(email, orderId);
        if (orderInfo instanceof BizResultCode) {
            res.send(BizResult.fail(orderInfo));
            return;
        }
        // get idx in order by cid and part_id
        var partId = await orderService.getPartIdByCidAndPartId(orderInfo.foggie_id, codebook.cid, codebook.part_id);
        dmc_client.transact({
            actions: [{
                account: "dmc.token",
                name: 'reqchallenge',
                authorization: [
                    {
                        actor: username,
                        permission: 'active'
                    }
                ],
                data: {
                    sender: username,
                    order_id: orderId,
                    data_id: partId,
                    hash_data: dataHash,
                    nonce: nonce
                }
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        }).then((res) => {
            orderService.saveChallengeRecord(orderId, email, username, codebook.cid, codebook.part_id, dataHash, nonce, res.transaction_id, res.processed.block_num);
            response.send(BizResult.success(res.transaction_id));
        }).catch((err) => {
            logger.error('err:', err);
            response.send(BizResult.fail(BizResultCode.REQ_CHALLENGE_FAILED));
        })
    }

    static async getChallengeList(req, res) {
        var email = req.body.email;
        var orderId = req.body.orderId;
        var limit = req.body.limit;
        var pageNum = req.body.pageNum;

        if (!orderId || !email) {
            res.send(BizResult.validateFailed(orderId));
            return;
        }
        if (typeof (limit) == "undefined") {
            limit = 10
        }

        var skip = 0;
        if (typeof (pageNum) !== "undefined") {
            skip = (pageNum - 1) * limit
        }

        var resultData = await orderService.getChallengeRecord(email, orderId, skip, limit);
        if (resultData instanceof BizResultCode) {
            res.send(BizResult.fail(resultData));
            return;
        }

        var total = await orderService.getChallengeCount(email, orderId);
        if (total instanceof BizResultCode) {
            res.send(BizResult.fail(total));
            return;
        }

        var result = {};
        result['list'] = resultData;
        result['count'] = total;
        res.send(BizResult.success(result));
    }

    static async release(req, res) {
        var email = req.body.email;
        var chainId = req.body.chainId;
        var orderId = req.body.orderId;
        var amount = req.body.amount;

        if (!email || !chainId || !orderId || !amount) {
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
        var result = await orderService.release(dmc_client, username, orderId, amount);
        if (result instanceof BizResultCode) {
            res.send(BizResult.fail(result));
            return;
        }
        res.send(BizResult.success(result));
    }

    static async append(req, res) {
        var email = req.body.email;
        var chainId = req.body.chainId;
        var orderId = req.body.orderId;
        var amount = req.body.amount;

        if (!email || !chainId || !orderId || !amount) {
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
        var result = await orderService.append(dmc_client, username, orderId, amount);
        if (result instanceof BizResultCode) {
            res.send(BizResult.fail(result));
            return;
        }
        res.send(BizResult.success(result));
    }

    static async cancel(req, res) {
        var email = req.body.email;
        var chainId = req.body.chainId;
        var orderId = req.body.orderId;

        if (!email || !chainId || !orderId) {
            res.send(BizResult.validateFailed());
            return;
        }

        var order = orderService.getOrderFromChain(orderId);
        if (order instanceof BizResultCode) {
            logger.info("get order from chain failed, orderId:{}", orderId);
            res.send(BizResult.fail(order));
            return;
        }
        // valid order state
        if (order.state > 0) {
            logger.error("order state is invalid, can't cancel, orderId:{}", orderId);
            res.send(BizResult.fail(BizResultCode.ORDER_STATE_INVALID_CANCEL));
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
        var result = await orderService.cancel(dmc_client, username, orderId);
        if (result instanceof BizResultCode) {
            res.send(BizResult.fail(result));
            return;
        }
        res.send(BizResult.success(result));
    }

    /**
     * sync device info（foggie 、 foggie max peerId、grpc、ip、port、token）
     * @param {*} req 
     * @param {*} res 
     */
    static async syncDevice(req, res) {
        var deviceId = req.body.deviceId;
        var email = req.body.email;
        if (!deviceId || !email) {
            res.send(BizResult.validateFailed());
            return;
        }

        // save device info to order
        var saveRes = await orderService.saveDevice2Order(email, deviceId);
        if (saveRes instanceof BizResultCode) {
            res.send(BizResult.fail(saveRes));
            return;
        }
        res.send(BizResult.success(saveRes));
    }

    static getChainId() {
        var chainId = orderService.getChainId();
        if (chainId instanceof BizResultCode) {
            return BizResult.fail(chainId);
        }
        return BizResult.success(chainId);
    }

    static getBenchmarkPrice() {
        var benchmarkPrice = orderService.getBenchmarkPrice();
        if (benchmarkPrice instanceof BizResultCode) {
            return BizResult.fail(benchmarkPrice);
        }
        return BizResult.success(benchmarkPrice);
    }
}

module.exports = OrderController