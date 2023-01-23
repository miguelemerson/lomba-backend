import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Role } from '../../entities/role';
import { RoleRepository } from '../../repositories/role_repository';


export interface GetRoleUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<Role>>>;
}

export class GetRole implements GetRoleUseCase {
	repository: RoleRepository;
	constructor(repository: RoleRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<Either<Failure,ModelContainer<Role>>> {
		return await this.repository.getRole(id);
	}
}