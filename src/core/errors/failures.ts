import { MongoError } from 'mongodb';

export interface Failure {
	name: string;
	message:string;
	code?:string | number;
}

export class DatabaseFailure implements Failure{
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

export class NetworkFailure implements Failure{
	name: string;
	message:string;
	code?:string | number;
	error?:Error;
	kind:string;
	constructor(name: string, message:string, code?:string | number, error?:Error)
	{
		this.kind = 'networkfailure';
		this.name = name;
		this.message = message;
		this.code = code;
		this.error = error;
	}
}