import { RoleModel } from "../models/role_model";

export interface RoleDataSource {
    getRoles(): Promise<RoleModel[]>;
    getRole(name: String): Promise<RoleModel>;
    enableRole(name: String, enableOrDisable: boolean): boolean;
}