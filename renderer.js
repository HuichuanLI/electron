// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded',()=>{
    ipcRenderer.send('message','hello from huichuan!')  
    ipcRenderer.on('reply',(event,arg)=>{
       document.getElementById('messages').innerHTML = arg   
    })    
})


