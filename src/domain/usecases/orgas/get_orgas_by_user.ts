import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Orga } from '../../entities/orga';
import { OrgaUserRepository } from '../../repositories/orgauser_repository';

export interface GetOrgasByUserUseCase {
    execute(userId:string): Promise<Either<Failure,ModelContainer<Orga>>>;
}

export class GetOrgasByUser implements GetOrgasByUserUseCase {
	repository: OrgaUserRepository;
	constructor(repository: OrgaUserRepository) {
		this.repository = repository;
	}

	async execute(userId:string): Promise<Either<Failure,ModelContainer<Orga>>> {
		return await this.repository.getOrgasByUserId(userId);
	}
}