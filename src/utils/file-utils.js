import { promises as fs } from "node:fs"
import path from "node:path"

export async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, "utf-8")
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`)
  }
}

export async function writeFile(filePath, content) {
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    return await fs.writeFile(filePath, content, "utf-8")
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`)
  }
}

export async function copyFile(sourcePath, targetPath) {
  try {
    await fs.mkdir(path.dirname(targetPath), { recursive: true })
    return await fs.copyFile(sourcePath, targetPath)
  } catch (error) {
    throw new Error(
      `Failed to copy file from ${sourcePath} to ${targetPath}: ${error.message}`,
    )
  }
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}
