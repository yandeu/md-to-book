const NOW = new Date().getTime()

/**
 *
 * @param {string} file
 */
export const addTimestampToImports = file => {
  const regCss = /(href=".+)(\.css)(")/g
  const regJs = /(src=".+)(\.js)(")/g

  file = file.replace(regCss, (str, m1, m2, m3) => m1 + m2 + '?v=' + NOW + m3)
  file = file.replace(regJs, (str, m1, m2, m3) => m1 + m2 + '?v=' + NOW + m3)

  return file
}
