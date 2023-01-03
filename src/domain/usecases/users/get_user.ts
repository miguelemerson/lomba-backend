import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { UserRepository } from '../../repositories/user_repository';

export interface GetUserUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<UserModel>>>;
}

export class GetUser implements GetUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<Either<Failure,ModelContainer<UserModel>>> {
		return await this.repository.getUser(id);
	}
}