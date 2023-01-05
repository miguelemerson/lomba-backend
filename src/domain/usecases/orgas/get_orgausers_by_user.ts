import { ModelContainer } from '../../../core/model_container';
import { OrgaUser } from '../../entities/orgauser';
import { OrgaUserRepository } from '../../repositories/orgauser_repository';
import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';


export interface GetOrgaUserByUsersUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<OrgaUser>>>;
}

export class GetOrgaUser implements GetOrgaUserByUsersUseCase {
	repository: OrgaUserRepository;
	constructor(repository: OrgaUserRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<Either<Failure,ModelContainer<OrgaUser>>> {
		return await this.repository.getOrgaUsersByUser(id);
	}
}