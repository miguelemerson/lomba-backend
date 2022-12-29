import { UserRepository } from '../../repositories/user_repository';

export interface DeleteUserUseCase {
    execute(id:string): Promise<boolean | null>;
}

export class DeleteUser implements DeleteUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(id:string): Promise<boolean | null> {
		return await this.repository.deleteUser(id);
	}
}