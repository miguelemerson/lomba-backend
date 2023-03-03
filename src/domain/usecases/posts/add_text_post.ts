import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/flows/post';
import { PostRepository } from '../../repositories/post_repository';
import { TextContent } from '../../entities/flows/textcontent';

export interface AddTextPostUseCase {
    execute(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, draft: boolean): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class AddTextPost implements AddTextPostUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, draft: boolean): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.addTextPost(orgaId, userId, flowId, title, textContent, draft);
	}
}