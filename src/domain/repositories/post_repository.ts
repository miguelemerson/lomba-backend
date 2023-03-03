import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Post } from '../entities/flows/post';
import { TextContent } from '../entities/flows/textcontent';

export interface PostRepository {
    getPosts(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, searchText: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>>;
    addTextPost(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, draft: boolean): Promise<Either<Failure, ModelContainer<Post>>>;
    sendVote(orgaId:string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure, ModelContainer<Post>>>;
    updatePost(postId: string, userId: string, stageId: string, title: string, textContent: TextContent): Promise<Either<Failure, ModelContainer<Post>>>;
    deletePost(postId: string, userId: string): Promise<Either<Failure, ModelContainer<Post>>>;
    enablePost(postId: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
    changeStage(postId:string, flowId: string, stageId:string): Promise<Either<Failure, ModelContainer<Post>>>;
}