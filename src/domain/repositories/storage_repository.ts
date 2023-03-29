import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { FileCloud } from '../entities/storage/filecloud';

export interface StorageRepository {
    uploadFileCloud(fileCloudId:string, dataBytes:Buffer): Promise<Either<Failure, ModelContainer<FileCloud>>>;
    getFileCloud(fileCloudId:string): Promise<Either<Failure, ModelContainer<FileCloud>>>;
    registerFileCloud(orgaId: string, userId:string): Promise<Either<Failure, ModelContainer<FileCloud>>>;
}