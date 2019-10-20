[![NPM](https://nodei.co/npm/mvdir.png)](https://nodei.co/npm/mvdir/)  
[![Build Status](https://travis-ci.com/m-ahmadi/mvdir.svg?branch=master)](https://travis-ci.com/m-ahmadi/mvdir)
[![install size](https://packagephobia.now.sh/badge?p=mvdir@latest)](https://packagephobia.now.sh/result?p=mvdir@latest)
## Why?
I did this: `npm i mv`,  
then I saw this: `+ mv@2.1.1 added 15 packages`,  
then I said no.

It first tries `fs.rename()`, then falls back on `fs.copyFile()` and `fs.unlink()`.
## Usage:
```javascript
const mvdir = require('mvdir');

await mvdir('source/file.js', 'dest/file.js'); // move file.
await mvdir('source/file.js', 'dest/');        // move file. (same as above if dest directory already exists)
await mvdir('source', 'dest');                 // move directory.
await mvdir('source', 'a/b/c/dest');           // creating necessary dirs.
await mvdir('file.js', 'D:\\file.js');         // move across drives/partitions.

// returns undefined if successful, or an error object:
const err = await mvdir('source/file.js', 'dest/file.js');
if (!err) console.log('done.');

mvdir('source/file.js', 'dest/file.js').then(err => {
  if (!err) console.log('done.');
});
```

### Copying:
```javascript
await mvdir('file1.js', 'file2.js', { copy: true });
await mvdir('dir1', 'dir2', { copy: true });
```

### Don't overwrite:
```javascript
await mvdir('file1.js', 'file2.js', { overwrite: false }); // error if file2.js already exists.
await mvdir('dir1', 'dir2', { overwrite: false });         // error if dir2     already exists.
```