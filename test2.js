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

import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import { encode } from 'multiformats/block'

async function generateCID() {
  const buf = Buffer.from('Hello, world!')
  const block = await encode({ value: buf, hasher: sha256 })
  const cid = new CID(block.cid)
  console.log(cid.toString())
}

generateCID().catch(console.error)

// var buffer = Buffer.from('hello world');
// console.log(buffer.length);
// var transferData = buffer;
// if(!Buffer.isBuffer(buffer)){
//     transferData = Buffer.alloc(2);
//     transferData.fill(buffer);
// }
// console.log(transferData.length);