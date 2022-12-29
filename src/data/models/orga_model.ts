import { Entity } from '../../domain/entities/entity';
import { Orga } from '../../domain/entities/orga';

export class OrgaModel implements Orga, Entity {
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

}