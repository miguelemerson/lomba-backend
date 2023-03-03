import { File } from '../../../domain/entities/storage/file';

export class FileModel implements File {
	constructor(id: string, name: string, path: string, 
		url: string, size: number, account: string, filetype: string, enabled: boolean, builtIn: boolean){
		this.id = id;
		this._id = id;
		this.name = name;
		this.path = path;
		this.url = url;
		this.size = size;
		this.account = account;
		this.filetype = filetype;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}
	_id: string;
	id: string;
	name:string;
	path:string;
	url:string;
	size:number;
	account:string;
	filetype:string;
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): File {
		return {id: this.id, name: this.name, 
			path: this.path, url: this.url, size: this.size, account: this.account, filetype:this.filetype, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}
}