const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const app = express();
const logger = require('./src/service/logger')('server.js');
const multipart = require('connect-multiparty');
var multipartMiddleware = multipart(); 
var serverConf = config.get('serverConfig');
var port = serverConf.get('port');
app.listen(port, () => {
  logger.info(`Web server running at port:${port}/`);
});

const OrderController = require('./src/service/OrderController');
const UserController = require('./src/service/UserController');
const FileController = require('./src/service/FileController');
const AssetsController = require('./src/service/AssetsController');
const PublishController = require('./src/service/PublishController');
const OperController = require('./src/service/OperController');
var jsonParser = bodyParser.json();

app.post('/order/outstanding_orders', jsonParser, (req, res) => {
  var email = req.body.email;
  var unmatchedAmount = req.body.unmatchedAmount;
  var period = req.body.period;
  var minPrice = req.body.minPrice;
  var maxPrice = req.body.maxPrice;
  OrderController.outstandingOrders(email, unmatchedAmount, period, minPrice, maxPrice, res);
});

app.post('/order/buy', jsonParser, (req, res) => {
  OrderController.buy(req, res);
});

app.post('/order/sync', jsonParser, (req, res) => {
  OrderController.syncOrder(req, res);
});

app.post('/order/list', jsonParser, (req, res) => {
  var email = req.body.email;
  var limit = req.body.limit;
  var pageNum = req.body.pageNum;
  OrderController.orderList(email, pageNum, limit, res);
});

app.post('/order/id', jsonParser, (req, res) => {
  OrderController.getOrderById(req, res);
});

app.get('/order/get_chain_id', (req, res) => {
  res.json(OrderController.getChainId());
});

app.get('/order/get_table_rows', (req, res) => {
  res.json(OrderController.getBenchmarkPrice());
});

app.post('/order/push_merkle', jsonParser, (req, res) => {
  OrderController.pushMerkle(req, res);
});

app.post('/order/push_merkle_record', jsonParser, (req, res) => {
  OrderController.getPushMerkleRecord(req, res);
});

app.post('/order/req_challenge', jsonParser, (req, res) => {
  OrderController.reqChallenge(req, res);
});

app.post('/order/challenge_list', jsonParser, (req, res) => {
  OrderController.getChallengeList(req, res);
});

app.post('/user/encode_user_order', jsonParser, (req, res) => {
  UserController.getToken4UploadFile(req, res);
});

app.post('/user/validate_user_login', jsonParser, (req, res) => {
  UserController.validateUserLogin(req, res);
});

app.post('/user/save_password', jsonParser, (req, res) => {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  UserController.saveUserPassword(email, password, username, res);
});

app.post('/user/validate_password', jsonParser, (req, res) => {
  UserController.validateUserPassword(req, res);
});

app.post('/user/reset_password', jsonParser, (req, res) => {
  UserController.resetUserPassword(req, res);
});

// import private key
app.post('/user/import_private_key', jsonParser, (req, res) => {
  
  UserController.saveUserPrivateKey(req, res);
});

app.post('/user/get_private_key', jsonParser, (req, res) => {
  UserController.getUserPrivateKey(req, res);
});

app.post('/user/claim_order', jsonParser, (req, res) => {
  UserController.claimOrder(req, res);
});

app.post('/file/save', jsonParser, (req, res) => {
  FileController.saveFileProp(req, res);
});

app.post('/file/list', jsonParser, (req, res) => {
  var orderId = req.body.orderId;
  var email = req.body.email;
  var pageSize = req.body.pageSize;
  var pageNo = req.body.pageNo;
  var deviceType = req.body.deviceType;
  FileController.list(orderId, email, deviceType, pageSize, pageNo, res);
});

app.post('/file/remove', jsonParser, (req, res) => {
  FileController.removeFileProp(req, res);
});

app.post('/file/get_codebook', jsonParser, (req, res) => {
  FileController.getCodebook(req, res);
});

app.post('/file/remove_file_codebook_offset', jsonParser, (req, res) => {
  FileController.deleteFileCodebookOffset(req, res);
});

app.post('/file/upload', multipartMiddleware, (req, res) => {
  FileController.upload(req, res);
});

