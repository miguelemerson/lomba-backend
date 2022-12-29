import { UserModel } from '../../../data/models/user_model';
import { UserRepository } from '../../repositories/user_repository';

export interface GetUserUseCase {
    execute(id:string): Promise<UserModel | null>;
}

export class GetUser implements GetUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<UserModel | null> {
		return await this.repository.getUser(id);
	}
}