import fs from 'node:fs'

let input = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => { input += chunk })
process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(input || '{}')
    const query = String(payload.tool_input?.query ?? '')
    const destructive = /\b(drop\s+(table|schema)|truncate)\b/i.test(query)
      || /\bdelete\s+from\b/i.test(query) && !/\bwhere\b/i.test(query)
    if (destructive) {
      process.stderr.write('Bloqueado: la operación puede destruir datos. Revísala y ejecútala manualmente desde Supabase si es indispensable.\n')
      process.exitCode = 2
      return
    }
    process.exitCode = 0
  } catch (error) {
    fs.writeSync(2, `No se pudo analizar la entrada del guardián: ${error.message}\n`)
    process.exitCode = 2
  }
})
