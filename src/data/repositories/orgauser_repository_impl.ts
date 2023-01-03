import { MongoError } from 'mongodb';
import { DatabaseException } from '../../core/errors/database_exception';
import { NetworkException } from '../../core/errors/network_exception';
import { ModelContainer } from '../../core/model_container';
import { Role } from '../../domain/entities/role';
import { OrgaUserRepository } from '../../domain/repositories/orgauser_repository';
import { OrgaUserDataSource } from '../datasources/orgauser_data_source';
import { OrgaUserModel } from '../models/orgauser_model';

export class OrgaUserRepositoryImpl implements OrgaUserRepository {
	dataSource: OrgaUserDataSource;
	constructor(dataSource: OrgaUserDataSource){
		this.dataSource = dataSource;
	}

	async getOrgaUsersByOrga(orgaId: string): Promise<ModelContainer<OrgaUserModel> | null> {
		try
		{
			const result = await this.dataSource.getOne(orgaId);
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

	async getOrgaUsersByUser(userId: string): Promise<ModelContainer<OrgaUserModel> | null> {
		try
		{
			const result = await this.dataSource.getOne(userId);
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

	async getOrgaUser(id: string): Promise<ModelContainer<OrgaUserModel> | null> {
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
	async addOrgaUser(orgaId: string, userId: string, roles: Role[],
		enabled: boolean, builtIn: boolean) : Promise<ModelContainer<OrgaUserModel> | null> {
		try{
			const orgaUser: OrgaUserModel = new OrgaUserModel(orgaId, userId, roles, enabled, builtIn);
			const result = this.dataSource.add(orgaUser);
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

	async updateOrgaUser(orgaId: string, userId: string, orgaUser: OrgaUserModel) : Promise<ModelContainer<OrgaUserModel> | null>{
		try{
			const result = this.dataSource.update(orgaId, orgaUser);
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

	async enableOrgaUser(orgaId: string, userId: string, enableOrDisable: boolean): Promise<boolean>{
		try{
			const result = this.dataSource.enable(orgaId, enableOrDisable);
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
	async deleteOrgaUser(orgaId: string): Promise<boolean>{
		try{
			const result = this.dataSource.delete(orgaId);
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