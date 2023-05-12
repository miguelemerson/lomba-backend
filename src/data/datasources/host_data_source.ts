import crypto from 'crypto';
import { ModelContainer } from '../../core/model_container';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { HostModel } from '../models/storage/host_model';

export interface HostDataSource {
	setId(obj: HostModel): HostModel;
    add(host: HostModel) : Promise<ModelContainer<HostModel>>;
	getById(hostId:string): Promise<ModelContainer<HostModel>>;
    getByHost(host: string): Promise<ModelContainer<HostModel>>;

}


export class HostDataSourceImpl implements HostDataSource {
	collection: MongoWrapper<HostModel>;

	constructor(dbMongo: MongoWrapper<HostModel>){
		this.collection = dbMongo;
	}
	setId(obj: HostModel): HostModel {
		if(obj.id == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	}
	async add(host: HostModel): Promise<ModelContainer<HostModel>> {
		host = this.setId(host);
		return await this.collection.add(host).then(() => this.collection.getOne({'_id':host.id}));
	}
	async getById(hostId: string): Promise<ModelContainer<HostModel>> {
		return await this.collection.getOne({_id: hostId});
	}
	async getByHost(host: string): Promise<ModelContainer<HostModel>> {
		return await this.collection.getOne({host: host});
	}
}