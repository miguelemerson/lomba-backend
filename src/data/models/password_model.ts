import crypto from 'crypto';
import { Password } from '../../domain/entities/password';

export class PasswordModel implements Password {
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
	
	public toEntity(): Password {
		return {id: this.id, userId:this.userId, hash:this.hash, salt:this.salt, enabled: this.enabled, builtin: this.builtin, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}
}