// const create  = require('ipfs-http-client')

// import { create } from 'ipfs-http-client'

// const ipfs = create()

// const data = 'hello world'

// const { cid } = await ipfs.add(data)
// console.log(cid.toString())

// import { CID } from 'multiformats/cid'
// import * as json from 'multiformats/codecs/json'
// import { sha256 } from 'multiformats/hashes/sha2'

// const CID = require('multiformats/cid')
// const json = require('multiformats/codecs/json')
// const sha256  = require('multiformats/hashes/sha2')

// const bytes = json.encode({ hello: 'world' })

// const hash = await sha256.digest(bytes)
// const cid = CID.create(1, json.code, hash)
// console.log(cid.toString())

// import { CID } from 'multiformats/cid'
// import { sha256 } from 'multiformats/hashes/sha2'
// import { encode } from 'multiformats/block'

// async function generateCID() {
//   const buf = Buffer.from('Hello, world!')
//   const block = await encode({ value: buf, hasher: sha256 })
//   const cid = new CID(block.cid)
//   console.log(cid.toString())
// }

// generateCID().catch(console.error)

// const randomHexString = (length) => {

//   if (length <= 0) {
//     return;
//   }
//   const result = [];
//   const characters = '0123456789abcdef';
//   for (let i = 0; i < length; i++) {
//     result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
//   }
//   return result.join('');
// }

// for (let i = 0; i < 10; i++) {
//   console.log(randomHexString(14));
// }



// var buffer = Buffer.from('hello world');
// console.log(buffer.length);
// var transferData = buffer;
// if(!Buffer.isBuffer(buffer)){
//     transferData = Buffer.alloc(2);
//     transferData.fill(buffer);
// }
// console.log(transferData.length);

// const crypto = require('crypto');
// const fs = require('fs');

// // 生成随机的私钥
// const privateKey = crypto.randomBytes(32).toString('hex');

// // 生成随机的16字节salt
// const salt = crypto.randomBytes(16);

// // 使用PBKDF2算法派生出一个32字节的加密密钥
// const password = 'yourPassword'; // 替换为您自己的密码
// const iterations = 10000;
// const keylen = 32;
// const digest = 'sha256';
// const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);

// // 使用AES-128-CBC算法加密私钥
// const iv = crypto.randomBytes(16);
// const cipher = crypto.createCipheriv('aes-128-cbc', derivedKey, iv);
// const encryptedPrivateKey = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()]);

// 构建Keystore对象
// const keystore = {
//   version: 3,
//   id: crypto.randomBytes(16).toString('hex'),
//   address: '',
//   crypto: {
//     ciphertext: encryptedPrivateKey.toString('hex'),
//     cipherparams: {
//       iv: iv.toString('hex')
//     },
//     cipher: 'aes-128-cbc',
//     kdf: 'pbkdf2',
//     kdfparams: {
//       c: iterations,
//       dklen: keylen,
//       salt: salt.toString('hex'),
//       prf: 'hmac-sha256'
//     }
//   }
// };

// // 计算并填写地址字段
// const publicKey = crypto.createHash('sha256').update(Buffer.from(privateKey, 'hex')).digest();
// const address = '0x' + crypto.createHash('rmd160').update(publicKey).digest('hex');
// keystore.address = address;

// console.log(JSON.stringify(keystore));
// // 将Keystore对象写入文件
// const keystorePath = '/path/to/keystore.json'; // 替换为您想要存储Keystore文件的路径
// fs.writeFileSync(keystorePath, JSON.stringify(keystore));
const fs = require('fs');
// 文件名列表
// const filenames = ['/var/folders/09/65dhg9416z19t_lnrxd220j80000gn/T/QPtIbauEdEqe1yJn-ZoU8bW6.zip', 
// '/var/folders/09/65dhg9416z19t_lnrxd220j80000gn/T/ZnWmSaYZ_QunV8R4scfarSvp.zip', 
// '/var/folders/09/65dhg9416z19t_lnrxd220j80000gn/T/PkNeiBeoMM7r0cTaeZ0ikfki.zip'];

// 记录所有文件内容的数组
// const contents = [];

// function readFile(index) {
//   if (index >= filenames.length) {
//   // 所有文件都已读取完毕，进行下一步处理
//   fs.writeFileSync('1.zip', contents);
//   return;
// }

//   const filename = filenames[index];
//   fs.readFile(filename, function(err, data) {
//     if (err) {
//       console.error(`Error reading file ${filename}: ${err}`);
//       return;
//     }
//     // 将当前文件内容拼接到之前记录下来的内容后面
//     contents.push(data);

