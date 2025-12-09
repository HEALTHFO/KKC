const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    icon: path.join(__dirname, "logo.png"),
    webPreferences: {
      partition: "persist:kccbilling"
    }
  });

  win.loadURL("https://healthfo.github.io/KKC/"); // your live app
}

app.whenReady().then(() => {
  createWindow();
});
