import { FileCloudModel } from '../models/storage/filecloud_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';


export interface FileCloudDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<FileCloudModel>>;
    getOne(query: object): Promise<ModelContainer<FileCloudModel>>;
    add(fileCloud: FileCloudModel) : Promise<ModelContainer<FileCloudModel>>;
    update(id: string, fileCloud: object): Promise<ModelContainer<FileCloudModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: FileCloudModel): FileCloudModel;
	updateDirect(id: string, fileCloud: object): Promise<ModelContainer<FileCloudModel>>;
	getAll(sort?: [string, 1 | -1][] | undefined): Promise<ModelContainer<FileCloudModel>>;
	getById(fileCloudId:string): Promise<ModelContainer<FileCloudModel>>;
}

export class FileCloudDataSourceImpl implements FileCloudDataSource {
	collection: MongoWrapper<FileCloudModel>;

	constructor(dbMongo: MongoWrapper<FileCloudModel>){
		this.collection = dbMongo;
	}
	async getById(fileCloudId: string): Promise<ModelContainer<FileCloudModel>> {
		return await this.collection.getOne({_id:fileCloudId});
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<FileCloudModel>>{
		return await this.collection.getMany<FileCloudModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<FileCloudModel>>{
		return await this.collection.getOne(query);
	}

	async add(fileCloud: FileCloudModel) : Promise<ModelContainer<FileCloudModel>>{
		fileCloud = this.setId(fileCloud);
		return await this.collection.add(fileCloud).then(() => this.getOne({'_id':fileCloud.id}));
	}
	async update(id: string, fileCloud: object): Promise<ModelContainer<FileCloudModel>>{
		return await this.collection.update(id, fileCloud).then(() => this.getOne({'_id':id}));
	}
	async updateDirect(id: string, post: object): Promise<ModelContainer<FileCloudModel>>{
		return await this.collection.updateDirect(id, post).then(() => this.getOne({'_id':id}));
	}	
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}

	async getAll(sort?: [string, 1 | -1][] | undefined): Promise<ModelContainer<FileCloudModel>> {
		return await this.collection.getMany<FileCloudModel>({}, sort);
	}

	public setId(obj: FileCloudModel): FileCloudModel
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