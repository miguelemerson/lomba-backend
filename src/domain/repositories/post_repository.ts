import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { ImageContent } from '../entities/workflow/imagecontent';
import { Post } from '../entities/workflow/post';
import { TextContent } from '../entities/workflow/textcontent';
import { VideoContent } from '../entities/workflow/videocontent';

export interface PostRepository {
    getPosts(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, searchText: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>>;
    addTextPost(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, draft: boolean): Promise<Either<Failure, ModelContainer<Post>>>;
    updatePost(postId: string, userId: string, title: string, textContent: TextContent): Promise<Either<Failure, ModelContainer<Post>>>;
    deletePost(postId: string, userId: string): Promise<Either<Failure, ModelContainer<Post>>>;
    enablePost(postId: string, userId:string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
    changeStage(postId:string, userId:string, flowId: string, stageId:string): Promise<Either<Failure, ModelContainer<Post>>>;
    getAdminViewPosts(orgaId: string, userId: string, flowId: string, stageId: string, searchText: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>>;
    getPost(postId:string): Promise<Either<Failure, ModelContainer<Post>>>;
    getPostWithUser(postId:string, userId: string, flowId: string, stageId: string): Promise<Either<Failure, ModelContainer<Post>>>;
    addMultiPost(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent | undefined, imageContent: ImageContent | undefined, videoContent: VideoContent | undefined, draft: boolean): Promise<Either<Failure, ModelContainer<Post>>>;
}