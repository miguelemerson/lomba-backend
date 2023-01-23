import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Orga } from '../../entities/orga';
import { OrgaRepository } from '../../repositories/orga_repository';


export interface GetOrgasUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<Orga>>>;
}

export class GetOrgas implements GetOrgasUseCase {
	repository: OrgaRepository;
	constructor(repository: OrgaRepository) {
		this.repository = repository;
	}

	async execute(): Promise<Either<Failure,ModelContainer<Orga>>> {
		return await this.repository.getOrgas();
	}
}