import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { ExternalUriRepository } from '../../domain/repositories/externaluri_repository';
import { ExternalUriDataSource } from '../datasources/externaluri_data_source';
import { ExternalUriModel } from '../models/storage/externaluri_model';
import { HostDataSource } from '../datasources/host_data_source';
import { HostModel } from '../models/storage/host_model';

export class ExternalUriRepositoryImpl implements ExternalUriRepository {
	dataSource: ExternalUriDataSource;
	hostDataSource: HostDataSource;
	constructor(dataSource: ExternalUriDataSource, hostDataSource: HostDataSource){
		this.dataSource = dataSource;
		this.hostDataSource = hostDataSource;
	}
	async addExternalUri(userId: string, uri: string): Promise<Either<Failure, ModelContainer<ExternalUriModel>>> {
		try{

			const result = await this.dataSource.getByUri(uri.trim());

			if(result.currentItemCount > 0)
			{
				return Either.right(result);
			}
			else
			{
				const url = new URL(uri);
				const host = url.hostname;
				const sourceName = url.hostname;
				const title = '';
				const httpstatus = 0;
				const type = '';
				const shortUrl = uri;
				const description = '';
    
				const externalUri = new ExternalUriModel('',userId, uri, host, sourceName, title, shortUrl, description, type, httpstatus, true);

				const resultAdd = await this.dataSource.add(externalUri);

				const resultHost = await this.hostDataSource.getByHost(host);
				if(resultHost.currentItemCount == 0)
				{
					const hostModel = new HostModel('', host, [sourceName], true);
					await this.hostDataSource.add(hostModel);
				}

				return Either.right(resultAdd);
			}

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
	async getExternalUriByUri(uri: string): Promise<Either<Failure, ModelContainer<ExternalUriModel>>> {
		try{

			const result = await this.dataSource.getByUri(uri.trim());
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
	async getExternalUriById(externalUriId: string): Promise<Either<Failure, ModelContainer<ExternalUriModel>>> {
		try{

			const result = await this.dataSource.getById(externalUriId);
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