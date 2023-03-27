
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
	async uploadFileCloud(dataBytes: Buffer, filename: string): Promise<Either<Failure, ModelContainer<FileCloud>>> {
		try{
           
			const { fileTypeFromBuffer } = await (eval('import("file-type")') as Promise<typeof import('file-type')>);
			const fileType = await fileTypeFromBuffer(dataBytes);

			const id = crypto.randomUUID();
			const ext = (fileType?.ext ?? 'bin');
			const newfilename = id + '.' + ext;

			const fileCloud = new FileCloudModel(id, newfilename, '','',0,'',fileType?.mime.toString() ?? '',true, false);

			const result = await this.dataSource.add(fileCloud);
			if(result.currentItemCount > 0)
			{
				const checkUpload = await this.blobStorage.uploadBlob(dataBytes, newfilename, fileType?.ext ?? 'bin');

				if(checkUpload)
				{
					const path = `/${this.blobStorage.containerName}/${ext}`;
					const account = this.blobStorage.blobService.accountName;
					const url = `https://${account}.blob.core.windows.net${path}/${newfilename}`;

					const resultUpdate = await this.dataSource.update(result.items[0].id, {size: dataBytes.length, path: path, url: url, account: account});

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