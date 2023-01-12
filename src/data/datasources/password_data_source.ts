import { PasswordModel } from '../models/password_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';


export interface PasswordDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PasswordModel>>;
    getOne(query: object): Promise<ModelContainer<PasswordModel>>;
    add(password: PasswordModel) : Promise<ModelContainer<PasswordModel>>;
    update(id: string, password: object): Promise<ModelContainer<PasswordModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class PasswordDataSourceImpl implements PasswordDataSource {
	collection: MongoWrapper<PasswordModel>;

	constructor(dbMongo: MongoWrapper<PasswordModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PasswordModel>>{
		return await this.collection.getMany<PasswordModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<PasswordModel>>{
		return await this.collection.getOne(query);
	}
	async add(password: PasswordModel) : Promise<ModelContainer<PasswordModel>>{
		return await this.collection.add(password).then(() => this.getOne({'_id':password.id}));
	}
	async update(id: string, password: object): Promise<ModelContainer<PasswordModel>>{
		return await this.collection.update(id, password).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}

}