//     // 读取下一个文件
//     readFile(index + 1);
//   });
// }
const crypto = require('crypto');
const zlib = require('zlib');
const DMC = require('dmc.js');
// readFile(0);
var merkleBufferSize = 4096;
var merkleBuffer = Buffer.alloc(merkleBufferSize);
// var fd = fs.openSync('/var/folders/09/65dhg9416z19t_lnrxd220j80000gn/T/BRMtcnE12XAvdT8vy8Da2VfG.zip', 'r');
var fd = fs.openSync('/Users/carl/Documents/paper/paper.zip', 'r');
// 判断当前的分片文件offset范围是否需要记录密码本
fs.readSync(fd, merkleBuffer, 0, merkleBufferSize, 1044480);
fs.closeSync(fd);
// var hashVaule = crypto.createHash('sha256').update(merkleBuffer).digest('base64');

// var codebook = codebooks[Math.floor(Math.random() * codebooks.length)];
// let data = zlib.unzipSync(Buffer.from(codebook.data, 'base64'));
// let nonce = fileService.generateRandom(4) + "#" + codebook.cid;
// let pre_data_hash = DMC.ecc.sha256(data + nonce);

let nonce = 'eddd';
// var buffer = Buffer.concat([merkleBuffer , Buffer.from(nonce)]);
// let pre_data_hash = DMC.ecc.sha256(buffer);
// var hashVaule = crypto.createHash('sha256').update(pre_data_hash).digest('base64');
// var hashVaule2 = Buffer.from(pre_data_hash).toString('base64')

// let pre_data_hash = DMC.ecc.sha256(buffer);
// let data_hash = DMC.ecc.sha256(Buffer.from(pre_data_hash, "hex"));
// console.log("pre_data_hash:"+pre_data_hash);
// console.log("Buffer.from(pre_data_hash, 'hex'):"+Buffer.from(pre_data_hash, "hex"));
// console.log("data_hash:"+data_hash);

// // console.log(hashVaule);
// // console.log(hashVaule2);
// var compressedData = zlib.gzipSync(merkleBuffer);
// var base64data = Buffer.from(compressedData).toString('base64');

// console.log(base64data);

// let data = zlib.unzipSync(Buffer.from(base64data, 'base64'));
// console.log("decompres:" + crypto.createHash('sha256').update(data).digest('base64'));

// var codebook = codebooks[Math.floor(Math.random() * codebooks.length)];
// let tmpData = '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';
// let data = zlib.unzipSync(Buffer.from(tmpData, 'base64'));
// let randomCharacter = '8b7a';
// // let buffer = Buffer.from(data).toString('hex')
// // console.log("buffer.length: ", buffer.length);
// // let bufferAdd = buffer + randomCharacter;
// // console.log("bufferAdd: ", bufferAdd);
// // console.log("bufferAdd.length: ", bufferAdd.length);
// // let nonce = randomCharacter + "#" + codebook.cid;
// // var buffer = Buffer.concat([data, Buffer.from(randomCharacter)]);
// var buffer = data + randomCharacter;
// console.log("buffer: ", buffer);
// let pre_data_hash = DMC.ecc.sha256(buffer);
// // let pre_data_hash = DMC.ecc.sha256(bufferAdd);
// console.log("pre_data_hash: ", pre_data_hash);
// // let data_hash = Buffer.from(DMC.ecc.sha256(Buffer.from(pre_data_hash, "hex"))).toString("hex");
// let data_hash = Buffer.from(DMC.ecc.sha256(Buffer.from(pre_data_hash, "hex"))).toString("hex");
// console.log("data_hash: ", data_hash);

const request = require('sync-request');

