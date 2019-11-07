const fs = require('fs');
const { join, parse } = require('path');
const { promisify } = require('util');
const access   = promisify(fs.access);
const mkdir    = promisify(fs.mkdir);
const stat     = promisify(fs.stat);
const unlink   = promisify(fs.unlink);
const readdir  = promisify(fs.readdir);
const rename   = promisify(fs.rename);
const copyFile = promisify(fs.copyFile);
const rmdir    = promisify(fs.rmdir);
const log = (m1, m2) => console.log(`[91m${m1}[0m${m2}`);

async function mvdir(_src='', _dest='', _opts) {
  let src  = typeof _src  === 'string' ? _src  : undefined;
  let dest = typeof _dest === 'string' ? _dest : undefined;
  const defOpts = { overwrite: true, copy: false };
  const opts = isObj(_opts) ? Object.assign(defOpts, _opts) : defOpts;
  let msg;
  // are src and dest arguments valid?
  if (!src || !dest) {
    msg = 'Invalid argument(s).';
    log(msg);
    return new CustomError(1, msg);
  }
  
  // does src exist?
  msg = ['No such file or directory: ', src];
  await access(src).catch(err => {
    log(...msg);
    src = false;
  });
  if (!src) return new CustomError(2, ...msg);
  
  // src exists.
  // if src is a file:
  const srcStats = await stat(src);
  if ( !srcStats.isDirectory() ) {
    let done;
    await access(dest).catch(async err => {
      // dest doesn't exist.
      const destDir = parse(dest).dir;
      if (destDir) {
        await access(destDir).catch(async e => {
          // dest folder(s) don't exist.
          await mkdir(destDir, { recursive: true });
        });
      }
      await moveFile(src, dest, opts.copy);
      done = true;
    });
    if (done) return;
    // dest exists.
    if (!opts.overwrite) {
      msg = ['Destination already exists: ', dest];
      log(...msg);
      return new CustomError(3, ...msg);
    }
    const destStats = await stat(dest);
    if ( destStats.isDirectory() ) {
      // dest is a folder.
      dest = join(dest, parse(src).base);
    }
    await moveFile(src, dest, opts.copy);
    return;
  }
  
  // src is a folder.
  // does dest exist?
  await access(dest).catch(async err => {
    await mkdir(dest, { recursive: true });
  });
  
  // dest exists.
  if (!opts.overwrite) {
    msg = ['Destination already exists: ', dest];
    log(...msg);
    return new CustomError(3, ...msg);
  }
  
  // if dest is a file:
  const destStats = await stat(dest);
  if ( !destStats.isDirectory() ) {
    if (!opts.overwrite) {
      msg = ['Destination is an existing file: ', dest];
      log(...msg);
      return new CustomError(4, ...msg);
    } else {
      await unlink(dest);
      await mkdir(dest);
    }
  }
  
  // src and dest are folders.
  const files = await readdir(src);
  for (const file of files) {
    const ferom = join(src, file);
    const to = join(dest, file);
    const stats = await stat(ferom);
    if ( stats.isDirectory() ) {
      await mvdir(ferom, to, opts);
    } else {
      await moveFile(ferom, to, opts.copy);
    }
  }
  if (!opts.copy) await rmdir(src);
  return;
};

async function moveFile(src, dest, copy) {
  await rename(src, dest).catch(async err => {
    if (err.code === 'EXDEV') {
      await copyFile(src, dest);
      if (!copy) await unlink(src);
    }
  });
}

function isObj(v) {
  return (
    v &&
    typeof v === 'object' &&
    typeof v !== null &&
    Object.prototype.toString.call(v) === '[object Object]'
  ) ? true : false;
}

class CustomError {
  constructor(code, m1, m2) {
    let str = '';
    str += m1 || '';
    str += m2 || '';
    this.code = code;
    this.message = str;
  }
}

module.exports = mvdir;
