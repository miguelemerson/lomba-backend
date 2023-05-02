import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Bookmark } from '../entities/workflow/bookmark';

export interface BookmarkRepository {
    giveMark(userId: string, postId: string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', giveOrTakeAway: boolean): Promise<Either<Failure, ModelContainer<Bookmark>>>;
}