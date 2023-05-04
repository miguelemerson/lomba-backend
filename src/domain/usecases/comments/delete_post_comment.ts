import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { CommentRepository } from '../../repositories/comment_repository';

export interface DeletePostCommentUseCase {
    execute(commentId: string, userId: string, postId:string): Promise<Either<Failure,boolean>>;
}

export class DeletePostComment implements DeletePostCommentUseCase {
	repository: CommentRepository;
	constructor(repository: CommentRepository) {
		this.repository = repository;
	}

	async execute(commentId: string, userId: string, postId:string): Promise<Either<Failure,boolean>> {
		return await this.repository.deleteComment(commentId, userId, postId);
	}
}