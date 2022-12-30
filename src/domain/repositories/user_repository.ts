import { ModelContainer } from '../../core/model_container';
import { UserModel } from '../../data/models/user_model';
import { User } from '../entities/user';

export interface UserRepository {
    getUsersByOrgaId(orgaId: string, sort?: [string, 1 | -1][]): Promise<ModelContainer<UserModel> | null>
    getUser(id: string): Promise<ModelContainer<UserModel> | null>;
    addUser(id: string, name: string, username: string, email: string,
		enabled: boolean, builtIn: boolean) : Promise<ModelContainer<UserModel> | null>;
    updateUser(id: string, user: UserModel) : Promise<ModelContainer<UserModel> | null>;
    enableUser(id: string, enableOrDisable: boolean): Promise<boolean>;
    deleteUser(id: string): Promise<boolean>;
}