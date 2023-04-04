import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Setting } from '../../domain/entities/setting';
import { SettingRepository } from '../../domain/repositories/setting_repository';
import { SettingDataSource } from '../datasources/setting_data_source';

export class SettingRepositoryImpl implements SettingRepository {
	dataSource: SettingDataSource;
	constructor(dataSource: SettingDataSource){
		this.dataSource = dataSource;
	}
	async updateSettings(changes: { id: string; value: string; }[], orgaId:string | undefined): Promise<Either<Failure, boolean>> {
		try{
			changes.forEach(async element => {
				if(orgaId == undefined)
				{
					await this.dataSource.update(element.id, {value: element.value});
				}
				else
				{
					await this.dataSource.update(element.id, {value: element.value});
				}
			});
			return Either.right(true);
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
	async getSettingsByOrga(orgaId: string): Promise<Either<Failure, ModelContainer<Setting>>> {
		try
		{
			const result = await this.dataSource.getAllByOrga(orgaId);
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
	async getSettings(): Promise<Either<Failure, ModelContainer<Setting>>> {
		try
		{
			const result = await this.dataSource.getAllSuper();
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