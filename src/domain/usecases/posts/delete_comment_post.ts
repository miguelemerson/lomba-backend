import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { CommentRepository } from '../../repositories/comment_repository';

export interface DeleteCommentPostUseCase {
    execute(commentId: string, userId: string): Promise<Either<Failure,boolean>>;
}

export class DeleteCommentPost implements DeleteCommentPostUseCase {
	repository: CommentRepository;
	constructor(repository: CommentRepository) {
		this.repository = repository;
	}

	async execute(commentId: string, userId: string): Promise<Either<Failure,boolean>> {
		return await this.repository.deleteComment(commentId, userId);
	}
}