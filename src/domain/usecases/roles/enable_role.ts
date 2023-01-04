import { RoleRepository } from '../../repositories/role_repository';
import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';

export interface EnableRoleUseCase {
    execute(id:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>>;
}

export class EnableRole implements EnableRoleUseCase {
	repository: RoleRepository;
	constructor(repository: RoleRepository) {
		this.repository = repository;
	}

	async execute(id:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>> {
		return await this.repository.enableRole(id, enableOrDisable);
	}
}