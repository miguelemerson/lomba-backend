import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { Auth } from '../../entities/auth';
import { AuthRepository } from '../../repositories/auth_repository';

export interface RegisterUserUseCase {
    execute(user:UserModel, auth:Auth, roles:string): Promise<Either<Failure,ModelContainer<UserModel>>>;
}

export class RegisterUser implements RegisterUserUseCase {
	repository: AuthRepository;
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	async execute(user:UserModel, auth:Auth, roles:string): Promise<Either<Failure,ModelContainer<UserModel>>> {
		return await this.repository.registerUser(user, auth, roles);
	}
}