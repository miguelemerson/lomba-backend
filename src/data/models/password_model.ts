import { Password } from '../../domain/entities/password';

export class PasswordModel implements Password {
	constructor(userId: string, hash: string, salt: string, enabled: boolean, createdAt: Date){
		this.userId = userId;
		this.hash = hash;
		this.salt = salt;
		this.enabled = enabled;
		this.createdAt = createdAt;
	}

	userId: string;
	hash: string;
	salt: string;
	enabled: boolean;
	createdAt: Date;
}