/*
*/

'use strict'

let port = chrome.runtime.connect({ name: portName })

let isClosed = false
let isListening = false
let data = false

setInterval(refreshInfo, 1000)

// listen for close event triggered by user
port.onMessage.addListener(msg => {

  /* DEBUG PURPOSES ONLY */
  console.info('[sc-rp] - ' + msg + '.')

  // if the user triggered an action
  if (msg.action) {
    
    // if we have a close action
    if (msg.actionn == 'close') {
      isClosed = true
    }
    else {

      /* DEBUG PURPOSES ONLY */
      console.warn("[sc-rp] - UNKNOWN ACTION: ", msg.action) // other action that is not 'close'
    }
  }
  else { // if the user haven't triggerend an action yet
         // continue listening for events
    isListening = msg.listen
    if (isListening && data) {
      chrome.runtime.sendMessage(data)
    }
  }
})

// if the event we're looking for is triggered
// send message to close port
port.onDisconnect.addListener(() => {

  /* DEBUG PURPOSES ONLY */
  console.info("[sc-rp] - PORT DISCONNECTED.")

  // stop event listener and tell the cortex (lul) that we're finished here
  // and reset state
  if (isClosed) {
    isClosed = false
    isListening = false
  }
  else { // if not reload listener api
    location.reload()
  }
})
