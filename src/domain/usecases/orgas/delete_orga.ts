import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { OrgaRepository } from '../../repositories/orga_repository';

export interface DeleteOrgaUseCase {
    execute(id:string): Promise<Either<Failure,boolean>>;
}

export class DeleteOrga implements DeleteOrgaUseCase {
	repository: OrgaRepository;
	constructor(repository: OrgaRepository) {
		this.repository = repository;
	}

	async execute(id:string): Promise<Either<Failure,boolean>> {
		return await this.repository.deleteOrga(id);
	}
}