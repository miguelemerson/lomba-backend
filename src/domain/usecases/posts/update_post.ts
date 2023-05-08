import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/workflow/post';
import { PostRepository } from '../../repositories/post_repository';
import { TextContent } from '../../entities/workflow/textcontent';
import { ImageContent } from '../../entities/workflow/imagecontent';
import { VideoContent } from '../../entities/workflow/videocontent';

export interface UpdatePostUseCase {
    execute(postId: string, userId: string, title: string, textContent: TextContent | undefined, imageContent: ImageContent | undefined, videoContent: VideoContent | undefined): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class UpdatePost implements UpdatePostUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(postId: string, userId: string, title: string, textContent: TextContent | undefined, imageContent: ImageContent | undefined, videoContent: VideoContent | undefined): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.updatePost(postId, userId, title, textContent, imageContent, videoContent);
	}
}