import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Flow } from '../../entities/workflow/flow';
import { FlowRepository } from '../../repositories/flow_repository';


export interface GetFlowUseCase {
    execute(id:string): Promise<Either<Failure,ModelContainer<Flow>>>;
}

export class GetFlow implements GetFlowUseCase {
	repository: FlowRepository;
	constructor(repository: FlowRepository) {
		this.repository = repository;
	}

	async execute(id: string): Promise<Either<Failure,ModelContainer<Flow>>> {
		return await this.repository.getFlow(id);
	}
}