import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Auth } from '../entities/auth';
import { Token } from '../entities/token';

export interface AuthRepository {
    getAuth(auth:Auth):Promise<Either<Failure,ModelContainer<Token>>>;
}