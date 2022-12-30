import { OrgaModel } from '../models/orga_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';


export interface OrgaDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaModel> | null>;
    getOne(id: string): Promise<ModelContainer<OrgaModel> | null>;
    add(orga: OrgaModel) : Promise<ModelContainer<OrgaModel> | null>;
    update(id: string, orga: object): Promise<ModelContainer<OrgaModel> | null>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class OrgaDataSourceImpl implements OrgaDataSource {
	collection: MongoWrapper<OrgaModel>;

	constructor(dbMongo: MongoWrapper<OrgaModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaModel> | null>{
		return await this.collection.getMany<OrgaModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(id: string): Promise<ModelContainer<OrgaModel> | null>{
		return await this.collection.getOne(id);
	}
	async add(orga: OrgaModel) : Promise<ModelContainer<OrgaModel> | null>{
		if(orga.id == undefined)
		{
			orga.id = crypto.randomUUID();
			orga._id = orga.id;
		}

		if(await this.collection.add(orga))
		{
			return this.getOne(orga.id);
		}
		return null;
	}
	async update(id: string, orga: object): Promise<ModelContainer<OrgaModel> | null>{
		if(await this.collection.update(id, orga))
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