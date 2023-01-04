import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { PasswordModel } from '../../data/models/password_model';
import { Auth } from '../entities/auth';
import { Token } from '../entities/token';

export interface PasswordRepository {
    addPassword(userId:string, auth:Auth): Promise<Either<Failure, ModelContainer<PasswordModel>>>;
    updatePassword(userId:string, auth:Auth): Promise<Either<Failure, ModelContainer<PasswordModel>>>;
    getPassword(userId:string): Promise<Either<Failure, ModelContainer<PasswordModel>>>;
    getAuth(auth:Auth):Promise<Either<Failure, ModelContainer<PasswordModel>>>;
}