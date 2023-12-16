// @ts-check

{
  let index = 0
  const themes = ['light', 'dark', 'contrast']
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) index = 1
  index = parseInt(localStorage.getItem('theme') || index.toString())

  const adjustTheme = () => {
    localStorage.setItem('theme', (index % 3).toString())

    const setDataTheme = theme => {
      const html = document.querySelector('html')
      html?.setAttribute('data-theme', theme)
    }

    document.querySelector(`link[title="${themes[index % 3]}-theme"]`)?.removeAttribute('disabled')

    for (const t in themes) {
      if (+t === index % 3) {
      } else {
        setTimeout(() => {
          document.querySelector(`link[title="${themes[t]}-theme"]`)?.setAttribute('disabled', 'disabled')
        }, 50)
      }
    }

    setDataTheme(themes[index % 3])
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
