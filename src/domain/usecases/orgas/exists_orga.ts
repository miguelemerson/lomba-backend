import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Orga } from '../../entities/orga';
import { OrgaRepository } from '../../repositories/orga_repository';

export interface ExistsOrgaUseCase {
    execute(orgaId:string, code:string): Promise<Either<Failure,ModelContainer<Orga>>>;
}

export class ExistsOrga implements ExistsOrgaUseCase {
	repository: OrgaRepository;
	constructor(repository: OrgaRepository) {
		this.repository = repository;
	}

	async execute(orgaId:string, code:string): Promise<Either<Failure,ModelContainer<Orga>>> {
		return await this.repository.existsOrga(orgaId, code);
	}
}