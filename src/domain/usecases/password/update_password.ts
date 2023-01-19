import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { PasswordModel } from '../../../data/models/password_model';
import { PasswordRepository } from '../../repositories/password_repository';

export interface UpdatePasswordUseCase {
    execute(userId:string, password:string): Promise<Either<Failure,boolean>>;
}

export class UpdatePassword implements UpdatePasswordUseCase {
	repository: PasswordRepository;
	constructor(repository: PasswordRepository) {
		this.repository = repository;
	}

	async execute(userId:string, password: string): Promise<Either<Failure,boolean>> {
		return await this.repository.updatePassword(userId, password);
	}
}