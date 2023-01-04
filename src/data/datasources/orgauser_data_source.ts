import { ModelContainer } from '../../core/model_container';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { OrgaUserModel } from '../models/orgauser_model';


export interface OrgaUserDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaUserModel>>;
    getOne(id: string): Promise<ModelContainer<OrgaUserModel>>;
    add(orgaOrgaUser: OrgaUserModel) : Promise<ModelContainer<OrgaUserModel>>;
    update(id: string, orgaOrgaUser: object): Promise<ModelContainer<OrgaUserModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class OrgaUserDataSourceImpl implements OrgaUserDataSource {
	collection: MongoWrapper<OrgaUserModel>;

	constructor(dbMongo: MongoWrapper<OrgaUserModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaUserModel>>{
		return await this.collection.getMany<OrgaUserModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(id: string): Promise<ModelContainer<OrgaUserModel>>{
		return await this.collection.getOne(id);
	}
	async add(orgaOrgaUser: OrgaUserModel) : Promise<ModelContainer<OrgaUserModel>>{
		if(orgaOrgaUser.id == undefined)
		{
			orgaOrgaUser.id = crypto.randomUUID();
			orgaOrgaUser._id = orgaOrgaUser.id;
		}

		return await this.collection.add(orgaOrgaUser).then(() => this.getOne(orgaOrgaUser.id));

	}
	async update(id: string, orgaOrgaUser: object): Promise<ModelContainer<OrgaUserModel>>{
		return await this.collection.update(id, orgaOrgaUser).then(() => this.getOne(id));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}

}