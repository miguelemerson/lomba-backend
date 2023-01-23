import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { OrgaUser } from '../../entities/orgauser';
import { OrgaUserRepository } from '../../repositories/orgauser_repository';

export interface UpdateOrgaUserUseCase {
    execute(orgaId:string, userId:string, orgaUser: OrgaUser): Promise<Either<Failure,ModelContainer<OrgaUser>>>;
}

export class UpdateOrgaUser implements UpdateOrgaUserUseCase {
	repository: OrgaUserRepository;
	constructor(repository: OrgaUserRepository) {
		this.repository = repository;
	}

	async execute(orgaId:string, userId:string, orgaUser: OrgaUser): Promise<Either<Failure,ModelContainer<OrgaUser>>> {
		return await this.repository.updateOrgaUser(orgaId, userId, orgaUser);
	}
}