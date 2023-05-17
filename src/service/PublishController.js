const BizResult = require("./BizResult");
const BizResultCode = require("./BaseResultCode");
const logger = require("./logger")("FileController.js");
const publish_proto = require("./grpc/publish");
const grpc = require("@grpc/grpc-js");
const config = require("config");

class PublishController {
  /**
   * publish ipfs
   * @param {*} cid          pubkey
   * @param {*} is_pin       is_pin
   * @param {*} new_path     file key
   * @param {*} res          HTTP response
   * @returns
   */
  static async doPublish(req, res) {
    let cid = req.body.key;
    let ip_address = req.body.ip_address;
    let port = req.body.port || "80";
    let token = req.body.token;
    let peerId = req.body.peerId;
    // let Id = req.body.orderID;
    let Id = req.body.Id;
    let stype = req.body.stype;
    let key = req.body.key;
    let exp = req.body.exp;
    let pin = req.body.pin;
    let isDir = req.body.isDir;
    token = "11111";
    // peerId = '12D3KooWDj1NkJ1DrVvpbBhtJ3nLCNA9CKyg3eynpiUTKsVEDkgx';
    peerId = "12D3KooWEJTLsHbP6Q1ybC1u49jFi77tQ8hYtraqGtKTHCXFzLnA";

    if (!peerId || !Id || !stype || !exp || !pin || !cid || !key) {
      res.send(BizResult.validateFailed());
      return;
    }
    const header = {
      peerId,
      Id,
      token,
    };
    var client = PublishController.getNetGrpcClient(ip_address, port);
    const request = {
      cid,
      stype,
      exp,
      pin,
      key,
      isDir,
    };
    const putObjectReq = {
      header: header,
      request: request,
    };

    client.Pin(putObjectReq, (err, data) => {
      if (err) {
        res.send({});
        return;
      }
      res.send(BizResult.success(data.cid));
    });
  }

  static getNetGrpcClient(ip_address, port) {
    // ip_address = "154.31.34.194";
    // ip_address  = "192.168.1.115";
    let grpcConfig = config.get("grpcConfig");
    ip_address = grpcConfig.get("ip");
    port = 8007;
    return new publish_proto.API(
      ip_address + ":" + port,
      grpc.credentials.createInsecure()
    );
  }

}
module.exports = PublishController;
