import { ModelContainer } from '../../core/model_container';
import { OrgaUser } from '../entities/orgauser';
import { Role } from '../entities/role';

export interface OrgaUserRepository {
   
    getOrgaUsersByOrga(orgaId: string): Promise<ModelContainer<OrgaUser> | null>;
    getOrgaUsersByUser(userId: string): Promise<ModelContainer<OrgaUser> | null>;
    addOrgaUser(orgaId: string, userId: string, roles: Role[], enabled: boolean, builtIn: boolean) : Promise<ModelContainer<OrgaUser> | null>;
    updateOrgaUser(orgaId: string, userId: string, orgaUser: object) : Promise<ModelContainer<OrgaUser> | null>;
    enableOrgaUser(orgaId: string, userId: string, enableOrDisable: boolean): Promise<boolean>;
    deleteOrgaUser(orgaId: string, userId: string): Promise<boolean>;
   
}