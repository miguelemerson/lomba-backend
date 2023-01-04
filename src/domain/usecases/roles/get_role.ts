import { ModelContainer } from '../../../core/model_container';
import { RoleModel } from '../../../data/models/role_model';
import { RoleRepository } from '../../repositories/role_repository';
import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';


export interface GetRoleUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<RoleModel>>>;
}

export class GetRole implements GetRoleUseCase {
	repository: RoleRepository;
	constructor(repository: RoleRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<Either<Failure,ModelContainer<RoleModel>>> {
		return await this.repository.getRole(id);
	}
}