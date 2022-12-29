export class NetworkException implements Error{
	name: string;
	message:string;
	code?:string | number;
	error?:Error;
	constructor(name: string, message:string, code?:string | number, error?:Error)
	{
		this.name = name;
		this.message = message;
		this.code = code;
		this.error = error;
	}
}