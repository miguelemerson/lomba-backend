import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { PasswordModel } from '../../../data/models/password_model';
import { PasswordRepository } from '../../repositories/password_repository';

export interface AddPasswordUseCase {
    execute(userId: string, password: string): Promise<Either<Failure, ModelContainer<PasswordModel>>>;
}

export class AddPassword implements AddPasswordUseCase {
	repository: PasswordRepository;
	constructor(repository: PasswordRepository) {
		this.repository = repository;
	}

	async execute(userId: string, password: string): Promise<Either<Failure,ModelContainer<PasswordModel>>> {
		return await this.repository.addPassword(userId, password);
	}
}