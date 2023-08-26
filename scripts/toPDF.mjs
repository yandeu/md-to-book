// @ts-check

import puppeteer from 'puppeteer'
import path, { join, resolve } from 'node:path'
import { writeFile } from 'fs/promises'
import { getChapters } from './chapters.mjs'
import { exec } from './exec.mjs'
import handler from 'serve-handler'
import http from 'node:http'
import { today } from './misc.mjs'
import { existsSync } from 'node:fs'
import { __dirname } from './misc.mjs'

export const toPdf = async (cwd = process.cwd()) => {
  const book = await getChapters(cwd)
  const book_name = book.name
  const book_name_file = book_name.toLocaleLowerCase().replace(/\s+/gm, '-')
  const DIST = join(cwd, 'dist')

  const server = http.createServer(async (request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/vercel/serve-handler#options
    return await handler(request, response, {
      public: DIST
    })
  })

  await (() => {
    return /** @type {Promise<void>} */ (
      new Promise(resolve => {
        server.listen(3000, () => {
          console.log('Running at http://localhost:3000')
          return resolve()
        })
      })
    )
  })()

  const browser = await puppeteer.launch({ headless: 'new' })

  /**
   * @param {string} chapter
   */
  async function printPDF(chapter) {
    console.log('chapter', join(DIST, chapter + '.html'), existsSync(join(DIST, chapter + '.html')))
    if (!existsSync(join(DIST, chapter + '.html'))) return

    const page = await browser.newPage()
    await page.goto(`http://localhost:3000/${chapter}.html`, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({
      format: 'A4',
      footerTemplate: `<div style="text-align: center; width: 100%;"><span style="font-size:7px;">BUILD: ${today()}</span></div>`,
      headerTemplate: ' ',
      displayHeaderFooter: true
    })
    await page.close()
    return pdf
  }

  let allFiles = ['']
  allFiles.pop()
  for (const section of book.sections) {
    for (const file of section.files) {
      allFiles.push(join('book', section.directory, file).split(path.sep).join(path.posix.sep))
    }
  }

  let index = 0
  for (const file of allFiles) {
    const pdf = await printPDF(file)

    if (pdf) {
      index++
      await writeFile(join(DIST, `chapter_${index}.pdf`), pdf)
    }
  }

  const outFilePosix = join('book', book_name_file + '.pdf')
    .split(path.sep)
    .join(path.posix.sep)

  await exec(
    `cd dist && pdftk ${allFiles.map((c, i) => 'chapter_' + (i + 1) + '.pdf').join(' ')} cat output ./${outFilePosix}`
  )
  // await exec('cd dist && rm chapter_*.pdf')

  await browser.close()

  await (() => {
    return /** @type {Promise<void>} */ (
      new Promise(resolve => {
        server.close(() => {
          console.log('server closed')
          resolve()
        })
      })
    )
  })()
}
