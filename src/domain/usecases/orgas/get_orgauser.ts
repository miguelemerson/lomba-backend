import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { OrgaUser } from '../../entities/orgauser';
import { OrgaUserRepository } from '../../repositories/orgauser_repository';


export interface GetOrgaUserUseCase {
    execute(orgaId: string, userId: string): Promise<Either<Failure,ModelContainer<OrgaUser>>>;
}

export class GetOrgaUser implements GetOrgaUserUseCase {
	repository: OrgaUserRepository;
	constructor(repository: OrgaUserRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId: string): Promise<Either<Failure,ModelContainer<OrgaUser>>> {
		return await this.repository.getOrgaUser(orgaId, userId);
	}
}