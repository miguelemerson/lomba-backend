import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Role } from '../../entities/role';
import { RoleRepository } from '../../repositories/role_repository';


export interface GetRolesUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<Role>>>;
}

export class GetRoles implements GetRolesUseCase {
	repository: RoleRepository;
	constructor(repository: RoleRepository) {
		this.repository = repository;
	}

	async execute(): Promise<Either<Failure,ModelContainer<Role>>> {
		return await this.repository.getRoles();
	}
}