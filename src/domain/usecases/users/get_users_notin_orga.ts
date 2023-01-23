import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { User } from '../../entities/user';
import { UserRepository } from '../../repositories/user_repository';

export interface GetUsersNotInOrgaUseCase {
    execute(orgaId:string, sort?: [string, 1 | -1][], pageIndex?: number, itemsPerPage?: number): Promise<Either<Failure,ModelContainer<User>>>;
}

export class GetUsersNotInOrga implements GetUsersNotInOrgaUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, sort?: [string, 1 | -1][], pageIndex?: number, itemsPerPage?: number): Promise<Either<Failure,ModelContainer<User>>> {
		return await this.repository.getUsersNotInOrga(orgaId, sort, pageIndex, itemsPerPage);
	}
}