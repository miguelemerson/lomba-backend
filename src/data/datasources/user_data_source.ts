import { UserModel } from '../models/user_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';


export interface UserDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<UserModel>>;
    getOne(id: string): Promise<ModelContainer<UserModel>>;
    add(user: UserModel) : Promise<ModelContainer<UserModel>>;
    update(id: string, user: object): Promise<ModelContainer<UserModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
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
	async getOne(id: string): Promise<ModelContainer<UserModel>>{
		return await this.collection.getOne(id);
	}
	async add(user: UserModel) : Promise<ModelContainer<UserModel>>{
		if(user.id == undefined)
		{
			user.id = crypto.randomUUID();
			user._id = user.id;
		}

		return await this.collection.add(user).then(() => this.getOne(user.id));
		
	}
	async update(id: string, user: object): Promise<ModelContainer<UserModel>>{
		return await this.collection.update(id, user).then(() => this.getOne(id));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}

}