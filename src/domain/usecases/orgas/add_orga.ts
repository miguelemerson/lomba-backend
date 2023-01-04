import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { OrgaModel } from '../../../data/models/orga_model';
import { OrgaRepository } from '../../repositories/orga_repository';

export interface AddOrgaUseCase {
    execute(orga: OrgaModel): Promise<Either<Failure, ModelContainer<OrgaModel>>>;
}

export class AddOrga implements AddOrgaUseCase {
	repository: OrgaRepository;
	constructor(repository: OrgaRepository) {
		this.repository = repository;
	}

	async execute(orga: OrgaModel): Promise<Either<Failure,ModelContainer<OrgaModel>>> {
		return await this.repository.addOrga(orga.id, orga.name, 
			orga.code, orga.enabled, 
			orga.builtin);
	}
}