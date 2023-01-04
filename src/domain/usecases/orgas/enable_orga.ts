import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { OrgaRepository } from '../../repositories/orga_repository';

export interface EnableOrgaUseCase {
    execute(id:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>>;
}

export class EnableOrga implements EnableOrgaUseCase {
	repository: OrgaRepository;
	constructor(repository: OrgaRepository) {
		this.repository = repository;
	}

	async execute(id:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>> {
		return await this.repository.enableOrga(id, enableOrDisable);
	}
}