// @ts-check

import { exec as _exec } from 'node:child_process'
import { promisify } from 'node:util'
const e = promisify(_exec)

export const exec = async (cmd, cwd) => {
  const isWin = process.platform === 'win32'

  const c = isWin ? 'wsl /bin/bash -c "' + cmd + '"' : cmd
  console.log(c)
  const res = await e(c, { cwd })
  console.log('stdout:', res.stdout)
  console.log('stderr:', res.stderr)
}
