import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Password } from '../entities/password';

export interface PasswordRepository {
    addPassword(userId:string, password:string): Promise<Either<Failure, ModelContainer<Password>>>;
    updatePassword(userId:string, password:string): Promise<Either<Failure, boolean>>;
}