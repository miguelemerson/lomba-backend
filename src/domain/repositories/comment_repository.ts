import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { CommentModel } from '../../data/models/workflow/comment_model';

export interface CommentRepository {
    addComment(userId: string, postId: string, text: string): Promise<Either<Failure, ModelContainer<CommentModel>>>;
    deleteComment(commentId: string, userId:string, postId:string): Promise<Either<Failure, boolean>>;
    getComments(postId: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<CommentModel>>>;
}