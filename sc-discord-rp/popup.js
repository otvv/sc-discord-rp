/*
*/

'use strict'

// reload extension when the user clicks on the extension logo
document.getElementById('reloadButton').onclick = () => {
	chrome.runtime.reload()
}
