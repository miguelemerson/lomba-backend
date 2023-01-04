import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { OrgaUserRepository } from '../../repositories/orgauser_repository';

export interface DeleteOrgaUserUseCase {
    execute(orgaId:string, userId:string): Promise<Either<Failure,boolean>>;
}

export class DeleteOrgaUser implements DeleteOrgaUserUseCase {
	repository: OrgaUserRepository;
	constructor(repository: OrgaUserRepository) {
		this.repository = repository;
	}

	async execute(orgaId:string, userId:string): Promise<Either<Failure,boolean>> {
		return await this.repository.deleteOrgaUser(orgaId, userId);
	}
}