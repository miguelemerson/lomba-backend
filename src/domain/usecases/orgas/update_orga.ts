import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { OrgaModel } from '../../../data/models/orga_model';
import { OrgaRepository } from '../../repositories/orga_repository';

export interface UpdateOrgaUseCase {
    execute(id:string, orga: OrgaModel): Promise<Either<Failure,ModelContainer<OrgaModel>>>;
}

export class UpdateOrga implements UpdateOrgaUseCase {
	repository: OrgaRepository;
	constructor(repository: OrgaRepository) {
		this.repository = repository;
	}

	async execute(id:string, orga: OrgaModel): Promise<Either<Failure,ModelContainer<OrgaModel>>> {
		return await this.repository.updateOrga(id, orga);
	}
}