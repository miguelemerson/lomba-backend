import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { UserModel } from '../../data/models/user_model';

export interface UserRepository {
    getUsersByOrgaId(orgaId: string, sort?: [string, 1 | -1][]): Promise<Either<Failure, ModelContainer<UserModel>>>;
    getUsersNotInOrga(orgaId: string, sort?: [string, 1 | -1][], pageIndex?: number, itemsPerPage?: number): Promise<Either<Failure, ModelContainer<UserModel>>>;
    getUser(id: string): Promise<Either<Failure, ModelContainer<UserModel>>>;
    addUser(id: string, name: string, username: string, email: string,
		enabled: boolean, builtIn: boolean) : Promise<Either<Failure, ModelContainer<UserModel>>>;
    updateUser(id: string, user: UserModel) : Promise<Either<Failure, ModelContainer<UserModel>>>;
    enableUser(id: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
    deleteUser(id: string): Promise<Either<Failure,boolean>>;
}