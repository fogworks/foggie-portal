const { defineConfig } = require('@vue/cli-service')
const path = require("path")
const port = process.env.port || process.env.npm_config_port || 8080; // dev port
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude
      .add(path.resolve(__dirname, 'src/svg-icons'))
      .end()
    // 配置svg图标的加载器
    config.module
      .rule('svg-icons')
      .test(/.svg$/)
      .include
      .add(path.resolve(__dirname, 'src/svg-icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/static/style/common.less")]
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
        changeOrigin: true, //是否跨域
        secure: false, // 设置支持https协议的代理
      },
      "/api/payments": {
        target: "http://154.31.0.29:8088",
        changeOrigin: true, //是否跨域
        secure: false, // 设置支持https协议的代理
      },
      "/api/checkpayment": {
        target: "http://154.31.0.29:8088",
        changeOrigin: true, //是否跨域
        secure: false, // 设置支持https协议的代理
      },
      "/api/completepayment": {
        target: "http://154.31.0.29:8088",
        changeOrigin: true, //是否跨域
        secure: false, // 设置支持https协议的代理
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
          '^/upload': ''//代理的路径
        }
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
    },
    // before: require('./mock/mock-server.js')
  },
})

// module.exports = { //多页面打包
//   pages: {
//     main: {
//       // 入口js
//       entry: 'src/views/main/main.js',
//       // 模板来源
//       template: 'public/main.html',
//       // 在 dist 中生成的html文件名字
//       filename: 'main.html',
//       // template html 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
//       title: 'Main Page'
//     }
//   }
// }
