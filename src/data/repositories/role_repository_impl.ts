import { RoleRepository } from '../../domain/repositories/role_repository';
import { RoleDataSource } from '../datasources/role_data_source';
import { MongoError } from 'mongodb';
import { ModelContainer } from '../../core/model_container';
import { RoleModel } from '../models/role_model';
import { Failure, GenericFailure, NetworkFailure, DatabaseFailure } from '../../core/errors/failures';
import { Either } from '../../core/either';

export class RoleRepositoryImpl implements RoleRepository {
	dataSource: RoleDataSource;
	constructor(dataSource: RoleDataSource){
		this.dataSource = dataSource;
	}
    
	async getRoles(): Promise<Either<Failure,ModelContainer<RoleModel>>> {
		try
		{
			const result = await this.dataSource.getMany({});
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

	async getRole(id: string): Promise<Either<Failure,ModelContainer<RoleModel>>> {
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

	async enableRole(name: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>{
		try{
			const result = await this.dataSource.enable(name, enableOrDisable);
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

