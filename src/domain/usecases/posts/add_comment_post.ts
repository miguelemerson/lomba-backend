import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { CommentRepository } from '../../repositories/comment_repository';

export interface AddCommentPostUseCase {
    execute(userId: string, postId: string, text: string): Promise<Either<Failure,ModelContainer<Comment>>>;
}

export class AddCommentPost implements AddCommentPostUseCase {
	repository: CommentRepository;
	constructor(repository: CommentRepository) {
		this.repository = repository;
	}

	async execute(userId: string, postId: string, text: string): Promise<Either<Failure,ModelContainer<Comment>>> {
		return await this.repository.addComment(userId, postId, text);
	}
}