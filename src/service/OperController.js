const BizResult = require("./BizResult");
const BizResultCode = require("./BaseResultCode");
const logger = require("./logger")("FileController.js");
const publish_proto = require("./grpc/publish");
const grpc = require("@grpc/grpc-js");
const config = require("config");
const { chunk } = require("lodash");
const FileType = import('file-type');
const userService = require('./UserService');
// const {fileTypeFromStream} = 'file-type';
// const { da } = require("element-plus/es/locale");

class PublishController {
  /**
   * publish ipfs
   * @param {*} cid          pubkey
   * @param {*} is_pin       is_pin
   * @param {*} new_path     file key
   * @param {*} res          HTTP response
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
    let type = req.type;
    
    if (type === 'space') {
      token = await userService.getToken4UploadFile(req.email, Id);
      if (token instanceof BizResultCode) {
        res.send(BizResult.fail(token));
        return;
      }
    }
    
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
      range,
    };

    var client = PublishController.getNetGrpcClient(ip_address, port);

    let call = client.GetObject(GetRequest);

    console.log("++++++++download", GetRequest);
    call.on("data", (employeeStream) => {
      if (employeeStream?.chunk) {
        res.write(employeeStream.chunk);
      }

      // if (employeeStream?.chunk) {
      //   totalLength += employeeStream.chunk.length
      //   successfulReports.push(employeeStream.chunk)
      // }


    });
    call.on('end', () => {
      res.end()
      //  res.send(Buffer.concat(successfulReports, totalLength))
    });
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
    let port = req.body.port;
    let token = req.body.token;
    let peerId = req.body.deviceData.peer_id;

    let Id = req.body.deviceData.foggie_id;

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
    let ip_address = req.body.deviceData.rpc.split(":")[0];
    let port = req.body.deviceData.rpc.split(":")[1];
    let token = req.body.token;
    let peerId = req.body.deviceData.peer_id;
    let Id = req.body.deviceData.foggie_id;
    let email = req.body.email;
    let type = req.body.type;

    // test
    // peerId = "12D3KooWEJTLsHbP6Q1ybC1u49jFi77tQ8hYtraqGtKTHCXFzLnA";
    // Id = "34";
    // token = "11111";
    if (type === 'space') {
      token = await userService.getToken4UploadFile(email, req.body.deviceData.space_order_id);
      if (token instanceof BizResultCode) {
        res.send(BizResult.fail(token));
        return;
      }
    }

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
      if (err) {
        res.send();
        return;
      }
      res.send(data);
    });
  }

  static async findObjects(req, res) {
    let ip_address = req.body.ip_address;
    let port = req.body.port;
    let token = req.body.token;
    let peerId = req.body.deviceData.peer_id;
    let Id = req.body.deviceData.foggie_id;

    if (type === 'space') {
      token = await userService.getToken4UploadFile(email, req.body.deviceData.space_order_id);
      if (token instanceof BizResultCode) {
        res.send(BizResult.fail(token));
        return;
      }
    }

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
      if (err) {
        res.send();
        return;
      }
      res.send(data);
    });
  }

  static async SearchObject(req, res) {
    let ip_address = req.body.ip;
    let port = req.body.port;
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

    let cid = req.body.cid;
    let key = req.body.key;

    // const request = {
    //   cid,
    //   key,
    // };
    const putObjectReq = {
      header: header,
      // request: request,
      cid,
      key,
    };
    var client = PublishController.getNetGrpcClient(ip_address, port);

    let call = client.SearchObject(putObjectReq);

    let successfulReports = [];
    let totalLength = 0;
    // let failedReports = [];
    call.on('data', async (employeeStream) => {
      // successfulReports.push(employeeStream);
      if (employeeStream?.chunk) {
        // let type = await FileType.fromBuffer(employeeStream.chunk);
        // if (type) {
        //   res.write({type, employeeStream: employeeStream.chunk})
        // } else {
        //   res.write({type: "", employeeStream: employeeStream.chunk})
        // }
        res.write(employeeStream.chunk);
      } else if (employeeStream.Option === "links") {
        res.send(employeeStream.links);
      }

    });
    call.on('end', () => {
      res.end();
      // res.send(successfulReports);
      //  res.send(Buffer.concat(successfulReports, totalLength))
    });
  }

  static getNetGrpcClient(ip_address, port) {
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
