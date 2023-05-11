import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { ExternalUriModel } from '../../data/models/storage/externaluri_model';

export interface ExternalUriRepository {
    addExternalUri(userId:string, uri:string): Promise<Either<Failure, ModelContainer<ExternalUriModel>>>;
    getExternalUriByUri(uri: string): Promise<Either<Failure, ModelContainer<ExternalUriModel>>>;
    getExternalUriById(externalUriId: string): Promise<Either<Failure, ModelContainer<ExternalUriModel>>>;
}