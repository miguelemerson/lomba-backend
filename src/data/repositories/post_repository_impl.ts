import { MongoError } from 'mongodb';
import { BoxPages } from '../../core/box_page';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { ImageContent } from '../../domain/entities/workflow/imagecontent';
import { Post } from '../../domain/entities/workflow/post';
import { PostItem } from '../../domain/entities/workflow/postitem';
import { Stage } from '../../domain/entities/workflow/stage';
import { TextContent } from '../../domain/entities/workflow/textcontent';
import { Total } from '../../domain/entities/workflow/total';
import { Track } from '../../domain/entities/workflow/track';
import { VideoContent } from '../../domain/entities/workflow/videocontent';
import { Vote } from '../../domain/entities/workflow/vote';
import { PostRepository } from '../../domain/repositories/post_repository';
import { FlowDataSource } from '../datasources/flow_data_source';
import { PostDataSource } from '../datasources/post_data_source';
import { StageDataSource } from '../datasources/stage_data_source';
import { PostModel } from '../models/workflow/post_model';
import { TotalModel } from '../models/workflow/total_model';
import { VoteDataSource } from '../datasources/vote_data_source';
import { VoteModel } from '../models/workflow/vote_model';
import { SourceContent } from '../../domain/entities/workflow/sourcecontent';

export class PostRepositoryImpl implements PostRepository {
	dataSource: PostDataSource;
	stageDataSource: StageDataSource;
	flowDataSource: FlowDataSource;
	voteDataSource: VoteDataSource;
	constructor(dataSource: PostDataSource, stageDataSource: StageDataSource, flowDataSource: FlowDataSource, voteDataSource: VoteDataSource){
		this.dataSource = dataSource;
		this.stageDataSource = stageDataSource;
		this.flowDataSource = flowDataSource;
		this.voteDataSource = voteDataSource;
	}
	
