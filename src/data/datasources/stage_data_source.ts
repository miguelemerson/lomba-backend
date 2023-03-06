import { StageModel } from '../models/workflow/stage_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';


export interface StageDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<StageModel>>;
    getOne(query: object): Promise<ModelContainer<StageModel>>;
    add(stage: StageModel) : Promise<ModelContainer<StageModel>>;
    update(id: string, stage: object): Promise<ModelContainer<StageModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: StageModel): StageModel;

	getAll(sort?: [string, 1 | -1][] | undefined): Promise<ModelContainer<StageModel>>;
	getById(stageId:string): Promise<ModelContainer<StageModel>>;
}

export class StageDataSourceImpl implements StageDataSource {
	collection: MongoWrapper<StageModel>;

	constructor(dbMongo: MongoWrapper<StageModel>){
		this.collection = dbMongo;
	}
	async getById(stageId: string): Promise<ModelContainer<StageModel>> {
		return await this.collection.getOne({_id:stageId});
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<StageModel>>{
		return await this.collection.getMany<StageModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<StageModel>>{
		return await this.collection.getOne(query);
	}

	async add(stage: StageModel) : Promise<ModelContainer<StageModel>>{
		stage = this.setId(stage);
		return await this.collection.add(stage).then(() => this.getOne({'_id':stage.id}));
	}
	async update(id: string, stage: object): Promise<ModelContainer<StageModel>>{
		return await this.collection.update(id, stage).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}

	async getAll(sort?: [string, 1 | -1][] | undefined): Promise<ModelContainer<StageModel>> {
		return await this.collection.getMany<StageModel>({}, sort);
	}

	public setId(obj: StageModel): StageModel
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