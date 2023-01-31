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

	async getFlowsByOrgaId(orgaId: string, sort?: [string, 1 | -1][]): Promise<Either<Failure,ModelContainer<Post>>> {
		try
		{
			if(!sort)
				sort = [['name', 1]];
			const result = await this.dataSource
				.getMany({'orgas.id' : orgaId}, sort);
			
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

	async getFlowsNotInOrga(orgaId: string, sort?: [string, 1 | -1][], pageIndex?: number, itemsPerPage?: number): Promise<Either<Failure, ModelContainer<Post>>>{
		try
		{
			if(!sort)
				sort = [['name', 1]];

			const result = await this.dataSource
				.getMany({'orgas.id' : {$ne: orgaId}}, sort, pageIndex, itemsPerPage);
			
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

	async getFlow(id: string): Promise<Either<Failure,ModelContainer<Post>>> {
		try
		{
			const result = await this.dataSource.getOne({'_id':id});
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
	async addFlow(id: string, name: string, username: string, email: string,
		enabled: boolean, builtIn: boolean) : Promise<Either<Failure,ModelContainer<Post>>> {
		try{
			const user: PostModel = new PostModel(id, name, username, email, enabled, builtIn);
			const result = await this.dataSource.add(user);
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

	async updateFlow(id: string, user: PostModel) : Promise<Either<Failure,ModelContainer<Post>>>{
		try{
			const result = await this.dataSource.update(id, user);
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

	async enableFlow(id: string, enableOrDisable: boolean): Promise<Either<Failure,boolean>>{
		try{
			const result = await this.dataSource.enable(id, enableOrDisable);
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
	async deleteFlow(id: string): Promise<Either<Failure,boolean>>{
		try{
			const result = await this.dataSource.delete(id);
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
	async existsFlow(userId: string, username: string, email: string): Promise<Either<Failure,ModelContainer<Post>>> {
		try
		{
			
			const result = await this.dataSource.getOne({$or:[ {'username':username}, {'email':email}], $and:[{'id':{$ne:userId}}]});
			
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