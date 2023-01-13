import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { OrgaUserModel } from '../../../data/models/orgauser_model';
import { OrgaUserRepository } from '../../repositories/orgauser_repository';


export interface GetOrgaUserByUsersUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<OrgaUserModel>>>;
}

export class GetOrgaUserByUser implements GetOrgaUserByUsersUseCase {
	repository: OrgaUserRepository;
	constructor(repository: OrgaUserRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		return await this.repository.getOrgaUsersByUser(id);
	}
}