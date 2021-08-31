"use strict";

import { app, BrowserWindow, protocol } from "electron";
const { ipcMain } = require("electron");
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

const isDevelopment = process.env.NODE_ENV !== "production";

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
ipcMain.on("quit", () => {
  app.quit();
});
async function createWindow() {
  const win = new BrowserWindow({
    width: 599,
    height: 1000,
    title: process.platform === "win32" ? "EduX" : "",
    titleBarStyle: "hiddenInset",
    frame: process.platform !== "win32",
    show: true,
    hasShadow: process.platform !== "darwin",
    webPreferences: {
      webSecurity: false,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  win.webContents.openDevTools();
  try {
    await installExtension(VUEJS_DEVTOOLS);
  } catch (e) {
    console.error("Vue Devtools failed to install:", e.toString());
  }
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

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
