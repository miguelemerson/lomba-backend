import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { Auth } from '../../entities/auth';
import { PasswordRepository } from '../../repositories/password_repository';

export interface RegisterUserUseCase {
    execute(userId: string, auth:Auth): Promise<Either<Failure,boolean>>;
}

export class RegisterUser implements RegisterUserUseCase {
	repository: PasswordRepository;
	constructor(repository: PasswordRepository) {
		this.repository = repository;
	}

	async execute(userId: string, auth:Auth): Promise<Either<Failure,boolean>> {
		return await this.repository.addPassword(userId, auth);
	}
}