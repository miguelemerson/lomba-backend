import { Role } from "../entities/role";

export interface RoleRepository {
    getRoles(): Promise<Role[]>;
    getRole(name: String): Promise<Role>;
    enableRole(name: String, enableOrDisable: boolean): Promise<boolean>;
}