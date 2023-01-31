import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/flows/post';
import { FlowRepository } from '../../repositories/flow_repository';

export interface SendVoteUseCase {
    execute(orgaId: string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class SendVote implements SendVoteUseCase {
	repository: FlowRepository;
	constructor(repository: FlowRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.sendVote(orgaId, userId, flowId, stageId, postId, voteValue);
	}
}