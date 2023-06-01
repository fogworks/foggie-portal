import { ipcMain, dialog, shell } from 'electron'
import { extname } from 'path'

export function initDownload (win) {
  let downloadObj = {
    downloadPath: '',
    fileName: '', 
    savedPath: '' 
  }
  function resetDownloadObj() {
    downloadObj = {
      downloadPath: '',
      fileName: '',
      savedPath: ''
    }
  }
  console.log('++++++++++++++++download-------ipcMain')
  ipcMain.on('download', (evt, args) => {
    console.log('++++++++++++++++download', args)
    downloadObj.downloadPath = args.downloadPath
    downloadObj.fileName = args.fileName
    let ext = extname(downloadObj.fileName)
    let filters = [{ name: 'All Files', extensions: ['*'] }]
    if (ext && ext !== '.') {
      filters.unshift({
        name: '',
        extensions: [ext.match(/[a-zA-Z]+$/)[0]]
      })
    }
    dialog
      .showSaveDialog(win, {
        filters,
        defaultPath: downloadObj.fileName
      })
      .then((result) => {
        downloadObj.savedPath = result.filePath
        if (downloadObj.savedPath) {
          win.webContents.downloadURL(downloadObj.downloadPath) 
        }
      })
      .catch(() => {})
  })

  win.webContents.session.on('will-download', (event, item) => {
    item.setSavePath(downloadObj.savedPath)
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        shell.showItemInFolder(downloadObj.savedPath)
      } else {
        console.log(`Download failed: ${state}`)
      }
      resetDownloadObj()
    })
  })
}
