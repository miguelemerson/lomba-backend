import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Bookmark } from '../../domain/entities/workflow/bookmark';
import { BookmarkRepository } from '../../domain/repositories/bookmark_repository';
import { BookmarkDataSource } from '../datasources/bookmark_data_source';
import { PostDataSource } from '../datasources/post_data_source';

export class BookmarkRepositoryImpl implements BookmarkRepository {
	dataSource: BookmarkDataSource;
	postDataSource: PostDataSource;
	constructor(dataSource: BookmarkDataSource, postDataSource: PostDataSource){
		this.dataSource = dataSource;
		this.postDataSource = postDataSource;
	}
    
	async giveMark(userId: string, postId: string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', giveOrTakeAway: boolean): Promise<Either<Failure, ModelContainer<Bookmark>>> {
		try
		{
			const result = await this.dataSource.upsert(userId, postId, markType, giveOrTakeAway);

			await this.postDataSource.updateBookmarksTotals(postId, markType, giveOrTakeAway ? 1 : -1);

			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
			
		}

	}
}