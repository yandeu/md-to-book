// @ts-check

export const addCssStringToDom = css => {
  const style = document.createElement('style')
  style.innerText = css
  document.head.append(style)
}

// https://stackoverflow.com/a/6234804
export const escapeHtml = unsafe => {
  if (unsafe && typeof unsafe === 'string')
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  return unsafe
}
