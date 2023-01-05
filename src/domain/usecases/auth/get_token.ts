import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { Auth } from '../../entities/auth';
import { AuthRepository } from '../../repositories/auth_repository';
import { Token } from '../../entities/token';
import { TokenModel } from '../../../data/models/token_model';

export interface GetTokenUseCase {
    execute(user: UserModel): Promise<Either<Failure,ModelContainer<TokenModel>>>;
}

export class GetToken implements GetTokenUseCase {
	repository: AuthRepository;
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	async execute(auth:Auth): Promise<Either<Failure,ModelContainer<TokenModel>>> {
		return await this.repository.getAuth(auth);
	}
}