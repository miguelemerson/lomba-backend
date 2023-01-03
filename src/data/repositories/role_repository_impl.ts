import { RoleRepository } from '../../domain/repositories/role_repository';
import { RoleDataSource } from '../datasources/role_data_source';

import { MongoError } from 'mongodb';
import { DatabaseException } from '../../core/errors/database_exception';
import { NetworkException } from '../../core/errors/network_exception';
import { ModelContainer } from '../../core/model_container';
import { RoleModel } from '../models/role_model';

export class RoleRepositoryImpl implements RoleRepository {
	dataSource: RoleDataSource;
	constructor(dataSource: RoleDataSource){
		this.dataSource = dataSource;
	}
    
	async getRoles(): Promise<ModelContainer<RoleModel> | null> {
		try
		{
			const result = await this.dataSource.getMany({});
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

	async getRole(id: string): Promise<ModelContainer<RoleModel> | null> {
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

	async enableRole(name: string, enableOrDisable: boolean): Promise<boolean>{
		try{
			const result = this.dataSource.enable(name, enableOrDisable);
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

