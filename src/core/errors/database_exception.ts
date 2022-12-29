import { MongoError } from 'mongodb';

export class DatabaseException implements Error{
	name: string;
	message:string;
	code?:string | number;
	mongoError?:MongoError;
	constructor(name: string, message:string, code?:string | number, error?:MongoError)
	{
		this.name = name;
		this.message = message;
		this.code = code;
		this.mongoError = error;
	}
}