
import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { FileCloud } from '../../domain/entities/storage/filecloud';
import { StorageRepository } from '../../domain/repositories/storage_repository';
import { BlobStorageSource } from '../datasources/blob_storage_source';
import { FileCloudDataSource } from '../datasources/filecloud_storage_source';
import { FileCloudModel } from '../models/storage/filecloud_model';
import crypto from 'crypto';

export class StorageRepositoryImpl implements StorageRepository {
	dataSource: FileCloudDataSource;
	blobStorage: BlobStorageSource;
	constructor(dataSource: FileCloudDataSource, blobStorage: BlobStorageSource){
		this.dataSource = dataSource;
		this.blobStorage = blobStorage;
	}
	async getFileCloud(fileCloudId: string): Promise<Either<Failure, ModelContainer<FileCloud>>> {
		try{
			const result = await this.dataSource.getById(fileCloudId);
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
	async registerFileCloud(orgaId: string, userId: string): Promise<Either<Failure, ModelContainer<FileCloud>>> {
		try{
			const id = crypto.randomUUID();
			const fileCloud = new FileCloudModel(id, '', '','','',0,'','',orgaId, userId, false, true, false);

			const result = await this.dataSource.add(fileCloud);
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
	async uploadFileCloud(fileCloudId: string, dataBytes: Buffer): Promise<Either<Failure, ModelContainer<FileCloud>>> {
		try{
           
			const { fileTypeFromBuffer } = await (eval('import("file-type")') as Promise<typeof import('file-type')>);
			const fileType = await fileTypeFromBuffer(dataBytes);

			const ext = (fileType?.ext ?? 'bin');
			const newfilename = fileCloudId + '.' + ext;

			const resultUpdate = await this.dataSource.update(fileCloudId, {name: newfilename});

			if(resultUpdate.currentItemCount > 0)
			{
				const userId = resultUpdate.items[0].userId =='' ? 'default' : resultUpdate.items[0].userId;
				
				const secondPath = `${ext}/${userId}`;
				const uploadData = await this.blobStorage.uploadBlob(dataBytes, newfilename, secondPath);

				if(uploadData != undefined)
				{
					const resultUpdate = await this.dataSource.update(fileCloudId, {size: dataBytes.length, path: uploadData.path, url: uploadData.url, account: uploadData.account, host: uploadData.host, filetype: fileType?.mime?? ''});

					return Either.right(resultUpdate);
				}
			}
			return Either.left(new GenericFailure('no uploaded'));
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