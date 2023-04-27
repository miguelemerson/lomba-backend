import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';

export interface CommentRepository {
    addComment(userId: string, postId: string, text: string): Promise<Either<Failure, ModelContainer<Comment>>>;
    deleteComment(commentId: string, userId:string): Promise<Either<Failure, boolean>>;
}