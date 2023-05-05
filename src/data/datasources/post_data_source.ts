import { PostModel } from '../models/workflow/post_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';
import { Track } from '../../domain/entities/workflow/track';


export interface PostDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>;
	getManyWithOptions(query: object, options?: object | undefined, sort?: [string, 1 | -1][],
			pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>;	
	getManyComplete(query: object, lookups:object[], queryToCount: object | undefined, projection: object | undefined, sort?: { [x: string]: 1 | -1; }, pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>;
    getOne(query: object): Promise<ModelContainer<PostModel>>;
    getOneWithOptions(query: object, options: object | undefined): Promise<ModelContainer<PostModel>>;	
	getOneComplete(query: object, lookups:object[], projection: object | undefined): Promise<ModelContainer<PostModel>>;	
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

	getAdminViewPosts(orgaId:string, userId:string, flowId:string, stageId:string, searchText: string, sort:[string, 1 | -1][], onlyStatusEnable?: boolean, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;

	getById(postId:string): Promise<ModelContainer<PostModel>>;
	getByIdBasic(postId:string): Promise<ModelContainer<PostModel>>;
	getByIdWithUser(postId:string, userId: string, flowId: string, stageId: string): Promise<ModelContainer<PostModel>>;

	getByQueryOut(postId:string, flowId:string, stageId:string, queryOut:{[x: string]: unknown}): Promise<ModelContainer<PostModel>>;

	pushToArrayField(id: string, arrayAndValue: object): Promise<ModelContainer<PostModel>>;

	updateTotals(postId:string, flowId:string, stageId:string, voteValue: number, isfirst:boolean): Promise<ModelContainer<PostModel>>;			

	addTrack(name:string, description:string, postId:string, userId:string, flowId:string, stageIdOld:string, stageIdNew:string, change:object): Promise<boolean>;

	updateBookmarksTotals(postId:string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', value:number): Promise<boolean>;

	getFavedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;

	getSavedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>>;
}

export class PostDataSourceImpl implements PostDataSource {
	collection: MongoWrapper<PostModel>;

	constructor(dbMongo: MongoWrapper<PostModel>){
		this.collection = dbMongo;
	}

	private getVotesLookupJoin(userId:string, flowId:string, stageId:string):object
	{
		const lookup = {
			$lookup: {
				from: 'votes',
				let: {post_postId: '$_id'},
				pipeline: [
					{$match: {$expr: {$and: [{$eq: ['$postId', '$$post_postId']}, {$eq: ['$userId', userId]}, {$eq: ['$flowId', flowId]}, {$eq: ['$stageId', stageId]}]}}},
					{$project: { _id: 1, id:1, postId: 1, userId:1, flowId:1, stageId:1, key:1, value:1, enabled:1,builtIn:1, created:1, updated:1 }}
				],
				as: 'votes'
			}
		};
		return lookup;
	}

	private getBookmarksLookupJoin(userId:string):object
	{
		const lookup = {
			$lookup:
		{
			from: 'bookmarks',
			let: { post_postId: '$_id' },
			pipeline: [
				{ $match: { $expr: {
					$and: [{ $eq: [ '$postId','$$post_postId' ] },
						{ $eq: [ '$userId', userId ] }]
				} 
				} 
				},
				{ $project: { _id: 1, postId: 1, userId:1, markType:1, enabled:1,builtIn:1, created:1, updated:1 } }],
			as: 'bookmarks'
		}
		};
		return lookup;
	}

	private getUserLookupJoin():object
	{
		const lookup = {
			$lookup: {
				from: 'users',
				let: { post_userId: '$userId' },
				pipeline: [
					{ $match: { $expr: {
						$and: [{ $eq: [ '$$post_userId', '$id' ] }]
					}
					}
					},
					{ $project: { _id: 1, id:1, name:1, username:1, email: 1, pictureUrl:1, pictureThumbnailUrl:1, enabled:1,builtIn:1, created:1 } }],
				as: 'users'
			}
		};
		return lookup;
	}


	async updateBookmarksTotals(postId: string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', value: number): Promise<boolean> {

		let updateQuery = {};
		if(markType == 'save')
		{
			updateQuery = { $inc: {'totalsaves':value}};
		} else if(markType == 'fav')
		{
			updateQuery = { $inc: {'totalfavs':value}};
		} else if(markType == 'report')
		{
			updateQuery = { $inc: {'totalreports':value}};
		} else if(markType == 'comment'){
			updateQuery = { $inc: {'totalcomments':value}};
		} else if(markType == 'download'){
			updateQuery = { $inc: {'totaldownloads':value}};
		} else {
			return false;
		}
		return await this.collection.updateDirect(postId, updateQuery);
	}
	async addTrack(name: string, description: string, postId: string, userId: string, flowId: string, stageIdOld:string, stageIdNew:string, change: object): Promise<boolean> {
		
		const track = {
			name: name,
			description: description,
			userId: userId,
			flowId: flowId,
			stageIdOld: stageIdOld,
			stageIdNew: stageIdNew,
			change: change,
			created: new Date(),
		} as unknown as Track;

		return await this.collection.updateDirect(postId, {$push: {tracks: track}}).then(() => true);

	}
	async getAdminViewPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], onlyStatusEnable?: boolean | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		if(flowId != '')
			query['flowId'] = flowId;
		if(stageId != '')
			query['stageId'] = stageId;			

		if(onlyStatusEnable!=undefined)
		{
			if(onlyStatusEnable == true)
				query['enabled'] = true;
			else
				query['enabled'] = false;
		}
		
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}

		return await this.getManyComplete(query, [this.getUserLookupJoin()], undefined, this.getProjectionBasic(), {'created':-1}, pageIndex, itemsPerPage);
	}

	async updateTotals(postId:string, flowId:string, stageId:string, voteValue: number, isfirst:boolean): Promise<ModelContainer<PostModel>> {

		let updateQuery = {};
		if(isfirst)
		{
			//si es primera vez que vota esta publicación.
			updateQuery = voteValue == 1 ? { $inc: {'totals.$[elem].totalpositive':Math.abs(voteValue), 'totals.$[elem].totalcount':1}} : { $inc: {'totals.$[elem].totalnegative': Math.abs(voteValue), 'totals.$[elem].totalcount': 1}};
		} else {
			//si no es primera vez que vota.
			updateQuery = voteValue == 1 ? { $inc: {'totals.$[elem].totalpositive':Math.abs(voteValue), 'totals.$[elem].totalnegative':(Math.abs(voteValue) * -1)}} : { $inc: {'totals.$[elem].totalnegative': Math.abs(voteValue), 'totals.$[elem].totalpositive': (Math.abs(voteValue) * -1)}};
		}
		
		return await this.collection.updateArray(postId, updateQuery, {arrayFilters: [{'elem.stageId':stageId, 'elem.flowId':flowId}]}).then(() => this.getByIdBasic(postId));
	}
	async pushToArrayField(id: string, arrayAndValue: object): Promise<ModelContainer<PostModel>> {
		return await this.collection.updateDirect(id, {$push: arrayAndValue}).then(() => this.getByIdBasic(id));
	}

	private getProjectionSpecial():object
	{
		const options = {votes: 1, _id:1, id:1, postitems:1, title:1, orgaId:1, userId:1, flowId:1, stageId:1, enabled:1, builtIn:1, created:1, stages:1, totals:1, tracks:1, updated:1, deleted:1, expires:1, totalsave:1, totalfav:1, totalreport:1, users:1};

		return options;
	}

	private getProjectionComplete():object
	{
		const options = {votes: 1, _id:1, id:1, postitems:1, title:1, orgaId:1, userId:1, flowId:1, stageId:1, enabled:1, builtIn:1, created:1, stages:1, totals:1, tracks:1, updated:1, deleted:1, expires:1, totalsave:1, totalfav:1, totalreport:1, bookmarks:1, users:1};

		return options;
	}

	private getProjectionBasic():object
	{
		const options = {_id:1,id:1, postitems:1, title:1, orgaId:1, userId:1, flowId:1, stageId:1, enabled:1, builtIn:1, created:1, stages:1, totals:1, tracks:1, updated:1, deleted:1, expires:1, totalsave:1, totalfav:1, totalreport:1, users:1};

		return options;
	}

	async getUploadedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, onlydrafts: boolean, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {

		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['userId'] = userId;
		query['flowId'] = flowId;
		query['enabled'] = true;
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

		return await this.getManyComplete(query, [this.getVotesLookupJoin(userId, flowId, stageId), this.getUserLookupJoin()],undefined, this.getProjectionSpecial(), {'created':-1}, pageIndex, itemsPerPage);
	}
	async getForApprovePosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {

		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stageId'] = stageId;
		query['enabled'] = true;
		query['votes.key'] = {$ne: `${userId}-${stageId}-${flowId}`};

		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}

		return await this.getManyComplete(query, [this.getVotesLookupJoin(userId, flowId, stageId), this.getUserLookupJoin()],undefined, this.getProjectionSpecial(), {'created':-1}, pageIndex, itemsPerPage);
	}
	async getApprovedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {

		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['enabled'] = true;
		query['stages'] = {$elemMatch: {id:stageId}};
		query['votes'] = {$elemMatch: {userId:userId, stageId:stageId, value:1}};
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}

		const queryToCount = {query: {userId:userId, flowId:flowId, stageId:stageId, value:1, enabled:true}, collectionName: 'votes'};

		return await this.getManyComplete(query, [this.getVotesLookupJoin(userId, flowId, stageId), this.getUserLookupJoin()], queryToCount, this.getProjectionSpecial(), {'created':-1}, pageIndex, itemsPerPage);

	}
	async getRejectedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['enabled'] = true;
		query['stages'] = {$elemMatch: {id:stageId}};
		query['votes'] = {$elemMatch: {userId:userId, stageId:stageId, value:-1}};
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		if(!sort)
		{
			sort = [['created', -1]];
		}
		const queryToCount = {query: {userId:userId, flowId:flowId, stageId:stageId, value:-1, enabled:true}, collectionName: 'votes'};

		return await this.getManyComplete(query, [this.getVotesLookupJoin(userId, flowId, stageId), this.getUserLookupJoin()], queryToCount, this.getProjectionSpecial(), {'created':-1}, pageIndex, itemsPerPage);
	}
	async getLatestPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stageId'] = stageId;
		query['enabled'] = true;
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		sort = [['created', -1]];

		return await this.getManyComplete(query, [this.getVotesLookupJoin(userId, flowId, stageId), this.getBookmarksLookupJoin(userId), this.getUserLookupJoin()],undefined, this.getProjectionComplete(), {'created':-1}, pageIndex, itemsPerPage);

	}
	async getPopularPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stageId'] = stageId;
		query['enabled'] = true;
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		sort = [['totals.totalpositive',-1]];
		
		return await this.getManyComplete(query, [this.getVotesLookupJoin(userId, flowId, stageId), this.getBookmarksLookupJoin(userId), this.getUserLookupJoin()],undefined, this.getProjectionComplete(), {'created':-1}, pageIndex, itemsPerPage);
	}
	async getVotedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, onlyWithVoteValue: number, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stageId'] = stageId;
		query['enabled'] = true;
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

		const queryToCount = {query: {userId:userId, flowId:flowId, stageId:stageId, enabled:true}, collectionName: 'votes'};

		return await this.getManyComplete(query, [this.getVotesLookupJoin(userId, flowId, stageId), this.getBookmarksLookupJoin(userId), this.getUserLookupJoin()], queryToCount, this.getProjectionComplete(), {'created':-1}, pageIndex, itemsPerPage);
	}
	async getFavedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stageId'] = stageId;
		query['enabled'] = true;
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		
		query['bookmarks'] = {$elemMatch: {userId:userId, markType: 'fav', enabled: true}};

		if(!sort)
		{
			sort = [['created', -1]];
		}

		const queryToCount = {query: {userId:userId, markType: 'fav', enabled: true}, collectionName: 'bookmarks'};

		return await this.getManyComplete(query, [this.getVotesLookupJoin(userId, flowId, stageId), this.getBookmarksLookupJoin(userId), this.getUserLookupJoin()], queryToCount, this.getProjectionComplete(), {'created':-1}, pageIndex, itemsPerPage);
	}

	async getSavedPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, sort: [string, 1 | -1][], pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<PostModel>> {
		const query = {} as {[x: string]: unknown;};
		query['orgaId'] = orgaId;
		query['flowId'] = flowId;
		query['stageId'] = stageId;
		query['enabled'] = true;
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}
		
		query['bookmarks'] = {$elemMatch: {userId:userId, markType: 'save', enabled: true}};

		if(!sort)
		{
			sort = [['created', -1]];
		}

		const queryToCount = {query: {userId:userId, markType: 'save', enabled: true}, collectionName: 'bookmarks'};

		return await this.getManyComplete(query, [this.getVotesLookupJoin(userId, flowId, stageId), this.getBookmarksLookupJoin(userId), this.getUserLookupJoin()], queryToCount, this.getProjectionComplete(), {'created':-1}, pageIndex, itemsPerPage);
	}

	async getByIdBasic(postId: string): Promise<ModelContainer<PostModel>> {

		return await this.collection.getOneWithOptions({_id:postId}, {projection: this.getProjectionBasic()});
	}	

	async getById(postId: string): Promise<ModelContainer<PostModel>> {

		return await this.getOneComplete({_id:postId}, [this.getUserLookupJoin()], this.getProjectionBasic());
	}
	async getByIdWithUser(postId: string, userId: string, flowId: string, stageId: string): Promise<ModelContainer<PostModel>> {

		return await this.getOneComplete({_id:postId}, [this.getVotesLookupJoin(userId, flowId, stageId), this.getBookmarksLookupJoin(userId), this.getUserLookupJoin()], this.getProjectionComplete());

	}
	async getByQueryOut(postId: string, flowId: string, stageId: string, queryOut: { [x: string]: unknown; }): Promise<ModelContainer<PostModel>> {
		queryOut['_id'] = postId;
		queryOut['stageId'] = stageId;
		queryOut['flowId'] = flowId;

		return await this.getOneComplete(queryOut, [this.getUserLookupJoin()], this.getProjectionBasic());
	}

	public get dbcollection(): MongoWrapper<PostModel> {
		return this.collection;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>{
		return await this.collection.getManyWithOptions<PostModel>(query, {projection: this.getProjectionBasic()}, sort, pageIndex, itemsPerPage);
	}
	async getManyWithOptions(query: object, options: object | undefined, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>{
		return await this.collection.getManyWithOptions<PostModel>(query, options, sort, pageIndex, itemsPerPage);
	}

	async setSpecialTotalItems(collectionName:string, queryToCount: object): Promise<number> {
		return await this.collection.db.collection(collectionName).count(queryToCount);
	}

	async getManyComplete(query: object, lookups:object[], queryToCount: {query: object, collectionName:string} | undefined, projection: object | undefined, sort: { [x: string]: 1 | -1; }, pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>{

		const limit: number = (itemsPerPage == undefined ? 10 : itemsPerPage);
		const skip: number = (pageIndex == undefined ? 1 : pageIndex - 1) * limit;
		
		let totalItems:number | undefined=0;

		if(queryToCount == undefined)
		{
			totalItems = await this.collection.setTotalItems(pageIndex, totalItems, query);
		}
		else
		{
			totalItems = await this.setSpecialTotalItems(queryToCount.collectionName, queryToCount.query);
		}

		const pipeline:object[] = [];

		for (let i = 0; i < lookups.length; i++) {
			pipeline.push(lookups[i]);
		}

		pipeline.push({$match:query});
		pipeline.push({$project:projection});
		pipeline.push({$sort:sort});
		pipeline.push({$skip:skip});
		pipeline.push({$limit:limit});



		const result = await this.collection.db.collection(this.collection.collectionName).aggregate<PostModel>(pipeline).toArray();

		const startIndex = ((pageIndex == undefined ? 1 : pageIndex - 1) * limit) + 1;
		const totalPages = parseInt(Math.ceil((totalItems == undefined ? 1 : totalItems) / limit).toString());

		const contains_many = this.collection.createModelContainer<PostModel>(result, itemsPerPage, pageIndex, startIndex, totalItems, totalPages);

		return contains_many;
	}	
	async getOne(query: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.getOneWithOptions(query, {projection: this.getProjectionBasic()});
	}
	async getOneWithOptions(query: object, options: object | undefined): Promise<ModelContainer<PostModel>>{
	
		return await this.collection.getOneWithOptions(query, options);
	}
	async getOneComplete(query: object, lookups:object[], projection: object | undefined): Promise<ModelContainer<PostModel>>{
	
		const result = await this.collection.db.collection(this.collection.collectionName).aggregate<PostModel>([
			lookups
			,{$match:query}, {$project:projection}]).toArray();

		const contains_one = ModelContainer.fromOneItem(result[0]);

		return contains_one;
	}
	async add(post: PostModel) : Promise<ModelContainer<PostModel>>{
		post = this.setId(post);
		return await this.collection.add(post).then(() => this.getByIdBasic(post.id));
	}
	async update(id: string, post: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.update(id, post).then(() => this.getByIdBasic(id));
	}
	async updateDirect(id: string, post: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.updateDirect(id, post).then(() => this.getByIdBasic(id));
	}	
	async updateArray(id: string, post: object, arrayFilters: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.updateArray(id, post, arrayFilters).then(() => this.getByIdBasic(id));
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