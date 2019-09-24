const fs = require('fs');
const { join, parse } = require('path');
const { promisify } = require('util');
const access   = promisify(fs.access);
const mkdir    = promisify(fs.mkdir);
const stat     = promisify(fs.stat);
const unlink   = promisify(fs.unlink);
const readdir  = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);
const rmdir    = promisify(fs.rmdir);

module.exports = async function (_src='', _dest='', _opts) {
	let src  = typeof _src  === 'string' ? _src  : undefined;
	let dest = typeof _dest === 'string' ? _dest : undefined;
	const opts = isObj(_opts) ? _opts : { overwrite: true };
	// are src and dest arguments string?
	if (!src || !dest) {
		console.log('[91mInvalid argument(s).[0m');
		return;
	}
	
	// does src exist?
	await access(src).catch(async err => {
		console.log('[91mNo such file or directory: [0m' + src);
		src = false;
	});
	if (!src) return;
	
	// src exist.
	// if src is a file:
	const srcStats = await stat(src);
	if ( !srcStats.isDirectory() ) {
		let done;
		await access(dest).catch(async err => {
			// if dest doesn't exist:
			await copyFile(src, dest);
			await unlink(src);
			done = true;
		});
		if (done) return;
		// dest exist.
		if (opts.overwrite) {
			console.log('[91mDestination already exist: [0m' + dest);
			return;
		}
		const destStats = await stat(dest);
		if ( destStats.isDirectory() ) {
			// dest is a folder.
			dest = join(dest, parse(src).base);
		}
		await copyFile(src, dest);
		await unlink(src);
		return;
	}
	
	// src is a folder.
	// does dest exist?
	await access(dest).catch(async err => {
		await mkdir(dest);
	});
	
	// dest exist.
	if (opts.overwrite) {
		console.log('[91mDestination already exist: [0m' + dest);
		return;
	}
	
	// if dest is a file:
	const stats = await stat(dest);
	if ( !stats.isDirectory() ) {
		if (opts.overwrite) {
			console.log('[91mDestination is an existing file: [0m' + dest);
			return;
		} else {
			await unlink(dest);
			await mkdir(dest);
		}
	}
	
	// src and dest are folders.
	const files = await readdir(src);
	for (file of files) {
		const ferom = join(src, file);
		const to = join(dest, file);
		const stats = await stat(ferom);
		if ( stats.isDirectory() ) {
			await mkdir(to);
			const files = await readdir(ferom);
			if (files.length) await moveDir(ferom, to);
		} else {
			await copyFile(ferom, to);
			await unlink(ferom);
		}
	}
	await rmdir(src);
	return true;
};

function isObj(v) {
	return (
		v &&
		typeof v === "object" &&
		typeof v !== null &&
		Object.prototype.toString.call(v) === "[object Object]"
	);
}