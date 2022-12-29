import { OrgaUser } from '../../domain/entities/orgauser';

export class OrgaUserModel implements OrgaUser {
	constructor(orgaId: string, userId: string, roles: string[], enabled: boolean, builtIn: boolean){
		this.orgaId = orgaId;
		this.userId = userId;
		this.roles = roles;
		this.enabled = enabled;
		this.builtIn = builtIn;
	}


	orgaId: string;
	userId: string;
	roles: string[];
	enabled: boolean;
	builtIn: boolean;

}