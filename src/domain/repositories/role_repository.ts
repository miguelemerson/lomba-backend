import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { RoleModel } from '../../data/models/role_model';

export interface RoleRepository {
    getRoles(): Promise<Either<Failure, ModelContainer<RoleModel>>>;
    getRole(name: string): Promise<Either<Failure, ModelContainer<RoleModel>>>;
    enableRole(name: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
}