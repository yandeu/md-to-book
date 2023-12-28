// @ts-check

{
  const main = () => {
    const audioBar = /** @type {HTMLDivElement} */ (document.getElementById('audio-bar'))
    if (!audioBar) return
    const audio = /** @type {HTMLAudioElement} */ (audioBar.firstChild)
    if (!audio) return

    console.log('asdfasdf')

    audio.addEventListener('play', () => {
      console.log('asdfasdf')
      audioBar.classList.add('is-active')
    })
  }
  window.addEventListener('DOMContentLoaded', main)
}
