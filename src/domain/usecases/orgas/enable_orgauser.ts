import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { OrgaUserRepository } from '../../repositories/orgauser_repository';

export interface EnableOrgaUserUseCase {
    execute(orgaId:string, userId:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>>;
}

export class EnableOrgaUser implements EnableOrgaUserUseCase {
	repository: OrgaUserRepository;
	constructor(repository: OrgaUserRepository) {
		this.repository = repository;
	}

	async execute(orgaId:string, userId:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>> {
		return await this.repository.enableOrgaUser(orgaId, userId, enableOrDisable);
	}
}