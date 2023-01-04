import { ModelContainer } from '../../../core/model_container';
import { OrgaModel } from '../../../data/models/orga_model';
import { OrgaRepository } from '../../repositories/orga_repository';
import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';


export interface GetOrgaUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<OrgaModel>>>;
}

export class GetOrga implements GetOrgaUseCase {
	repository: OrgaRepository;
	constructor(repository: OrgaRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<Either<Failure,ModelContainer<OrgaModel>>> {
		return await this.repository.getOrga(id);
	}
}