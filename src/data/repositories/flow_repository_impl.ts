import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { FlowRepository } from '../../domain/repositories/flow_repository';
import { FlowDataSource } from '../datasources/flow_data_source';
import { Flow } from '../../domain/entities/workflow/flow';

export class FlowRepositoryImpl implements FlowRepository {
	dataSource: FlowDataSource;
	constructor(dataSource: FlowDataSource){
		this.dataSource = dataSource;
	}

	async getFlows(sort?: [string, 1 | -1][]): Promise<Either<Failure,ModelContainer<Flow>>> {
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
	async getFlow(id: string): Promise<Either<Failure,ModelContainer<Flow>>> {
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