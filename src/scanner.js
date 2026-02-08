import fg from "fast-glob"
import path from "node:path"

const DEFAULT_IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/.nuxt/**",
  "**/.output/**",
  "**/coverage/**",
]

export async function scanProject(rootPath, options = {}) {
  const { ignore = DEFAULT_IGNORE_PATTERNS, recursive = true, include = ["**/*.vue"] } = options

  const patterns = include.map(pattern => {
    const fullPattern = path.join(rootPath, pattern)
    return recursive ? fullPattern : path.join(rootPath, "/*", path.basename(pattern))
  })

  try {
    const files = await fg(patterns, {
      ignore: ignore.map(pattern => path.join(rootPath, pattern)),
      absolute: true,
      onlyFiles: true,
    })

    return files.filter(file => file.endsWith(".vue"))
  } catch (error) {
    throw new Error(`Failed to scan project: ${error.message}`)
  }
}
