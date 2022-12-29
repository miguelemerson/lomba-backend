import { Orga } from '../entities/orga';
import { OrgaUser } from '../entities/orgauser';

export interface OrgaRepository {
    getOrgas(filter: string, fieldOrder: string, pageNumber: string, pageSize: string): Promise<Orga[]>;
    getOrga(id: string): Promise<Orga>;
    addOrga(id: string, name: string, code: string, enabled: boolean, builtIn: boolean) : Promise<Orga>;
    updateOrga(orgaId: string, orga: Orga): Promise<Orga>;
    enableOrga(orgaId: string, enableOrDisable: boolean): Promise<boolean>;
    deleteOrga(id: string): Promise<boolean>;
   
    getOrgaUsers(orgaId: string): Promise<Orga[]>;
    addOrgaUser(orgaId: string, userId: string, roles: string[], enabled: boolean, builtIn: boolean) : Promise<Orga>;
    updateOrgaUser(orgaId: string, userId: string, orgaUser: OrgaUser) : Promise<OrgaUser>;
    enableOrgaUser(orgaId: string, userId: string, enableOrDisable: boolean): Promise<boolean>;
    deleteOrgaUser(orgaId: string, userId: string): Promise<boolean>;
   
}