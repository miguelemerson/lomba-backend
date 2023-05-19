import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { CommentModel } from '../../../data/models/workflow/comment_model';
import { CommentRepository } from '../../repositories/comment_repository';

export interface GetPostCommentsUseCase {
    execute(postId: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure,ModelContainer<CommentModel>>>;
}

export class GetPostComments implements GetPostCommentsUseCase {
	repository: CommentRepository;
	constructor(repository: CommentRepository) {
		this.repository = repository;
	}

	async execute(postId: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure,ModelContainer<CommentModel>>> {
		return await this.repository.getComments(postId, params, sort, pageIndex, itemsPerPage);
	}
}