import { MongoError } from 'mongodb';
import { ModelContainer } from '../../core/model_container';
import { Role } from '../../domain/entities/role';
import { OrgaUserRepository } from '../../domain/repositories/orgauser_repository';
import { OrgaUserDataSource } from '../datasources/orgauser_data_source';
import { OrgaUserModel } from '../models/orgauser_model';
import { Either } from '../../core/either';
import { DatabaseFailure, NetworkFailure, GenericFailure, Failure } from '../../core/errors/failures';
import { UserDataSource } from '../datasources/user_data_source';

export class OrgaUserRepositoryImpl implements OrgaUserRepository {
	dataSource: OrgaUserDataSource;
	userDataSource: UserDataSource;
	constructor(dataSource: OrgaUserDataSource, userDataSource: UserDataSource){
		this.dataSource = dataSource;
		this.userDataSource = userDataSource;
	}

	async getOrgaUsersByOrga(orgaId: string): Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		try
		{
			const result = await this.dataSource.getMany({'orgaId': orgaId});
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

	async getOrgaUsersByUser(userId: string): Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		try
		{
			const result = await this.dataSource.getMany({'userId': userId});
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

	async getOrgaUser(orgaId: string, userId: string): Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		try
		{
			const result = await this.dataSource.getOne({'orgaId': orgaId, 'userId': userId});
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
	async addOrgaUser(orgaId: string, userId: string, roles: Role[],
		enabled: boolean, builtIn: boolean) : Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		try{
			const orgaUser: OrgaUserModel = new OrgaUserModel(orgaId, userId, roles, enabled, builtIn);
			const result = await this.dataSource.add(orgaUser);
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

	async updateOrgaUser(orgaId: string, userId: string, orgaUser: OrgaUserModel) : Promise<Either<Failure,ModelContainer<OrgaUserModel>>>{
		try{
			const resultOrgaUser = await this.getOrgaUser(orgaId, userId);
			if(resultOrgaUser.isRight())
			{
				let lastOrgaUser:OrgaUserModel | undefined;

				resultOrgaUser.fold(error => {
					//something wrong
					throw new MongoError('No encontrado: ' + error.message);
				}, value => {
					lastOrgaUser = value.items[0];
				});


				if(lastOrgaUser)
				{
					const result = await this.dataSource.update(lastOrgaUser.id, {'roles': orgaUser.roles, 'enabled': orgaUser.enabled});

					return Either.right(result);
				}

				
			}
			return Either.left(new GenericFailure('No encontrado'));
			
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

	async enableOrgaUser(orgaId: string, userId: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>{
		try{
			const result = await this.dataSource.enable(orgaId, enableOrDisable);
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
	async deleteOrgaUser(orgaId: string, userId: string): Promise<Either<Failure, boolean>>{
		try{
			const resultOrgaUser = await this.getOrgaUser(orgaId, userId);
			if(resultOrgaUser.isRight())
			{
				let lastOrgaUser:OrgaUserModel | undefined;

				resultOrgaUser.fold(error => {
					//something wrong
					throw new MongoError('No encontrado: ' + error.message);
				}, value => {
					lastOrgaUser = value.items[0];
				});


				if(lastOrgaUser)
				{
					const result = await this.dataSource.delete(lastOrgaUser.id);

					if(result)
					{
						const modelContainerUser= await this.userDataSource.getOne({'_id':lastOrgaUser.userId});

						const orgas = modelContainerUser.items[0].orgas;
						if(orgas)
						{
							const newOrgasList = orgas.filter(e=> e.id != lastOrgaUser?.orgaId);

							await this.userDataSource.update(modelContainerUser.items[0].id, {'orgas':newOrgasList});

						}


					}


					return Either.right(result);
				}

				
			}
			return Either.left(new GenericFailure('No encontrado'));
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