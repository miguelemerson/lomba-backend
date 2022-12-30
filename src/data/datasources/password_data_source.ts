import { PasswordModel } from '../models/password_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';


export interface PasswordDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PasswordModel> | null>;
    getOne(id: string): Promise<ModelContainer<PasswordModel> | null>;
    add(password: PasswordModel) : Promise<ModelContainer<PasswordModel> | null>;
    update(id: string, password: object): Promise<ModelContainer<PasswordModel> | null>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class PasswordDataSourceImpl implements PasswordDataSource {
	collection: MongoWrapper<PasswordModel>;

	constructor(dbMongo: MongoWrapper<PasswordModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PasswordModel> | null>{
		return await this.collection.getMany<PasswordModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(id: string): Promise<ModelContainer<PasswordModel> | null>{
		return await this.collection.getOne(id);
	}
	async add(password: PasswordModel) : Promise<ModelContainer<PasswordModel> | null>{
		if(password.id == undefined)
		{
			password.id = crypto.randomUUID();
			password._id = password.id;
		}

		if(await this.collection.add(password))
		{
			return this.getOne(password.id);
		}
		return null;
	}
	async update(id: string, password: object): Promise<ModelContainer<PasswordModel> | null>{
		if(await this.collection.update(id, password))
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