#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { requirePackageReleaseNotes } from '../src/release-notes.js';

const manifest = JSON.parse(await readFile(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8'));
requirePackageReleaseNotes(manifest);
console.log(`Verified author-written update text for ${manifest.name}@${manifest.version}.`);
