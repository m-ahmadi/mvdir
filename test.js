const { mkdirSync, writeFileSync, rmdirSync, unlinkSync } = require('fs');
const mvdir = require('./');

const tests = [
  async function () {
    mkdirSync('source');
    writeFileSync('source/file.js', text());
    
    const stat = await mvdir('source/file.js', 'dest/file.js');
    
    unlinkSync('dest/file.js');
    rmdirSync('dest');
    rmdirSync('source');
    return stat;
  },
  async function () {
    mkdirSync('source');
    writeFileSync('source/file.js', text());
    
    const stat = await mvdir('source/file.js', 'dest');
    
    unlinkSync('dest');
    rmdirSync('source');
    return stat;
  },
  async function () {
    mkdirSync('source');
    mkdirSync('source/a');
    mkdirSync('source/b');
    writeFileSync('source/file.js', text());
    writeFileSync('source/a/file.js', text());
    writeFileSync('source/b/file.js', text());
    
    const stat = await mvdir('source', 'dest');
    
    unlinkSync('dest/b/file.js');
    unlinkSync('dest/a/file.js');
    unlinkSync('dest/file.js');
    rmdirSync('dest/b');
    rmdirSync('dest/a');
    rmdirSync('dest');
    return stat;
  },
  async function () {
    mkdirSync('source');
    writeFileSync('source/file.js', text());
    
    const stat = await mvdir('source', 'a/b/c/dest');
    
    unlinkSync('a/b/c/dest/file.js');
    rmdirSync('a/b/c/dest');
    rmdirSync('a/b/c');
    rmdirSync('a/b');
    rmdirSync('a');
    return stat;
  },
  async function () {
    writeFileSync('file.js', text());
    
    const stat = await mvdir('file.js', 'D:\\file.js');
    
    unlinkSync('D:\\file.js');
    return stat;
  },
  async function () {
    mkdirSync('source');
    mkdirSync('source/a');
    mkdirSync('source/b');
    writeFileSync('source/file.js', text());
    writeFileSync('source/a/file.js', text());
    writeFileSync('source/b/file.js', text());
    
    const stat = await mvdir('source', 'dest', { copy: true });
    
    unlinkSync('dest/a/file.js');
    unlinkSync('dest/b/file.js');
    unlinkSync('dest/file.js');
    rmdirSync('dest/a');
    rmdirSync('dest/b');
    rmdirSync('dest');
    unlinkSync('source/b/file.js');
    unlinkSync('source/a/file.js');
    unlinkSync('source/file.js');
    rmdirSync('source/b');
    rmdirSync('source/a');
    rmdirSync('source');
    return stat;
  },
  async function () {
    mkdirSync('source');
    mkdirSync('source/a');
    mkdirSync('source/b');
    writeFileSync('source/file.js', text());
    writeFileSync('source/a/file.js', text());
    writeFileSync('source/b/file.js', text());
    
    const stat = await mvdir('source', 'dest', { copy: true, overwrite: false });
    
    unlinkSync('dest/a/file.js');
    unlinkSync('dest/b/file.js');
    unlinkSync('dest/file.js');
    rmdirSync('dest/a');
    rmdirSync('dest/b');
    rmdirSync('dest');
    unlinkSync('source/b/file.js');
    unlinkSync('source/a/file.js');
    unlinkSync('source/file.js');
    rmdirSync('source/b');
    rmdirSync('source/a');
    rmdirSync('source');
    return stat;
  }
];

(async function () {
  let i = 1;
  for (const test of tests) {
    log( `Test ${i}: `, await test() );
    i++;
  } 
})();

function log(m, err) {
  console.log(`${m}[${err ? '31' : '32'}m${err ? 'fail X' : 'pass √'}[0m`);
}
function text() {
  return [...Array(1000).fill('hello')].join('\n');
}
