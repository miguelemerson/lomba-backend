import { MongoError } from 'mongodb';
import { FlowRepository } from '../../domain/repositories/flow_repository';
import { FlowDataSource } from '../datasources/flow_data_source';
import { PostModel } from '../models/flows/post_model';
import { ModelContainer } from '../../core/model_container';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { Either } from '../../core/either';
import { Post } from '../../domain/entities/flows/post';

export class FlowRepositoryImpl implements FlowRepository {
	dataSource: FlowDataSource;
	constructor(dataSource: FlowDataSource){
		this.dataSource = dataSource;
	}

	async getPosts(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, textSearch: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const result = await this.dataSource;
			
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

	async addTextPost(orgaId: string, userId: string, flowId: string, title: string, textContent: string, draft: boolean): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const result = await this.dataSource;
			
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

	async sendVote(orgaId: string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const result = await this.dataSource;
			
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