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
// import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const cp = require("child_process");
const { spawn } = require("child_process");
const os = require("os");
const fs = require("fs");
const { initDownload } = require("./download.js");
const express = require("express");
const app1 = express();
const checkMacOS = () => process.platform === "darwin";

const net = require("net");

let spawnObject = {
  childSpawn: null,
  childSpawn1: null,
};
let childProcess = null;
let npmInstall = null;
let user_path = os.homedir();
let workingDir = null;
let nodeProcess = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (npmInstall) {
    npmInstall.kill();
    npmInstall = null;
  }
  if (spawnObject.childSpawn) {
    spawnObject.childSpawn.kill();
    spawnObject.childSpawn = null;
  }
  if (childProcess) {
    childProcess.kill();
    childProcess = null;
  }
  if (spawnObject.foggieProcess) {
    spawnObject.foggieProcess.kill();
    spawnObject.foggieProcess = null;
  }
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

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
});

function isPortInUse(port) {
  return new Promise((resolve, reject) => {
    const server = net
      .createServer()
      .once("error", (err) => {
        if (err.code === "EADDRINUSE") {
          resolve(true); //
        } else {
          reject(err); //
        }
      })
      .once("listening", () => {
        server.close();
        resolve(false); //
      })
      .listen(port);
  });
}

function closePort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", (err) => {
      // dialog.showErrorBox("close----error", err);
      reject(err);
      server.close();
    });

    server.once("close", () => {
      // dialog.showErrorBox("close----success", "");
      resolve();
    });

    server.listen(port, "127.0.0.1", () => {
      // dialog.showErrorBox("close----listen", "");
      server.close();
    });
  });
}

function initNodeProces() {
  workingDir = `${__dirname}/foggie-node`;

  process.chdir(workingDir);

  nodeProcess = spawn("node", ["--experimental-fetch", "server.js"]);

  nodeProcess.stdout.on("data", (data) => {
    // dialog.showErrorBox("stdout-----node", data.toString());
  });

  nodeProcess.stderr.on("data", (data) => {
    // dialog.showErrorBox("stderr------node", data.toString());
  });

  nodeProcess.on("exit", (code) => {
    // dialog.showErrorBox("exit------node", `Child process exited with code ${code}`);
    if (code === 0) {
      initNodeProces();
    }
  });
}

function initFoggieProcess() {
  spawnObject.foggieProcess = spawn(__dirname + "/foggie.exe", ["node"], {
    detached: true,
    env: {
      PROX_LOG: `${user_path}/AppData/Roaming/foggie/Logs/foggie.log`,
      // PROX_CONFIG: `${user_path}/Library/Application Support/foggie/config.json`
      PROX_CONFIG: `${__dirname}/config.json`,
    },
  });

  spawnObject.foggieProcess.stdout.on("data", (d) => {
    // dialog.showErrorBox("stdout", d.toString());
  });

  spawnObject.foggieProcess.stderr.on("data", (d) => {
    // dialog.showErrorBox("stderr", d.toString());
  });

  // spawnObject.foggieProcess.unref();

  spawnObject.foggieProcess.on("exit", (code, signal) => {
    // dialog.showErrorBox("exit", `code: ${code}, signal: ${signal}`);
    if (code === 0) {
      initFoggieProcess();
    }
  });
}

function checkMemory() {
  const totalMemory = os.totalmem(); // 获取系统总内存，单位为字节
  const totalMemoryGB = totalMemory / (1024 * 1024 * 1024); // 将总内存转换为GB

  if (totalMemoryGB < 8) {
    dialog.showMessageBox({
      type: "info",
      title: "Info",
      message:
        "The system memory is less than 8GB, it is recommended that you upgrade the memory",
      buttons: ["OK"],
    });
  }
}

