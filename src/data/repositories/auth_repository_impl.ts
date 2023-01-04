import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Token } from '../../domain/entities/token';
import { AuthRepository } from '../../domain/repositories/auth_repository';
import { OrgaDataSource } from '../datasources/orga_data_source';
import { PasswordDataSource } from '../datasources/password_data_source';
import { UserDataSource } from '../datasources/user_data_source';

export class AuthRepositoryImpl implements AuthRepository {
	passwordDataSource: PasswordDataSource;
	userDataSource: UserDataSource;
	orgaDataSource: OrgaDataSource;
	constructor(userDataSource: UserDataSource, orgaDataSource: OrgaDataSource, passwordDataSource: PasswordDataSource){
		this.passwordDataSource = passwordDataSource;
		this.userDataSource = userDataSource;
		this.orgaDataSource = orgaDataSource;
	}

	async getAuth(auth:Auth):Promise<Either<Failure,ModelContainer<Token>>>
	{
		try{
			const userResult = await this.userDataSource.getMany({});
			if(userResult.currentItemCount < 1)
			{
				return Either.left(new GenericFailure('Not found'));
			}
			const user = userResult.items[0];

            
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