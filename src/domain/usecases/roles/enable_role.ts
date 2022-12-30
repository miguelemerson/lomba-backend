import { RoleRepository } from '../../repositories/role_repository';

export interface EnableRoleUseCase {
    execute(id:string, enableOrDisable: boolean): Promise<boolean | null>;
}

export class EnableRole implements EnableRoleUseCase {
	repository: RoleRepository;
	constructor(repository: RoleRepository) {
		this.repository = repository;
	}

	async execute(id:string, enableOrDisable: boolean): Promise<boolean> {
		return await this.repository.enableRole(id, enableOrDisable);
	}
}