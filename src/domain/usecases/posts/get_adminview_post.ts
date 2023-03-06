import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/workflow/post';
import { PostRepository } from '../../repositories/post_repository';

export interface GetAdminViewPostsUseCase {
    execute(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class GetAdminViewPosts implements GetAdminViewPostsUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.getAdminViewPosts(orgaId, userId, flowId, stageId, searchText, params, sort, pageIndex, itemsPerPage);
	}
}