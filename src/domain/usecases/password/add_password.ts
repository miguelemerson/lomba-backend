import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Password } from '../../entities/password';
import { PasswordRepository } from '../../repositories/password_repository';

export interface AddPasswordUseCase {
    execute(userId: string, password: string): Promise<Either<Failure, ModelContainer<Password>>>;
}

export class AddPassword implements AddPasswordUseCase {
	repository: PasswordRepository;
	constructor(repository: PasswordRepository) {
		this.repository = repository;
	}

	async execute(userId: string, password: string): Promise<Either<Failure,ModelContainer<Password>>> {
		return await this.repository.addPassword(userId, password);
	}
}