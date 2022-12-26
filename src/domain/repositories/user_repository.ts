import { User } from "../entities/user";

export interface UserRepository {
    getUsers(orgaId: string): Promise<User[]>;
    getUser(id: String): Promise<User>;
    addUser(id: String, name: string, username: string, 
        email: string, enabled: boolean, builtIn: boolean) : Promise<User>;
    enableUser(userId: String, enableOrDisable: boolean): Promise<boolean>;
    deleteUser(id: String): Promise<boolean>;
}