import { MongoError } from 'mongodb';
import { DatabaseException } from '../../core/errors/database_exception';
import { NetworkException } from '../../core/errors/network_exception';
import { ModelContainer } from '../../core/model_container';
import { OrgaRepository } from '../../domain/repositories/orga_repository';
import { OrgaDataSource } from '../datasources/orga_data_source';
import { OrgaModel } from '../models/orga_model';

export class OrgaRepositoryImpl implements OrgaRepository {
	dataSource: OrgaDataSource;
	constructor(dataSource: OrgaDataSource){
		this.dataSource = dataSource;
	}

	async getOrgas(sort?: [string, 1 | -1][]): Promise<ModelContainer<OrgaModel> | null> {
		try
		{
			const result = await this.dataSource.getMany({},sort);
			return result;
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				throw new DatabaseException(error.name, error.message, error.code, error);
			} else if(error instanceof Error)
				throw new NetworkException(error.name, error.message, undefined, error);
			
		}
		return null;
	}
	async getOrga(id: string): Promise<ModelContainer<OrgaModel> | null> {
		try
		{
			const result = await this.dataSource.getOne(id);
			return result;
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				throw new DatabaseException(error.name, error.message, error.code, error);
			} else if(error instanceof Error)
				throw new NetworkException(error.name, error.message, undefined, error);
			
		}
		return null;
	}
	async addOrga(id: string, name: string, code: string,
		enabled: boolean, builtIn: boolean) : Promise<ModelContainer<OrgaModel> | null> {
		try{
			const orga: OrgaModel = new OrgaModel(id, name, code, enabled, builtIn);
			const result = this.dataSource.add(orga);
			return result;
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				throw new DatabaseException(error.name, error.message, error.code, error);
			} else if(error instanceof Error)
				throw new NetworkException(error.name, error.message, undefined, error);
			
		}
		return null;
	}

	async updateOrga(id: string, orga: OrgaModel) : Promise<ModelContainer<OrgaModel> | null>{
		try{
			const result = this.dataSource.update(id, orga);
			return result;
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				throw new DatabaseException(error.name, error.message, error.code, error);
			} else if(error instanceof Error)
				throw new NetworkException(error.name, error.message, undefined, error);
			
		}
		return null;
	}

	async enableOrga(id: string, enableOrDisable: boolean): Promise<boolean>{
		try{
			const result = this.dataSource.enable(id, enableOrDisable);
			return result;
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				throw new DatabaseException(error.name, error.message, error.code, error);
			} else if(error instanceof Error)
				throw new NetworkException(error.name, error.message, undefined, error);
			
		}	
		return false;
	}
	async deleteOrga(id: string): Promise<boolean>{
		try{
			const result = this.dataSource.delete(id);
			return result;
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				throw new DatabaseException(error.name, error.message, error.code, error);
			} else if(error instanceof Error)
				throw new NetworkException(error.name, error.message, undefined, error);
			
		}	
		return false;		
	}

}