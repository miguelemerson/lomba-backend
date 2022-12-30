import { Entity } from '../../domain/entities/entity';
import { User } from '../../domain/entities/user';

export class UserModel implements User, Entity {
	constructor(id: string, name: string, username: string, 
		email: string, enabled: boolean, builtin: boolean){
		this.id = id;
		this._id = id;
		this.name = name;
		this.username = username;
		this.email = email;
		this.enabled = enabled;
		this.builtin = builtin;
		this.created = new Date();
	}


	_id: string;
	id: string;
	name: string;
	username: string;
	email: string;
	builtin: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;
	orgas?: ({id:string, code:string}[]);

	public toEntity(): User {
		return {id: this.id, name: this.name, 
			username: this.username, email: this.email};
	}
}