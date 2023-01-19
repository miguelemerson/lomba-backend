import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { Auth } from '../../entities/auth';
import { AuthRepository } from '../../repositories/auth_repository';
import { UserRepository } from '../../repositories/user_repository';

export interface ExistsUserUseCase {
    execute(userId:string, username:string, email:string): Promise<Either<Failure,ModelContainer<UserModel>>>;
}

export class eEistsUser implements ExistsUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(userId:string, username:string, email:string): Promise<Either<Failure,ModelContainer<UserModel>>> {
		return await this.repository.existsUser(userId, username, email);
	}
}