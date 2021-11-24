/*
*/

'use strict'

let discordPort = undefined
let soundCloudPort = undefined

const resetActivity = () => {

  // if the discord broadcast channel is already initialized
  // reset presence activity
  if (discordPort !== undefined) {

    discordPort.postMessage({
      type: 0,
      name: '',
      streamurl: '',
      details: '',
      state: '',
      partycur: '',
      partymax: ''
    })
  }
}

chrome.runtime.onConnect.addListener(port => {

  if (port.name == 'discord') {

    // if the discord broadcast channel is already initialized
    // reset presence activity
    if (discordPort !== undefined) {

      // send close event and disconnect
      discordPort.postMessage({ action: 'close' })
      discordPort.disconnect()
    }

    // initialize the broadcast channel (port)
    discordPort = port
    console.info('[sc-rp] - DISCORD PORT OPENED.')

    port.onDisconnect.addListener(() => {

      // close discord broadcast channel
      discordPort = undefined

      console.info('[sc-rp] - DISCORD PORT CLOSED.')
    })

    if (soundCloudPort !== undefined) {
      soundCloudPort.postMessage({ listen: true })
    }
  }
  else if (port.name == 'soundcloud') {

    // if the soondcloud broadcast channel is already initialized
    // reset presence activity
    if (soundCloudPort !== undefined) {

      soundCloudPort.postMessage({ action: 'close' })
      soundCloudPort.disconnect()
    }

    // initialize the broadcast channel (port)
    soundCloudPort = port
    console.info('[sc-rp] - SOUNDCLOUD PORT OPENED.')

    port.onDisconnect.addListener(() => {

      // close soundcloud broadcast channel
      soundCloudPort = undefined;

      console.info('[sc-rp] - SOUNDCLOUD PORT CLOSED.')
    })

    if (discordPort !== undefined) {
      soundCloudPort.postMessage({ listen: true })
    }
  }
  else {

    console.error('[sc-rp] - DENIED CONNECTION WITH UNKNOWN PORT NAME: ', port.name)
    port.disconnect()
  }

})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  /* DEBUG PURPOSES ONLY */
  console.info('[sc-rp] - REQUEST: ', request)

  if (request.action !== undefined) {

    switch (request.action) {

      case 'ports': {
        sendResponse({
          discord: discordPort !== undefined,
          soundcloud: soundCloudPort !== undefined
        })
      }
        break;
      case 'source': {

        if (soundCloudPort !== undefined) {
          soundCloudPort.postMessage({ listen: true })
        }

        sendResponse()
      }
        break;
      case 'reset': {
        
        resetActivity()
        
        sendResponse()
      }
        break;

      default:

        /* DEBUG PURPOSES ONLY */
        console.error('[sc-rp] - UNKNOWN ACTION: ', request.action) // any action that is not 'source', 'ports' or 'reset'
    }
  }
  else {

    if (discordPort !== undefined) {
      discordPort.postMessage(request)
    }
  }
})
