#!/usr/bin/env node
// Script para eliminar BOM (UTF-8 BOM) de archivos de texto en el repo.
// No depende de librerías externas, usa sólo Node.js estándar.

const fs = require('fs');
const path = require('path');

const IGNORES = new Set(['.git', 'node_modules', 'dist', 'public', 'vendor']);
const TEXT_EXT = new Set(['.js','.ts','.tsx','.jsx','.json','.md','.html','.css','.scss','.conf','.env','.yml','.yaml','.txt','.ini','.ps1','.sh','.dockerfile']);

/**
 * Comprueba si es un archivo de texto que queremos procesar por extensión
 * @param {string} filePath
 * @returns {boolean}
 */
function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  // Archivos sin extensión pero conocidos (Dockerfile)
  if (path.basename(filePath).toLowerCase() === 'dockerfile') return true;
  return TEXT_EXT.has(ext);
}

/**
 * Recorre directorio y retorna lista de archivos que coinciden
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (IGNORES.has(file)) continue;
      results = results.concat(walk(full));
    } else {
      if (isTextFile(full)) results.push(full);
    }
  }
  return results;
}

function stripBOM(file) {
  const buf = fs.readFileSync(file);
  if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    fs.writeFileSync(file, buf.slice(3));
    console.log('Stripped BOM:', file);
    return true;
  }
  return false;
}

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const files = walk(repoRoot);
  let changed = 0;
  for (let f of files) {
    try {
      if (stripBOM(f)) changed++;
    } catch (err) {
      console.error('Error processing', f, err.message);
    }
  }
  if (changed === 0) {
    console.log('No BOMs found.');
  } else {
    console.log('Total files modified:', changed);
  }
}

if (require.main === module) main();
root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{sh,ps1}]
end_of_line = lf

[*.md]
trim_trailing_whitespace = false

