import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { PostRepository } from '../../repositories/post_repository';

export interface EnablePostUseCase {
    execute(postId:string, userId:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>>;
}

export class EnablePost implements EnablePostUseCase {
	repository: PostRepository;
	constructor(repository: PostRepository) {
		this.repository = repository;
	}

	async execute(postId:string, userId:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>> {
		return await this.repository.enablePost(postId, userId, enableOrDisable);
	}
}