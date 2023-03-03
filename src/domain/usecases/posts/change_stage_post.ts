import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/flows/post';
import { PostRepository } from '../../repositories/post_repository';

export interface ChangeStagePostUseCase {
    execute(postId:string, flowId: string, stageId:string): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class ChangeStagePost implements ChangeStagePostUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(postId:string, flowId:string, stageId:string): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.changeStage(postId, flowId, stageId);
	}
}