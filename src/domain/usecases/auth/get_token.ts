import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { Auth } from '../../entities/auth';
import { Token } from '../../entities/token';
import { PasswordRepository } from '../../repositories/password_repository';

export interface GetTokenUseCase {
    execute(user: UserModel): Promise<ModelContainer<Token> | null>;
}

export class GetToken implements GetTokenUseCase {
	repository: PasswordRepository;
	constructor(repository: PasswordRepository) {
		this.repository = repository;
	}

	async execute(auth:Auth): Promise<ModelContainer<Token> | null> {
		return await this.repository.getAuth(auth);
	}
}