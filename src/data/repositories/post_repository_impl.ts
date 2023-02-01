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

export class PostRepositoryImpl implements PostRepository {
	dataSource: PostDataSource;
	constructor(dataSource: PostDataSource){
		this.dataSource = dataSource;
	}

	async getPosts(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, textSearch: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
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
			//COMPLETAR
			//¿asignar etapa
			//asignar etapa a la lista de etapas
			//qué hacer con el draft?
			if(!draft) {
				
				//const post: PostModel = new PostModel(orgaId, userId, flowId, title, textContent);
			} else {
				let stage: Stage[];
				stage;
			}
			const post: PostModel = new PostModel(orgaId, userId, flowId, title, textContent);
			const result = await this.dataSource.add(post);
			
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

	async sendVote(orgaId: string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			//COMPLETAR
			const result = await this.dataSource;
			
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