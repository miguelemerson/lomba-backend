import { ModelContainer } from '../../../core/model_container';
import { RoleModel } from '../../../data/models/role_model';
import { RoleRepository } from '../../repositories/role_repository';
import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';


export interface GetRolesUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<RoleModel>>>;
}

export class GetRoles implements GetRolesUseCase {
	repository: RoleRepository;
	constructor(repository: RoleRepository) {
		this.repository = repository;
	}

	async execute(): Promise<Either<Failure,ModelContainer<RoleModel>>> {
		return await this.repository.getRoles();
	}
}