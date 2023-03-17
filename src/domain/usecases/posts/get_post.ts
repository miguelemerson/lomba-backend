import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/workflow/post';
import { PostRepository } from '../../repositories/post_repository';

export interface GetPostUseCase {
    execute(postId:string): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class GetPost implements GetPostUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(postId:string): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.getPost(postId);
	}
}