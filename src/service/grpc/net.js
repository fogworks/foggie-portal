const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = path.join(__dirname, 'net.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
// 这个是client调用本地的grpc，优先级低于prox 测试prox对应的地址是154.31.34.194:6007， net对应的地址是154.31.34.194:8007
const net_proto = protoDescriptor.proto
module.exports = net_proto