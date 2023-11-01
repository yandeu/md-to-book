// @ts-check

import dayjs from 'dayjs'
import { readdirSync } from 'node:fs'
import { join } from 'path'

import { fileURLToPath } from 'node:url'
import { cp } from 'node:fs/promises'
export const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const today = () => dayjs().format('YYMMDD')

/**
 *
 * @param {string} from
 * @param {string} to
 * @param {RegExp} exclude
 */
export const copyAllFiles = async (from, to, exclude) => {
  for (const filePath of walkSync(from)) {
    if (exclude.test(filePath)) continue
    await cp(filePath, filePath.replace(from, to))
  }
}

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
