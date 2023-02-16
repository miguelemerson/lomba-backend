import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Orga } from '../../entities/orga';
import { OrgaRepository } from '../../repositories/orga_repository';

export interface AddOrgaUseCase {
    execute(orga: Orga): Promise<Either<Failure, ModelContainer<Orga>>>;
}

export class AddOrga implements AddOrgaUseCase {
	repository: OrgaRepository;
	constructor(repository: OrgaRepository) {
		this.repository = repository;
	}

	async execute(orga: Orga): Promise<Either<Failure,ModelContainer<Orga>>> {
		return await this.repository.addOrga(orga.id, orga.name, 
			orga.code, orga.enabled, 
			orga.builtIn);
	}
}