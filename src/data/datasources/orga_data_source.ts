import { OrgaModel } from '../models/orga_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';


export interface OrgaDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaModel>>;
    getOne(id: string): Promise<ModelContainer<OrgaModel>>;
    add(orga: OrgaModel) : Promise<ModelContainer<OrgaModel>>;
    update(id: string, orga: object): Promise<ModelContainer<OrgaModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class OrgaDataSourceImpl implements OrgaDataSource {
	collection: MongoWrapper<OrgaModel>;

	constructor(dbMongo: MongoWrapper<OrgaModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaModel>>{
		return await this.collection.getMany<OrgaModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(id: string): Promise<ModelContainer<OrgaModel>>{
		return await this.collection.getOne(id);
	}
	async add(orga: OrgaModel) : Promise<ModelContainer<OrgaModel>>{
		if(orga.id == undefined)
		{
			orga.id = crypto.randomUUID();
			orga._id = orga.id;
		}

		return await this.collection.add(orga).then(() => this.getOne(orga.id));
		
	}
	async update(id: string, orga: object): Promise<ModelContainer<OrgaModel>>{
		return await this.collection.update(id, orga).then(() => this.getOne(id));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}

}