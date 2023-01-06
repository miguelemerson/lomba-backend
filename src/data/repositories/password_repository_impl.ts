import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { HashPassword } from '../../core/password_hash';
import { Auth } from '../../domain/entities/auth';
import { PasswordRepository } from '../../domain/repositories/password_repository';
import { PasswordDataSource } from '../datasources/password_data_source';
import { PasswordModel } from '../models/password_model';

export class PasswordRepositoryImpl implements PasswordRepository {
	dataSource: PasswordDataSource;
	constructor(dataSource: PasswordDataSource){
		this.dataSource = dataSource;
	}

	async addPassword(userId:string, auth:Auth): Promise<Either<Failure,ModelContainer<PasswordModel>>>{
		try{
			//debe especificar password caso contrario retorna left
			if(!auth.password)
				return Either.left(new GenericFailure('Need password'));

			const passHashed = HashPassword.createHash(auth.password);

			const pass: PasswordModel = new PasswordModel(userId, passHashed.hash,passHashed.salt,true,false);
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
			//debe especificar password caso contrario retorna left
			if(!auth.password)
				return Either.left(new GenericFailure('Need password'));

			const passHashed = HashPassword.createHash(auth.password);

			const changes = {hash:passHashed.hash, salt:passHashed.salt, istemp:false};

			const result = await this.dataSource.update(userId, changes);
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

