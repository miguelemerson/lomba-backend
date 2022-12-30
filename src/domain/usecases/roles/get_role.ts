import { ModelContainer } from '../../../core/model_container';
import { RoleModel } from '../../../data/models/role_model';
import { RoleRepository } from '../../repositories/role_repository';


export interface GetRoleUseCase {
    execute(id:string): Promise<ModelContainer<RoleModel> | null>;
}

export class GetRole implements GetRoleUseCase {
	repository: RoleRepository;
	constructor(repository: RoleRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<ModelContainer<RoleModel> | null> {
		return await this.repository.getRole(id);
	}
}