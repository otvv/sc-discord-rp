/*
*/

'use strict'

const portName = 'soundcloud'
let lastSongPlayed = '(null)'
let lastKnownAuthor = '(null)'
let lastSongProgress = 0
let lastSongMaxProgress = 0
let isPlaying = false

const refreshInfo = () => {

  // if the user starts listening to a song
  if (isListening) {

    let isCurrentlyPlaying = false
    let songCurrentlyPlaying = '(null)'
    let songAuthor = '(null)'
    let songCurrentProgress = 0
    let songMaxProgress = 0

    // retrieve playing status from soundcloud 
    if (document.querySelector('.playControls__play') !== null) {
      isCurrentlyPlaying = document.querySelector('.playControls__play').classList.contains('playing')
    }

    // get song title, author & link from soundcloud api if the user starts listening to a song
    if (document.querySelector('.playbackSoundBadge__title > a[href][title]') !== null) {
      songCurrentlyPlaying = document.querySelector('.playbackSoundBadge__title > a[href][title]').getAttribute('title')
      songAuthor = document.querySelector('.playbackSoundBadge__titleContextContainer > a[href][title]').getAttribute('title')
    }

    // get song progress
    if (document.querySelector('.playControls__timeline') !== null) {
      songMaxProgress = document.querySelector('.playbackTimeline__duration > span[aria-hidden]').textContent
      songCurrentProgress = document.querySelector('.playbackTimeline__timePassed > span[aria-hidden]').textContent
    }

    // update status if the user starts playing a new song
    if (isPlaying !== isCurrentlyPlaying || lastSongPlayed !== songCurrentlyPlaying || lastKnownAuthor !== songAuthor 
      || lastSongProgress !== songCurrentProgress || lastSongProgress !== songCurrentProgress)  { // FIXME: make this less weird

      // update song status (playing or not)
      isPlaying = isCurrentlyPlaying

      // update song info (author and title)
      lastSongPlayed = songCurrentlyPlaying
      lastKnownAuthor = songAuthor

      // update song progress (time)
      lastSongMaxProgress = songMaxProgress
      lastSongProgress = songCurrentProgress

      // if we have a song being played right now
      // set data with info retrieved from soundcloud api
      if (isCurrentlyPlaying) {

        data = {
          dontSave: true,
          type: 2,
          name: 'SoundCloud',
          streamurl: '',
          details: songCurrentlyPlaying,
          state: 'by ' + songAuthor + '⠀|⠀' + songCurrentProgress + ' - ' + songMaxProgress,
          partycur: '',
          partymax: ''
        }
        // send message through chrome runtime
        chrome.runtime.sendMessage(data)
      }
      else { // if paused, reset presence
             // or if the soundcloud port closes

        // clear data and reset
        data = undefined;

        chrome.runtime.sendMessage({ action: 'reset' });
      }
    }
  }
}
