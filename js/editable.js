// @ts-check

{
  const editable = document.querySelector('.editable')

  editable?.addEventListener('click', () => {
    const text = editable.querySelector('.hljs')?.textContent
    if (typeof text !== 'string') return

    editable.innerHTML = `<textarea autocorrect="off" autocapitalize="off" spellcheck="false" rows="4" cols="50">${text}</textarea>`
    const textarea = /** @type {HTMLTextAreaElement | null} */ (editable.firstChild)
    if (typeof textarea == null) return

    textarea?.addEventListener('blur', () => {
      editable.innerHTML = `<pre><code class="language-sql">${textarea.value}</code></pre>`
      const code = editable.querySelector('code')
      if (typeof code === null) return
      // @ts-expect-error
      hljs?.highlightElement(code)
    })
  })
}
