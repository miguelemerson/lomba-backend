import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/workflow/post';
import { PostRepository } from '../../repositories/post_repository';

export interface DeletePostUseCase {
    execute(postId: string, userId: string): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class DeletePost implements DeletePostUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(postId: string, userId: string): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.deletePost(postId, userId);
	}
}