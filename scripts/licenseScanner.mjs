// @ts-check

import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

// search for license files in dist and root
export const extract = async () => {
  const SPLIT = '\n\n#############################################################################\n\n'
  let text = '3RD PARTY LICENSES\n(todo: list of these licenses with links to their projects)' + SPLIT
  let licenseFiles = []

  const options = [
    { dir: 'dist', recursive: true },
    { dir: '.', recursive: false }
  ]

  for (const opt of options) {
    const files = await readdir(opt.dir, { recursive: opt.recursive })
    const files2 = files.filter(a => a.match(/(^|\/)license\.?(md|txt)?$/i))
    licenseFiles = [...licenseFiles, ...files2.map(a => resolve(join(opt.dir, a)))]
  }

  for (const [i, file] of licenseFiles.entries()) {
    text += await readFile(file, { encoding: 'utf-8' })
    if (i < licenseFiles.length - 1) text += SPLIT
  }

  await writeFile(resolve('dist/LICENSE-3RD-PARTY.txt'), text, { encoding: 'utf-8' })
}
