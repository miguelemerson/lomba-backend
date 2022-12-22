import { RoleModel } from "../../data/models/role_model";

export interface RoleRepository {
    getRoles(): Promise<RoleModel[]>;
    getRole(name: String): Promise<RoleModel>;
    enableRole(name: String, enableOrDisable: boolean): boolean;
}