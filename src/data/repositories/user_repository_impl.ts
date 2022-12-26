import { resourceLimits } from "worker_threads"
import { User } from "../../domain/entities/user"
import { UserRepository } from "../../domain/repositories/user_repository"
import { UserDataSource } from "../datasources/user_data_source"
import { UserModel } from "../models/user_model"

export class UserRepositoryImpl implements UserRepository {
    dataSource: UserDataSource
    constructor(dataSource: UserDataSource){
        this.dataSource = dataSource
    }

    async getUsers(orgaId: string): Promise<User[]> {
        const result = await this.dataSource.getUsers(orgaId);
        return result;
    }
    async getUser(id: String): Promise<User> {
        const result = await this.dataSource.getUser(id);
        return result;
    }
    async addUser(id: string, username: string, name: string, email: string,
        enabled: boolean, builtIn: boolean) : Promise<User> {

        let user: UserModel = {id: id, username: username, name: name, email: email,
        enabled: enabled, builtIn: builtIn};
        
        const result = this.dataSource.addUser(user);
        return result;
    }

    async updateUser(id: string, user: UserModel) : Promise<User>{
        const result = this.dataSource.updateUser(id, user);
        return result;
    }

    async enableUser(userId: String, enableOrDisable: boolean): Promise<boolean>{
        const result = this.dataSource.enableUser(userId, enableOrDisable);
        return result;
    }
    async deleteUser(id: String): Promise<boolean>{
        const result = this.dataSource.deleteUser(id);
        return result;
    }
}