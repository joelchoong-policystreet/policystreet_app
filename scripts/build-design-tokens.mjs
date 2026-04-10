import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const TOKENS_PATH = resolve(rootDir, 'src/design-tokens/policystreet.tokens.json');
const OUTPUT_PATH = resolve(rootDir, 'src/design-tokens/_generated-tokens.scss');

/**
 * Resolves "{a.b.c}" path references from the token object.
 */
function resolveRefPath(tokens, refPath) {
  return refPath.split('.').reduce((obj, part) => (obj && part in obj ? obj[part] : undefined), tokens);
}

function resolveValue(tokens, value, visiting = new Set()) {
  if (typeof value !== 'string') return String(value);

  const fullRefMatch = value.match(/^\{(.+)\}$/);
  if (!fullRefMatch) return value;

  const refPath = fullRefMatch[1];
  if (visiting.has(refPath)) {
    throw new Error(`Circular token reference detected: ${refPath}`);
  }

  visiting.add(refPath);
  const refValue = resolveRefPath(tokens, refPath);
  if (refValue === undefined) {
    throw new Error(`Token reference not found: ${refPath}`);
  }
  const resolved = resolveValue(tokens, refValue, visiting);
  visiting.delete(refPath);
  return resolved;
}

function buildCssVariables(tokens) {
  const cssVars = tokens.cssVariables ?? {};
  const lines = Object.entries(cssVars).map(([name, rawValue]) => {
    const value = resolveValue(tokens, rawValue);
    return `  ${name}: ${value};`;
  });

  return [
    '/* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. */',
    `/* Generated from: src/design-tokens/${'policystreet.tokens.json'} */`,
    ':root {',
    ...lines,
    '}',
    '',
  ].join('\n');
}

function main() {
  const tokens = JSON.parse(readFileSync(TOKENS_PATH, 'utf8'));
  const scss = buildCssVariables(tokens);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, scss, 'utf8');
  console.log(`Generated design tokens: ${OUTPUT_PATH}`);
}

main();
