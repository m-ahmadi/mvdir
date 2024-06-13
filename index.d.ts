/**
	Move or copy a file or whole directory from a source path to a destination path.  
	It takes a `source` and `destination` arguments that must be strings and paths to a file or directory.
	
	It also takes an `options` argument that is an object with three boolean properties:
	- `overwrite`: Whether to overwrite a file if it already exists in the destination. Default: `false`
	- `copy`: If `true`, change the operation from moving to copying. Default: `false`
	- `log`: Whether to print a message upon encountering an error. Default: `true`
	
	Returns `undefined` if the operation is successful or a `CustomError` object.  
	
	The `CustomError` object returned upon errors has a `code` and a `message` properties:
	- `code`: An integer number.
	- `message`: A string containing the error message.
	
	Here are the possible error codes and messages:
	Code | Message
	-----|-----------------------------------------
	`1`  | `'Invalid argument(s).'`
	`2`  | `'No such file or directory: ...'`
	`3`  | `'Destination already exists: ...'`
	`4`  | `'Destination is an existing file: ...'`
*/
declare function mvdir(source?: string, destination?: string, options?: Options): Promise<CustomError | undefined>;

interface Options {
	overwrite?: boolean;
	copy?: boolean;
	log?: boolean;
}

interface CustomError {
	code: ErrorCode;
	message: string;
}

declare enum ErrorCode {
	InvalidArgs = 1,
	SrcNotExists = 2,
	DestAlreadyExists = 3,
	DestIsExistingFile = 4,
}

export default mvdir;