function modifyConfig() {
  fs.readFile(
    path.join(__dirname, "./config.json"),
    "utf8",
    (err, data) => {
      if (data) {
        // dialog.showErrorBox("data", data);
      }
      if (err) {
        // dialog.showErrorBox("err", err);
      }

      if (err) throw err;
      let list = JSON.parse(data);
      let user_path = os.homedir();
      let server = list.server;
      let db = list.db;
      if (server.repoPath.indexOf(user_path) !== 0) {
        let isExistRepo = fs.existsSync(
          `${user_path}/AppData/Roaming/foggie/repo`
        );
        let isExistDb = fs.existsSync(
          `${user_path}/AppData/Roaming/foggie/db`
        );
        if (!isExistRepo) {
          try {
            fs.mkdirSync(`${user_path}/AppData/Roaming/foggie/repo`);
            server.repoPath = `${user_path}/AppData/Roaming/foggie/repo`;
          } catch (error) {}
        }
        if (!isExistDb) {
          try {
            fs.mkdirSync(`${user_path}/AppData/Roaming/foggie/db`);
            db.path = `${user_path}/AppData/Roaming/foggie/db`;
          } catch (error) {}
        }
      }

      let newContent = JSON.stringify(list, null, 4);
      fs.writeFile(
        path.join(__dirname, "./config.json"),
        newContent,
        "utf8",
        (err) => {
          if (err) throw err;
          console.log("success done");
        }
      );
    }
  );
}

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
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      webSecurity: false,
      experimentalFeatures: true,
    },
    icon: nativeImage.createFromPath(getTrayIcon()),
  });

  if (!isDevelopment) {
    // 使用示例
    checkMemory();
    isPortInUse(3000)
      .then((inUse) => {
        if (inUse) {
          dialog
            .showMessageBox({
              type: "question",
              title: "OK",
              message: "Port 3000 is occupied, is it closed?",
              buttons: ["OK", "Cancel"],
            })
            .then((result) => {
              if (result.response === 0) {
                closePort(3000)
                  .then(() => {})
                  .catch((error) => {});
              } else {
                return;
              }
            });
        }
      })
      .catch((err) => {});
    if (checkMacOS()) {
      closePort(8007)
        .then(() => {
          // console.log('端口关闭成功');
        })
        .catch((error) => {
          // console.error('发生错误', error);
        });
      let user_path = os.homedir();

      // let childSpawn2;

      spawnObject.childSpawn = cp.exec(
        `cd ${__dirname}/foggie-node && npm run serve`,
        (err, stdout, stderr) => {
          // dialog.showErrorBox("foggie-node", stderr);
        }
      );

      spawnObject.childSpawn1 = cp.exec(
        `chmod +x ${__dirname}/foggie`,
        (err, stdout, stderr) => {
          // dialog.showErrorBox("chmod", stderr);
        }
      );

      fs.readFile(
        path.join(__dirname, "./config.json"),
        "utf8",
        (err, data) => {
          // dialog.showErrorBox("data", data);
          // dialog.showErrorBox("err", err);
          if (err) throw err;
          let list = JSON.parse(data);
          let server = list.server;
          let db = list.db;
          if (server.repoPath.indexOf(user_path) !== 0) {
            server.repoPath = user_path + server.repoPath;
            db.path = user_path + db.path;
          }

          let newContent = JSON.stringify(list, null, 4);
          fs.writeFile(
            path.join(__dirname, "./config.json"),
            newContent,
            "utf8",
            (err) => {
              if (err) throw err;
              console.log("success done");
            }
          );
        }
      );

      // const childProcess = cp.spawn(__dirname + "/mac-arm64/foggie-portal.app/Contents/Resources/app/foggie", ['node'], {
      childProcess = cp.spawn(__dirname + "/foggie", ["node"], {
        detached: true,
        env: {
          PROX_LOG: `${user_path}/Library/Logs/foggie.log`,
          // PROX_CONFIG: `${user_path}/Library/Application Support/foggie/config.json`
          PROX_CONFIG: `${__dirname}/config.json`,
        },
      });

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
    } else if (process.platform === "win32") {
      initNodeProces();
      const filePath = path.resolve(`${__dirname}/foggie.exe`); // Replace with the actual path to the file
      fs.chmod(filePath, 0o755, (err) => {
        if (err) {
          console.error("Error occurred while changing file permissions:", err);
        } else {
          initFoggieProcess();
        }
      });
      const cofigPath = path.resolve(`${__dirname}/config.json`); // Replace with the actual path to the file
      // dialog.showErrorBox("cofigPath", cofigPath);

      fs.chmod(cofigPath, 0o755, (err) => {
        if (err) {
          // dialog.showErrorBox("Error-----config", err);
          console.error("Error occurred while changing file permissions:", err);
        } else {
          modifyConfig();
        }
      });
    }
  }

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
