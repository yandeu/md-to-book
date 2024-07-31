// @ts-check

export const addCssStringToDom = css => {
  const style = document.createElement('style')
  style.innerText = css
  document.head.append(style)
}
