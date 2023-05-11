import { Host } from '../../../domain/entities/storage/host';

export class HostModel implements Host {
	constructor(id:string, host:string, names:(string[]), enabled: boolean) {
		this.id = id;
		this._id = id;
		this.host = host;
		this.names = names;
		this.enabled = enabled;
		this.created = new Date();
	}

	_id: string;
	id: string;
	host: string;
	names: (string[]);
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): Host {
		return {id: this.id, _id:this.id, host:this.host, names:this.names, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires, enabled: this.enabled};
	}
}