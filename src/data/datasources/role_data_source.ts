import { RoleModel } from '../models/role_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';


export interface RoleDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<RoleModel> | null>;
    getOne(id: string): Promise<ModelContainer<RoleModel> | null>;
    add(role: RoleModel) : Promise<ModelContainer<RoleModel> | null>;
    update(id: string, role: object): Promise<ModelContainer<RoleModel> | null>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class RoleDataSourceImpl implements RoleDataSource {
	collection: MongoWrapper<RoleModel>;

	constructor(dbMongo: MongoWrapper<RoleModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<RoleModel> | null>{
		return await this.collection.getMany<RoleModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(id: string): Promise<ModelContainer<RoleModel> | null>{
		return await this.collection.getOne(id);
	}
	async add(role: RoleModel) : Promise<ModelContainer<RoleModel> | null>{
		if(role.id == undefined)
		{
			role.id = crypto.randomUUID();
			role._id = role.id;
		}

		if(await this.collection.add(role))
		{
			return this.getOne(role.id);
		}
		return null;
	}
	async update(id: string, role: object): Promise<ModelContainer<RoleModel> | null>{
		if(await this.collection.update(id, role))
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