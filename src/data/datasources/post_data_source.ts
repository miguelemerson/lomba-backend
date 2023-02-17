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

	getUploadedPosts(orgaId:string, userId:string, flowId:string, stageId:string, searchText: string, onlydrafts:boolean, sort:[string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;

	getForApprovePosts(orgaId:string, userId:string, flowId:string, stageId:string, searchText: string, sort:[string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;

	getApprovedPosts(orgaId:string, userId:string, flowId:string, stageId:string, searchText: string, sort:[string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;

	getRejectedPosts(orgaId:string, userId:string, flowId:string, stageId:string, searchText: string, sort:[string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;

	getLatestPosts(orgaId:string, userId:string, flowId:string, stageId:string, searchText: string, sort:[string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;

	getPopularPosts(orgaId:string, userId:string, flowId:string, stageId:string, searchText: string, sort:[string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;

	getVotedPosts(orgaId:string, userId:string, flowId:string, stageId:string, searchText: string, onlyWithVoteValue:number, sort:[string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;

	getIfHasVote(userId: string, flowId: string, stageId: string, postId: string): Promise<ModelContainer<PostModel>>;	

	getById(postId:string): Promise<ModelContainer<PostModel>>;

	getByQueryOut(postId:string, flowId:string, stageId:string, queryOut:{[x: string]: unknown}): Promise<ModelContainer<PostModel>>;

	pushToArrayField(id: string, arrayAndValue: object): Promise<ModelContainer<PostModel>>;

	updateTotals(postId:string, flowId:string, stageId:string, voteValue: number): Promise<ModelContainer<PostModel>>;			

	updateVote(postId:string, userId:string, flowId:string, stageId:string, voteValue: number): Promise<ModelContainer<PostModel>>;

}

export class PostDataSourceImpl implements PostDataSource {
	collection: MongoWrapper<PostModel>;

	constructor(dbMongo: MongoWrapper<PostModel>){
		this.collection = dbMongo;
	}
	async updateVote(postId: string, userId:string, flowId: string, stageId: string, voteValue: number): Promise<ModelContainer<PostModel>> {
		
		return await this.collection.updateArray(postId, { $set :{'votes.$[elem].updated': new Date(), 'votes.$[elem].value':voteValue}}, {arrayFilters: [{'elem.userId':userId, 'elem.stageId':stageId, 'elem.flowId':flowId}]}).then(() => this.getById(postId));
	}
	async updateTotals(postId:string, flowId:string, stageId:string, voteValue: number): Promise<ModelContainer<PostModel>> {

		const updateQuery = voteValue == 1 ? { $inc: {'totals.$[elem].totalpositive':1, 'totals.$[elem].totalcount':1}} : { $inc: {'totals.$[elem].totalnegative': 1, 'totals.$[elem].totalcount': 1}};

		return await this.collection.updateArray(postId, updateQuery, {arrayFilters: [{'elem.stageId':stageId, 'elem.flowId':flowId}]}).then(() => this.getById(postId));
	}
	async pushToArrayField(id: string, arrayAndValue: object): Promise<ModelContainer<PostModel>> {
		return await this.collection.updateDirect(id, {$push: arrayAndValue}).then(() => this.getById(id));
	}

	private getStandardProjection(userId:string, flowId:string, stageId:string):object
	{
		const options = {votes: { $elemMatch: {'userId':userId, 'stageId':stageId, 'flowId':flowId }}, id:1, postitems:1, title:1, orgaId:1, userId:1, flowId:1, stageId:1, enabled:1, builtIn:1, created:1, stages:1, totals:1, tracks:1, updated:1, deleted:1, expires:1};

		return options;
	}

	private getWithoutVotesProjection():object
	{
		const options = {votes: -1};

		return options;
	}

	async getUploadedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, onlydrafts: boolean, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {

		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['userId'] = userId;
		query['flowId'] = flowId;
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		if(onlydrafts)
		{
			query['stageId'] = stageId;
		}
		else
		{
			query['stages'] = {$elemMatch: {id:stageId}};
		}

		return await this.getManyWithOptions(query, {projection: this.getStandardProjection(userId, flowId, stageId)}, sort, pageIndex, itemsPerPage);
	}
	async getForApprovePosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {

		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stages'] = {$elemMatch: {id:stageId}};
		query['votes'] = {$elemMatch: {id:{$ne:userId}}};
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		return await this.getManyWithOptions(query, {projection: this.getStandardProjection(userId, flowId, stageId)}, sort, pageIndex, itemsPerPage);
	}
	async getApprovedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {

		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stages'] = {$elemMatch: {id:stageId}};
		query['votes'] = {$elemMatch: {userId:{$ne:userId}, stageId:stageId, value:1}};
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		return await this.getManyWithOptions(query, {projection: this.getStandardProjection(userId, flowId, stageId)}, sort, pageIndex, itemsPerPage);
	}
	async getRejectedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stages'] = {$elemMatch: {id:stageId}};
		query['votes'] = {$elemMatch: {userId:{$ne:userId}, stageId:stageId, value:-1}};
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		if(!sort)
		{
			sort = [['created', -1]];
		}
		return await this.getManyWithOptions(query, {projection: this.getStandardProjection(userId, flowId, stageId)}, sort, pageIndex, itemsPerPage);
	}
	async getLatestPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stageId'] = stageId;
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		sort = [['created', -1]];
		
		return await this.getManyWithOptions(query, {projection: this.getStandardProjection(userId, flowId, stageId)}, sort, pageIndex, itemsPerPage);
	}
	async getPopularPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stageId'] = stageId;
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		sort = [['totals.totalpositive',-1]];
		
		return await this.getManyWithOptions(query, {projection: this.getStandardProjection(userId, flowId, stageId)}, sort, pageIndex, itemsPerPage);
	}
	async getVotedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, onlyWithVoteValue: number, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stageId'] = stageId;
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		if(onlyWithVoteValue.toString() == '1')
		{
			query['votes'] = {$elemMatch: {userId:userId, stageId:stageId, value:1}};
		}
		else if (onlyWithVoteValue.toString() == '-1')
		{
			query['votes'] = {$elemMatch: {userId:userId, stageId:stageId, value:-1}};
		}
		else
		{
			query['votes'] = {$elemMatch: {userId:userId, stageId:stageId}};
		}
		if(!sort)
		{
			sort = [['created', -1]];
		}
		
		return await this.getManyWithOptions(query, {projection: this.getStandardProjection(userId, flowId, stageId)}, sort, pageIndex, itemsPerPage);
	}
	async getIfHasVote(userId: string, flowId: string, stageId: string, postId: string): Promise<ModelContainer<PostModel>> {
		const query = {id: postId, 'votes.userId':userId, 'votes.stageId':stageId, 'votes.flowId':flowId};

		const options = this.getStandardProjection(userId, flowId, stageId);

		return await this.collection.getOneWithOptions(query, options);
	}
	async getById(postId: string): Promise<ModelContainer<PostModel>> {
		return await this.collection.getOneWithOptions({_id:postId}, {projection: this.getWithoutVotesProjection()});
	}
	async getByQueryOut(postId: string, flowId: string, stageId: string, queryOut: { [x: string]: unknown; }): Promise<ModelContainer<PostModel>> {
		queryOut['_id'] = postId;
		queryOut['stageId'] = stageId;
		queryOut['flowId'] = flowId;
		return await this.collection.getOneWithOptions(queryOut, {projection: this.getWithoutVotesProjection()});
	}

	public get dbcollection(): MongoWrapper<PostModel> {
		return this.collection;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>{
		return await this.collection.getManyWithOptions<PostModel>(query, {projection: this.getWithoutVotesProjection()}, sort, pageIndex, itemsPerPage);
	}
	async getManyWithOptions(query: object, options: object | undefined, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>{
		return await this.collection.getManyWithOptions<PostModel>(query, options, sort, pageIndex, itemsPerPage);
	}	
	async getOne(query: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.getOneWithOptions(query, {projection: this.getWithoutVotesProjection()});
	}
	async getOneWithOptions(query: object, options: object | undefined): Promise<ModelContainer<PostModel>>{
	
		return await this.collection.getOneWithOptions(query, options);
	}
	async add(post: PostModel) : Promise<ModelContainer<PostModel>>{
		post = this.setId(post);
		return await this.collection.add(post).then(() => this.getById(post.id));
	}
	async update(id: string, post: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.update(id, post).then(() => this.getById(id));
	}
	async updateDirect(id: string, post: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.updateDirect(id, post).then(() => this.getById(id));
	}	
	async updateArray(id: string, post: object, arrayFilters: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.updateArray(id, post, arrayFilters).then(() => this.getById(id));
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