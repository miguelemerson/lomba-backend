import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { OrgaRepository } from '../../domain/repositories/orga_repository';
import { OrgaDataSource } from '../datasources/orga_data_source';
import { Orga } from '../../domain/entities/orga';
import { OrgaModel } from '../models/orga_model';

export class OrgaRepositoryImpl implements OrgaRepository {
	dataSource: OrgaDataSource;
	constructor(dataSource: OrgaDataSource){
		this.dataSource = dataSource;
	}

	async getOrgas(sort?: [string, 1 | -1][]): Promise<Either<Failure,ModelContainer<Orga>>> {
		try
		{
			const result = await this.dataSource.getMany({},sort);
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
	async getOrga(id: string): Promise<Either<Failure,ModelContainer<Orga>>> {
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
	async addOrga(id: string, name: string, code: string,
		enabled: boolean, builtIn: boolean) : Promise<Either<Failure,ModelContainer<Orga>>> {
		try{
			const orga = new OrgaModel(id, name, code, enabled, builtIn);
			const result = await this.dataSource.add(orga);
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
	async updateOrga(id: string, orga: object) : Promise<Either<Failure,ModelContainer<Orga>>>{
		try{
			const result = await this.dataSource.update(id, orga);
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
	async enableOrga(id: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>{
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
	async deleteOrga(id: string): Promise<Either<Failure, boolean>>{
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
	async existsOrga(orgaId: string, code: string): Promise<Either<Failure,ModelContainer<Orga>>> {
		try
		{
			
			const result = await this.dataSource.getOne({'code':code});
			
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