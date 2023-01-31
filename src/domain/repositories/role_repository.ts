import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Role } from '../entities/role';

export interface RoleRepository {
    getRoles(): Promise<Either<Failure, ModelContainer<Role>>>;
    getRole(name: string): Promise<Either<Failure, ModelContainer<Role>>>;
    enableRole(name: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
}