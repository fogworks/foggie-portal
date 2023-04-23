const DMC = require('dmc.js');
const request = require('sync-request')
const merkle = require('merkle');

////////////////////////////////////////////user///////////
var dmc_client = DMC({
    chainId: "4d1fb981dd562d2827447dafa89645622bdcd4e29185d60eeb45539f25d2d85d",
    keyProvider: "5J2J27QSRhX4yXaxDrbA2w1RoWciFV4J9gdQNz1fUGxN1BhJ93z",
    httpEndpoint: "http://154.22.123.188:8870",
    logger: {
        log: null,
        error: null
    }
});

// 发起挑战
function reqChallenge() {
    let data = "123";
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
                    actor: "tianbao12345",
                    permission: 'active'
                }
            ],
            data: {
                sender: "tianbao12345",
                order_id: 153,
                data_id: 1,
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


// 领取交付奖励
function claimorder() {
    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'claimorder',
            authorization: [
                {
                    actor: "tianbao12345",
                    permission: 'active'
                }
            ],
            data: {
                payer: "tianbao12345",
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
// claimorder();

// 查询挑战记录
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

// findChallenge();

function transfer() {
    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'transfer',
            authorization: [
                {
                    actor: "tianbao12345",
                    permission: 'active'
                }
            ],
            data: {
                from: "tianbao12345",
                to: "miner1222222",
                quantity: "100.0000 DMC",
                memo: "share test DMC"
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

// transfer();

// 买单
function order() {
    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'order',
            authorization: [
                {
                    actor: "tianbao12345",
                    permission: 'active'
                }
            ],
            data: {
                owner: "tianbao12345",
                bill_id: "195",
                benchmark_price: "110",
                epoch: "24",
                price_range: 3,
                asset: {
                    quantity: "10 PST",
                    contract: "datamall"
                },
                reserve: {
                    quantity: "0.2400 DMC",
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
// order();

// 用户提交merkle树
function userPushMerkle() {
    var tree = merkle('sha256').sync(['123', '456', '789']);
    dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'addmerkle',
            authorization: [
                {
                    actor: "tianbao12345",
                    permission: 'active'
                }
            ],
            data: {
                sender: "tianbao12345",
                order_id: 151,
                merkle_root: tree.root(),
                data_block_count: 12
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

// userPushMerkle();

////////////////////////////////////////////miner///////////
var miner_dmc_client = DMC({
    chainId: "4d1fb981dd562d2827447dafa89645622bdcd4e29185d60eeb45539f25d2d85d",
    keyProvider: "5KV7aKDajbmgG54RPvpyyfAtRBCs69XqXXRvEetSrjtJ7medN5h",
    httpEndpoint: "http://154.22.123.188:8870",
    logger: {
        log: null,
        error: null
    }
});

// 质押
function increase() {
    miner_dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'increase',
            authorization: [
                {
                    actor: "miner1222222",
                    permission: 'active'
                }
            ],
            data: {
                owner: "miner1222222",
                miner: "miner1222222",
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
// increase();

// 铸造
function mint() {
    miner_dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'mint',
            authorization: [
                {
                    actor: "miner1222222",
                    permission: 'active'
                }
            ],
            data: {
                owner: "miner1222222",
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

// mint();

// 挂单
function bill() {
    miner_dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'bill',
            authorization: [
                {
                    actor: "miner1222222",
                    permission: 'active'
                }
            ],
            data: {
                owner: "miner1222222",
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



// 矿工提交merkle树
function minerPushMerkle() {
    var tree = merkle('sha256').sync(['123', '456', '789']);
    miner_dmc_client.transact({
        actions: [{
            account: "dmc.token",
            name: 'addmerkle',
            authorization: [
                {
                    actor: "miner1222222",
                    permission: 'active'
                }
            ],
            data: {
                sender: "miner1222222",
                order_id: 153,
                merkle_root: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                data_block_count: 0
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



//////////////////////////DB test /////////////////////////
const NeDB = require('nedb');
const config = require('config');
const process = require('node:process');
const path = require('path');
const dbConfig = config.get('dbConfig');
const testTableName = dbConfig.get('testTableName');

const db = new NeDB({
    filename: process.env.HOME + path.sep + testTableName,
    autoload: true
});


// var data = Buffer.from('1234567890');
// db.insert({
//     primary_key: 'binary',
//     data: data,
// }, function (err, doc) {
//     if (err) {
//         console.log('err:', err);
//         // resolve(BizResultCode.SAVE_PASSWORD_FAILED);
//         return;
//     }
//     console.log('doc:', doc);
// });

// db.find({
//     primary_key: 'binary'
// }, function (err, docs) {
//     if (err) {
//         console.log('err:', err);
//         return;
//     }
//     var data = Buffer.from(docs[0].data).toString('utf8');
//     console.log('data:', data);
// });


const fs = require('fs');
const zlib = require('zlib');
// read the image file
const imageData = fs.readFileSync('/Users/carl/Documents/5f475eb447fb4');
// compress the image data
var compressedData = zlib.gzipSync(imageData);
var base64data = Buffer.from(compressedData).toString('base64');

// insert the binary data into the database
// db.insert({ data: base64data }, function (err, newDoc) {
//     if (err) {
//         console.log(err);
//     } else {
//         // console.log('Inserted new document:', newDoc);
//         // retrieve the binary data from the database
//         db.findOne({ _id: newDoc._id }, function (err, doc) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 // write the binary data to a new file
//                 var data = Buffer.from(doc.data, 'base64');
//                 fs.writeFileSync('/Users/carl/Documents/new-5f475eb447fb4', zlib.unzipSync(data));
//                 console.log('Saved binary data to file: new-image.jpg');
//             }
//         });
//     }
// });


// import("es6-modules.mjs").then((module)=>{/*…*/}).catch((err)=>{/**…*/})
// // 或者使用 async 函数
// (async () => {
//   await import('./es6-modules.mjs');
// })();


reqChallenge();
// bill();
// minerPushMerkle();

