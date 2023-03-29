import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { CloudFile } from '../../entities/storage/cloudfile';
import { StorageRepository } from '../../repositories/storage_repository';

export interface UploadCloudFileUseCase {
    execute(cloudFileId:string, dataBytes:Buffer): Promise<Either<Failure, ModelContainer<CloudFile>>>;
}

export class UploadCloudFile implements UploadCloudFileUseCase {
	repository: StorageRepository;
	constructor(repository: StorageRepository) {
		this.repository = repository;
	}

	async execute(cloudFileId:string, dataBytes:Buffer): Promise<Either<Failure,ModelContainer<CloudFile>>> {
		return await this.repository.uploadCloudFile(cloudFileId, dataBytes);
	}
}