const DMC = require('dmc.js');
const request = require('sync-request')
const merkle = require('merkle');

////////////////////////////////////////////user///////////
var dmc_client = DMC({
    chainId: "bb6e31180359e169335481bad672aadf57cfb5787379bedb6a5dce916fcb0ac5",
    keyProvider: "5HsrwqjEJHsvqKgh4LDKwWQsfKK9UZygPYCspRaVfwM3recZC44",
    httpEndpoint: "http://156.242.10.10:5802",
    logger: {
        log: null,
        error: null
    }
});

function reqChallenge() {
    let data = "12345";
    let nonce = "QmdigZtSztwgxMFs6QqEUgfLu4YyPsGPquVDhTNqqmw3U8";
    let pre_data_hash = DMC.ecc.sha256(data + nonce);
    let data_hash = Buffer.from(pre_data_hash).toString('hex');

    // Buffer.from(merkleRootBytes).toString('hex')

    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'reqchallenge',
            authorization: [
                {
                    actor: "tbliuca12345",
                    permission: 'active'
                }
            ],
            data: {
                sender: "tbliuca12345",
                order_id: 62,
                data_id: 2,
                hash_data: data_hash,
                nonce: nonce
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}

function paychallenge() {
    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'paychallenge',
            authorization: [
                {
                    actor: "tbliuca12345",
                    permission: 'active'
                }
            ],
            data: {
                sender: "tbliuca12345",
                order_id: 77
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
    // var intervalId = setInterval(function() {
    //     console.log("Hello World");
    //   }, 1000);

    //   setTimeout(() => {
    //     console.log("timeout");
    //     clearInterval(intervalId);
    //   }, 10000);
}


function claimorder() {
    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'claimorder',
            authorization: [
                {
                    actor: "tbliuca12345",
                    permission: 'active'
                }
            ],
            data: {
                payer: "tbliuca12345",
                order_id: 150
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}


function findChallenge() {
    var skip = 0;
    var pageSize = 10;
    var orderId = 150;
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
    let challengeList = JSON.parse(request('POST', 'http://test.dmctech.io/1.1', {
        headers: {
            'Content-Type': 'application/graphql'
        },
        body: body
    }).getBody('utf-8')).data.find_challenge;
    console.log('challengeList:', challengeList);
}



function transfer() {
    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'transfer',
            authorization: [
                {
                    actor: "tbliuca12345",
                    permission: 'active'
                }
            ],
            data: {
                from: "tbliuca12345",
                to: "ljktest12345",
                quantity: "100.0000 DMC"
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}

function order() {
    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'order',
            authorization: [
                {
                    actor: "tbliuca12345",
                    permission: 'active'
                }
            ],
            data: {
                owner: "tbliuca12345",
                bill_id: "98",
                benchmark_price: "10000",
                epoch: "24",
                price_range: 3,
                asset: {
                    quantity: "1 PST",
                    contract: "datamall"
                },
                reserve: {
                    quantity: "154.0000 DMC",
                    contract: "datamall"
                },
                memo: ""
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}


function userPushMerkle() {
    var tree = merkle('sha256').sync(['456', '789', '432', '765']);
    console.log('tree_root:', tree.root());
    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'addmerkle',
            authorization: [
                {
                    actor: "tbliuca12345",
                    permission: 'active'
                }
            ],
            data: {
                sender: "tbliuca12345",
                order_id: 61,
                merkle_root: tree.root(),
                data_block_count: 3323
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}



////////////////////////////////////////////miner///////////
var miner_dmc_client = DMC({
    chainId: "bb6e31180359e169335481bad672aadf57cfb5787379bedb6a5dce916fcb0ac5",
    keyProvider: "5K7KeVcqhLKAHCun34Ziz3pw9FUrmM67FaU8eEnuBCxoJt2Ctew",
    httpEndpoint: "http://156.242.10.10:5802",
    logger: {
        log: null,
        error: null
    }
});

function increase() {
    miner_dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'increase',
            authorization: [
                {
                    actor: "ljktest12345",
                    permission: 'active'
                }
            ],
            data: {
                owner: "ljktest12345",
                miner: "ljktest12345",
                asset: {
                    quantity: "4.0000 DMC",
                    contract: "datamall"
                }
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}


function mint() {
    miner_dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'mint',
            authorization: [
                {
                    actor: "ljktest12345",
                    permission: 'active'
                }
            ],
            data: {
                owner: "ljktest12345",
                asset: {
                    quantity: "40 PST",
                    contract: "datamall"
                }
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}



function bill() {
    miner_dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'bill',
            authorization: [
                {
                    actor: "ljktest12345",
                    permission: 'active'
                }
            ],
            data: {
                owner: "ljktest12345",
                asset: {
                    quantity: "10 PST",
                    contract: "datamall"
                },
                price: 0.001,
                expire_on: "2024-01-01T08:01:01",
                deposit_ratio: "0",
                memo: ""
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}



function minerPushMerkle() {
    var tree = merkle('sha256').sync(['000', '123', '456', '789', '432', '765']);
    console.log('tree_root:', tree.root());
    miner_dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'addmerkle',
            authorization: [
                {
                    actor: "ljktest12345",
                    permission: 'active'
                }
            ],
            data: {
                sender: "ljktest12345",
                order_id: 62,
                merkle_root: tree.root(),
                data_block_count: 256
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}

function ansChallenge() {
    let data = "123";
    let nonce = "QmdigZtSztwgxMFs6QqEUgfLu4YyPsGPquVDhTNqqmw3U8";
    var dataHash = DMC.ecc.sha256(data + nonce);
    var reply_hash = Buffer.from(dataHash).toString('hex');

    miner_dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'anschallenge',
            authorization: [
                {
                    actor: "ljktest12345",
                    permission: 'active'
                }
            ],
            data: {
                sender: "ljktest12345",
                order_id: 62,
                reply_hash: reply_hash,
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then((res) => {
        // res.send(BizResult.success());
        console.log('res:', res);
    }).catch((err) => {
        console.log('err:', err);
        // logger.error('err:', err);
        // res.send(BizResult.fail(BizResultCode.PUSH_MERKLE_FAILED));
    })
}

// reqChallenge();
// paychallenge()
// ansChallenge();
// claimorder();
// findChallenge();
// transfer();
order();
// userPushMerkle();
// bill();
// minerPushMerkle();
// increase();
// mint();
// var someObject = {}
// const usedSpace = someObject.usedSpace ? someObject.usedSpace : 0;

// console.log('usedSpace:', usedSpace);
