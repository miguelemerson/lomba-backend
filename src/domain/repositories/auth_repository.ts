import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { TokenModel } from '../../data/models/token_model';
import { UserModel } from '../../data/models/user_model';
import { Auth } from '../entities/auth';

export interface AuthRepository {
    getAuth(auth:Auth):Promise<Either<Failure,ModelContainer<TokenModel>>>;
    registerUser(user:UserModel, auth:Auth, roles:string): Promise<Either<Failure,ModelContainer<UserModel>>>;
}