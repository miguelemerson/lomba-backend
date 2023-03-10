import { UserModel } from '../models/user_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';


export interface UserDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<UserModel>>;
    getOne(query: object): Promise<ModelContainer<UserModel>>;
    add(user: UserModel) : Promise<ModelContainer<UserModel>>;
    update(id: string, user: object): Promise<ModelContainer<UserModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: UserModel): UserModel;
}

export class UserDataSourceImpl implements UserDataSource {
	collection: MongoWrapper<UserModel>;

	constructor(dbMongo: MongoWrapper<UserModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<UserModel>>{
		return await this.collection.getMany<UserModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<UserModel>>{
		return await this.collection.getOne(query);
	}

	async add(user: UserModel) : Promise<ModelContainer<UserModel>>{
		user = this.setId(user);
		return await this.collection.add(user).then(() => this.getOne({'_id':user.id}));
	}
	async update(id: string, user: object): Promise<ModelContainer<UserModel>>{
		return await this.collection.update(id, user).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: UserModel): UserModel
	{
		if(obj.id.trim() == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	} 
}