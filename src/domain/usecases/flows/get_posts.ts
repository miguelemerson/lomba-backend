import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/flows/post';
import { PostRepository } from '../../repositories/post_repository';

export interface GetPostsUseCase {
    execute(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, params: {key:string, value:string}[], textSearch: string): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class GetPosts implements GetPostsUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, params: {key:string, value:string}[], textSearch: string): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.getPosts(orgaId, userId, flowId, stageId, boxPage, params, textSearch);
	}
}