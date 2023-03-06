import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Stage } from '../entities/workflow/stage';


export interface StageRepository {
    getStages(sort?: [string, 1 | -1][]): Promise<Either<Failure, ModelContainer<Stage>>>;
    getStage(id: string): Promise<Either<Failure, ModelContainer<Stage>>>;
}