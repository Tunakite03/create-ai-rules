import process from 'node:process';

// --- NO_COLOR detection (respects non-TTY / piped output) ---
export const NO_COLOR = !process.stdout.isTTY || process.env.NO_COLOR !== undefined;

// --- ANSI helpers ---
const ansi = (code) => (s) => (NO_COLOR ? s : `\x1b[${code}m${s}\x1b[0m`);
export function bold(s) {
   return ansi('1')(s);
}
export function green(s) {
   return ansi('32')(s);
}
export function yellow(s) {
   return ansi('33')(s);
}
export function dim(s) {
   return ansi('2')(s);
}

// --- Arrow-key interactive selectors ---

function itemLabel(item) {
   if (typeof item === 'string') return item;
   return item.desc ? `${item.label}  ${dim(item.desc)}` : item.label;
}

function restoreTerminal() {
   process.stdout.write(`\x1b[?25h`);
   if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
      process.stdin.pause();
   }
}

/** Single-select: ↑/↓ to navigate, Enter to confirm. */
export async function selectOne(question, items, defaultIdx = 0) {
   let idx = defaultIdx;

   const render = () => {
      process.stdout.write(`\x1b[?25l`); // hide cursor
      process.stdout.write(`\n  ${bold(question)}\n`);
      for (let i = 0; i < items.length; i++) {
         const pointer = i === idx ? green('❯') : ' ';
         const label = i === idx ? bold(itemLabel(items[i])) : itemLabel(items[i]);
         process.stdout.write(`  ${pointer} ${label}\n`);
      }
   };

   const clear = () => {
      const lines = items.length + 2;
      process.stdout.write(`\x1b[${lines}A`);
      for (let i = 0; i < lines; i++) {
         process.stdout.write(`\x1b[2K\n`);
      }
      process.stdout.write(`\x1b[${lines}A`);
   };

   render();

   return new Promise((resolve, reject) => {
      process.stdin.setRawMode(true);
      process.stdin.resume();

      const onData = (data) => {
         try {
            // Convert to array of byte values for cross-platform handling
            const bytes = [...data];
            const key = data.toString();

            // Arrow keys — ANSI: ESC [ A/B  |  Windows raw: 0xE0 0x48/0x50 or 0x00 0x48/0x50
            const isUp =
               key === '\x1b[A' ||
               (bytes.length === 2 && (bytes[0] === 0xe0 || bytes[0] === 0x00) && bytes[1] === 0x48);
            const isDown =
               key === '\x1b[B' ||
               (bytes.length === 2 && (bytes[0] === 0xe0 || bytes[0] === 0x00) && bytes[1] === 0x50);
            const isEnter = key === '\r' || key === '\n';
            const isCtrlC = key === '\x03';

            if (isCtrlC) {
               restoreTerminal();
               process.exit(130);
            }

            if (isUp) {
               idx = (idx - 1 + items.length) % items.length;
               clear();
               render();
            } else if (isDown) {
               idx = (idx + 1) % items.length;
               clear();
               render();
            } else if (isEnter) {
               restoreTerminal();
               process.stdin.removeListener('data', onData);
               clear();
               const item = items[idx];
               const label = typeof item === 'string' ? item : item.label;
               process.stdout.write(`  ${bold(question)} ${green(label)}\n`);
               resolve(items[idx]);
            }
         } catch (err) {
            restoreTerminal();
            process.stdin.removeListener('data', onData);
            reject(err);
         }
      };

      process.stdin.on('data', onData);
   });
}

/** Multi-select: ↑/↓ to navigate, Space to toggle, A to toggle all, Enter to confirm. */
export async function selectMulti(question, items) {
   let idx = 0;
   const selected = new Set();
   // Pre-select first two items by default
   if (items.length >= 2) {
      selected.add(0);
      selected.add(1);
   } else if (items.length === 1) {
      selected.add(0);
   }

   const render = () => {
      process.stdout.write(`\x1b[?25l`);
      process.stdout.write(`\n  ${bold(question)} ${dim('(Space=toggle, A=all, Enter=confirm)')}\n`);
      for (let i = 0; i < items.length; i++) {
         const pointer = i === idx ? green('❯') : ' ';
         const check = selected.has(i) ? green('◉') : dim('○');
         const label = i === idx ? bold(itemLabel(items[i])) : itemLabel(items[i]);
         process.stdout.write(`  ${pointer} ${check} ${label}\n`);
      }
      if (selected.size === 0) {
         process.stdout.write(dim('    ↑ Select at least one, then press Enter\n'));
      }
   };

   const clear = () => {
      const extra = selected.size === 0 ? 1 : 0;
      const lines = items.length + 2 + extra;
      process.stdout.write(`\x1b[${lines}A`);
      for (let i = 0; i < lines; i++) {
         process.stdout.write(`\x1b[2K\n`);
      }
      process.stdout.write(`\x1b[${lines}A`);
   };

   render();

   return new Promise((resolve, reject) => {
      process.stdin.setRawMode(true);
      process.stdin.resume();

      const onData = (data) => {
         try {
            const bytes = [...data];
            const key = data.toString();

            const isUp =
               key === '\x1b[A' ||
               (bytes.length === 2 && (bytes[0] === 0xe0 || bytes[0] === 0x00) && bytes[1] === 0x48);
            const isDown =
               key === '\x1b[B' ||
               (bytes.length === 2 && (bytes[0] === 0xe0 || bytes[0] === 0x00) && bytes[1] === 0x50);
            const isSpace = key === ' ';
            const isEnter = key === '\r' || key === '\n';
            const isCtrlC = key === '\x03';
            const isA = key === 'a' || key === 'A';

            if (isCtrlC) {
               restoreTerminal();
               process.exit(130);
            }

            if (isUp) {
               idx = (idx - 1 + items.length) % items.length;
               clear();
               render();
            } else if (isDown) {
               idx = (idx + 1) % items.length;
               clear();
               render();
            } else if (isSpace) {
               selected.has(idx) ? selected.delete(idx) : selected.add(idx);
               clear();
               render();
            } else if (isA) {
               if (selected.size === items.length) {
                  selected.clear();
               } else {
                  for (let i = 0; i < items.length; i++) selected.add(i);
               }
               clear();
               render();
            } else if (isEnter && selected.size > 0) {
               restoreTerminal();
               process.stdin.removeListener('data', onData);
               clear();
               const labels = [...selected]
                  .sort()
                  .map((i) => {
                     const it = items[i];
                     return typeof it === 'string' ? it : it.label;
                  })
                  .join(', ');
               process.stdout.write(`  ${bold(question)} ${green(labels)}\n`);
               resolve([...selected].sort().map((i) => items[i]));
            }
         } catch (err) {
            restoreTerminal();
            process.stdin.removeListener('data', onData);
            reject(err);
         }
      };

      process.stdin.on('data', onData);
   });
}
