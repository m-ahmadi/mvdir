## Usage:
```javascript
const mvdir = require('mvdir');

await mvdir('source/file.js', 'dest/file.js'); // move file.
await mvdir('source/file.js', 'dest/');        // move file. (same as above if dest directory already exists)
await mvdir('source', 'dest');                 // move directory.
await mvdir('source', 'a/b/c/dest');           // creating necessary dirs.
await mvdir('file1.js', 'D:\\file.js');        // move across drives/partitions.

mvdir('source/file.js', 'dest/file.js').then(success => {
  if (success) console.log('done.');
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