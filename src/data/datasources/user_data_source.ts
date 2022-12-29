import { UserModel } from '../models/user_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { User } from '../../domain/entities/user';
import { ContainsMany } from '../../core/contains_many';


export interface UserDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ContainsMany<UserModel> | null>;
    getOne(id: string): Promise<UserModel | null>;
    add(user: UserModel) : Promise<UserModel | null>;
    update(id: string, user: UserModel): Promise<UserModel | null>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class UserDataSourceImpl implements UserDataSource {
	collection: MongoWrapper<UserModel>;

	constructor(dbMongo: MongoWrapper<UserModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ContainsMany<UserModel> | null>{
		return await this.collection.getMany<UserModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(id: string): Promise<UserModel | null>{
		return await this.collection.getOne(id);
	}
	async add(user: UserModel) : Promise<UserModel | null>{
		return await this.collection.add(user);
	}
	async update(id: string, user: UserModel): Promise<UserModel | null>{
		return await this.collection.update(id, user);
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	/*
	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<UserModel[] | null>{
		let result = null;
		if(sort == null && pageIndex == null)
			result = await this.collection.collection<UserModel>('users')
				.find(query).toArray();
		if(sort != null && pageIndex == null)
			result = await this.collection.collection<UserModel>('users')
				.find(query).sort(sort).toArray();
		if(sort != null && pageIndex != null)
		{
			const limit:number = (itemsPerPage == null ? 10 : itemsPerPage);
			const skip:number = pageIndex * limit;
			result = await this.collection.collection<UserModel>('users')
				.find(query).sort(sort).skip(skip).limit(limit).toArray();
		}
		return result;
	}

	async getOne(id: string): Promise<UserModel | null>{
		const result = await this.collection.collection<UserModel>('users').findOne({_id: id});
		return result;
	}

	async add(user: UserModel) : Promise<UserModel | null>{
		const result = await this.collection.collection<UserModel>('users').insertOne(user);
		const rn = await this.getOne(result.insertedId);
		return rn;
	}

	async update(id: string, user: UserModel): Promise<UserModel | null>{
		const result = await this.collection.collection<UserModel>('users').updateOne({_id: id}, user);
		const rn = await this.getOne(result.upsertedId.toString());
		return rn;

	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		const result = await this.collection.collection<UserModel>('users')
			.updateOne({_id: id}, {enabled: enableOrDisable, updated: new Date()});
		return (result.modifiedCount > 0);
	}
	async delete(id: string): Promise<boolean>{
		const rn = await this.getOne(id);
		if(rn != null && rn instanceof UserModel){
			rn.deleted = new Date();
			await this.collection.collection<UserModel>('users_deleted').insertOne(rn);
			const result = await this.collection.collection<UserModel>('users').deleteOne({_id: id});
			return (result.deletedCount > 0);
		}

		return false;
	}    
*/
}