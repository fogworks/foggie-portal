const express = require("express");

const hostname = "localhost";
const port = 3001;

const app = express();

// 不限制监听数量
//  process.setMaxListeners(0)

// 支持post请求，前端对象形式传递过来的，application/x-www-form-urlencoded(默认)
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  // let address = getIP();
  // res.send(address);
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
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

// const get_status = ()=>{
//   const querystring = require("querystring");
//   const { Curl } = require("node-libcurl");
//   const curlTest = new Curl();
//   const terminate = curlTest.close.bind(curlTest);
//   curlTest.setOpt(Curl.option.URL, "explorer.dmctech.io");
//   curlTest.setOpt(Curl.option.POST, true);
//   curlTest.setOpt(
//     Curl.option.POSTFIELDS,
//     querystring.stringify({
//       name: "section",
//       job: "webdev",
//     })
//   );

//   curlTest.on("end", function (statusCode, data, headers) {
//     console.info("Status code " + statusCode);
//     console.info("***");
//     console.info("Our response: " + data);
//     console.info("***");
//     console.info("Length: " + data.length);
//     console.info("***");
//     // console.info("Total time taken: " + this.getInfo("TOTAL_TIME"));

//     this.close();
//     return {
//       statusCode,
//       data
//     };
//   });
//   curlTest.on("error", terminate);

//   curlTest.perform();
// }

// const re = (url)=> {
//   let request = require('request');
//   request(url, function(err, response, body){
//     if(!err && response.statusCode == 200){
//       //todoJSON.parse(body)
//       let res = JSON.parse(body);
//       return res;
//     }
//   }
// }

app.post("/get_net_status", (req, res) => {
  let ip = req.body.ip;
  const querystring = require("querystring");
  const { Curl } = require("node-libcurl");
  const curlTest = new Curl();
  const terminate = curlTest.close.bind(curlTest);
  console.log(Curl.option);
  curlTest.setOpt(Curl.option.TIMEOUT, 1);
  curlTest.setOpt(Curl.option.URL, ip);
  curlTest.setOpt(Curl.option.POST, true);
  curlTest.setOpt(
    Curl.option.POSTFIELDS,
    querystring.stringify({
      name: "section",
      job: "webdev",
    })
  );

  curlTest.on("end", function (statusCode, data, headers) {
    console.info("Status code " + statusCode);
    console.info("***");
    console.info("Our response: " + data);
    console.info("***");
    console.info("Length: " + data.length);
    console.info("***");
    // console.info("Total time taken: " + this.getInfo("TOTAL_TIME"));

    this.close();
    res.send({
      statusCode,
      data,
    });
  });
  curlTest.on("error", () => {
    console.log("CURL ERROR");
  });
  curlTest.perform();
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
    // let rrr = await get_max_info(ip, i);
    // if (rrr?.result) {
    //   hosts.push(rrr);
    // }

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
        console.log("Found: +++++++++++++++", host);
        hosts.push({ host });
      }
    });
  }
  return hosts;
};
