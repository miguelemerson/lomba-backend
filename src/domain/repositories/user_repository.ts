import { ContainsMany } from '../../core/contains_many';
import { UserModel } from '../../data/models/user_model';
import { User } from '../entities/user';

export interface UserRepository {
    getUsersByOrgaId(orgaId: string, sort?: [string, 1 | -1][]): Promise<ContainsMany<UserModel> | null>
    getUser(id: string): Promise<UserModel | null>;
    addUser(id: string, name: string, username: string, email: string,
		enabled: boolean, builtIn: boolean) : Promise<UserModel | null>;
    updateUser(id: string, user: UserModel) : Promise<UserModel | null>;
    enableUser(id: string, enableOrDisable: boolean): Promise<boolean>;
    deleteUser(id: string): Promise<boolean>;
}