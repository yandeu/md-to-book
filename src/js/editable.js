// @ts-check
class ManageStorage {
  /**
   * @param {string} path
   */
  constructor(path) {
    this.path = path
  }

  getDataByIndex(/** @type {number} */ index) {
    const data = this.getData()
    if (data.length >= index) {
      return data[index]
    }
    return
  }

  getData() {
    const storage = window.localStorage.getItem(this.path)
    return typeof storage === 'string' ? JSON.parse(storage) : []
  }

  setData(data) {
    window.localStorage.setItem(this.path, JSON.stringify(data))
  }

  adjustData(index, newData) {
    const data = this.getData()
    data[index] = newData
    this.setData(data)
  }
}

{
  const editable = /** @type {NodeListOf<HTMLDivElement>} */ (document.querySelectorAll('.editable'))
  const path = window.location.pathname
  const store = new ManageStorage(path)

  for (const [index, el] of editable.entries()) {
    // adjust data from storage
    const d = store.getDataByIndex(index)
    if (d) el.innerHTML = `<pre><code class="language-sql">${d}</code></pre>`

    el?.addEventListener('click', () => {
      const text = el.querySelector('.hljs')?.textContent
      if (typeof text !== 'string') return

      el.innerHTML = `<textarea autocorrect="off" autocapitalize="off" spellcheck="false" rows="4" cols="50">${text}</textarea>`
      const textarea = /** @type {HTMLTextAreaElement | null} */ (el.firstChild)
      if (!textarea) return

      textarea?.addEventListener('blur', () => {
        el.innerHTML = `<pre><code class="language-sql">${textarea.value}</code></pre>`

        // save data
        store.adjustData(index, textarea.value)

        const code = el.querySelector('code')
        if (typeof code === null) return
        // @ts-expect-error
        hljs?.highlightElement(code)
      })
    })
  }
}
