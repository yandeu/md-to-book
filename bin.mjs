#!/usr/bin/env node

import { build } from './scripts/build.mjs'
import { toPdf } from './scripts/toPDF.mjs'

const args = process.argv.splice(2)

const arg0 = args[0]

if (arg0 === 'build') {
  await build()
} else if (arg0 === 'to-pdf') {
  await toPdf()
} else {
  process.exit(1)
}
