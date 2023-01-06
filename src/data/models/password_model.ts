import { Entity } from '../../domain/entities/entity';
import { Password } from '../../domain/entities/password';
import crypto from 'crypto';

export class PasswordModel implements Password, Entity {
	constructor(userId: string, hash: string, salt: string, enabled: boolean, builtin: boolean){
		this.id = crypto.randomUUID();
		this._id = this.id;		
		this.userId = userId;
		this.hash = hash;
		this.salt = salt;
		this.enabled = enabled;
		this.builtin = builtin;
		this.created = new Date();
	}
	_id?: string;
	id: string;
	userId: string;
	hash: string;
	salt: string;
	istemp?:boolean;
	builtin: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;    
}