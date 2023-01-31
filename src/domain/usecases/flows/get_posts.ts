import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/flows/post';
import { FlowRepository } from '../../repositories/flow_repository';

export interface GetPostsUseCase {
    execute(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, textSearch: string): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class GetPosts implements GetPostsUseCase {
	repository: FlowRepository;
	constructor(repository: FlowRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, textSearch: string): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.getPosts(orgaId, userId, flowId, stageId, boxPage, textSearch);
	}
}