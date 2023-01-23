import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { OrgaUser } from '../entities/orgauser';
import { Role } from '../entities/role';

export interface OrgaUserRepository {
   
    getOrgaUsersByOrga(orgaId: string): Promise<Either<Failure, ModelContainer<OrgaUser>>>;
    getOrgaUsersByUser(userId: string): Promise<Either<Failure, ModelContainer<OrgaUser>>>;
    getOrgaUser(orgaId: string, userId: string): Promise<Either<Failure, ModelContainer<OrgaUser>>>;
    addOrgaUser(orgaId: string, userId: string, roles: Role[], enabled: boolean, builtIn: boolean) : Promise<Either<Failure, ModelContainer<OrgaUser>>>;
    updateOrgaUser(orgaId: string, userId: string, orgaUser: object) : Promise<Either<Failure, ModelContainer<OrgaUser>>>;
    enableOrgaUser(orgaId: string, userId: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
    deleteOrgaUser(orgaId: string, userId: string): Promise<Either<Failure, boolean>>;
   
}