import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { TokenModel } from '../../../data/models/token_model';
import { Auth } from '../../entities/auth';
import { AuthRepository } from '../../repositories/auth_repository';

export interface ChangeOrgaUseCase {
    execute(auth:Auth): Promise<Either<Failure,ModelContainer<TokenModel>>>;
}

export class ChangeOrga implements ChangeOrgaUseCase {
	repository: AuthRepository;
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	async execute(auth:Auth): Promise<Either<Failure,ModelContainer<TokenModel>>> {
		return await this.repository.changeOrga(auth);
	}
}