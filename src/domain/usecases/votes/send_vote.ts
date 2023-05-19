import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Vote } from '../../entities/workflow/vote';
import { VoteRepository } from '../../repositories/vote_repository';

export interface SendVoteUseCase {
    execute(orgaId:string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure,ModelContainer<Vote>>>;
}

export class SendVote implements SendVoteUseCase {
	repository: VoteRepository;
	constructor(repository: VoteRepository) {
		this.repository = repository;
	}

	async execute(orgaId:string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure,ModelContainer<Vote>>> {
		return await this.repository.sendVote(orgaId, userId, flowId, stageId, postId, voteValue);
	}
}