"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  screen,
  nativeImage,
  dialog,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const cp = require("child_process");
const os = require("os");
const spawn1 = require("cross-spawn");
const fs = require("fs");
const { initDownload } = require('./download.js')
// let childSpawn;
// const checkMacOS = () => process.platform === 'darwin';
// console.log('++++++++checkMacOS', checkMacOS())
// console.log('++++++++__dirname', __dirname)
// if (checkMacOS()) {
//   // childSpawn = cp.spawn(`node ${path.join(__dirname, "bundled/foggie-node/server.js")}`);
//   childSpawn = cp.spawn("node",["./foggie-node/server.js"], {
//     shell:false,
//     stdio: ['inherit', 'inherit', 'inherit','ipc']
//   });
// } else {
//   // cp.spawn(path.join(__dirname, './winResources/xxx'));
// }

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  let size = screen.getPrimaryDisplay().workAreaSize;
  let width = parseInt(size.width * 0.8);
  let height = parseInt(size.height * 0.8);

  function getTrayIcon() {
    if (process.platform !== "darwin") {
      // windows
      return path.join(__static, "f1.ico");
    }
    return path.join(__static, "f1.png");
  }

  const win = new BrowserWindow({
    width,
    height,
    // fullscreen: true,
    backgroundColor: "#fff",
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
    icon: nativeImage.createFromPath(getTrayIcon()),
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  initDownload(win);
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const express = require("express");
const app1 = express();
const checkMacOS = () => process.platform === "darwin";

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();

  if (checkMacOS()) {
    let user_path = os.homedir();
    let childSpawn;
    let childSpawn1;
    // let childSpawn2;

    childSpawn = cp.exec(
      `cd ${__dirname}/foggie-node && npm run serve`,
      (err, stdout, stderr) => {
        // dialog.showErrorBox("foggie-node", stderr);
      }
    );

    childSpawn1 = cp.exec(
      `chmod +x ${__dirname}/foggie`,
      (err, stdout, stderr) => {
        // dialog.showErrorBox("chmod", stderr);
      }
    );
    // fs.chmod(`${__dirname}/foggie`, 1)
    // fs.chmod(`${__dirname}/config.json`, 1)

    // fs.readFile(path.join(__dirname, "./config.json"), "utf8", (err, data) => {
    //   // dialog.showErrorBox("data", data);
    //   // dialog.showErrorBox("err", err);
    //   if (err) throw err;
    //   let list = JSON.parse(data);
    //   let server = list.server;
    //   let db = list.db;
    //   if (server.repoPath.indexOf(user_path) !== 0) {
    //     server.repoPath = user_path + server.repoPath;
    //     db.path = user_path + db.path;
    //   }

    //   let newContent = JSON.stringify(list, null, 4);
    //   fs.writeFile(path.join(__dirname, "./config.json"), newContent, "utf8", (err) => {
    //     if (err) throw err;
    //     console.log("success done");
    //   });
    // });

    // const childProcess = cp.spawn(__dirname + "/mac-arm64/foggie-portal.app/Contents/Resources/app/foggie", ['node'], {
    // const childProcess = cp.spawn(__dirname + "/foggie", ["node"], {
    //   detached: true,
    //   env: {
    //     PROX_LOG: `${user_path}/Library/Logs/foggie.log`,
    //     // PROX_CONFIG: `${user_path}/Library/Application Support/foggie/config.json`
    //     PROX_CONFIG: `${__dirname}/config.json`,
    //   },
    // });

    childProcess.stdout.on("data", (d) => {
      // dialog.showErrorBox("stdout", d.toString());
    });

    childProcess.stderr.on("data", (d) => {
      // dialog.showErrorBox("stderr", d.toString());
    });

    childProcess.unref();

    childProcess.on("exit", (code, signal) => {
      // dialog.showErrorBox("exit", `code: ${code}, signal: ${signal}`);
    });
  } else {
    // cp.spawn(path.join(__dirname, './winResources/xxx'));
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
