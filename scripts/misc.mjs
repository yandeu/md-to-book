// @ts-check

import dayjs from 'dayjs'
import { readdirSync } from 'node:fs'
import { join } from 'path'

import { fileURLToPath } from 'node:url'
export const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const today = () => dayjs().format('YYMMDD')

/**
 *
 * @param {string} dir
 * @example
 * for (const filePath of walkSync(__dirname)) {
 *  console.log(filePath);
 * }
 */
export function* walkSync(dir) {
  const files = readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(join(dir, file.name))
    } else {
      yield join(dir, file.name)
    }
  }
}
