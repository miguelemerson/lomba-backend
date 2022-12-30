import { ModelContainer } from '../../core/model_container';
import { RoleModel } from '../../data/models/role_model';

export interface RoleRepository {
    getRoles(): Promise<ModelContainer<RoleModel> | null>;
    getRole(name: string): Promise<ModelContainer<RoleModel> | null>;
    enableRole(name: string, enableOrDisable: boolean): Promise<boolean>;
}