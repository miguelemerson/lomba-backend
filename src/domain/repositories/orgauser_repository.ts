import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Role } from '../entities/role';
import { OrgaUserModel } from '../../data/models/orgauser_model';

export interface OrgaUserRepository {
   
    getOrgaUsersByOrga(orgaId: string): Promise<Either<Failure, ModelContainer<OrgaUserModel>>>;
    getOrgaUsersByUser(userId: string): Promise<Either<Failure, ModelContainer<OrgaUserModel>>>;
    getOrgaUser(orgaId: string, userId: string): Promise<Either<Failure, ModelContainer<OrgaUserModel>>>;
    addOrgaUser(orgaId: string, userId: string, roles: Role[], enabled: boolean, builtIn: boolean) : Promise<Either<Failure, ModelContainer<OrgaUserModel>>>;
    updateOrgaUser(orgaId: string, userId: string, orgaUser: object) : Promise<Either<Failure, ModelContainer<OrgaUserModel>>>;
    enableOrgaUser(orgaId: string, userId: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
    deleteOrgaUser(orgaId: string, userId: string): Promise<Either<Failure, boolean>>;
   
}