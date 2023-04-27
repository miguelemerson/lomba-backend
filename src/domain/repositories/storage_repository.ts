import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { CloudFile } from '../entities/storage/cloudfile';

export interface StorageRepository {
    uploadCloudFile(cloudFileId:string, dataBytes:Buffer): Promise<Either<Failure, ModelContainer<CloudFile>>>;
    getCloudFile(cloudFileId:string): Promise<Either<Failure, ModelContainer<CloudFile>>>;
    registerCloudFile(orgaId: string, userId:string): Promise<Either<Failure, ModelContainer<CloudFile>>>;
    registerUserPicture(userId:string): Promise<Either<Failure, ModelContainer<CloudFile>>>;
    uploadUserPicture(cloudFileId:string, dataBytes:Buffer): Promise<Either<Failure, ModelContainer<CloudFile>>>;
}