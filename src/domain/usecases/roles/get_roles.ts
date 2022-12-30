import { ModelContainer } from '../../../core/model_container';
import { RoleModel } from '../../../data/models/role_model';
import { RoleRepository } from '../../repositories/role_repository';


export interface GetRolesUseCase {
    execute(orgaId:string): Promise<ModelContainer<RoleModel> | null>;
}

export class GetRoles implements GetRolesUseCase {
	repository: RoleRepository;
	constructor(repository: RoleRepository) {
		this.repository = repository;
	}

	async execute(): Promise<ModelContainer<RoleModel> | null> {
		return await this.repository.getRoles();
	}
}