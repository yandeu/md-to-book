// @ts-check

class ManageStorage {
  /**
   * @param {string} path
   * @param {"local" | "remote"} storageType
   */
  constructor(path, storageType) {
    this.path = path
    this.storageType = storageType
  }

  getDataByIndex(/** @type {number} */ index) {
    const data = this.getData()
    if (data?.length >= index) {
      return data[index]
    }
    return
  }

  getData() {
    if (this.storageType === 'local') {
      const storage = window.localStorage.getItem(this.path)
      return typeof storage === 'string' ? JSON.parse(storage) : []
    }

    return []
  }

  setData(data) {
    if (this.storageType === 'local') {
      window.localStorage.setItem(this.path, JSON.stringify(data))
    }
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
  const storageType = document.body.getAttribute('data-storage') || 'local'
  // @ts-expect-error
  const store = new ManageStorage(path, storageType)

  for (const [index, el] of editable.entries()) {
    // adjust data from storage
    const d = store.getDataByIndex(index)
    if (d) el.innerHTML = `<pre><code class="language-sql">${d}</code></pre>`

    el?.addEventListener('click', () => {
      const text = el.querySelector('.hljs')?.textContent
      if (typeof text !== 'string') return

      el.innerHTML = `<div class="editable-text" contenteditable role="textbox" autocorrect="off" autocapitalize="off" spellcheck="false" rows="4" cols="50">${escapeHtml(
        text
      )}</div>`
      const textarea = /** @type {HTMLTextAreaElement | null} */ (el.firstChild)
      if (!textarea) return
      setTimeout(() => {
        textarea.focus()
      })

      textarea?.addEventListener('blur', () => {
        const value = escapeHtml(textarea.innerText)
        el.innerHTML = `<pre><code class="language-sql">${value}</code></pre>`

        // save data
        store.adjustData(index, value)

        const code = el.querySelector('code')
        if (typeof code === null) return
        // @ts-expect-error
        hljs?.highlightElement(code)
      })
    })
  }
}

// https://stackoverflow.com/a/6234804
const escapeHtml = unsafe => {
  if (unsafe && typeof unsafe === 'string')
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  return unsafe
}
