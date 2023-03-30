import { CloudFileModel } from '../models/storage/cloudfile_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';


export interface CloudFileDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<CloudFileModel>>;
    getOne(query: object): Promise<ModelContainer<CloudFileModel>>;
    add(cloudFile: CloudFileModel) : Promise<ModelContainer<CloudFileModel>>;
    update(id: string, cloudFile: object): Promise<ModelContainer<CloudFileModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: CloudFileModel): CloudFileModel;
	updateDirect(id: string, cloudFile: object): Promise<ModelContainer<CloudFileModel>>;
	getAll(sort?: [string, 1 | -1][] | undefined): Promise<ModelContainer<CloudFileModel>>;
	getById(cloudFileId:string): Promise<ModelContainer<CloudFileModel>>;
}

export class CloudFileDataSourceImpl implements CloudFileDataSource {
	collection: MongoWrapper<CloudFileModel>;

	constructor(dbMongo: MongoWrapper<CloudFileModel>){
		this.collection = dbMongo;
	}
	async getById(cloudFileId: string): Promise<ModelContainer<CloudFileModel>> {
		return await this.collection.getOne({_id:cloudFileId});
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<CloudFileModel>>{
		return await this.collection.getMany<CloudFileModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<CloudFileModel>>{
		return await this.collection.getOne(query);
	}

	async add(cloudFile: CloudFileModel) : Promise<ModelContainer<CloudFileModel>>{
		cloudFile = this.setId(cloudFile);
		return await this.collection.add(cloudFile).then(() => this.getOne({'_id':cloudFile.id}));
	}
	async update(id: string, cloudFile: object): Promise<ModelContainer<CloudFileModel>>{
		return await this.collection.update(id, cloudFile).then(() => this.getOne({'_id':id}));
	}
	async updateDirect(id: string, post: object): Promise<ModelContainer<CloudFileModel>>{
		return await this.collection.updateDirect(id, post).then(() => this.getOne({'_id':id}));
	}	
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}

	async getAll(sort?: [string, 1 | -1][] | undefined): Promise<ModelContainer<CloudFileModel>> {
		return await this.collection.getMany<CloudFileModel>({}, sort);
	}

	public setId(obj: CloudFileModel): CloudFileModel
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