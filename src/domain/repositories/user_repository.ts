import { UserModel } from "../../data/models/user_model";

export interface UserRepository {
    getUsers(orgaId: string): Promise<UserModel[]>;
    getUser(id: String): Promise<UserModel>;
    addUser(id: String, name: string, username: string, email: string, enabled: boolean, builtIn: boolean) : Promise<UserModel>;
    enableUser(userId: String, enableOrDisable: boolean): boolean;
}