import { Orga } from "../entities/orga";
import { OrgaUser } from "../entities/orgauser";

export interface OrgaRepository {
    getOrgas(filter: string, fieldOrder: string, pageNumber: string, pageSize: string): Promise<Orga[]>;
    getOrga(id: String): Promise<Orga>;
    addOrga(id: String, name: string, code: string, enabled: boolean, builtIn: boolean) : Promise<Orga>;
    updateOrga(orgaId: string, orga: Orga): Promise<Orga>;
    enableOrga(orgaId: String, enableOrDisable: boolean): Promise<boolean>;
    deleteOrga(id: String): Promise<boolean>;
   
    getOrgaUsers(orgaId: string): Promise<Orga[]>;
    addOrgaUser(orgaId: String, userId: string, roles: string[], enabled: boolean, builtIn: boolean) : Promise<Orga>;
    updateOrgaUser(orgaId: string, userId: string, orgaUser: OrgaUser) : Promise<OrgaUser>;
    enableOrgaUser(orgaId: String, userId: string, enableOrDisable: boolean): Promise<boolean>;
    deleteOrgaUser(orgaId: String, userId: string): Promise<boolean>;
   
}