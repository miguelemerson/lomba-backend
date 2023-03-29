import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { FileCloud } from '../../entities/storage/filecloud';
import { StorageRepository } from '../../repositories/storage_repository';

export interface GetFileCloudUseCase {
    execute(fileCloudId:string): Promise<Either<Failure, ModelContainer<FileCloud>>>;
}

export class GetFileCloud implements GetFileCloudUseCase {
	repository: StorageRepository;
	constructor(repository: StorageRepository) {
		this.repository = repository;
	}

	async execute(fileCloudId:string): Promise<Either<Failure,ModelContainer<FileCloud>>> {
		return await this.repository.getFileCloud(fileCloudId);
	}
}