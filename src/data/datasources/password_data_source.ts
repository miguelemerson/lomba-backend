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
		password = this.setId(password);
		return await this.collection.add(password).then(() => this.getOne({'_id':password.id}));
	}
	async update(userId: string, password: object): Promise<ModelContainer<PasswordModel>>{

		const params = (password as {[x: string]: unknown;});
		if(password != null)
			params['updated'] = new Date();

		const result = await this.collection.db.collection<PasswordModel>(this.collection.collectionName).updateOne({'userId': userId}, {$set:params});
		if (result?.modifiedCount > 0)
			return this.getOne({'userId':userId});
		else
		{
			return await this.collection.update(userId, password).then(() => this.getOne({'userId':userId}));
		}
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: PasswordModel): PasswordModel
	{
		if(obj.id == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	}
}