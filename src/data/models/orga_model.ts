import { Orga } from '../../domain/entities/orga';

export class OrgaModel implements Orga {
	constructor(id: string, name: string, code: string, enabled: boolean, builtin: boolean){
		this.id = id;
		this._id = id;
		this.name = name;
		this.code = code;
		this.enabled = enabled;
		this.builtin = builtin;
		this.created = new Date();
	}

	_id: string;
	id: string;
	name: string;
	code: string;
	builtin: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): Orga {
		return {id: this.id, name: this.name, 
			code: this.code, enabled: this.enabled, builtin: this.builtin, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}

}