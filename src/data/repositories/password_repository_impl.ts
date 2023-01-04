import { MongoError } from 'mongodb';
import { ModelContainer } from '../../core/model_container';
import { PasswordRepository } from '../../domain/repositories/password_repository';
import { Auth } from '../../domain/entities/auth';
import { PasswordModel } from '../models/password_model';
import { DatabaseFailure, NetworkFailure, GenericFailure, Failure } from '../../core/errors/failures';
import { Either } from '../../core/either';
import { PasswordDataSource } from '../datasources/password_data_source';
import { Token } from '../../domain/entities/token';

export class PasswordRepositoryImpl implements PasswordRepository {
	dataSource: PasswordDataSource;
	constructor(dataSource: PasswordDataSource){
		this.dataSource = dataSource;
	}

	async addPassword(userId:string, auth:Auth): Promise<Either<Failure,ModelContainer<PasswordModel>>>{
		try{
			const pass: PasswordModel = new PasswordModel(userId, '','',true,false);
			const result = await this.dataSource.add(pass);
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
	async updatePassword(userId:string, auth:Auth): Promise<Either<Failure,ModelContainer<PasswordModel>>>{
		try{
			const result = await this.dataSource.update(userId, auth);
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

	async getPassword(userId: string): Promise<Either<Failure,ModelContainer<PasswordModel>>> {
		try
		{
			const result = await this.dataSource.getOne(userId);
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

	async getAuth(auth:Auth): Promise<Either<Failure,ModelContainer<PasswordModel>>> {
		try
		{
			const result = await this.dataSource.getOne('');
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

