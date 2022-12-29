import { UserRepository } from '../../repositories/user_repository';

export interface EnableUserUseCase {
    execute(id:string, enableOrDisable: boolean): Promise<boolean | null>;
}

export class EnableUser implements EnableUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(id:string, enableOrDisable: boolean): Promise<boolean | null> {
		return await this.repository.enableUser(id, enableOrDisable);
	}
}