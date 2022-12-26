import { MongoClient } from "mongodb";
import { UserModel } from "../models/user_model";

export interface UserDataSource {
    getUsers(orgaId: string): Promise<UserModel[]>;
    getUser(id: String): Promise<UserModel>;
    addUser(user: UserModel) : Promise<UserModel>;
    updateUser(id: string, user: UserModel): Promise<UserModel>;
    enableUser(userId: String, enableOrDisable: boolean): Promise<boolean>;
    deleteUser(id: String): Promise<boolean>;
}

export class UserDataSourceImpl implements UserDataSource {
    db: any;
    constructor(client: MongoClient){
        this.db = client.db("USERS_DB");
    }

    async getUsers(orgaId: string): Promise<UserModel[]>{

        let users: UserModel[] = [];

        return users;

    }
    async getUser(id: String): Promise<UserModel>{

        const result = this.db.collection("users").findMany();
        return result;

    }
    async addUser(user: UserModel) : Promise<UserModel>{
        const result = this.db.collection("users").insertOne(user);
        return result;
    }
    async updateUser(id: string, user: UserModel): Promise<UserModel>{
        const result = this.db.collection("user").updateOne({_id : id}, user);
        return result;
    }
    async enableUser(userId: String, enableOrDisable: boolean): Promise<boolean>{
        return true;
    }
    async deleteUser(id: String): Promise<boolean>{
        const result = this.db.collection("user").deleteOne({ _id: id });
        return result;
    }    

}