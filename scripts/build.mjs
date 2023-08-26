// @ts-check

import fs, { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { parseMarkdown } from '@yandeu/parse-markdown'
import { getChapters } from './chapters.mjs'
import { __dirname } from './misc.mjs'
import { addTimestampToImports } from './cache.mjs'

export const build = async (cwd = process.cwd()) => {
  const book = await getChapters(cwd)
  const book_name = book.name
  const book_name_file = book_name.toLocaleLowerCase().replace(/\s+/gm, '-')

  const BOOK_PATH = join(cwd, 'book')
  const DIST = join(cwd, 'dist')
  const SRC = join(__dirname, '../src')
  const HTML_TEMPLATE = addTimestampToImports(await fs.readFile(join(SRC, 'template.html'), { encoding: 'utf-8' }))

  // make dist dir
  await mkdir(DIST, { recursive: true })

  // delete all files in dist dir
  for await (const file of await fs.readdir(DIST)) {
    await rm(join(DIST, file), { force: true, recursive: true })
  }

  const addChapters = (/** @type {string} */ index) => {
    let str = ''
    for (const p of book.sections) {
      str += `<li>${p.title}<ol>`
      for (const f of p.files) {
        str += `<li><a href="./book/${p.directory}/${f}.html">${f}</a></li>`
      }
      str += '</ol></li>'
    }
    return index
      .replace('{{CHAPTERS}}', str)
      .replace('{{BOOK_NAME}}', book_name)
      .replace('{{BOOK_NAME_FILE}}', book_name_file)
  }

  // copy files from src to dist
  await fs.cp(resolve(SRC), resolve(DIST), { recursive: true })

  // modify index.html file / remove template.html
  {
    let path = join(DIST, 'index.html')
    let file = addTimestampToImports(await readFile(path, { encoding: 'utf-8' }))
    file = addChapters(file)
    await writeFile(path, file, { encoding: 'utf-8' })
    await rm(join(DIST, 'template.html'))
  }

  let index
  for (const p of book.sections) {
    index = 0
    for (const file of p.files) {
      index++
      const FILE_NAME = file
      const CHAPTER_NR = index

      try {
        const data = await fs.readFile(join(BOOK_PATH, p.directory, FILE_NAME + '.md'), { encoding: 'utf-8' })
        const md = await parseMarkdown(data) // Promise<{ markdown: string; yaml: {}; }>
        const html = HTML_TEMPLATE.replace('{{md}}', md.markdown).replace('{{chapter}}', CHAPTER_NR.toString())
        const outfile = join(DIST, 'book', p.directory, FILE_NAME + '.html')
        await fs.mkdir(dirname(outfile), { recursive: true })
        await fs.writeFile(outfile, html, { encoding: 'utf-8' })
      } catch (err) {
        console.log('WARN:', err.message, err)
      }
    }
  }
}
