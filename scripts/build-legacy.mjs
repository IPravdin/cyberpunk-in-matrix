// This fallback deliberately uses only Node's standard library.
import { cp, mkdir, rm } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const destination = new URL('.legacy/', root);
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(new URL('public/', root), destination, { recursive: true });
await cp(new URL('legacy/pages/', root), destination, { recursive: true });
console.log('Legacy fallback assembled in .legacy/');
