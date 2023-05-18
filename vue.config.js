const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const port = process.env.port || process.env.npm_config_port || 9001; // dev port

require("events").EventEmitter.defaultMaxListeners = 0;

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {},
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
      },
    },
    plugins: [new NodePolyfillPlugin()],
  },
  chainWebpack: (config) => {
    config.module
      .rule("svg")
      .exclude.add(path.resolve(__dirname, "src/svg-icons"))
      .end();
    config.module
      .rule("svg-icons")
      .test(/.svg$/)
      .include.add(path.resolve(__dirname, "src/svg-icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "./src/static/style/index.scss")],
    },
    electronBuilder: {
      builderOptions: {
        appId: 'contact@vofocorp.com',
        mac: {
          icon: 'public/dog1.icns'
        },
        win: {
          icon: 'public/dog.ico'
        }
      }
    }
  },
  lintOnSave: true,
  devServer: {
    port: port,
    open: true,
    // overlay: {
    //   warnings: false,
    //   errors: true,
    // },
    proxy: {
      "/api/paynode": {
        target: `http://154.31.0.29:8088`,
        changeOrigin: true,
        secure: false,
      },
      "/api/payments": {
        target: "http://154.31.0.29:8088",
        changeOrigin: true,
        secure: false,
      },
      "/api/checkpayment": {
        target: "http://154.31.0.29:8088",
        changeOrigin: true,
        secure: false,
      },
      "/api/completepayment": {
        target: "http://154.31.0.29:8088",
        changeOrigin: true,
        secure: false,
      },
      "/v2/payments": {
        // target: 'https://connect.squareupsandbox.com',//http://10.8.90.252:7000//http://10.8.90.145:8001，http://154.31.0.29:8001
        // target: 'http://154.31.0.29:8001',
        target: "https://connect.squareup.com",
        changeOrigin: true,
        secure: false,
      },
      "/v1/chain/get_table_rows": {
        // target: 'https://connect.squareupsandbox.com',//http://10.8.90.252:7000//http://10.8.90.145:8001，http://154.31.0.29:8001
        // target: 'http://154.31.0.29:8001',
        // target: "http://rc1.dmctech.io", //http://scontract.dmctech.io:25986
        target: "http://18.188.82.206:8870",
        changeOrigin: true,
        secure: false,
      },
      // http://scontract.dmctech.io:25986/v1/chain/get_table_rows
      "^/o/": {
        // target: 'https://vfoggie.vofocorp.com',//http://10.8.90.252:7000//http://10.8.90.145:8001，http://154.31.0.29:8001
        // target: 'http://154.31.0.29:8001',
        target: "http://154.31.41.36:880",
        // target: "http://218.2.96.99:880/",
        changeOrigin: true,
        secure: false,
      },
      // "^/mp": {
      //   // target: 'https://vfoggie.vofocorp.com',//http://10.8.90.252:7000//http://10.8.90.145:8001，http://154.31.0.29:8001
      //   // target: 'http://154.31.0.29:8001',
      //   // target: "http://154.31.34.194:9000",
      //   target: "https://218.2.96.99:9010",
      //   changeOrigin: true,
      //   secure: false,
      // },
      "^/mp": {
        target: "https://218.2.96.99:8443",
        changeOrigin: true,
        secure: false,
      },
      "^/upload": {
        target: "http://154.31.34.194:9000",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/upload": "",
        },
      },
      "^/x": {
        target: "http://154.31.41.36:880",
        changeOrigin: true,
        secure: false,
      },
      // "^/x/reward_active": {
      //   target: "http://154.31.41.36:880",
      //   changeOrigin: true,
      //   secure: false,
      // },
      // "^/s/": {
      //   target: "http://154.31.41.36:880/",
      //   changeOrigin: true,
      //   secure: false,
      // },
      "^/d": {
        target: "http://154.31.41.36:880",
        changeOrigin: true,
        secure: false,
      },
      "^/metrics": {
        target: "http://154.31.41.36:9009",
        changeOrigin: true,
        secure: false,
      },
      "/q/query": {
        target: "http://154.31.41.36:880",
        changeOrigin: true,
        secure: false,
      },
      "^/ipfs/": {
        // target: "http://154.31.41.36:880",
        target: "http://218.2.96.99:9010",
        changeOrigin: true,
        secure: false,
      },
      "^/ipfsops": {
        // target: "http://154.31.41.36:880",
        target: "http://218.2.96.99:9010",
        // target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "^/publish": {
        // target: "http://154.31.41.36:880",
        // target: "http://218.2.96.99:9010",
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "^/file_delete": {
        // target: "http://154.31.41.36:880",
        // target: "http://218.2.96.99:9010",
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "^/list_files": {
        // target: "http://154.31.41.36:880",
        // target: "http://218.2.96.99:9010",
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "^/find_objects": {
        // target: "http://154.31.41.36:880",
        // target: "http://218.2.96.99:9010",
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },

      "^/search_object": {
        // target: "http://154.31.41.36:880",
        // target: "http://218.2.96.99:9010",
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },

      "^/file_download": {
        // target: "http://154.31.41.36:880",
        // target: "http://218.2.96.99:9010",
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "^/s_ipfsops/pin": {
        // target: "http://154.31.41.36:880",
        // target: "http://218.2.96.99:9010",
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "^/ipns": {
        // target: "http://154.31.41.36:880",
        target: "http://218.2.96.99:9010",
        changeOrigin: true,
        secure: false,
      },
      "^/pin/": {
        // target: "http://154.31.41.36:880",
        target: "https://218.2.96.99:8443/",
        changeOrigin: true,
        secure: false,
      },
      "/v1/chain/get_account": {
        target: "http://explorer.dmctech.io/",
        changeOrigin: true,
        secure: false,
      },
      "^/api": {
        // target: 'https://vfoggie.vofocorp.com',//http://10.8.90.252:7000//http://10.8.90.145:8001，http://154.31.0.29:8001
        // target: 'http://154.31.0.29:8001',
        target: "http://154.31.41.36:8001",
        changeOrigin: true,
        secure: false,
      },
      "^/vpp": {
        target: "http://154.31.41.36:8003",
        changeOrigin: true,
        secure: false,
      },
      "^/cyfs_sign": {
        target: "http://106.75.136.42:10388/",
        changeOrigin: true,
        secure: false,
      },
      "^/nixls": {
        target: "https://218.2.96.99:8443",
        // target: "https://154.37.16.163:8443",
        changeOrigin: true,
        secure: false,
      },
      "^/stats": {
        target: "https://218.2.96.99:8443",
        // target: "https://172.16.30.10",
        changeOrigin: true,
        secure: false,
      },
      "^/ping": {
        target: "https://218.2.96.99:8443",
        changeOrigin: true,
        secure: false,
      },
      "^/object": {
        target: "https://218.2.96.99:8443",
        changeOrigin: true,
        secure: false,
      },
      "^/lookup": {
        target: "https://218.2.96.99:8443",
        changeOrigin: true,
        secure: false,
      },
      "^/find": {
        target: "https://218.2.96.99:8443",
        changeOrigin: true,
        secure: false,
      },
      "^/fog": {
        target: "https://218.2.96.99:8443",
        changeOrigin: true,
        secure: false,
      },
      "^/v1": {
        target: "http://154.37.16.163:9094",
        changeOrigin: true,
        secure: false,
      },
      "/getIP": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "/portal_ping": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "/socket_ip": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "/get_max_info": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "/get_net_status": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      "/client_api": {
        // target: 'http://192.168.1.104:3000',

        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        // ws: false, //
        // logLevel: 'debug',
        // onProxyReq: (proxyReq, req) => {
        //   console.log('[HPM] %s %s %s %s', req.method, req.originalUrl, '->', req.url);
        // },
        pathRewrite: {
          "^/client_api": "",
        },
      },
    },
    // before: require('./mock/mock-server.js')
  },
});

// module.exports = {
//   pages: {
//     main: {
//       entry: 'src/views/main/main.js',
//       template: 'public/main.html',
//       filename: 'main.html',
//       title: 'Main Page'
//     }
//   }
// }
