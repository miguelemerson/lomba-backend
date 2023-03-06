import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { StageRepository } from '../../domain/repositories/stage_repository';
import { StageDataSource } from '../datasources/stage_data_source';
import { Stage } from '../../domain/entities/workflow/stage';


export class StageRepositoryImpl implements StageRepository {
	dataSource: StageDataSource;
	constructor(dataSource: StageDataSource){
		this.dataSource = dataSource;
	}

	async getStages(sort?: [string, 1 | -1][]): Promise<Either<Failure,ModelContainer<Stage>>> {
		try
		{
			const result = await this.dataSource.getAll(sort);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
			
		}
		
	}
	async getStage(id: string): Promise<Either<Failure,ModelContainer<Stage>>> {
		try
		{
			const result = await this.dataSource.getById(id);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
			
		}
	}
	
	

}