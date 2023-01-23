import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { OrgaUser } from '../../entities/orgauser';
import { OrgaUserRepository } from '../../repositories/orgauser_repository';

export interface AddOrgaUserUseCase {
    execute(orgaUser: OrgaUser): Promise<Either<Failure, ModelContainer<OrgaUser>>>;
}

export class AddOrgaUser implements AddOrgaUserUseCase {
	repository: OrgaUserRepository;
	constructor(repository: OrgaUserRepository) {
		this.repository = repository;
	}

	async execute(orgaUser: OrgaUser): Promise<Either<Failure,ModelContainer<OrgaUser>>> {
		return await this.repository.addOrgaUser(orgaUser.orgaId, orgaUser.userId, 
			orgaUser.roles, orgaUser.enabled, 
			orgaUser.builtin);
	}
}