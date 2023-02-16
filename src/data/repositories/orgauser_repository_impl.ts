import { MongoError } from 'mongodb';
import { ModelContainer } from '../../core/model_container';
import { Role } from '../../domain/entities/role';
import { OrgaUserRepository } from '../../domain/repositories/orgauser_repository';
import { OrgaUserDataSource } from '../datasources/orgauser_data_source';
import { OrgaUserModel } from '../models/orgauser_model';
import { Either } from '../../core/either';
import { DatabaseFailure, NetworkFailure, GenericFailure, Failure } from '../../core/errors/failures';
import { UserDataSource } from '../datasources/user_data_source';
import { OrgaDataSource } from '../datasources/orga_data_source';
import { OrgaUser } from '../../domain/entities/orgauser';
import { Orga } from '../../domain/entities/orga';

export class OrgaUserRepositoryImpl implements OrgaUserRepository {
	dataSource: OrgaUserDataSource;
	userDataSource: UserDataSource;
	orgaDataSource: OrgaDataSource;
	constructor(dataSource: OrgaUserDataSource, userDataSource: UserDataSource, orgaDataSource: OrgaDataSource){
		this.dataSource = dataSource;
		this.userDataSource = userDataSource;
		this.orgaDataSource = orgaDataSource;
	}

	async getOrgaUsersByOrga(orgaId: string): Promise<Either<Failure,ModelContainer<OrgaUser>>> {
		try
		{
			const result = await this.dataSource.getByOrgaId(orgaId);
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

	async getOrgaUsersByUser(userId: string): Promise<Either<Failure,ModelContainer<OrgaUser>>> {
		try
		{
			const result = await this.dataSource.getByUserId(userId);
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

	async getOrgaUser(orgaId: string, userId: string): Promise<Either<Failure,ModelContainer<OrgaUser>>> {
		try
		{
			const result = await this.dataSource.getOneBy(orgaId, userId);
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
		enabled: boolean, builtIn: boolean) : Promise<Either<Failure,ModelContainer<OrgaUser>>> {
		try{
			const orgaUser: OrgaUserModel = new OrgaUserModel(orgaId, userId, roles, enabled, builtIn);

			const result = await this.dataSource.add(orgaUser);

			if(result.currentItemCount > 0)
			{
				const resultOrga = await this.orgaDataSource.getById(orgaId);

				const orgas:{id:string, code:string}[] = [];

				if(resultOrga.currentItemCount > 0)
				{
					orgas.push({id: resultOrga.items[0].id, code: resultOrga.items[0].code});
				}

				const resultUser = await this.userDataSource.getById(orgaUser.userId);

				if(orgas.length > 0 && resultUser.currentItemCount > 0)
				{
					if(!resultUser.items[0].orgas)
						resultUser.items[0].orgas = orgas;
					else if(!resultUser.items[0].orgas.includes(orgas[0]))
					{
						resultUser.items[0].orgas.push(orgas[0]);
					}
					
					await this.userDataSource.update(userId, {'orgas': resultUser.items[0].orgas});

				}
			}

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

	async updateOrgaUser(orgaId: string, userId: string, orgaUser: OrgaUserModel) : Promise<Either<Failure,ModelContainer<OrgaUser>>>{
		try{
			const resultOrgaUser = await this.getOrgaUser(orgaId, userId);
			if(resultOrgaUser.isRight())
			{
				let lastOrgaUser:OrgaUser | undefined;

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
				let lastOrgaUser:OrgaUser | undefined;

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
						const modelContainerUser= await this.userDataSource.getById(lastOrgaUser.userId);

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

	async getOrgasByUserId(userId:string) : Promise<Either<Failure, ModelContainer<Orga>>>{
		try
		{
			const result = await this.dataSource.getByUserId(userId);

			if(result.currentItemCount > 0)
			{
				const resultOrga = await this.orgaDataSource.getByOrgasIdArray(result.items.map((element) => element.orgaId));
				return Either.right(resultOrga);
			}

			return Either.right(new ModelContainer<Orga>([]));
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