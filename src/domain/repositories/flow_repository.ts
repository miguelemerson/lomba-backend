import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Post } from '../entities/flows/post';

export interface FlowRepository {
    getPosts(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, textSearch: string, sort?: [string, 1 | -1][], pageIndex?: number, itemsPerPage?: number): Promise<Either<Failure, ModelContainer<Post>>>;
    addTextPost(orgaId: string, userId: string, flowId: string, title: string, textContent: string, draft: boolean): Promise<Either<Failure, ModelContainer<Post>>>;
    sendVote(orgaId: string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure, ModelContainer<Post>>>;
}