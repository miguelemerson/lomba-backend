import crypto from 'crypto';
import { ModelContainer } from '../../core/model_container';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ExternalUriModel } from '../models/storage/externaluri_model';

export interface ExternalUriDataSource {
	setId(obj: ExternalUriModel): ExternalUriModel;
    add(externalUri: ExternalUriModel) : Promise<ModelContainer<ExternalUriModel>>;
	getById(externalUriId:string): Promise<ModelContainer<ExternalUriModel>>;
	getByUri(uri:string): Promise<ModelContainer<ExternalUriModel>>;
	update(id: string, externalUri: object): Promise<ModelContainer<ExternalUriModel>>;
}

export class ExternalUriDataSourceImpl implements ExternalUriDataSource {
	collection: MongoWrapper<ExternalUriModel>;

	constructor(dbMongo: MongoWrapper<ExternalUriModel>){
		this.collection = dbMongo;
	}
	async update(id: string, externalUri: object): Promise<ModelContainer<ExternalUriModel>> {
		return await this.collection.update(id, externalUri).then(() => this.getOneComplete({'_id':id}));
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
		return await this.collection.add(externalUri).then(() => this.getOneComplete({'_id':externalUri.id}));
	}
	async getById(externalUriId: string): Promise<ModelContainer<ExternalUriModel>> {
		return await this.getOneComplete({_id: externalUriId});
	}
	async getByUri(uri: string): Promise<ModelContainer<ExternalUriModel>> {
		return await this.getOneComplete({uri: uri});
	}
	async getOneComplete(query: object): Promise<ModelContainer<ExternalUriModel>>{
	
		const pipeline:object[] = [];

		pipeline.push({
			$lookup: {
				from: 'hosts',
				let: { externalUri_host: '$host' },
				pipeline: [
					{ $match: { $expr: {
						$and: [{ $eq: [ '$$externalUri_host', '$host' ] }]
					}
					}
					},
					{ $project: { _id: 1, id:1, host:1, names:1, enabled:1, created:1, updated:1 } }],
				as: 'hosts'
			}
		});


		pipeline.push({$match:query});

		const result = await this.collection.db.collection(this.collection.collectionName).aggregate<ExternalUriModel>(pipeline).toArray();

		if(result.length == 0)
		{
			return new ModelContainer<ExternalUriModel>([]);
		}
		const contains_one = ModelContainer.fromOneItem(result[0]);
		return contains_one;
	}
}