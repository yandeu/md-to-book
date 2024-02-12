// @ts-check

import { join } from 'path'

/**
 * @typedef {{
 *   name: string;
 *   sections: {
 *     title: string;
 *     directory: string;
 *     files: string[];
 *   }[];
 *   config?: {
 *     storage?: string;
 *     customHeader?: string;
 *   };
 * }} Book
 */

/**
 *
 * @param {string} cwd
 * @returns {Promise<Book>}
 */
export const getChapters = async cwd => {
  const file = join('file:', cwd, '/book/book.mjs')
  const { json } = await import(file)
  return json
}
