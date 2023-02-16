import { PostModel } from '../models/flows/post_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';


export interface PostDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>;
	getManyWithOptions(query: object, options?: object | undefined, sort?: [string, 1 | -1][],
			pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>;		
    getOne(query: object): Promise<ModelContainer<PostModel>>;
    getOneWithOptions(query: object, options: object | undefined): Promise<ModelContainer<PostModel>>;	
    add(post: PostModel) : Promise<ModelContainer<PostModel>>;
    update(id: string, post: object): Promise<ModelContainer<PostModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: PostModel): PostModel;
    updateDirect(id: string, post: object): Promise<ModelContainer<PostModel>>;
	updateArray(id: string, post: object, arrayFilters: object): Promise<ModelContainer<PostModel>>;
	get dbcollection(): MongoWrapper<PostModel>;

	getUploadedPosts(orgaId:string, userId:string, flowId:string, stageId:string, onlydrafts:boolean, sort:[string, 1 | -1][]): Promise<ModelContainer<PostModel>>;

	getForApprovePosts(orgaId:string, userId:string, flowId:string, stageId:string, sort:[string, 1 | -1][]): Promise<ModelContainer<PostModel>>;

	getApprovedPosts(orgaId:string, userId:string, flowId:string, stageId:string, sort:[string, 1 | -1][]): Promise<ModelContainer<PostModel>>;

	getRejectedPosts(orgaId:string, userId:string, flowId:string, stageId:string, sort:[string, 1 | -1][]): Promise<ModelContainer<PostModel>>;

	getLatestPosts(orgaId:string, userId:string, flowId:string, stageId:string, sort:[string, 1 | -1][]): Promise<ModelContainer<PostModel>>;

	getPopularPosts(orgaId:string, userId:string, flowId:string, stageId:string, sort:[string, 1 | -1][]): Promise<ModelContainer<PostModel>>;

	getVotedPosts(orgaId:string, userId:string, flowId:string, stageId:string, onlyWithVoteValue:number, sort:[string, 1 | -1][]): Promise<ModelContainer<PostModel>>;

	getIfHasVote(userId: string, flowId: string, stageId: string, postId: string): Promise<ModelContainer<PostModel>>;	

	getById(postId:string): Promise<ModelContainer<PostModel>>;

	getByQueryOut(postId:string, flowId:string, stageId:string, queryOut:{[x: string]: unknown}): Promise<ModelContainer<PostModel>>;
}

export class PostDataSourceImpl implements PostDataSource {
	collection: MongoWrapper<PostModel>;

	constructor(dbMongo: MongoWrapper<PostModel>){
		this.collection = dbMongo;
	}

	private getStandardProjection(userId:string, flowId:string, stageId:string):object
	{
		const options = {votes: { $elemMatch: {'userId':userId, 'stageId':stageId, 'flowId':flowId }}, id:1, postitems:1, title:1, orgaId:1, userId:1, flowId:1, stageId:1, enabled:1, builtIn:1, created:1, stages:1, totals:1, tracks:1, updated:1, deleted:1, expires:1};

		return options;
	}

	getUploadedPosts(orgaId: string, userId: string, flowId: string, stageId: string, onlydrafts: boolean, sort: [string, 1 | -1][]): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getForApprovePosts(orgaId: string, userId: string, flowId: string, stageId: string, sort: [string, 1 | -1][]): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getApprovedPosts(orgaId: string, userId: string, flowId: string, stageId: string, sort: [string, 1 | -1][]): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getRejectedPosts(orgaId: string, userId: string, flowId: string, stageId: string, sort: [string, 1 | -1][]): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getLatestPosts(orgaId: string, userId: string, flowId: string, stageId: string, sort: [string, 1 | -1][]): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getPopularPosts(orgaId: string, userId: string, flowId: string, stageId: string, sort: [string, 1 | -1][]): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getVotedPosts(orgaId: string, userId: string, flowId: string, stageId: string, onlyWithVoteValue: number, sort: [string, 1 | -1][]): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	async getIfHasVote(userId: string, flowId: string, stageId: string, postId: string): Promise<ModelContainer<PostModel>> {
		const query = {id: postId, 'votes.userId':userId, 'votes.stageId':stageId, 'votes.flowId':flowId};

		const options = this.getStandardProjection(userId, flowId, stageId);

		return await this.collection.getOneWithOptions(query, options);
	}
	async getById(postId: string): Promise<ModelContainer<PostModel>> {
		return await this.collection.getOne({_id:postId});
	}
	async getByQueryOut(postId: string, flowId: string, stageId: string, queryOut: { [x: string]: unknown; }): Promise<ModelContainer<PostModel>> {
		queryOut['_id'] = postId;
		queryOut['stageId'] = stageId;
		queryOut['flowId'] = flowId;
		return await this.collection.getOne(queryOut);
	}

	public get dbcollection(): MongoWrapper<PostModel> {
		return this.collection;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>{
		return await this.collection.getMany<PostModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getManyWithOptions(query: object, options: object | undefined, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>{
		return await this.collection.getManyWithOptions<PostModel>(query, options, sort, pageIndex, itemsPerPage);
	}	
	async getOne(query: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.getOne(query);
	}
	async getOneWithOptions(query: object, options: object | undefined): Promise<ModelContainer<PostModel>>{
	
		return await this.collection.getOneWithOptions(query, options);
	}
	async add(post: PostModel) : Promise<ModelContainer<PostModel>>{
		post = this.setId(post);
		return await this.collection.add(post).then(() => this.getOne({'_id':post.id}));
	}
	async update(id: string, post: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.update(id, post).then(() => this.getOne({'_id':id}));
	}
	async updateDirect(id: string, post: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.updateDirect(id, post).then(() => this.getOne({'_id':id}));
	}	
	async updateArray(id: string, post: object, arrayFilters: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.updateArray(id, post, arrayFilters).then(() => this.getOne({'_id':id}));
	}	
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: PostModel): PostModel
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