app.post('/file/create', jsonParser, (req, res) => {
  var fileName = req.body.fileName;
  var md5 = req.body.md5;
  var fileType = req.body.fileType;
  var fileSize = req.body.fileSize;
  var orderId = req.body.orderId;
  var email = req.body.email;
  var deviceType = req.body.deviceType;
  FileController.create(email, fileName, md5, fileType, fileSize, orderId, deviceType, res);
});

app.post('/file/complete', jsonParser, (req, res) => {
  FileController.complete(req, res);
});

app.post('/assets/transfer', jsonParser, (req, res) => {
  AssetsController.transfer(req, res);
});

app.post('/assets/list_in_order', jsonParser, (req, res) => {
  AssetsController.getAssetsOfOrder(req, res);
});

app.post('/assets/list_in_user', jsonParser, (req, res) => {
  AssetsController.getAssetsOfUser(req, res);
});

app.post('/assets/user', jsonParser, (req, res) => {
  AssetsController.userOverview(req, res);
});


const os = require("os").networkInterfaces();

function getIP() {
  let interfaces = os;
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
require("events").EventEmitter.defaultMaxListeners = 0;


app.post("/get_net_status", (req, res) => {
  // let ip = req.body.ip;
  // const querystring = require("querystring");
  // const { Curl } = require("node-libcurl");
  // const curlTest = new Curl();
  // const terminate = curlTest.close.bind(curlTest);
  // console.log(Curl.option);
  // curlTest.setOpt(Curl.option.TIMEOUT, 1);
  // curlTest.setOpt(Curl.option.URL, ip);
  // curlTest.setOpt(Curl.option.POST, true);
  // curlTest.setOpt(
  //   Curl.option.POSTFIELDS,
  //   querystring.stringify({
  //     name: "section",
  //     job: "webdev",
  //   })
  // );

  // curlTest.on("end", function (statusCode, data, headers) {
  //   console.info("Status code " + statusCode);
  //   console.info("***");
  //   console.info("Our response: " + data);
  //   console.info("***");
  //   console.info("Length: " + data.length);
  //   console.info("***");
  //   // console.info("Total time taken: " + this.getInfo("TOTAL_TIME"));

  //   this.close();
  //   res.send({
  //     statusCode,
  //     data,
  //   });
  // });
  // curlTest.on("error", () => {
  //   console.log("CURL ERROR");
  // });
  // curlTest.perform();
});

app.get("/getIP", (req, res) => {
  let address = getIP();

  res.send({ address: address });
});

app.post("/get_max_info", (req, res) => {
  let request = require("request");
  request(`${req.body.url}v1/get_max_info`, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      //todoJSON.parse(body)
      let rr = JSON.parse(body);
      res.send(rr);
    } else {
      res.send({});
    }
  });
});

const get_max_info = async (ip, i) => {
  let request = require("request");
  request(
    `http://${ip}.${i}:9094/v1/get_max_info`,
    function (err, response, body) {
      let rr = {};
      if (!err && response.statusCode == 200) {
        //todoJSON.parse(body)
        rr = JSON.parse(body);
        // res.send(rr);
      } else {
        // res.send({})
      }
      return rr;
    }
  );
};

app.post("/socket_ip", async (req, res) => {
  //   let data = socketIP();
  let ip = "154.37.16";
  let port1 = 9094;
  let hosts = [];
  for (let i = 1; i <= 255; i++) {

    let request = require("request");
    request(
      `http://${ip}.${i}:9094/v1/get_max_info`,
      function (err, response, body) {
        let rr = { data: [] };
        if (!err && response.statusCode == 200) {
          //todoJSON.parse(body)
          rr.data.push(JSON.parse(body)?.result);
          res.send(rr);
        } else {
          // res.send({})
        }
        return rr;
      }
    );

    // res.send(hosts);
  }
  // res.send(hosts);
  // res.send(hosts);
  // let data = socketIP1();
  // res.send(data);
});

