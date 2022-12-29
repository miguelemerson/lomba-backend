import { RoleModel } from '../models/role_model';

export interface RoleDataSource {
    getRoles(): Promise<RoleModel[]>;
    getRole(name: string): Promise<RoleModel>;
    enableRole(name: string, enableOrDisable: boolean): Promise<boolean>;
}