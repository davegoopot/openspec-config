#!/usr/bin/env node
import { checkCommand, syncCommand } from '../lib/core.mjs';

const HELP = `openspec-config — share one OpenSpec config.yaml across repos

Usage:
  openspec-config sync [options]   regenerate <dir>/openspec/config.yaml
  openspec-config check [options]  exit 0 if in sync, 1 otherwise (for CI)

Options:
  --dir <path>    target project root (default: current directory)
  --base <path>   install an alternative base config (advanced/testing)
  --force         sync: overwrite a config.yaml that lacks the generated header

The generated config merges:
  1. the base config shipped by this package (config/base.yaml), and
  2. <dir>/openspec/config.override.yaml, if present.

Merge rules: nested maps deep-merge; scalars and arrays replace the base
value at the deepest key provided; a null value deletes the key.
`;

const opts = { command: null, force: false };
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === 'sync' || a === 'check') opts.command = a;
  else if (a === 'help' || a === '--help' || a === '-h') opts.command = 'help';
  else if (a === '--dir' || a === '--base') opts[a.slice(2)] = args[++i];
  else if (a === '--force') opts.force = true;
  else {
    console.error(`Error: unknown argument: ${a}\n\n${HELP}`);
    process.exit(2);
  }
}

if (opts.command === 'help') {
  console.log(HELP);
  process.exit(0);
}
if (!opts.command) {
  console.error(HELP);
  process.exit(2);
}

try {
  const code = opts.command === 'sync' ? syncCommand(opts) : checkCommand(opts);
  process.exit(code);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
