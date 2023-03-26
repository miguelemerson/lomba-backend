import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { FileCloud } from '../../entities/storage/filecloud';
import { StorageRepository } from '../../repositories/storage_repository';

export interface UploadFileCloudUseCase {
    execute(dataBytes:Buffer, filename: string): Promise<Either<Failure, ModelContainer<FileCloud>>>;
}

export class UploadFileCloud implements UploadFileCloudUseCase {
	repository: StorageRepository;
	constructor(repository: StorageRepository) {
		this.repository = repository;
	}

	async execute(dataBytes:Buffer, filename: string): Promise<Either<Failure,ModelContainer<FileCloud>>> {
		return await this.repository.uploadFileCloud(dataBytes, filename);
	}
}