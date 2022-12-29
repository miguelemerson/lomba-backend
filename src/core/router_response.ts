import { DatabaseException } from './errors/database_exception';
import { NetworkException } from './errors/network_exception';
import { isTypedArray } from 'util/types';
import { INSPECT_MAX_BYTES } from 'buffer';
import { ContainsMany } from './contains_many';


export class RouterResponse{
	apiVersion?: string;
	context?: string;
	id?: string;
	_id?: string;
	method?: string;
	params?: object;
	data?:DataResponse;
	error?:ErrorResponse;
	constructor(apiVersion:string, response:unknown, method?:string, params?:object, context?:string){
		this.apiVersion = apiVersion;
		this.method = method;
		this.params = params;
		this.context = context;
		this.id = this._id = crypto.randomUUID();
		if(response instanceof DatabaseException)
		{
			this.data = undefined;
			this.error = new ErrorResponse(response.code, response.message);
			if(response.mongoError != null)
			{
				this.error.addErrorItem({domain: response.mongoError.code?.toString(),
					reason: response.mongoError.cause?.message,
					message: response.mongoError.message,
					location: response.mongoError.stack,
					extendedHelp: response.mongoError.errmsg                    
				});
				if(response.mongoError.cause != null)
				{
					this.error.addErrorItem({domain: response.mongoError.cause.name, 
						reason: response.mongoError.cause.message, 
						location:response.mongoError.cause.stack});
				}
			}
		} else if(response instanceof NetworkException)
		{
			this.data = undefined;
			this.error = new ErrorResponse(response.code, response.message);
			if(response.error != null)
			{
				this.error.addErrorItem({domain: response.code?.toString(),
					message: response.message,
					location: response.error.stack,
				});
			}
		} else if(response instanceof Error)
		{
			this.data = undefined;
			this.error = new ErrorResponse(response.name, response.message);            
		} else{
			this.error = undefined;
			if(response instanceof ContainsMany)
			{
				this.data = {items:response.items,
					kind: typeof(response.items).toString(),
					currentItemCount: response.currentItemCount,
					itemsPerPage:response.itemsPerPage,
					startIndex:response.startIndex,
					totalItems:response.totalItems,
					pageIndex:response.pageIndex,
					totalPages:response.totalPages,                    
				};
			} else
			{
				this.data = {items:[response as object],
					kind: typeof(response as object).toString(),
					currentItemCount: 1                 
				};
			}
		}
	}
}

export class ErrorResponse{
	code?:string | number;
	message?:string;
	errors?:ErrorItem[];
    
	constructor(code?:string | number, message?:string, error?:ErrorItem)
	{
		this.code = code;
		this.message = message;
		if(error != null)
			this.errors = [error];
	}
    
	public addErrorItem(error:ErrorItem)
	{
		if(this.errors == null) this.errors = [];
		this.errors.push(error);
	}

}

export class ErrorItem{
	domain?:string; 
	reason?:string; 
	message?:string; 
	location?:string; 
	locationType?:string; 
	extendedHelp?:string; 
	sendReport?:string;}

export class DataResponse{
	kind?:string;
	fields?:string;
	etag?:string;
	id?:string;
	lang?:string;
	updated?:Date;
	deleted?:Date;
	currentItemCount?:number;
	itemsPerPage?:number;
	startIndex?:number;
	totalItems?:number;
	pageIndex?:number;
	totalPages?:number;
	pageLinkTemplate?:string;
	next?:object;
	nextLink?:string;
	previous?:object;
	previousLink?:string;
	self?:object;
	selfLink?:string;
	edit?:object;
	editLink?:string;
	items?: object[];
}