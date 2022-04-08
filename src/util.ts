import fs from 'fs'
import path from 'path'

export async function isFile (filepath: string) {
  try {
    const stat = await fs.promises.stat(filepath)
    return stat.isFile()
  } catch (err) {
    return false
  }
}

export async function findFile (rootDir: string, pathname: string, method: string) {
  const arr = pathname.split('/')
  const tail = ['', method.toLowerCase(), 'ts'].join('.') // example: .get.ts, .post.ts...

  for (let i = 0; i < arr.length; i++) {
    const left = arr.slice(0, i).join('/')
    const right = arr.slice(i).join('#')
    const filepath = path.join(rootDir, left, right + tail)
    if (await isFile(filepath)) {
      return filepath
    }
  }

  return null
}
