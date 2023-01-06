import { Entity } from '../../domain/entities/entity';
import { OrgaUser } from '../../domain/entities/orgauser';
import { Role } from '../../domain/entities/role';
import crypto from 'crypto';

export class OrgaUserModel implements OrgaUser, Entity {
	constructor(orgaId: string, userId: string, roles: Role[], enabled: boolean, builtin: boolean){
		this.id = crypto.randomUUID();
		this._id = this.id;
		this.orgaId = orgaId;
		this.userId = userId;
		this.roles = roles;
		this.enabled = enabled;
		this.builtin = builtin;
		this.created = new Date();
	}
	_id?: string | undefined;
	id: string;
	orgaId: string;
	userId: string;
	roles: Role[];
	builtin: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): OrgaUser {
		return {orgaId: this.orgaId, 
			userId: this.userId, roles: this.roles};
	}

}