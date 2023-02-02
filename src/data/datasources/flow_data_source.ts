import { FlowModel } from '../models/flows/flow_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';


export interface FlowDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<FlowModel>>;
    getOne(query: object): Promise<ModelContainer<FlowModel>>;
    add(flow: FlowModel) : Promise<ModelContainer<FlowModel>>;
    update(id: string, flow: object): Promise<ModelContainer<FlowModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: FlowModel): FlowModel;
}

export class FlowDataSourceImpl implements FlowDataSource {
	collection: MongoWrapper<FlowModel>;

	constructor(dbMongo: MongoWrapper<FlowModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<FlowModel>>{
		return await this.collection.getMany<FlowModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<FlowModel>>{
		return await this.collection.getOne(query);
	}

	async add(flow: FlowModel) : Promise<ModelContainer<FlowModel>>{
		flow = this.setId(flow);
		return await this.collection.add(flow).then(() => this.getOne({'_id':flow.id}));
	}
	async update(id: string, flow: object): Promise<ModelContainer<FlowModel>>{
		return await this.collection.update(id, flow).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: FlowModel): FlowModel
	{
		if(obj.id.trim() == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	} 
}