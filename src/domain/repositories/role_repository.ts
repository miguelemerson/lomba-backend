import { Role } from '../entities/role';

export interface RoleRepository {
    getRoles(): Promise<Role[]>;
    getRole(name: string): Promise<Role>;
    enableRole(name: string, enableOrDisable: boolean): Promise<boolean>;
}