function syncOrder2RegsiterCenter(){

    let body = {};
    body['email']="jiakai.li@megaops.net";
    body['bill_id']="1";
    body['order_id']="1";
    body['transaction_id']="4291391203129421";
    body['peer_id']="21212121322986839423";
    body['rpc']="154.31.34.194:6007";
    body['total_space']="100";
    body['used_space']="10";
    body['expire']="3821311223";
    let result = JSON.parse(request('POST', "http://154.31.41.36:8001/api/accounts/bind_space_order", {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).getBody('utf-8'))

    console.log(result)
}

syncOrder2RegsiterCenter()

var body = '{\
    "transaction_id":"35935f9b37f1859ae125b6e23e1410cfac82bd32393c9f48c2af063abc44525d",\
    "processed":{\
        "id":"35935f9b37f1859ae125b6e23e1410cfac82bd32393c9f48c2af063abc44525d",\
        "block_num":2934095,\
        "block_time":"2023-04-28T03:35:26.000",\
        "producer_block_id":null,\
        "receipt":{\
            "status":"executed",\
            "cpu_usage_us":3154,\
            "net_usage_words":22\
        },\
        "elapsed":3154,\
        "net_usage":176,\
        "scheduled":false,\
        "action_traces":[\
            {\
                "action_ordinal":1,\
                "creator_action_ordinal":0,\
                "closest_unnotified_ancestor_action_ordinal":0,\
                "receipt":{\
                    "receiver":"dmc.token",\
                    "act_digest":"fd84c658ce587de2ca2b20d29bf87ade1baf7ed11df273f36cac838d3e1f4003",\
                    "global_sequence":2983447,\
                    "recv_sequence":49052,\
                    "auth_sequence":[\
                        [\
                            "tbliuca12345",\
                            37\
                        ]\
                    ],\
                    "code_sequence":2,\
                    "abi_sequence":2\
                },\
                "receiver":"dmc.token",\
                "act":{\
                    "account":"dmc.token",\
                    "name":"order",\
                    "authorization":[\
                        {\
                            "actor":"tbliuca12345",\
                            "permission":"active"\
                        }\
                    ],\
                    "data":{\
                        "owner":"tbliuca12345",\
                        "bill_id":16,\
                        "benchmark_price":10000,\
                        "price_range":3,\
                        "epoch":24,\
                        "asset":{\
                            "quantity":"1 PST",\
                            "contract":"datamall"\
                        },\
                        "reserve":{\
                            "quantity":"27.0000 DMC",\
                            "contract":"datamall"\
                        },\
                        "memo":""\
                    },\
                    "hex_data":""\
                },\
                "context_free":false,\
                "elapsed":2224,\
                "console":"",\
                "trx_id":"35935f9b37f1859ae125b6e23e1410cfac82bd32393c9f48c2af063abc44525d",\
                "block_num":2934095,\
                "block_time":"2023-04-28T03:35:26.000",\
                "producer_block_id":null,\
                "account_ram_deltas":[\
                    {\
                        "account":"dmc.token",\
                        "delta":-1840\
                    },\
                    {\
                        "account":"ljktest12345",\
                        "delta":-972\
                    },\
                    {\
                        "account":"tbliuca12345",\
                        "delta":1416\
                    }\
                ],\
                "except":null,\
                "error_code":null,\
                "return_value_hex_data":"",\
                "inline_traces":[\
                    {\
                        "action_ordinal":11,\
                        "creator_action_ordinal":1,\
                        "closest_unnotified_ancestor_action_ordinal":1,\
                        "receipt":{\
                            "receiver":"dmc.token",\
                            "act_digest":"9eec48fed086187668472815813d2832b24",\
                            "global_sequence":2983457,\
                            "recv_sequence":49059,\
                            "auth_sequence":[\
                                [\
                                    "dmc.token",\
                                    367\
                                ]\
                            ],\
                            "code_sequence":2,\
                            "abi_sequence":2\
                        },\
                        "receiver":"dmc.token",\
                        "act":{\
                            "account":"dmc.token",\
                            "name":"orderrec",\
                            "authorization":[\
                                {\
                                    "actor":"dmc.token",\
                                    "permission":"active"\
                                }\
                            ],\
                            "data":{\
                                "order_info":{\
                                    "order_id":11,\
                                    "user":"tbliuca12345",\
                                    "miner":"ljktest12345",\
                                    "bill_id":16,\
                                    "user_pledge":{\
                                        "quantity":"25.0000 DMC",\
                                        "contract":"datamall"\
                                    },\
                                    "miner_lock_pst":{\
                                        "quantity":"1 PST",\
                                        "contract":"datamall"\
                                    },\
                                    "miner_lock_dmc":{\
                                        "quantity":"60.0000 DMC",\
                                        "contract":"datamall"\
                                    },\
                                    "price":{\
                                        "quantity":"1.0000 DMC",\
                                        "contract":"datamall"\
                                    },\
                                    "settlement_pledge":{\
                                        "quantity":"0.0000 DMC",\
                                        "contract":"datamall"\
                                    },\
                                    "lock_pledge":{\
                                        "quantity":"1.0000 DMC",\
                                        "contract":"datamall"\
                                    },\
                                    "state":0,\
                                    "deliver_start_date":"1970-01-01T00:00:00",\
                                    "latest_settlement_date":"1970-01-01T00:00:00",\
                                    "miner_lock_rsi":{\
                                        "quantity":"0.0000 RSI",\
                                        "contract":"datamall"\
                                    },\
                                    "miner_rsi":{\
                                        "quantity":"0.0000 RSI",\
                                        "contract":"datamall"\
                                    },\
                                    "user_rsi":{\
                                        "quantity":"0.0000 RSI",\
                                        "contract":"datamall"\
                                    },\
                                    "deposit":{\
                                        "quantity":"1.0000 DMC",\
                                        "contract":"datamall"\
                                    },\
                                    "epoch":24,\
                                    "deposit_valid":"1970-01-01T00:00:00",\
                                    "cancel_date":"1970-01-01T00:00:00"\
                                },\
                                "type":1\
                            },\
                            "hex_data":"0b0000000000000000000000000000000000001"\
                        },\
                        "context_free":false,\
                        "elapsed":62,\
                        "console":"",\
                        "trx_id":"35935f9b37f1859ae125b6e23e1410cfac82bd32393c9f48c2af063abc44525d",\
                        "block_num":2934095,\
                        "block_time":"2023-04-28T03:35:26.000",\
                        "producer_block_id":null,\
                        "account_ram_deltas":[],\
                        "except":null,\
                        "error_code":null,\
                        "return_value_hex_data":"",\
                        "inline_traces":[\
\
                        ]\
                    },\
                    {\
                        "action_ordinal":15,\
                        "creator_action_ordinal":1,\
                        "closest_unnotified_ancestor_action_ordinal":1,\
                        "receipt":{\
                            "receiver":"dmc.token",\
                            "act_digest":"c63722ba480ba84f3c3ab85515429750f81af1b0e53d6dd435",\
                            "global_sequence":2983461,\
                            "recv_sequence":49063,\
                            "auth_sequence":[\
                                [\
                                    "dmc.token",\
                                    371\
                                ]\
                            ],\
                            "code_sequence":2,\
                            "abi_sequence":2\
                        },\
                        "receiver":"dmc.token",\
                        "act":{\
                            "account":"dmc.token",\
                            "name":"orderassrec",\
                            "authorization":[\
                                {\
                                    "actor":"dmc.token",\
                                    "permission":"active"\
                                }\
                            ],\
                            "data":{\
                                "order_id":11,\
                                "changed":[\
                                    {\
                                        "quant":{\
                                            "quantity":"27.0000 DMC",\
                                            "contract":"datamall"\
                                        },\
                                        "type":1\
                                    },\
                                    {\
                                        "quant":{\
                                            "quantity":"-1.0000 DMC",\
                                            "contract":"datamall"\
                                        },\
                                        "type":3\
                                    },\
                                    {\
                                        "quant":{\
                                            "quantity":"-1.0000 DMC",\
                                            "contract":"datamall"\
                                        },\
                                        "type":6\
                                    }\
                                ],\
                                "owner":"tbliuca12345",\
                                "acc_type":1,\
                                "exec_date":"2023-04-28T03:35:26"\
                            },\
                            "hex_data":"0b000000000c810c120ede2c901fe3e4b64"\
                        },\
                        "context_free":false,\
                        "elapsed":47,\
                        "console":"",\
                        "trx_id":"35935f9b37f1859ae125b6e23e1410cfac82bd32393c9f48c2af063abc44525d",\
                        "block_num":2934095,\
                        "block_time":"2023-04-28T03:35:26.000",\
                        "producer_block_id":null,\
                        "account_ram_deltas":[],\
                        "except":null,\
                        "error_code":null,\
                        "return_value_hex_data":"",\
                        "inline_traces":[]\
                    }\
                ]\
            }\
        ],\
        "account_ram_delta":null,\
        "except":null,\
        "error_code":null\
    }\
}';
// const _ = require('lodash');
// var json = JSON.parse(body);
// var actionTraces = json.processed.action_traces;
// var actionTrace = actionTraces[actionTraces.length - 1];
// var inlineTraces = actionTrace.inline_traces;
// inlineTraces.forEach((item) => {
//     const orderId = _.get(item, 'act.data.order_info.order_id');
//     if (orderId !== undefined) {
//       console.log('找到的 order_id:', orderId);
//     }
// });

// var num = "2";
// console.log(num*1024*1024);