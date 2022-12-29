import { UserModel } from '../../../data/models/user_model';
import { UserRepository } from '../../repositories/user_repository';

export interface UpdateUserUseCase {
    execute(id:string, user: UserModel): Promise<UserModel | null>;
}

export class UpdateUser implements UpdateUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(id:string, user: UserModel): Promise<UserModel | null> {
		return await this.repository.updateUser(id, user);
	}
}