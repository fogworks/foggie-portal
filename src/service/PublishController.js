const BizResult = require("./BizResult");
const BizResultCode = require("./BaseResultCode");
const logger = require("./logger")("FileController.js");
const publish_proto = require("./grpc/publish");
const grpc = require("@grpc/grpc-js");

class PublishController {
  /**
   * 发布ipfs
   * @param {*} cid          pubkey
   * @param {*} is_pin       is_pin
   * @param {*} new_path     file key
   * @param {*} res          HTTP的response
   * @returns
   */
  static async doPublish(req, res) {
    let cid = req.body.key;
    // test
    cid = "QmNf82AtemgaHu2Sg3wpiaEFmoy6ym6Sv1Ma9eLJg6dHm3";
    let is_pin = req.body.is_pin;
    // let new_path = req.body.new_path;
    let ip_address = req.body.ip_address;
    let port = req.body.port || "80";
    let token = req.body.token;
    let peerId = req.body.peerId;
    // let Id = req.body.orderID;
    let Id = '4321';
    // test 
    Id =  '100';
    let exp = 3 * 24 * 3600;
    let stype = req.body.type;
    let pin = true;
    token = '11111';
    // peerId = '12D3KooWDj1NkJ1DrVvpbBhtJ3nLCNA9CKyg3eynpiUTKsVEDkgx';
    peerId = "12D3KooWEg8qpg5BfBtxM9kBtzp4RB6VD3dBb2cPxasKuyvKrosC";
    console.log("~~~~~~~~~~~key", cid);
    console.log("~~~~~~~~~~~is_pin", Id);
    // console.log("~~~~~~~~~~~new_path", new_path);
    console.log("~~~~~~~~~~~ip_address", ip_address);
    console.log("~~~~~~~~~~~port", port);
    console.log("~~~~~~~~~~~token", token);

    if (!peerId || !Id || !stype || !exp || !pin || !cid) {
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
      pin
    };
    const putObjectReq = {
      header: header,
      request: request,
    };

    console.log('~~~~~~~~~~~~~~', putObjectReq)

    client.Pin(putObjectReq, (err, data) => {
      console.log("+++++++++++++++++err", err);
      console.log("+++++++++++++++++data", data);
      if (err) {
        // logger.error("err:", err);
        //   res.send(BizResult.fail(BizResultCode.UPLOAD_FILE_FAILED));
        res.send({});
        return;
      }
      res.send(BizResult.success(data.cid));
      // res.send({ aa: "bb" });
    });

    // if (parseInt(fileCategory) == 1) {
    //   if (!fileType) {
    //     res.send(BizResult.validateFailed());
    //     return;
    //   }

    // //   stream.write({ req: putObjectReq });

    // } else {
    //   res.send(BizResult.fail(BizResultCode.NOT_SUPPORT_FILE_TYPE));
    // }
  }

  static getNetGrpcClient(ip_address, port) {
    // ip_address = "154.31.34.194";
    ip_address  = "192.168.1.115";
    port = 8007;
    // console.log('@@@@@@@@@@@@@@@@', publish_proto)
    return new publish_proto.API(
      ip_address + ":" + port,
      grpc.credentials.createInsecure()
    );
  }
}
module.exports = PublishController;
