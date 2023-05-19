import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/workflow/post';
import { PostRepository } from '../../repositories/post_repository';

export interface GetPostWithUserUseCase {
    execute(postId:string, userId: string, flowId:string, stageId:string): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class GetPostWithUser implements GetPostWithUserUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(postId:string, userId: string, flowId:string, stageId:string): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.getPostWithUser(postId, userId, flowId, stageId);
	}
}