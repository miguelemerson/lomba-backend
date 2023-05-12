import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { ExternalUriModel } from '../../../data/models/storage/externaluri_model';
import { ExternalUriRepository } from '../../repositories/externaluri_repository';

export interface GetExternalUriByUriUseCase {
    execute(uri:string): Promise<Either<Failure,ModelContainer<ExternalUriModel>>>;
}

export class GetExternalUriByUri implements GetExternalUriByUriUseCase {
	repository: ExternalUriRepository;
	constructor(repository: ExternalUriRepository) {
		this.repository = repository;
	}

	async execute(uri:string): Promise<Either<Failure,ModelContainer<ExternalUriModel>>> {
		return await this.repository.getExternalUriByUri(uri);
	}
}