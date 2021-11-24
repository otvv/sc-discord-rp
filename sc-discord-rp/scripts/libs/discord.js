/*
*/

// NOTE: credits to github.com/Sainan

'use strict'

const injectionCode = () => {
	
	const originalWebSocket = window.WebSocket, originalWebSocketProperties = ["binaryType", "bufferedAmount", "extensions", "onclose", "onmessage", "onopen", "protocol", "readyState", "url"]

	let status = 'online'
	let since = 0
	let afk = false 
	let timer = 0
	
	window.SetDiscordActivityData = {
		sendUpdate: false,
		activityType: 2,
		activityName: '',
		activityUrl: '',
		activityDetails: '',
		activityState: '',
		activityPartyCur: '',
		activityPartyMax: ''
	}

	window.WebSocket = function(u, p) {

		this.downstreamSocket = new originalWebSocket(u, p)

		if (u.indexOf("gateway.discord.gg") > -1) {
			window.SetDiscordActivityActiveSocket = this.downstreamSocket
		}

		for (let i in originalWebSocketProperties) {

			Object.defineProperty(this,originalWebSocketProperties[i], {
				get: () => this.downstreamSocket[originalWebSocketProperties[i]],
				set: v => this.downstreamSocket[originalWebSocketProperties[i]] = v
			})
		}
	}

	window.WebSocket.prototype.send = function(data) {
		
		if (this.downstreamSocket == window.SetDiscordActivityActiveSocket) {

			const start = data.substr(0, 8)

			if (start == '{"op":3,') {

				// parse json data
				const json = JSON.parse(data)

				status = json.data.status
				since = json.data.since
				afk = json.data.afk

				window.SetDiscordActivitySendStatus()
			}
			else {

				if (start == '{"op":2,') {

					clearInterval(timer)

					timer = setInterval( () => {

						if (window.SetDiscordActivityData.sendUpdate) {
							window.SetDiscordActivityData.sendUpdate = false
							window.SetDiscordActivitySendStatus()
						}
					}, 500)
				}

				this.downstreamSocket.send(data)
			}
		}
		else {
			this.downstreamSocket.send(data)
		}
	}

	window.WebSocket.prototype.close = function(c,r) {
		this.downstreamSocket.close(c,r)
	}

	window.WebSocket.CONNECTING = originalWebSocket.CONNECTING
	window.WebSocket.OPEN = originalWebSocket.OPEN
	window.WebSocket.CLOSING = originalWebSocket.CLOSING
	window.WebSocket.CLOSED = originalWebSocket.CLOSED

	window.SetDiscordActivitySendStatus = () => {
		
		if (window.SetDiscordActivityActiveSocket && window.SetDiscordActivityActiveSocket.readyState == originalWebSocket.OPEN) {
			
			let activity = {
				type: window.SetDiscordActivityData.activityType,
				name: window.SetDiscordActivityData.activityName
			}

			if (window.SetDiscordActivityData.activityPartyCur != '' && window.SetDiscordActivityData.activityPartyMax != '') {
				activity.party = { size: [window.SetDiscordActivityData.activityPartyCur, window.SetDiscordActivityData.activityPartyMax] }
			}

			if (window.SetDiscordActivityData.activityDetails) {
				activity.details = window.SetDiscordActivityData.activityDetails
			}

			if (window.SetDiscordActivityData.activityState) {
				activity.state = window.SetDiscordActivityData.activityState
			}

			window.SetDiscordActivityActiveSocket.send(JSON.stringify( {op: 3, d: {
				status,
				activities: [activity],
				since,
				afk
			}}))
		}
	}
},

injectScript = text => {
	
	// script element
	let script= document.createElement('script')

	// set script text
	script.innerHTML = text
	script = document.documentElement.appendChild(script)

	setTimeout(() => {
		document.documentElement.removeChild(script)
	}, 10)
},

encodeString = str => str ? str.split("\\").join("\\\\").split("\"").join("\\\"") : str
injectScript('(' + injectionCode.toString() + ')()')

let port = chrome.runtime.connect( {name:'discord'} )
let isClosed = false

port.onMessage.addListener(msg => {

  /* DEBUG PURPOSES ONLY */
  console.info('[sc-rp] - ' + msg + '.')
	
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
	else if (msg.type !== undefined && msg.name !== undefined) {
		injectScript(`window.SetDiscordActivityData = {
			sendUpdate: true,
			activityType: ` + msg.type +`,
			activityName: \"` + encodeString(msg.name) + `\",
			activityUrl: \"` + encodeString(msg.streamurl) + `\",
			activityDetails: \"` + encodeString(msg.details) + `\",
			activityState: \"` + encodeString(msg.state) + `\",
			activityPartyCur: \"` + encodeString(msg.partycur) + `\",
			activityPartyMax: \"` + encodeString(msg.partymax) + `\"
		}`)
	}
})

port.onDisconnect.addListener( () => {

  /* DEBUG PURPOSES ONLY */
	console.info("[sc-rp] - PORT DISCONNECTED.")
	
	// stop event listener and tell the cortex that we're finished here
  // and reset state
	if (isClosed) {
		isClosed = false
	}
	else {
		location.reload()
	}
})
