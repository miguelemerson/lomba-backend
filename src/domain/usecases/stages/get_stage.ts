
import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Stage } from '../../entities/workflow/stage';

import { StageRepository } from '../../repositories/stage_repository';


export interface GetStageUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<Stage>>>;
}

export class GetStage implements GetStageUseCase {
	repository: StageRepository;
	constructor(repository: StageRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<Either<Failure,ModelContainer<Stage>>> {
		return await this.repository.getStage(id);
	}
}