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
  static async doDownload(req, res) {
    let ip_address = req.body.ip_address;
    let port = req.body.port || "80";
    let token = req.body.token;
    let peerId = req.body.peerId;
    let Id = "4321";
    // test
    Id = "100";
    token = "11111";
    peerId = "12D3KooWEg8qpg5BfBtxM9kBtzp4RB6VD3dBb2cPxasKuyvKrosC";
    // peerId = "12D3KooWRybBDQ872y2PBYawD2k14SSwwA6x9JqsHs1Ren3EXWmM";

    // if (!peerId || !Id || !stype || !exp || !pin || !cid) {
    //   res.send(BizResult.validateFailed());
    //   return;
    // }
    const header = {
      peerId,
      Id,
      token,
    };

    let cid = req.body.cid;
    let key = req.body.key;
    let start = req.body.start;
    let length = req.body.length;
    // test
    cid = "QmNf82AtemgaHu2Sg3wpiaEFmoy6ym6Sv1Ma9eLJg6dHm3";
    key = "test1/uuu/upgrade.sh1";
    key = "";
    start = 0;
    length = 0;

    const range = {
      start,
      length,
    };
    const GetRequest = {
      header,
      cid,
      key,
      range
    };

    var client = PublishController.getNetGrpcClient(ip_address, port);

    let call = client.GetObject(GetRequest);

    let successfulReports = [];
    // let failedReports = [];
    call.on('data',(employeeStream)=>{
      // res.send(employeeStream);
      successfulReports.push(employeeStream)

    });
    call.on('end',()=>{
       res.send()
    })

    // call.on("data", (response)=>{
    //   console.log('~~~~~~~~~~~', response)
    // });

    // call.on('end',()=>{
    //   console.log('All Salaries have been paid');
    //   // res.send()
    // });

    // client.GetObject(GetRequest, (err, data) => {
    //   console.log("+++++++++++++++++err", err);
    //   console.log("+++++++++++++++++data", data);
    //   if (err) {
    //     res.send({});
    //     return;
    //   }
    //   res.send(BizResult.success(data.cid));
    //   // res.send({ aa: "bb" });
    // });
  }

  static async doDelete(req, res) {
    let cids = req.body.key;
    // test
    cids = ["QmcRccgj2rK2e9sVcsf11v7hDdLsKq1kTfrEGAYe2NDuQP"];

    let objects = req.body.objects;
    objects = [];

    let object_type = req.body.object_type;
    object_type = "normal";

    let ip_address = req.body.ip_address;
    let port = req.body.port || "80";
    let token = req.body.token;
    let peerId = req.body.peerId;

    let Id = "4321";
    // test
    Id = "100";

    token = "11111";
    peerId = "12D3KooWEg8qpg5BfBtxM9kBtzp4RB6VD3dBb2cPxasKuyvKrosC";
    // peerId = "12D3KooWRybBDQ872y2PBYawD2k14SSwwA6x9JqsHs1Ren3EXWmM";
    // console.log("~~~~~~~~~~~ip_address", ip_address);
    console.log("~~~~~~~~~~~port", port);
    console.log("~~~~~~~~~~~token", token);

    console.log("~~~~~~~~~~~~~~~~~~~objects", JSON.stringify(objects));

    if (!object_type || !objects || !cids) {
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
      cids,
      objects,
      object_type,
    };
    const putObjectReq = {
      header: header,
      request: request,
    };


    client.DeleteObject(putObjectReq, (err, data) => {
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

  static async listFiles(req, res) {
    let ip_address = req.body.ip_address;
    let port = req.body.port || "80";
    let token = req.body.token;
    let peerId = req.body.peerId;
    let Id = "4321";

    // test
    peerId = "12D3KooWEg8qpg5BfBtxM9kBtzp4RB6VD3dBb2cPxasKuyvKrosC";
    Id = "100";
    token = "11111";

    const header = {
      peerId,
      Id,
      token,
    };

    let prefix = req.body.prefix;
    let delimiter = req.body.delimiter;
    let max_keys = req.body.max_keys;
    let start_after = req.body.start_after;
    let continuation_token = req.body.continuation_token;
    let version_id_marker = req.body.version_id_marker;
    let key_marker = req.body.version_id_marker;

    //test
    prefix = "/";
    // prefix = "";
    delimiter = "/";
    max_keys = "50";
    start_after = "";
    continuation_token = ""; // next_marker
    version_id_marker = "";
    key_marker = "";

    const request = {
      prefix,
      delimiter,
      max_keys,
      start_after,
      continuation_token,
      version_id_marker,
      key_marker,
    };
    const putObjectReq = {
      header: header,
      request: request,
    };


    var client = PublishController.getNetGrpcClient(ip_address, port);

    client.ListObjects(putObjectReq, (err, data) => {
      console.log("+++++++++++++++++err", err);
      console.log("+++++++++++++++++data", data);
      if (err) {
        res.send();
        return;
      }
      res.send(data);
    });
  }

  static getNetGrpcClient(ip_address, port) {
    ip_address = "154.31.34.194";
    // ip_address  = "192.168.1.115";
    port = 8007;
    // console.log('@@@@@@@@@@@@@@@@', publish_proto)
    return new publish_proto.API(
      ip_address + ":" + port,
      grpc.credentials.createInsecure()
    );
  }
}
module.exports = PublishController;
