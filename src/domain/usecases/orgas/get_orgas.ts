import { ModelContainer } from '../../../core/model_container';
import { OrgaModel } from '../../../data/models/orga_model';
import { OrgaRepository } from '../../repositories/orga_repository';
import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';


export interface GetOrgasUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<OrgaModel>>>;
}

export class GetOrgas implements GetOrgasUseCase {
	repository: OrgaRepository;
	constructor(repository: OrgaRepository) {
		this.repository = repository;
	}

	async execute(): Promise<Either<Failure,ModelContainer<OrgaModel>>> {
		return await this.repository.getOrgas();
	}
}