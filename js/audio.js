// @ts-check

{
  const main = async () => {
    const audioBar = /** @type {HTMLDivElement} */ (document.getElementById('audio-bar'))
    if (!audioBar) return
    const audio = /** @type {HTMLAudioElement} */ (audioBar.firstChild)
    if (!audio) return

    const audioMarksUrl = audioBar.getAttribute('data-marks-url')
    if (audioMarksUrl) {
      try {
        const res = await fetch(audioMarksUrl)
        const str = '[' + (await res.text()).split('\n').join(',').slice(0, -1) + ']'
        const json = JSON.parse(str)

        // listen to clicks on h1-h3
        const headings = /** @type {NodeListOf<HTMLHeadingElement>} */ (document.querySelectorAll('h1, h2, h3'))
        headings.forEach(heading => {
          heading.addEventListener('click', () => {
            const f = json.find(j => j.value === heading.innerText)
            if (f) {
              audio.currentTime = f.time / 1000
              audio.play()
            }
          })
        })
      } catch (e) {
        console.log(e.message)
      }
    }

    audio.addEventListener('play', () => {
      audioBar.classList.add('is-active')
    })
  }
  window.addEventListener('DOMContentLoaded', main)
}
