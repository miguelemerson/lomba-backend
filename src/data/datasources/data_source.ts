import { UserModel } from '../models/user_model';
import { Db } from 'mongodb';

export interface DataSource<T> {
    get(query: object, pageIndex?: number, itemsPerPage?: number) : Promise<T[] | null>;
    getOneById(id: string): Promise<T | null>;
    add(user: T) : Promise<T | null>;
    update(id: string, user: T): Promise<T | null>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
/*
export class DataSourceImpl<T> implements DataSource<T> {
	private db: Db;
	private name: string;

	constructor(dbMongo: Db, collectionName: string){
		this.db = dbMongo;
		this.name = collectionName;
	}

	async getUsersByOrga(orgaId: string): Promise<UserModel[]>{
		let users: UserModel[] = [];
		try{
			const result = await this.db.collection<UserModel>('users').find({'orgas.id' : orgaId}).toArray();
			users = result;
		}
		catch(error)
		{
			console.log(error);
			throw error;
		}
		return users;				
	}
	async getUser(id: string): Promise<UserModel | null>{
		try
		{
			const result = await this.db.collection<UserModel>('users').findOne({_id: id});
			return result;
		}
		catch(error)
		{
			console.log(error);
			throw error;
		}
	}
	async addUser(user: UserModel) : Promise<UserModel | null>{
		try{
			const result = await this.db.collection<UserModel>('users').insertOne(user);
			const rn = await this.getUser(result.insertedId);
			return rn;
		}
		catch(error)
		{
			console.log(error);
			throw error;
		}
	}

	async updateUser(id: string, user: UserModel): Promise<UserModel | null>{
		try
		{
			const result = await this.db.collection<UserModel>('users').updateOne({_id: id}, user);
			const rn = await this.getUser(result.upsertedId.toString());
			return rn;
		}
		catch(error)
		{
			console.log(error);
			throw error;
		}
	}
	async enableUser(id: string, enableOrDisable: boolean): Promise<boolean>{
		try
		{
			const result = await this.db.collection<UserModel>('users').updateOne({_id: id}, {enabled: enableOrDisable, updated: new Date()});
			return (result.modifiedCount > 0);
		}
		catch(error)
		{
			console.log(error);
			throw error;
		}
	}
	async deleteUser(id: string): Promise<boolean>{
		try
		{
			const rn = await this.getUser(id);
			if(rn){
				rn.deleted = new Date();
				await this.db.collection<UserModel>('users_deleted').insertOne(rn);
				const result = await this.db.collection<UserModel>('users').deleteOne({_id: id});
				return (result.deletedCount > 0);
			}
		}
		catch(error)
		{
			console.log(error);
			throw error;
		}
		return false;
	}    

}
*/