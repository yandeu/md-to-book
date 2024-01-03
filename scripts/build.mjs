// @ts-check

import fs, { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { parseMarkdown } from '@yandeu/parse-markdown'
import { getChapters } from './chapters.mjs'
import { __dirname, copyAllFiles } from './misc.mjs'
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

        // html-to-ssml (experimental)
        let audioFileUrl = ''
        {
          // flatten lists (easier to make readable by polly)
          const data_mod = data.replace(/^(\s{2,})(-\s.*)$/gm, (str, m1, m2) => m2)
          const md = await parseMarkdown(data_mod) // Promise<{ markdown: string; yaml: {}; }>
          let x = md.markdown
          // replace h1-h6 with p and mark
          x = x.replace(/(<\/?)(h[1|2|3|4|5|6])(>)/g, (str, m1, m2, m3, m4) => {
            if (m1 === '<') return m1 + 'p' + m3 + '<mark name="heading"/>'
            else return m1 + 'p' + m3
          })
          // remove table and pre
          x = x.replace(/<(table|pre)>.+?<\/\1>/gms, '')
          // ul/ol to p; li to s
          x = x.replace(/(<\/?)(ul|ol|li)([^>]+)?(\/?>)/gms, (str, m1, m2, m3, m4) => {
            if (m2 == 'li') return m1 + 's' + m4
            else return m1 + 'p' + m4
          })

          {
            // remove nested p (https://stackoverflow.com/a/42367252)
            // x = x.replace(/(.*<p>)(((?!<\/p>).)*?)(<p>)(.*?)(<\/p>)(.*)/gms, (str, ...m) => {
            //   return m[0] + m[1] + m[4] + m[5]
            // })
          }

          // remove img
          x = x.replace(/<(img).+?>/gms, '')
          // remove all non ssml tags
          x = x.replace(/<\/?(.+?)\/?>/gms, (str, m1) => {
            if (m1 === 's' || m1 === 'p' || m1 === 'mark name="heading"') return str
            else return ''
          })
          // remove empty s and p tags
          x = x.replace(/<s><\/s>/gms, '')
          x = x.replace(/<p><\/p>/gms, '')
          const ssml = ('<speak>\n' + x + '\n</speak>')
            .split('\n')
            .filter(l => l.length > 0)
            .join('\n')

          try {
            const { CLOUD_FRONT_URL, POLLY_LAMBDA_URL, POLLY_LAMBDA_KEY } = process.env
            if (CLOUD_FRONT_URL && POLLY_LAMBDA_URL && POLLY_LAMBDA_KEY) {
              const res = await fetch(POLLY_LAMBDA_URL, {
                method: 'POST',
                headers: {
                  'x-api-key': POLLY_LAMBDA_KEY
                },
                body: JSON.stringify({ ssml })
              })
              const json = await res.json()
              const { audio, marks } = json
              const audioMarksUrl = 'https://' + CLOUD_FRONT_URL + '/' + marks
              audioFileUrl = 'https://' + CLOUD_FRONT_URL + '/' + audio
              audioFileUrl = `<div id="audio-bar" class="no-print" data-marks-url="${audioMarksUrl}" data-audio-url="${audioFileUrl}"><audio controls></audio></div>`
            }
          } catch (e) {
            console.log(e.message)
          }
        }

        md.markdown = `<a class="no-print" href="../../">< back to overview</a>` + audioFileUrl + md.markdown

        // add lazy loading to images (https://web.dev/articles/browser-level-image-lazy-loading)
        md.markdown = md.markdown.replace(/(<img\ssrc=")/gm, _ => '<img loading="lazy" class="lazyload" data-src="')

        // wrap table inside div
        md.markdown = md.markdown.replace(/<(\/?)table>/gm, (str, m1) => {
          if (!m1) return '<div class="table-wrapper">' + str
          else return str + '</div>'
        })

        const html = HTML_TEMPLATE.replace('{{md}}', md.markdown).replace('{{chapter}}', CHAPTER_NR.toString())
        const outfile = join(DIST, 'book', p.directory, FILE_NAME + '.html')
        await fs.mkdir(dirname(outfile), { recursive: true })
        await fs.writeFile(outfile, html, { encoding: 'utf-8' })
      } catch (err) {
        console.log('WARN:', err.message, err)
      }
    }
  }

  // copy all files
  await copyAllFiles(BOOK_PATH, join(DIST, 'book'), /\/\.|\.js$|\.mjs$|\.md$/)
  console.log('done')
}
