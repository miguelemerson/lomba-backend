import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { UserRepository } from '../../repositories/user_repository';

export interface UpdateUserUseCase {
    execute(id:string, user: UserModel): Promise<Either<Failure,ModelContainer<UserModel>>>;
}

export class UpdateUser implements UpdateUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(id:string, user: UserModel): Promise<Either<Failure,ModelContainer<UserModel>>> {
		return await this.repository.updateUser(id, user);
	}
}