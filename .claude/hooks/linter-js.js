import { spawnSync } from 'node:child_process'
import path from 'node:path'

let input = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => { input += chunk })
process.stdin.on('end', () => {
  const payload = JSON.parse(input || '{}')
  const filePath = payload.tool_input?.file_path
  if (!filePath || !/\.(jsx?|mjs)$/i.test(filePath)) process.exit(0)
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const result = spawnSync(npmCommand, ['exec', '--', 'oxlint', '--', path.resolve(filePath)], { encoding: 'utf8' })
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '')
    process.stderr.write(result.stderr || '')
    process.exit(2)
  }
  process.exit(0)
})
