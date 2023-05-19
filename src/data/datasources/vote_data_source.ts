import crypto from 'crypto';
import { ModelContainer } from '../../core/model_container';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { VoteModel } from '../models/workflow/vote_model';

export interface VoteDataSource {
	getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<VoteModel>>;
    getOne(query: object): Promise<ModelContainer<VoteModel>>;
    add(vote: VoteModel) : Promise<ModelContainer<VoteModel>>;
    update(id: string, vote: object): Promise<ModelContainer<VoteModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(voteId: string, userId:string): Promise<boolean>;
	setId(obj: VoteModel): VoteModel;
	getById(voteId:string): Promise<ModelContainer<VoteModel>>;
	getByPost(postId: string, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<VoteModel>>;
    getVote(postId: string, userId: string, flowId:string, stageId:string): Promise<ModelContainer<VoteModel>>;
}


export class VoteDataSourceImpl implements VoteDataSource {
	collection: MongoWrapper<VoteModel>;

	constructor(dbMongo: MongoWrapper<VoteModel>){
		this.collection = dbMongo;
	}
	async getVote(postId: string, userId: string, flowId: string, stageId: string): Promise<ModelContainer<VoteModel>> {
		return await this.collection.getOne({postId: postId, userId: userId, flowId: flowId, stageId: stageId});
	}
	async getByPost(postId: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<VoteModel>> {
		return await this.collection.getMany<VoteModel>({postId:postId}, sort, pageIndex, itemsPerPage);
	}
	async getMany(query: object, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<VoteModel>> {
		return await this.collection.getMany<VoteModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<VoteModel>> {
		return await this.collection.getOne(query);
	}
	async add(vote: VoteModel): Promise<ModelContainer<VoteModel>> {
		vote = this.setId(vote);
		return await this.collection.add(vote).then(() => this.getOne({'_id':vote.id}));
	}
	async update(id: string, vote: object): Promise<ModelContainer<VoteModel>> {
		return await this.collection.update(id, vote).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean> {
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(voteId: string, userId:string): Promise<boolean> {
		return await this.collection.delete(voteId);
	}
	setId(obj: VoteModel): VoteModel {
		if(obj.id == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	}
	async getById(voteId: string): Promise<ModelContainer<VoteModel>> {
		return await this.collection.getOne({_id: voteId});
	}
}