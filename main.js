const {app,BrowserWindow,ipcMain,dialog} = require('electron')
const store = require('electron-store')
const Datastore = require('./renderer/MusicDataStore')
let addWindow = null
const myStore = new Datastore({'name':'Music Data'})
class Appwindow extends BrowserWindow{
  constructor(config,filelocation){
    const basicConfig = {
      width:800,
      height:600,
      webPreferences:{      
        nodeIntegration:true
      }
    }
    const finalConfig = Object.assign(basicConfig,config)
    super(finalConfig)
    this.loadFile(filelocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}


app.on('ready',()=>{
  const mainWindow = new Appwindow({},'./renderer/index.html')

  mainWindow.webContents.on('did-finish-load',()=>{
    mainWindow.send('getTracks', myStore.getTracks())
  })
  ipcMain.on('add-music-window',()=>{  

    addWindow = new Appwindow({width:500,height:400, parent:mainWindow  },'./renderer/add.html')
  })
 
  ipcMain.on('open-music-file',(event)=>{
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        // 路径读取了文件
        filters: [{ name: 'Music', extensions: ['mp3'] }]
          }, (files) => {
        if (files) {
          event.sender.send('selected-file',files)
        }
    })
  })
  ipcMain.on('add-tracks',(event,tracks)=>{
    const updatedTracks = myStore.addTracks(tracks).getTracks()
    mainWindow.send('get-tracks',updatedTracks)
    addWindow.close()
    mainWindow.reload()
  })

  ipcMain.on('delete-track',(event,id)=>{
    const updatedTracks = myStore.deleteTrack(id)
    mainWindow.send('get-tracks',updatedTracks)
    mainWindow.reload()
  })

  
  
})