	async getPost(postId: string): Promise<Either<Failure, ModelContainer<Post>>> {
		try{
			const result = await this.dataSource.getById(postId);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}
	async getPostWithUser(postId: string, userId: string, flowId: string, stageId: string): Promise<Either<Failure, ModelContainer<Post>>> {
		try{
			const result = await this.dataSource.getByIdWithUser(postId, userId, flowId, stageId);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}
	async enablePost(postId: string, userId: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>> {
		try{
			const result = await this.dataSource.enable(postId, enableOrDisable);
			if(result)
			{
				await this.dataSource.addTrack(enableOrDisable ? 'enabled' : 'disabled', enableOrDisable ? 'Habilita publicación': 'Deshabilita publicación', postId, userId, '', '', '', {'enabled' : enableOrDisable});
			}
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}
	async changeStage(postId: string, userId:string, flowId: string, stageId: string): Promise<Either<Failure, ModelContainer<Post>>> {
		try{

			const resultPost = await this.dataSource.getById(postId);
			const resultStage = await this.stageDataSource.getById(stageId);
			const postStages = resultPost.items[0].stages;
			let newStages:Stage[] = [];
			
			postStages.forEach((stage: Stage) => {
				if(stage.order < resultStage.items[0].order)
				{
					newStages.push(stage);
				}
			});

			newStages.push(resultStage.items[0]);

			newStages = newStages.sort((a: Stage, b: Stage) => a.order - b.order);

			const result = await this.dataSource.update(postId, {stageId:stageId,stages: newStages});

			if(result)
			{
				await this.dataSource.addTrack('changestage', 'Cambio de etapa a ' + resultStage.items[0].name, postId, userId, flowId, '', stageId, {stageId:stageId});

				const resulupd = await this.dataSource.getById(postId);
				return Either.right(resulupd);
			}

			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}

	async getPosts(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, searchText: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			if (boxPage == BoxPages.uploadedPosts) {

				if(!sort)
				{
					sort = [['created', -1]];
				}

				const result = await this.dataSource.getUploadedPosts(orgaId, userId, flowId, stageId, searchText, (params['isdraft'] as string).toString() == 'true', sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.forApprovePosts) {

				if(!sort)
				{
					sort = [['created', -1]];
				}				

				const result = await this.dataSource.getForApprovePosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.approvedPosts) {
				if(!sort)
				{
					sort = [['created', -1]];
				}
				
				const result = await this.dataSource.getApprovedPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.rejectedPosts) {
				if(!sort)
				{
					sort = [['created', -1]];
				}

				const result = await this.dataSource.getRejectedPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.latestPosts) {
				sort = [['created',-1]];

				const result = await this.dataSource.getLatestPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.popularPosts) {
				sort = [['totals.totalpositive',-1]];

				const result = await this.dataSource.getPopularPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);			
				return Either.right(result);	
			}
			if (boxPage == BoxPages.votedPosts) {
				if(!sort)
				{
					sort = [['created', -1]];
				}
				const onlyWithVote = (params['voteState'] as string).toString() == '1' || (params['voteState'] as string).toString() == '-1' ? parseInt((params['voteState'] as string).toString()) : 0;

				const result = await this.dataSource.getVotedPosts(orgaId, userId, flowId, stageId, searchText, onlyWithVote, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.favedPosts) {
				if(!sort)
				{
					sort = [['created', -1]];
				}
				
				const result = await this.dataSource.getFavedPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.savedPosts) {
				if(!sort)
				{
					sort = [['created', -1]];
				}
				
				const result = await this.dataSource.getSavedPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}			
		
			return Either.left(new GenericFailure('no boxpage found'));		
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async addTextPost(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, draft: boolean): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const resultFlow = await this.flowDataSource.getById(flowId);
			
			if(resultFlow.currentItemCount > 0)
			{
				const firstStage = resultFlow.items[0].stages.filter(e=> e.order == 1)[0];

				const postItem = {order:1, content: textContent, type:'text', format:'', builtIn:false, created: new Date()} as PostItem;

				const postItems:PostItem[] = [postItem];
				let postStageId = firstStage.id;

				const post = new PostModel('', postItems, title, orgaId, userId, flowId, postStageId, true, false);

				const listStages:Stage[] = [];
				const listVotes:Vote[] = [];
				const listTotals:Total[] = [];
				const listTracks:Track[] = [];

				listStages.push(firstStage);

				//Track de entrada
				const track = {
					name: 'new',
					description: `Se crea en ${firstStage.name}`,
					userId: userId,
					flowId: flowId,
					stageIdNew: postStageId,
					change: {},
					created: new Date(),
				} as unknown as Track;

				listTracks.push(track);

				if(!draft)
				{
					const vote = {  
						flowId:flowId,
						stageId:postStageId,
						userId:userId,
						key: `${userId}-${postStageId}-${flowId}`,
						value:1, created: new Date()} as Vote;
					listVotes.push(vote);

					const newTotal:TotalModel = new TotalModel(1, 0, 1, flowId, postStageId);

					listTotals.push(newTotal);

					const secondStage = resultFlow.items[0].stages.filter(e=> e.order == firstStage.order + 1)[0];

					postStageId = secondStage.id;
					listStages.push(secondStage);

					//Track de publicación a aprobación
					const track2 = {
						name: 'goforward',
						description: `Avanza a ${secondStage.name}`,
						userId: userId,
						flowId: flowId,
						stageIdOld: track.stageIdNew,
						stageIdNew: postStageId,
						change: {},
						created: new Date(),
					} as unknown as Track;

					listTracks.push(track2);

				}

				const resultAddPost = await this.dataSource.add(post);

				if(resultAddPost.currentItemCount > 0)
				{
					const changes:object = {postitems:postItems, stageId:postStageId, stages:listStages, votes:listVotes, totals: listTotals, tracks: listTracks};

					const resultUpdatePost = await this.dataSource.update(resultAddPost.items[0].id, changes);

					return Either.right(resultUpdatePost);	
				}
			}

			return Either.left(new GenericFailure('undetermined'));
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async addMultiPost(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent | undefined, imageContent: ImageContent | undefined, videoContent: VideoContent | undefined, sourcesContent: SourceContent[] | undefined, categoryNames:string[], draft: boolean): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			if(textContent == undefined && imageContent == undefined && videoContent == undefined)
			{
				return Either.left(new GenericFailure('none', 'no content'));
			}

			const resultFlow = await this.flowDataSource.getById(flowId);
			
			if(resultFlow.currentItemCount > 0)
			{
				const firstStage = resultFlow.items[0].stages.filter(e=> e.order == 1)[0];

				const postItems:PostItem[] = [];
				let order = 1;
				if(textContent != undefined)
				{
					const postItem1 = {order:order, content: textContent, type:'text', format:'text/plain', builtIn:false, created: new Date()} as PostItem;
					postItems.push(postItem1);
					order++;
				}
				if(imageContent != undefined)
				{
					const postItem2 = {order:order, content: imageContent, type:'image', format:imageContent.filetype, builtIn:false, created: new Date()} as PostItem;
					postItems.push(postItem2);
					order++;
				}
				if(videoContent != undefined)
				{
					const postItem3 = {order:order, content: videoContent, type:'video', format:videoContent.filetype, builtIn:false, created: new Date()} as PostItem;
					postItems.push(postItem3);
					order++;
				}
				if(sourcesContent != undefined)
				{
					sourcesContent.forEach((source: SourceContent) => {
						const postItem4 = {order:order, content: source, type:'source', format:'url', builtIn:false, created: new Date()} as PostItem;
						postItems.push(postItem4);
						order++;
					});
				}
				
				let postStageId = firstStage.id;

				const post = new PostModel('', postItems, title, orgaId, userId, flowId, postStageId, true, false);

				const listStages:Stage[] = [];
				const listVotes:VoteModel[] = [];
				const listTotals:Total[] = [];
				const listTracks:Track[] = [];

				listStages.push(firstStage);

				//Track de entrada
				const track = {
					name: 'new',
					description: `Se crea en ${firstStage.name}`,
					userId: userId,
					flowId: flowId,
					stageIdNew: postStageId,
					change: {},
					created: new Date(),
				} as unknown as Track;

				listTracks.push(track);


				if(!draft)
				{
					const vote = new VoteModel('', userId, '', flowId, postStageId, `${userId}-${postStageId}-${flowId}`, 1, true, false);

					/*
					const vote = {  
						flowId:flowId,
						stageId:postStageId,
						userId:userId,
						key: `${userId}-${postStageId}-${flowId}`,
						value:1, created: new Date()} as Vote;
					*/

					listVotes.push(vote);

					const newTotal:TotalModel = new TotalModel(1, 0, 1, flowId, postStageId);

					listTotals.push(newTotal);

					const secondStage = resultFlow.items[0].stages.filter(e=> e.order == firstStage.order + 1)[0];

					postStageId = secondStage.id;
					listStages.push(secondStage);

					//Track de publicación a aprobación
					const track2 = {
						name: 'goforward',
						description: `Avanza a ${secondStage.name}`,
						userId: userId,
						flowId: flowId,
						stageIdOld: track.stageIdNew,
						stageIdNew: postStageId,
						change: {},
						created: new Date(),
					} as unknown as Track;

					listTracks.push(track2);

				}

				const resultAddPost = await this.dataSource.add(post);

				if(resultAddPost.currentItemCount > 0)
				{
					if(listVotes.length > 0)
					{
						listVotes[0].postId = resultAddPost.items[0].id;
						await this.voteDataSource.add(listVotes[0]);
					}
					const changes:object = {postitems:postItems, stageId:postStageId, stages:listStages, votes:listVotes, totals: listTotals, tracks: listTracks, categoryNames: categoryNames};

					const resultUpdatePost = await this.dataSource.update(resultAddPost.items[0].id, changes);

					return Either.right(resultUpdatePost);	
				}
			}

			return Either.left(new GenericFailure('undetermined'));
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async updatePost(postId: string, userId: string, title: string, textContent: TextContent | undefined, imageContent: ImageContent | undefined, videoContent: VideoContent | undefined, sourcesContent: SourceContent[] | undefined, categoryNames:string[]): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const resultPost = await this.dataSource.getById(postId);

			if(resultPost.currentItemCount > 0) {
				const newPostItemList:PostItem[] = [];
				let order = 1;

				if(textContent != undefined) {
					newPostItemList.push({order:order, content: textContent, type:'text', format:'text', builtIn:false, created: new Date()} as PostItem);
					order++;
				}
				if(imageContent != undefined) {
					newPostItemList.push({order:order, content: imageContent, type:'image', format:imageContent.filetype, builtIn:false, created: new Date()} as PostItem);
					order++;
				}
				if(videoContent != undefined) {
					newPostItemList.push({order:order, content: videoContent, type:'video', format:videoContent.filetype, builtIn:false, created: new Date()} as PostItem);
					order++;
				}
				if(sourcesContent != undefined)
				{
					sourcesContent.forEach((source: SourceContent) => {
						const postItem4 = {order:order, content: source, type:'source', format:'url', builtIn:false, created: new Date()} as PostItem;
						newPostItemList.push(postItem4);
						order++;
					});
				}

				const resultUpdate = await this.dataSource.update(resultPost.items[0].id, {title: title, postitems: newPostItemList, categoryNames: categoryNames});

				if(resultUpdate.currentItemCount > 0) {

					await this.dataSource.addTrack('update', 'Modifica publicación', postId, userId, '','','',{title: title, postitems: newPostItemList});

					return Either.right(resultUpdate);
				} else {
					return Either.left(new GenericFailure('no se realizó actualización'));
				}
			}

			return Either.left(new GenericFailure('undetermined'));
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async deletePost(postId: string, userId: string): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const resultPost = await this.dataSource.getById(postId);

			if(resultPost.currentItemCount > 0) {

				const resultDelete = await this.dataSource.delete(resultPost.items[0].id);

				if(resultDelete) {
					return Either.right(resultPost);
				} else {
					return Either.left(new GenericFailure('no se realizó la eliminación'));
				}
			}

			return Either.left(new GenericFailure('undetermined'));
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async getAdminViewPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			if(!sort)
			{
				sort = [['created', -1]];
			}
			const onlyEnabledOrDisabled = (params['postEnabled']==undefined || params['postEnabled'] == '0') ? undefined : (params['postEnabled'] as string).toString() == '1' ? true : false;

			const result = await this.dataSource.getAdminViewPosts(orgaId, userId, flowId, stageId, searchText, sort, onlyEnabledOrDisabled, pageIndex, itemsPerPage);

			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}
}