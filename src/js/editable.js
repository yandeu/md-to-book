// @ts-check

/// <reference path="./types.d.ts" />

/**
 *
 * @returns {Promise<boolean>}
 */
const simulateRemoteDelay = () => new Promise(r => setTimeout(() => r(true), 200))

class ManageStorage {
  /**
   * @param {string} path
   * @param {"local" | "remote"} storageType
   */
  constructor(path, storageType) {
    this.path = path
    this.storageType = storageType
  }

  /**
   *
   * @param {number} index
   * @returns {Promise<string | null>}
   */
  async getDataByIndex(index) {
    const data = await this.getData()
    if (data?.length >= index) {
      return data[index]
    }
    return null
  }

  /**
   *
   * @returns {Promise<Array<string>>}
   */
  async getData() {
    if (this.storageType === 'local') {
      const storage = window.localStorage.getItem(this.path)
      return typeof storage === 'string' ? JSON.parse(storage) : []
    } else if (this.storageType === 'remote') {
      if (window.get_remote_data && typeof window.get_remote_data === 'function') {
        return (await window.get_remote_data()) || []
      } else {
        return []
      }
    }
    return []
  }

  /**
   *
   * @param {any} data
   * @returns {Promise<boolean>}
   */
  async setData(data) {
    if (this.storageType === 'local') {
      window.localStorage.setItem(this.path, JSON.stringify(data))
      return true
    } else if (this.storageType === 'remote') {
      if (window.store_remote_data && typeof window.store_remote_data === 'function') {
        return await window.store_remote_data(JSON.stringify(data))
      } else {
        return false
      }
    }
    return true
  }

  /**
   *
   * @param {number} index
   * @param {string} newData
   * @returns {Promise<boolean>}
   */
  async adjustData(index, newData) {
    const data = await this.getData()
    data[index] = newData
    return await this.setData(data)
  }
}

{
  const main = async () => {
    const editable = /** @type {NodeListOf<HTMLDivElement>} */ (document.querySelectorAll('.editable'))
    const path = window.location.pathname
    const storageType = document.body.getAttribute('data-storage') || 'local'
    // @ts-expect-error
    const store = new ManageStorage(path, storageType)

    for (const [index, el] of editable.entries()) {
      // adjust data from storage
      const d = await store.getDataByIndex(index)
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

        textarea?.addEventListener('blur', async () => {
          const value = escapeHtml(textarea.innerText)

          // save data
          const success = await store.adjustData(index, value)

          el.innerHTML = `<pre><code class="language-sql ${success ? 'success' : 'failed'} " >${value}</code></pre>`

          const code = el.querySelector('code')
          if (typeof code === null) return
          // @ts-expect-error
          hljs?.highlightElement(code)
        })
      })
    }
  }
  main()
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
