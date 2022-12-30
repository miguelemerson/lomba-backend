import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { UserRepository } from '../../repositories/user_repository';

export interface AddUserUseCase {
    execute(user: UserModel): Promise<ModelContainer<UserModel> | null>;
}

export class AddUser implements AddUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(user: UserModel): Promise<ModelContainer<UserModel> | null> {
		return await this.repository.addUser(user.id, user.name, 
			user.username, user.email, user.enabled, 
			user.builtin);
	}
}