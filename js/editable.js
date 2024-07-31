// @ts-check

/// <reference path="./types.d.ts" />

import { escapeHtml } from './misc.esm.js'
import { ManageStorage } from './store.js'

const editable = /** @type {NodeListOf<HTMLDivElement>} */ (document.querySelectorAll('.editable'))
const store = new ManageStorage()

for (const [index, el] of editable.entries()) {
  // adjust data from storage
  const d = await store.getDataByIndex(index)
  const c = el.querySelector('code')
  if (d && c) c.innerHTML = d
  if (c) {
    // @ts-expect-error
    hljs?.highlightElement(c)
  }

  el?.addEventListener('click', () => {
    const text = el.querySelector('[class^="language-"]')?.textContent
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
