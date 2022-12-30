import { Auth } from '../../entities/auth';
import { PasswordRepository } from '../../repositories/password_repository';

export interface RegisterUserUseCase {
    execute(userId: string, auth:Auth): Promise<boolean | null>;
}

export class RegisterUser implements RegisterUserUseCase {
	repository: PasswordRepository;
	constructor(repository: PasswordRepository) {
		this.repository = repository;
	}

	async execute(userId: string, auth:Auth): Promise<boolean | null> {
		return await this.repository.addPassword(userId, auth);
	}
}