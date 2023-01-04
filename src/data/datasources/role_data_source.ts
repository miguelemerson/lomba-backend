import { RoleModel } from '../models/role_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';


export interface RoleDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<RoleModel>>;
    getOne(id: string): Promise<ModelContainer<RoleModel>>;
    add(role: RoleModel) : Promise<ModelContainer<RoleModel>>;
    update(id: string, role: object): Promise<ModelContainer<RoleModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class RoleDataSourceImpl implements RoleDataSource {
	collection: MongoWrapper<RoleModel>;

	constructor(dbMongo: MongoWrapper<RoleModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<RoleModel>>{
		return await this.collection.getMany<RoleModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(id: string): Promise<ModelContainer<RoleModel>>{
		return await this.collection.getOne(id);
	}
	async add(role: RoleModel) : Promise<ModelContainer<RoleModel>>{
		if(role.id == undefined)
		{
			role.id = crypto.randomUUID();
			role._id = role.id;
		}

		return await this.collection.add(role).then(() => this.getOne(role.id));
		
	}
	async update(id: string, role: object): Promise<ModelContainer<RoleModel>>{
		return await this.collection.update(id, role).then(() => this.getOne(id));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}

}