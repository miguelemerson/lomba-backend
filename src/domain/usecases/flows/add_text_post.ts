import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Post } from '../../entities/flows/post';
import { FlowRepository } from '../../repositories/flow_repository';

export interface AddTextPostUseCase {
    execute(orgaId: string, userId: string, flowId: string, title: string, textContent: string, draft: boolean): Promise<Either<Failure,ModelContainer<Post>>>;
}

export class AddTextPost implements AddTextPostUseCase {
	repository: FlowRepository;
	constructor(repository: FlowRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string, userId: string, flowId: string, title: string, textContent: string, draft: boolean): Promise<Either<Failure,ModelContainer<Post>>> {
		return await this.repository.addTextPost(orgaId, userId, flowId, title, textContent, draft);
	}
}