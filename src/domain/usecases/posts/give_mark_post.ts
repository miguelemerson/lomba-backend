import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Bookmark } from '../../entities/workflow/bookmark';
import { BookmarkRepository } from '../../repositories/bookmark_repository';

export interface GiveMarkPostUseCase {
    execute(userId: string, postId: string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', giveOrTakeAway: boolean): Promise<Either<Failure,ModelContainer<Bookmark>>>;
}

export class GiveMarkPost implements GiveMarkPostUseCase {
	repository: BookmarkRepository;
	constructor(repository: BookmarkRepository) {
		this.repository = repository;
	}

	async execute(userId: string, postId: string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', giveOrTakeAway: boolean): Promise<Either<Failure,ModelContainer<Bookmark>>> {
		return await this.repository.giveMark(userId, postId, markType, giveOrTakeAway);
	}
}