app.post("/portal_ping", (req, res) => {
  //ping
  if (req.body.tyspes == "Ping") {
    let ping = require("child_process").spawn("ping", [req.body.ip]);
    let iconv = require("iconv-lite");
    let all = "";
    //  let logname = __dirname + '/' + 'log.txt';
    ping.stdout.on("data", (data) => {
      // fs.writeFileSync(logname, iconv.decode(data, 'cp936'))
      // let info = fs.readFileSync(logname, 'utf8')
      all += iconv.decode(data, "cp936");
      // res.send(info)
      //  console.log(info)
    });
    ping.stderr.on("data", (data) => {
      // console.log(data);
    });
    ping.on("close", (code) => {
      console.log("data:", all);
      res.send(all);
    });
  } else {
    //toraceroute
    const Traceroute = require("nodejs-traceroute");
    let all2 = "";
    const tracer = new Traceroute();
    tracer
      .on("pid", (pid) => {
        all2 += `pid: ${pid} \n`;
      })
      // .on('destination', (destination) => {
      //     all2 += `destination: ${destination} \n`;
      // })
      // .on('hop', (hop) => {
      //     all2 += `hop: ${JSON.stringify(hop)} \n`;
      // })
      .on("close", (code) => {
        all2 += `close: code ${code}`;
        res.send(all2);
      });

    tracer.trace(req.body.ip);
  }
});

const { PromiseSocket } = require("promise-socket");

const client = async (ip, port) => {
  const socket = new PromiseSocket();
  socket.setTimeout(1500);
  await socket.connect({ host: ip, port: port });
  let response = await socket.read(1);
  await socket.end();
  if (response) {
    return { host: ip, port: port };
  }
};

const socketIP1 = () => {
  let net = require("net");
  let Socket = net.Socket;
  //待扫描的开始网段，可换成192.168.0
  let ip = "154.37.16";
  let port1 = 9094;
  let hosts = [];
  let request = require("request");
  for (let i = 1; i <= 255; i++) {
    request(`${ip}.${i}/v1/get_max_info`, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        //todoJSON.parse(body)
        let rr = JSON.parse(body);
        // res.send(rr);
        hosts.push(data);
      } else {
        // res.send({})
      }
    });
    // let data = await client(ip + "." + i, port1)
    // hosts.push(data);
  }
  return hosts;
};

const socketIP = () => {
  console.log('socketIPsocketIPsocketIP')
  let net = require("net");
  let Socket = net.Socket;
  //待扫描的开始网段，可换成192.168.0
  let ip = "192.168.1";
  let port1 = 80;
  let scan = function (host, cb) {
    let socket = new Socket();
    let status = null;
    socket.setTimeout(1500);
    socket.on("connect", function () {
      socket.end();
      cb && cb(null, host);
    });
    socket.on("timeout", function () {
      socket.destroy();
      cb && cb(new Error("timeout"), host);
    });
    socket.on("error", function (err) {
      cb && cb(err, host);
    });
    socket.on("close", function (err) {});
    socket.connect(port1, host);
  };
  let hosts = [];
  for (let i = 1; i <= 255; i++) {
    scan(ip + "." + i, function (err, host) {
      if (err) {
        // console.log("Not found", err);
      } else {
        hosts.push({ host });
      }
    });
  }
  return hosts;
};



// ipfs pin
app.post("/s_ipfsops/pin",jsonParser, (req, res) => {
  console.log('~~~~~~~~~~~',req.url)
  console.log('_++++++++++++++', req.method)
  console.log('~~~~~~~~~~~',req.body)
  console.log('+++++++++++++++++', `http://${req.body.ip_address}:${req.body.port}/ipfsops/pin`)
  let request = require("request");
  request(`http://${req.body.ip_address}:${req.body.port}/ipfsops/pin`, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      //todoJSON.parse(body)
      console.log('----------------------', body)
      console.log('----------------------', response)
      let rr = JSON.parse(body);
      res.send(rr);
    } else {
      console.log('***************', err)
      // console.log('***************', response)
      console.log('***************', body)
      res.send({});
    }
  });
});


// ipfs pin
app.post('/publish', jsonParser, (req, res) => {
  PublishController.doPublish(req, res);
});

app.get('/file_download', jsonParser, (req, res) => {
  OperController.doDownload(req, res);
});

app.delete('/file_delete', jsonParser, (req, res) => {
  OperController.doDelete(req, res);
});

app.get('/list_files', jsonParser, (req, res) => {
  OperController.listFiles(req, res);
});
