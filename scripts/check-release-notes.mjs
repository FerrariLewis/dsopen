#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { requirePackageReleaseNotes } from '../src/release-notes.js';

const manifest = JSON.parse(await readFile(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8'));
requirePackageReleaseNotes(manifest, { bilingual: true });
console.log(`Verified versioned release text and its English translation for ${manifest.name}@${manifest.version}.`);
