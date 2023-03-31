import { CloudFile } from '../../../domain/entities/storage/cloudfile';

export class CloudFileModel implements CloudFile {
	constructor(id: string, name: string, path: string, host:string,
		url: string, size: number, account: string, filetype: string, orgaId:string, userId:string, associated:boolean, enabled: boolean, builtIn: boolean){
		this.id = id;
		this._id = id;
		this.name = name;
		this.path = path;
		this.host = host;
		this.url = url;
		this.size = size;
		this.account = account;
		this.filetype = filetype;
		this.orgaId = orgaId;
		this.userId = userId;
		this.associated = associated;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}
	_id: string;
	id: string;
	name:string;
	path:string;
	host:string;
	url:string;
	size:number;
	account:string;
	filetype:string;
	builtIn: boolean;
	enabled: boolean;
	orgaId:string;
	userId:string;
	associated:boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): CloudFile {
		return {id: this.id, name: this.name, 
			path: this.path, host:this.host, url: this.url, size: this.size, account: this.account, filetype:this.filetype, orgaId: this.orgaId, userId: this.userId, associated: this.associated, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}
}