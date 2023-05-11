import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import { ExternalUriModel } from '../models/storage/externaluri_model';

export interface ExternalUriDataSource {
	setId(obj: ExternalUriModel): ExternalUriModel;
    add(externalUri: ExternalUriModel) : Promise<ModelContainer<ExternalUriModel>>;
	getById(externalUriId:string): Promise<ModelContainer<ExternalUriModel>>;
	getByUri(uri:string): Promise<ModelContainer<ExternalUriModel>>;

}

export class ExternalUriDataSourceImpl implements ExternalUriDataSource {
	collection: MongoWrapper<ExternalUriModel>;

	constructor(dbMongo: MongoWrapper<ExternalUriModel>){
		this.collection = dbMongo;
	}
	setId(obj: ExternalUriModel): ExternalUriModel {
		if(obj.id == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	}
	async add(externalUri: ExternalUriModel): Promise<ModelContainer<ExternalUriModel>> {
		externalUri = this.setId(externalUri);
		return await this.collection.add(externalUri).then(() => this.collection.getOne({'_id':externalUri.id}));
	}
	async getById(externalUriId: string): Promise<ModelContainer<ExternalUriModel>> {
		return await this.collection.getOne({_id: externalUriId});
	}
	async getByUri(uri: string): Promise<ModelContainer<ExternalUriModel>> {
		return await this.collection.getOne({uri: uri});
	}
}