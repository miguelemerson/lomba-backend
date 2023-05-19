import { ExternalUri } from '../../../domain/entities/storage/externaluri';
import { Host } from '../../../domain/entities/storage/host';

export class ExternalUriModel implements ExternalUri {
	constructor(id:string, userId:string, uri:string, host:string, sourceName:string, title:string, shortUrl:string, description:string, type:string, httpstatus:number, enabled: boolean) {
		this.id = id;
		this._id = id;
		this.userId = userId;
		this.uri = uri;
		this.hosts = [];
		this.host = host;
		this.sourceName = sourceName;
		this.title = title;
		this.shortUrl = shortUrl;
		this.description = description;
		this.type = type;
		this.lastchecked = undefined;
		this.httpstatus = httpstatus;
		this.enabled = enabled;
		this.created = new Date();
	}

	_id: string;
	id: string;
	userId: string;
	uri: string;
	hosts: (Host[]);
	host:string;
	sourceName: string;
	title: string;
	shortUrl: string;
	description: string;
	type: string;
	lastchecked: Date | undefined;
	httpstatus: number;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): ExternalUri {
		return {id: this.id, _id:this.id, userId:this.userId, uri:this.uri, hosts:this.hosts, host:this.host,sourceName:this.sourceName, title:this.title, shortUrl:this.shortUrl, description:this.description, type:this.type, lastchecked: this.lastchecked, httpstatus: this.httpstatus, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires, enabled: this.enabled};
	}
}