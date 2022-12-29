import { MongoError } from 'mongodb';
import { UserRepository } from '../../domain/repositories/user_repository';
import { UserDataSource } from '../datasources/user_data_source';
import { UserModel } from '../models/user_model';
import { DatabaseException } from '../../core/errors/database_exception';
import { NetworkException } from '../../core/errors/network_exception';
import { User } from '../../domain/entities/user';
import { ContainsMany } from '../../core/contains_many';

export class UserRepositoryImpl implements UserRepository {
	dataSource: UserDataSource;
	constructor(dataSource: UserDataSource){
		this.dataSource = dataSource;
	}

	async getUsersByOrgaId(orgaId: string, sort?: [string, 1 | -1][]): Promise<ContainsMany<UserModel> | null> {
		try
		{
			const result = await this.dataSource.getMany({'orgas.id' : orgaId}, sort);
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
	async getUser(id: string): Promise<UserModel | null> {
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
	async addUser(id: string, name: string, username: string, email: string,
		enabled: boolean, builtIn: boolean) : Promise<UserModel | null> {
		try{
			const user: UserModel = new UserModel(id, name, username, email, enabled, builtIn);
			const result = this.dataSource.add(user);
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

	async updateUser(id: string, user: UserModel) : Promise<UserModel | null>{
		try{
			const result = this.dataSource.update(id, user);
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

	async enableUser(id: string, enableOrDisable: boolean): Promise<boolean>{
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
	async deleteUser(id: string): Promise<boolean>{
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