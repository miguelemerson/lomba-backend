import { MongoError } from 'mongodb';
import { PostRepository } from '../../domain/repositories/post_repository';
import { PostDataSource } from '../datasources/post_data_source';
import { PostModel } from '../models/flows/post_model';
import { ModelContainer } from '../../core/model_container';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { Either } from '../../core/either';
import { Post } from '../../domain/entities/flows/post';
import { BoxPages } from '../../core/box_page';
import { TextContent } from '../../domain/entities/flows/textcontent';
import { Stage } from '../../domain/entities/flows/stage';
import { StageDataSource } from '../datasources/stage_data_source';
import { Vote } from '../../domain/entities/flows/vote';
import { PostItem } from '../../domain/entities/flows/postitem';
import { FlowDataSource } from '../datasources/flow_data_source';

export class PostRepositoryImpl implements PostRepository {
	dataSource: PostDataSource;
	stageDataSource: StageDataSource;
	flowDataSource: FlowDataSource;
	constructor(dataSource: PostDataSource, stageDataSource: StageDataSource, flowDataSource: FlowDataSource){
		this.dataSource = dataSource;
		this.stageDataSource = stageDataSource;
		this.flowDataSource = flowDataSource;
	}

	async getPosts(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, params: {key:string, value:string}[], textSearch: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			params.filter(f => f.value);
			let query = {};
			if (boxPage == BoxPages.uploadedPosts) {
				query = {
					orgaId:orgaId,
					userId:userId,
					flowId:flowId,
					stages: {$elemMatch: {id:stageId}},
					$text: {$search: textSearch},
				};
			}
			if (boxPage == BoxPages.forApprovePosts) {
				query = {
					orgaId:orgaId,
					flowId:flowId,
					stages: {$elemMatch: {id:stageId}},
					$text: {$search: textSearch},
					votes: {$elemMatch: {id:{$ne:userId}}}
				};
			}
			if (boxPage == BoxPages.approvedPosts) {
				query = {
					orgaId:orgaId,
					flowId:flowId,
					stages: {$elemMatch: {id:stageId}},
					$text: {$search: textSearch},
					votes: {$elemMatch: {id:userId, value:1}}
				};
			}
			if (boxPage == BoxPages.rejectedPosts) {
				query = {
					orgaId:orgaId,
					flowId:flowId,
					stages: {$elemMatch: {id:stageId}},
					$text: {$search: textSearch},
					votes: {$elemMatch: {id:userId, value:-1}}
				};
			}
			if (boxPage == BoxPages.latestPosts) {
				query = {
					orgaId:orgaId,
					flowId:flowId,
					stageId:stageId,
					$text: {$search: textSearch}
				};
				sort = [['created',-1]];
			}
			if (boxPage == BoxPages.popularPosts) {
				query = {
					orgaId:orgaId,
					flowId:flowId,
					stageId:stageId,
					$text: {$search: textSearch}
				};
				sort = [['totals.totalpositive',-1]];
			}
			if (boxPage == BoxPages.votedPosts) {
				query = {
					orgaId:orgaId,
					flowId:flowId,
					stages: {$elemMatch: {id:stageId}},
					$text: {$search: textSearch},
					votes: {$elemMatch: {id:userId}}
				};
			}
			const result = await this.dataSource.getMany(query, sort, pageIndex, itemsPerPage);
			
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

	async addTextPost(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, draft: boolean): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{

			const resultFlow = await this.flowDataSource.getOne({id:flowId});
			
			if(resultFlow.currentItemCount > 0)
			{
				const firstStage = resultFlow.items[0].stages.filter(e=> e.order = 1)[0];

				const postItem = {order:1, content: textContent, type:'text', format:'', builtIn:false, created: new Date()} as PostItem;

				const postItems:PostItem[] = [postItem];
				let postStageId = firstStage.id;

				const post = new PostModel('', postItems, title, orgaId, userId, flowId, postStageId, true, false);

				const listStages:Stage[] = [];
				const listVotes:Vote[] = [];


				listStages.push(firstStage);
				
				if(!draft)
				{
					const vote = {  
						flowId:flowId,
						stageId:postStageId,
						userId:userId,
						value:1, created: new Date()} as Vote;
					listVotes.push(vote);

					const secondStage = resultFlow.items[0].stages.filter(e=> e.order = firstStage.order + 1)[0];

					postStageId = secondStage.id;
					listStages.push(secondStage);
				}

				const resultAddPost = await this.dataSource.add(post);
				if(resultAddPost.currentItemCount > 0)
				{
					const resultUpdatePost = await this.dataSource.update(resultAddPost.items[0].id, {postitems:postItems, stageId:postStageId, stages:listStages, votes:listVotes});

					return Either.right(resultUpdatePost);	
				}
			}

			/* MODO ADD
			if(resultFlow.currentItemCount > 0)
			{
				const firstStage = resultFlow.items[0].stages.filter(e=> e.order = 1)[0];

				const postItem = {order:1, content: textContent, type:'text', format:'', builtIn:false, created: new Date()} as PostItem;
				const postItems:PostItem[] = [postItem];
				const firstStageId = firstStage.id;
				const post = new PostModel('', postItems, title, orgaId, userId, flowId, firstStageId, true, false);

				post.stages.push(firstStage);

				if(!draft)
				{
					const vote = {  
						flowId:flowId,
						stageId:firstStageId,
						userId:userId,
						value:1, created: new Date()} as Vote;

					post.votes.push(vote);

					const secondStage = resultFlow.items[0].stages.filter(e=> e.order = firstStage.order + 1)[0];

					post.stageId = secondStage.id;
					post.stages.push(secondStage);
				}

				const resultPost = await this.dataSource.add(post);
				return Either.right(resultPost);	

			}
*/
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

	async sendVote(orgaId: string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			//COMPLETAR
			const resultPost = await this.dataSource.getOne({id: postId});
			
			if (resultPost.currentItemCount > 0) {

				const newVote = {  
					flowId:flowId,
					stageId:stageId,
					userId:userId,
					value:voteValue, 
					created: new Date()} as Vote;
	
				const result = await this.dataSource.update(postId, { $push: { votes: newVote}});
				
				return Either.right(result);
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

}