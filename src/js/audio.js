// @ts-check

{
  const main = async () => {
    const audioBar = /** @type {HTMLDivElement} */ (document.getElementById('audio-bar'))
    if (!audioBar) return
    const audio = /** @type {HTMLAudioElement} */ (audioBar.firstChild)
    if (!audio) return

    const audioUrl = audioBar.getAttribute('data-audio-url')
    const audioMarksUrl = audioBar.getAttribute('data-marks-url')
    if (!audioMarksUrl || !audioUrl) return

    let marksLoaded = false
    let ssml_heading = /** @type {Array<{time: number}>} */ ([])

    const loadAudiMarks = async () => {
      if (marksLoaded) return ssml_heading
      const res = await fetch(audioMarksUrl)
      const str = '[' + (await res.text()).split('\n').join(',').slice(0, -1) + ']'
      const json = JSON.parse(str)
      ssml_heading = json.filter(a => a.value === 'heading')
      marksLoaded = true
      return ssml_heading
    }

    const loadAudioFile = () => {
      if (audio.src) return

      return /** @type {Promise<void>} */ (
        new Promise(resolve => {
          audio.addEventListener(
            'canplaythrough',
            () => {
              return resolve()
            },
            { once: true }
          )
          audio.src = audioUrl
        })
      )
    }

    const audioToggle = /** @type {HTMLButtonElement} */ (document.getElementById('toggle-play'))
    if (audioToggle) {
      audioToggle.addEventListener('click', async () => {
        await loadAudioFile()
        // console.log(audio.pause)
        // console.log(audio.readyState)
        if (audio.paused) {
          audio.play()
        } else {
          audio.pause()
        }
      })
    }

    try {
      // listen to clicks on h1-h6
      const headings = /** @type {NodeListOf<HTMLHeadingElement>} */ (
        document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      )

      headings.forEach((heading, index) => {
        heading.addEventListener('click', async () => {
          const f = (await loadAudiMarks())[index]
          if (f) {
            await loadAudioFile()
            audio.currentTime = f.time / 1000
            audio.play()
          }
        })
      })
    } catch (e) {
      console.log(e.message)
    }

    audio.addEventListener('play', () => {
      audioBar.classList.add('is-active')
    })
  }
  window.addEventListener('DOMContentLoaded', main)
}
