import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { CommentModel } from '../../../data/models/workflow/comment_model';
import { CommentRepository } from '../../repositories/comment_repository';

export interface AddPostCommentUseCase {
    execute(userId: string, postId: string, text: string): Promise<Either<Failure,ModelContainer<CommentModel>>>;
}

export class AddPostComment implements AddPostCommentUseCase {
	repository: CommentRepository;
	constructor(repository: CommentRepository) {
		this.repository = repository;
	}

	async execute(userId: string, postId: string, text: string): Promise<Either<Failure,ModelContainer<CommentModel>>> {
		return await this.repository.addComment(userId, postId, text);
	}
}