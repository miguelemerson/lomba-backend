import { UserModel } from '../models/user_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { User } from '../../domain/entities/user';
import { ModelContainer } from '../../core/model_container';


export interface UserDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<UserModel> | null>;
    getOne(id: string): Promise<ModelContainer<UserModel> | null>;
    add(user: UserModel) : Promise<ModelContainer<UserModel> | null>;
    update(id: string, user: object): Promise<ModelContainer<UserModel> | null>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class UserDataSourceImpl implements UserDataSource {
	collection: MongoWrapper<UserModel>;

	constructor(dbMongo: MongoWrapper<UserModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<UserModel> | null>{
		return await this.collection.getMany<UserModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(id: string): Promise<ModelContainer<UserModel> | null>{
		return await this.collection.getOne(id);
	}
	async add(user: UserModel) : Promise<ModelContainer<UserModel> | null>{
		if(user.id == undefined)
		{
			user.id = crypto.randomUUID();
			user._id = user.id;
		}

		if(await this.collection.add(user))
		{
			return this.getOne(user.id);
		}
		return null;
	}
	async update(id: string, user: object): Promise<ModelContainer<UserModel> | null>{
		if(await this.collection.update(id, user))
		{
			return this.getOne(id);
		}
		return null;
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}

}