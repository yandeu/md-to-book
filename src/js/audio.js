// @ts-check

{
  const main = async () => {
    const audioBar = /** @type {HTMLDivElement} */ (document.getElementById('audio-bar'))
    if (!audioBar) return
    const audio = /** @type {HTMLAudioElement} */ (audioBar.firstChild)
    if (!audio) return

    const audioToggle = /** @type {HTMLButtonElement} */ (document.getElementById('toggle-play'))
    if (audioToggle) {
      audioToggle.addEventListener('click', () => {
        if (audio.paused) {
          audio.play()
        } else {
          audio.pause()
        }
      })
    }

    const audioMarksUrl = audioBar.getAttribute('data-marks-url')
    if (audioMarksUrl) {
      try {
        const res = await fetch(audioMarksUrl)
        const str = '[' + (await res.text()).split('\n').join(',').slice(0, -1) + ']'
        const json = JSON.parse(str)
        const ssml_heading = json.filter(a => a.value === 'heading')

        // listen to clicks on h1-h6
        const headings = /** @type {NodeListOf<HTMLHeadingElement>} */ (
          document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        )

        headings.forEach((heading, index) => {
          heading.addEventListener('click', () => {
            const f = ssml_heading[index]
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
