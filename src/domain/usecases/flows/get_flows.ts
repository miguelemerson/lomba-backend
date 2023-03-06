import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Flow } from '../../entities/workflow/flow';

import { FlowRepository } from '../../repositories/flow_repository';


export interface GetFlowsUseCase {
    execute(sort?: [string, 1 | -1][]): Promise<Either<Failure,ModelContainer<Flow>>>;
}

export class GetFlows implements GetFlowsUseCase {
	repository: FlowRepository;
	constructor(repository: FlowRepository) {
		this.repository = repository;
	}

	async execute(sort?: [string, 1 | -1][]): Promise<Either<Failure,ModelContainer<Flow>>> {
		return await this.repository.getFlows(sort);
	}
}