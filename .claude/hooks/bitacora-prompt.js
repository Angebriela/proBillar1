import fs from 'node:fs'
import path from 'node:path'

let input = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => { input += chunk })
process.stdin.on('end', () => {
  const payload = JSON.parse(input || '{}')
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()
  const timestamp = new Date().toISOString()
  const prompt = String(payload.prompt ?? '').replaceAll('\r', '').trim()
  fs.appendFileSync(path.join(projectDir, 'bitacora-ia.md'), `\n## ${timestamp}\n\n${prompt}\n`)
  process.exit(0)
})
