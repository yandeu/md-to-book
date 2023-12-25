// @ts-check

{
  let index = 0
  const font = ['default', 'literata']
  index = parseInt(localStorage.getItem('font') || index.toString())

  const adjustFont = () => {
    const html = document.querySelector('html')
    html?.setAttribute('data-font', font[index % 2])
    localStorage.setItem('font', (index % 2).toString())
  }

  window.addEventListener('DOMContentLoaded', () => {
    const toggleTheme = document.getElementById('toggle-font')
    toggleTheme?.addEventListener('click', () => {
      index++
      adjustFont()
    })
  })
  adjustFont()
}

{
  let index = 0
  const themes = ['light', 'read', 'dark', 'contrast']
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) index = 2
  index = parseInt(localStorage.getItem('theme') || index.toString())

  const adjustTheme = () => {
    localStorage.setItem('theme', (index % 4).toString())

    console.log(themes[index % 4] === 'read')

    if (themes[index % 4] !== 'read') {
      document.querySelector(`link[title="${themes[index % 4]}-theme"]`)?.removeAttribute('disabled')

      for (const t in themes) {
        if (+t === index % 4) {
        } else {
          setTimeout(() => {
            document.querySelector(`link[title="${themes[t]}-theme"]`)?.setAttribute('disabled', 'disabled')
          }, 50)
        }
      }
    }

    const html = document.querySelector('html')
    html?.setAttribute('data-theme', themes[index % 4])
  }

  adjustTheme()

  window.addEventListener('DOMContentLoaded', () => {
    const toggleTheme = document.getElementById('toggle-theme')
    toggleTheme?.addEventListener('click', () => {
      index++
      adjustTheme()
    })
  })
}
