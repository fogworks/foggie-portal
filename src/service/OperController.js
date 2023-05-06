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
    let ip_address = req.ip_address;
    let port = req.port;
    let token = req.token;
    let peerId = req.peerId;
    let Id = req.Id;
    let cid = req.cid;
    let key = req.key;
    let start = req.start;
    let length = req.length;
    token = "11111";
    const header = {
      peerId,
      Id,
      token,
    };

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
    let totalLength = 0;
    // let failedReports = [];
    call.on('data', (employeeStream) => {
      if (employeeStream?.chunk) {
        totalLength += employeeStream.chunk.length
        successfulReports.push(employeeStream.chunk)
      }


    });
    call.on('end', () => {
      res.send(Buffer.concat(successfulReports, totalLength))
    })
  }

  static async doDelete(req, res) {
    let cids = req.body.cids;
    // test
    // cids = ["QmcRccgj2rK2e9sVcsf11v7hDdLsKq1kTfrEGAYe2NDuQP"];

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
    peerId = "12D3KooWEJTLsHbP6Q1ybC1u49jFi77tQ8hYtraqGtKTHCXFzLnA";

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
      if (err) {
        res.send({});
        return;
      }
      res.send(BizResult.success(data.cid));
    });
  }

  static async listFiles(req, res) {
    let ip_address = req.body.ip_address;
    let port = req.body.port || "80";
    let token = req.body.token;
    let peerId = req.body.peerId;
    let Id = req.body.Id;

    // test
    peerId = "12D3KooWEJTLsHbP6Q1ybC1u49jFi77tQ8hYtraqGtKTHCXFzLnA";
    // Id = "34";
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
    // prefix = "";
    // // prefix = "";
    // delimiter = "/";
    // max_keys = "50";
    // start_after = "";
    // continuation_token = ""; // next_marker
    // version_id_marker = "";
    // key_marker = "";

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
      console.log('+++++++++++', err)
      console.log('+++++++++++', data)
      if (err) {
        res.send();
        return;
      }
      res.send(data);
    });
  }

  static getNetGrpcClient(ip_address, port) {
    // ip_address = "154.31.34.194";
    // ip_address  = "192.168.1.115";
    ip_address = "172.16.30.11";
    port = 8007;
    return new publish_proto.API(
      ip_address + ":" + port,
      grpc.credentials.createInsecure()
    );
  }
}
module.exports = PublishController;
