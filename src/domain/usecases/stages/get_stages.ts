import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Stage } from '../../entities/workflow/stage';


import { StageRepository } from '../../repositories/stage_repository';


export interface GetStagesUseCase {
    execute(sort?: [string, 1 | -1][]): Promise<Either<Failure,ModelContainer<Stage>>>;
}

export class GetStages implements GetStagesUseCase {
	repository: StageRepository;
	constructor(repository: StageRepository) {
		this.repository = repository;
	}

	async execute(sort?: [string, 1 | -1][]): Promise<Either<Failure,ModelContainer<Stage>>> {
		return await this.repository.getStages(sort);
	}
}