const io = require('socket.io-client')
const socket = io('http://localhost:3001')
const {app, BrowserWindow, Menu} = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1030,
        height: 618,
        frame: true,
        resizable: false
    })
    // Menu.setApplicationMenu(null)
    win.loadFile('./index.html')
}

app.whenReady().then(() => {
    createWindow()
})