import axios from 'axios'
import { type Buffer } from 'buffer'
import { type PathLike } from 'fs'
import { access, writeFile } from 'fs/promises'
import mkdirp from 'mkdirp'
import { join as joinPath, parse } from 'path'

const exists = async (path: PathLike) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export const downloadCachedAsset = async (
  directory: string,
  url: string,
  filename?: string
) => {
  await mkdirp(directory)

  const { base } = parse(decodeURIComponent(url))
  const filepath = joinPath(directory, filename ?? base)

  const fileExists = await exists(filepath)
  if (fileExists) return filepath

  const resp = await axios.get<Buffer>(url, { responseType: 'arraybuffer' })
  await writeFile(filepath, resp.data)

  return filepath
}
