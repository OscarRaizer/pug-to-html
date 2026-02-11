import fg from "fast-glob"
import path from "node:path"
import { stat } from "node:fs/promises"

const DEFAULT_IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/.nuxt/**",
  "**/.output/**",
  "**/coverage/**",
]

export async function scanFiles(inputPath, options = {}) {
  const { patterns = [".vue"], ignore = DEFAULT_IGNORE_PATTERNS, recursive = true } = options

  try {
    const pathStat = await stat(inputPath)

    if (pathStat.isFile()) {
      return handleFile(inputPath, patterns)
    }

    if (pathStat.isDirectory()) {
      return handleDirectory(inputPath, { patterns, ignore, recursive })
    }

    throw new Error(`Path is neither a file nor a directory: ${inputPath}`)
  } catch (error) {
    throw new Error(`Failed to scan ${inputPath}: ${error.message}`)
  }
}

async function handleFile(filePath, patterns) {
  const matches = patterns.some(pattern => {
    return filePath.endsWith(pattern)
  })

  return {
    files: matches ? [filePath] : [],
    type: "file",
    count: matches ? 1 : 0,
    matched: matches,
    inputPath: filePath,
  }
}

async function handleDirectory(directionPath, { patterns, ignore, recursive }) {
  const globPatterns = patterns.map(pattern => {
    // Convert ".vue" to "**/*.vue" for fast-glob
    const globPattern = pattern.startsWith(".") ? `**/*${pattern}` : pattern
    const fullPattern = path.join(directionPath, globPattern)
    return recursive ? fullPattern : path.join(directionPath, "*", globPattern)
  })

  const files = await fg(globPatterns, {
    ignore: ignore.map(pattern => path.join(directionPath, pattern)),
    absolute: true,
    onlyFiles: true,
  })

  return {
    files: files,
    type: "directory",
    count: files.length,
    matched: files.length > 0,
    inputPath: directionPath,
  }
}
