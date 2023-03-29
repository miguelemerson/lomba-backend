import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/workflow/post';
import { PostRepository } from '../../repositories/post_repository';
import { TextContent } from '../../entities/workflow/textcontent';
import { ImageContent } from '../../entities/workflow/imagecontent';
import { VideoContent } from '../../entities/workflow/videocontent';

export interface AddMultiPostUseCase {
    execute(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent | undefined, imageContent: ImageContent | undefined, videoContent: VideoContent | undefined, draft: boolean): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class AddMultiPost implements AddMultiPostUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent | undefined, imageContent: ImageContent | undefined, videoContent: VideoContent | undefined, draft: boolean): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.addMultiPost(orgaId, userId, flowId, title, textContent, imageContent, videoContent, draft);
	}
}