import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { CommentRepository } from '../../domain/repositories/comment_repository';
import { CommentDataSource } from '../datasources/comment_data_source';
import { CommentModel } from '../models/workflow/comment_model';
import { PostDataSource } from '../datasources/post_data_source';

export class CommentRepositoryImpl implements CommentRepository {
	dataSource: CommentDataSource;
	postDataSource: PostDataSource;
	constructor(dataSource: CommentDataSource, postDataSource: PostDataSource){
		this.dataSource = dataSource;
		this.postDataSource = postDataSource;
	}
	async getComments(postId: string, params: { [x: string]: unknown; }, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<CommentModel>>> {
		try
		{
			const result = await this.dataSource.getByPost(postId, sort, pageIndex, itemsPerPage);
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
	async addComment(userId: string, postId: string, text: string): Promise<Either<Failure, ModelContainer<CommentModel>>> {
		try{
			const comment = new CommentModel('', userId, postId, text, true, false);
			const result = await this.dataSource.add(comment);
			if(result.currentItemCount > 0
			){
				await this.postDataSource.updateBookmarksTotals(postId, 'comment', 1);
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
	async deleteComment(commentId: string, userId: string, postId:string): Promise<Either<Failure, boolean>> {
		try{
			const result = await this.dataSource.delete(commentId, userId);

			if(result)
			{
				await this.postDataSource.updateBookmarksTotals(postId, 'comment', -1);
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
}