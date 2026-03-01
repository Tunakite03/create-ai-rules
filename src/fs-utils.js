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

export async function writeFileSafe(relPath, content, { force }) {
   const abs = path.join(process.cwd(), relPath);
   await ensureDir(abs);
   if (!force && (await exists(abs))) {
      return { relPath, status: 'skipped' };
   }
   await fs.writeFile(abs, content, 'utf8');
   return { relPath, status: 'written' };
}
