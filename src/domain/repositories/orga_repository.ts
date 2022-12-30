import { ModelContainer } from '../../core/model_container';
import { OrgaModel } from '../../data/models/orga_model';
import { OrgaUser } from '../entities/orgauser';
import { Role } from '../entities/role';

export interface OrgaRepository {
    getOrgas(sort?: [string, 1 | -1][]): Promise<ModelContainer<OrgaModel> | null>;
    getOrga(id: string): Promise<ModelContainer<OrgaModel> | null>;
    addOrga(id: string, name: string, code: string, enabled: boolean, builtin: boolean) : Promise<ModelContainer<OrgaModel> | null>;
    updateOrga(orgaId: string, orga: object): Promise<ModelContainer<OrgaModel> | null>;
    enableOrga(orgaId: string, enableOrDisable: boolean): Promise<boolean>;
    deleteOrga(id: string): Promise<boolean>;
   
    getOrgaUsersByOrga(orgaId: string): Promise<ModelContainer<OrgaUser> | null>;
    getOrgaUsersByUser(userId: string): Promise<ModelContainer<OrgaUser> | null>;
    addOrgaUser(orgaId: string, userId: string, roles: Role[], enabled: boolean, builtIn: boolean) : Promise<ModelContainer<OrgaModel> | null>;
    updateOrgaUser(orgaId: string, userId: string, orgaUser: object) : Promise<ModelContainer<OrgaUser> | null>;
    enableOrgaUser(orgaId: string, userId: string, enableOrDisable: boolean): Promise<boolean>;
    deleteOrgaUser(orgaId: string, userId: string): Promise<boolean>;
   
}