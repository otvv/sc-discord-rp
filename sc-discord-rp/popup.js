/*
*/

'use strict'

// close popup window
document.getElementById('closeButton').onclick = () => {
	window.close()
}

// reload extension
document.getElementById('reloadButton').onclick = () => {
	chrome.runtime.reload()
}

// show extension info
document.getElementById('infoButton').onclick = () => {

	// main card
	const mainCard = document.getElementById('mainCard')

	// caret switch
	const customCaret = document.getElementById('caretSwitch')

	// info button
	const infoButton = document.getElementById('infoButton')

	// info button icon
	const infoButtonIcon = document.getElementById('infoButtonIcon')

	// paragraph to hide
	const customText = document.getElementById('hiddenText')

	if (customText.style.display !== 'none') {
		customText.style.display = 'none'
	}
	else {
		customText.style.display = 'inline-block'
	}

	if (customText.style.display === 'none') {
		mainCard.style.height = '100px'

		customCaret.textContent = 'expand_less' // up arrow
	}
	else {
		mainCard.style.height = '180px'

		customCaret.textContent = 'expand_more' // down arrow
	}

	if (infoButton.checked) {
		infoButton.style.background = 'rgb(138,180,248)'

		infoButtonIcon.style.color = 'rgb(34,35,40)'
	}
	else {
		infoButton.style.background = 'rgba(160, 160, 160, 0.5)'

		infoButtonIcon.style.color = 'rgb(224, 224, 224)'
	}
}

// show extension info when clicking on the caret
document.getElementById('caretSwitch').onclick = () => {

	// main card
	const mainCard = document.getElementById('mainCard')

	// caret switch
	const customCaret = document.getElementById('caretSwitch')

	// paragraph to hide
	const customText = document.getElementById('hiddenText')

	if (customText.style.display !== 'none') {
		customText.style.display = 'none'
	}
	else {
		customText.style.display = 'inline-block'
	}

	if (customText.style.display === 'none') {
		mainCard.style.height = '100px'

		customCaret.textContent = 'expand_less' // up arrow
	}
	else {
		mainCard.style.height = '180px'

		customCaret.textContent = 'expand_more' // down arrow
	}
}
