import { promises as fs } from "fs"
import os from "os"
import path from "path"
import type { z } from "zod"

// Vercel's deployed function bundle is read-only — only os.tmpdir() is
// writable there, and it's ephemeral (reset on cold start, not shared across
// instances). Local dev keeps writing straight into the repo's ./data so it
// survives restarts. See data-seed/ below for how a fresh Vercel instance
// gets bootstrapped with usable demo content instead of starting empty.
const DATA_DIR = process.env.VERCEL ? path.join(os.tmpdir(), "aptis-data") : path.join(process.cwd(), "data")
const SEED_DIR = path.join(process.cwd(), "data-seed")

// Per-file write queues so concurrent route handler invocations (Next dev can
// fire requests in parallel) don't interleave writes and corrupt a JSON file.
const writeQueues = new Map<string, Promise<unknown>>()

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

/** Seeds a fresh runtime file from data-seed/ (checked into git) so a cold Vercel instance starts with usable demo content instead of an empty collection. */
async function readSeedOrEmpty(fileName: string): Promise<string> {
  try {
    return await fs.readFile(path.join(SEED_DIR, fileName), "utf-8")
  } catch {
    return "[]"
  }
}

async function readCollection<T>(fileName: string, schema: z.ZodType<T>): Promise<T[]> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, fileName)
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      throw new Error(`${fileName} does not contain a JSON array`)
    }
    return parsed.map((item, index) => {
      const result = schema.safeParse(item)
      if (!result.success) {
        throw new Error(
          `${fileName}[${index}] failed validation: ${result.error.message}`,
        )
      }
      return result.data
    })
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      const seedRaw = await readSeedOrEmpty(fileName)
      await fs.writeFile(filePath, seedRaw, "utf-8")
      return readCollection(fileName, schema)
    }
    throw error
  }
}

async function writeCollection<T>(fileName: string, items: T[]): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, fileName)
  const previous = writeQueues.get(fileName) ?? Promise.resolve()
  const next = previous
    .catch(() => undefined)
    .then(() => fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf-8"))
  writeQueues.set(fileName, next)
  await next
}

export function createJsonCollection<T>(
  fileName: string,
  schema: z.ZodType<T>,
  getKey: (item: T) => string,
) {
  return {
    async all(): Promise<T[]> {
      return readCollection(fileName, schema)
    },
    async findByKey(key: string): Promise<T | null> {
      const items = await readCollection(fileName, schema)
      return items.find((item) => getKey(item) === key) ?? null
    },
    async findMany(predicate: (item: T) => boolean): Promise<T[]> {
      const items = await readCollection(fileName, schema)
      return items.filter(predicate)
    },
    async insert(item: T): Promise<T> {
      const items = await readCollection(fileName, schema)
      items.push(item)
      await writeCollection(fileName, items)
      return item
    },
    async update(key: string, updater: (item: T) => T): Promise<T | null> {
      const items = await readCollection(fileName, schema)
      const index = items.findIndex((item) => getKey(item) === key)
      if (index === -1) return null
      items[index] = updater(items[index])
      await writeCollection(fileName, items)
      return items[index]
    },
    async removeMany(predicate: (item: T) => boolean): Promise<number> {
      const items = await readCollection(fileName, schema)
      const remaining = items.filter((item) => !predicate(item))
      if (remaining.length !== items.length) {
        await writeCollection(fileName, remaining)
      }
      return items.length - remaining.length
    },
  }
}
