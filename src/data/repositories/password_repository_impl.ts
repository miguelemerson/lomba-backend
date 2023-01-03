import { MongoError } from 'mongodb';
import { ModelContainer } from '../../core/model_container';
import { PasswordRepository } from '../../domain/repositories/password_repository';
import { Auth } from '../../domain/entities/auth';
import { PasswordModel } from '../models/password_model';
/*
export class PasswordRepositoryImpl implements PasswordRepository {
	dataSource: PasswordDataSource;
	constructor(dataSource: PasswordDataSource){
		this.dataSource = dataSource;
	}

	async registerPassword(userId:string, auth:Auth): Promise<boolean | null>{
		try{
			const user: PasswordModel = new PasswordModel(id, name, username, email, enabled, builtIn);
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
	async changePassword(userId:string, auth:Auth): Promise<boolean | null>{
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

	async getPassword(userId: string): Promise<ModelContainer<PasswordModel> | null> {
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
}

*/