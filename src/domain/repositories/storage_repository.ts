import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { FileCloud } from '../entities/storage/filecloud';

export interface StorageRepository {
    uploadFileCloud(dataBytes:Buffer, filename: string): Promise<Either<Failure, ModelContainer<FileCloud>>>;
}