import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { CloudFile } from '../../entities/storage/cloudfile';
import { StorageRepository } from '../../repositories/storage_repository';

export interface RegisterCloudFileUseCase {
    execute(orgaId: string, userId:string): Promise<Either<Failure, ModelContainer<CloudFile>>>;
}

export class RegisterCloudFile implements RegisterCloudFileUseCase {
	repository: StorageRepository;
	constructor(repository: StorageRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId:string): Promise<Either<Failure,ModelContainer<CloudFile>>> {
		return await this.repository.registerCloudFile(orgaId, userId);
	}
}