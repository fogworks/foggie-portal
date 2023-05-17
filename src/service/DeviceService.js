const logger = require('./logger')('DeviceService.js');
const BizResultCode = require('./BaseResultCode');
const config = require('config');
const publish_proto = require('./grpc/publish');
const grpc = require('@grpc/grpc-js');

module.exports = {
    getPublishGrpcClient: () => {
        var grpcConfig = config.get('grpcConfig');
        var ip = grpcConfig.get("ip");
        var port = grpcConfig.get("port");
        return new publish_proto.PowService(ip + ':' + port, grpc.credentials.createInsecure());
    },
}