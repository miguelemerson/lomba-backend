import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { FileCloud } from '../../entities/storage/filecloud';
import { StorageRepository } from '../../repositories/storage_repository';

export interface RegisterFileCloudUseCase {
    execute(orgaId: string, userId:string): Promise<Either<Failure, ModelContainer<FileCloud>>>;
}

export class RegisterFileCloud implements RegisterFileCloudUseCase {
	repository: StorageRepository;
	constructor(repository: StorageRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId:string): Promise<Either<Failure,ModelContainer<FileCloud>>> {
		return await this.repository.registerFileCloud(orgaId, userId);
	}
}