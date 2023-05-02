import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { CommentRepository } from '../../domain/repositories/comment_repository';
import { CommentDataSource } from '../datasources/comment_data_source';

export class CommentRepositoryImpl implements CommentRepository {
	dataSource: CommentDataSource;
	constructor(dataSource: CommentDataSource){
		this.dataSource = dataSource;
	}
	async addComment(userId: string, postId: string, text: string): Promise<Either<Failure, ModelContainer<Comment>>> {
		throw new Error('Method not implemented.');
	}
	async deleteComment(commentId: string, userId: string): Promise<Either<Failure, boolean>> {
		throw new Error('Method not implemented.');
	}
}