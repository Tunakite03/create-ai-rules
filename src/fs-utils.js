import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function ensureDir(absPath) {
   await fs.mkdir(path.dirname(absPath), { recursive: true });
}

export async function exists(absPath) {
   try {
      await fs.access(absPath);
      return true;
   } catch {
      return false;
   }
}

function assertWithinCwd(abs) {
   const cwd = path.resolve(process.cwd());
   const resolved = path.resolve(abs);
   if (!resolved.startsWith(cwd + path.sep) && resolved !== cwd) {
      throw new Error(`Path traversal detected: "${resolved}" is outside working directory`);
   }
}

export async function writeFileSafe(relPath, content, { force = false } = {}) {
   const abs = path.join(process.cwd(), relPath);
   assertWithinCwd(abs);
   await ensureDir(abs);
   if (!force && (await exists(abs))) {
      return { relPath, status: 'skipped' };
   }
   await fs.writeFile(abs, content, 'utf8');
   return { relPath, status: 'written' };
}
