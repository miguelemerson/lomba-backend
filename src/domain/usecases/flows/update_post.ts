import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/flows/post';
import { PostRepository } from '../../repositories/post_repository';
import { TextContent } from '../../entities/flows/textcontent';

export interface UpdatePostUseCase {
    execute(postId: string, userId: string, stageId: string, title: string, textContent: TextContent): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class UpdatePost implements UpdatePostUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(postId: string, userId: string, stageId: string, title: string, textContent: TextContent): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.updatePost(postId, userId, stageId, title, textContent);
	}
}