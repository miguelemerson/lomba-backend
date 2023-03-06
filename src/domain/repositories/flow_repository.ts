import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Flow } from '../entities/workflow/flow';

export interface FlowRepository {
    getFlows(sort?: [string, 1 | -1][]): Promise<Either<Failure, ModelContainer<Flow>>>;
    getFlow(id: string): Promise<Either<Failure, ModelContainer<Flow>>>;
}