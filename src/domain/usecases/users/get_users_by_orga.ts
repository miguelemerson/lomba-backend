import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { User } from '../../entities/user';
import { UserRepository } from '../../repositories/user_repository';

export interface GetUsersByOrgaIdUseCase {
    execute(orgaId:string): Promise<ModelContainer<UserModel> | null>;
}

export class GetUsersByOrgaId implements GetUsersByOrgaIdUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string): Promise<ModelContainer<UserModel> | null> {
		return await this.repository.getUsersByOrgaId(orgaId);
	}
}