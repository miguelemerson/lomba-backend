import express, { Request, Response } from 'express';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { AddPostCommentUseCase } from '../domain/usecases/comments/add_post_comment';
import { DeletePostCommentUseCase } from '../domain/usecases/comments/delete_post_comment';
import { GetPostCommentsUseCase } from '../domain/usecases/comments/get_post_comments';


export default function CommentsRouter(
	addCommentPost: AddPostCommentUseCase,
	deleteCommentPost: DeletePostCommentUseCase,
	getCommentsPost: GetPostCommentsUseCase
) {
	const router = express.Router();

	router.post('/',[isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const bodypost = req.body as {userId: string, postId: string, text:string};
			//execution
			const orga = await addCommentPost.execute(bodypost.userId, bodypost.postId, bodypost.text);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'comment was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'comment was added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'comment was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.delete('/',[isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const bodypost = req.body as {userId: string, commentId: string, postId: string};

			if(bodypost.userId !== req.params.r_userId)
			{
				code = 401;
				toSend = new RouterResponse('1.0', new Error('user not allowed'), 'put', {id: req.params.id}, 'user was not edited');
				res.status(code).send(toSend);
				return;
			}

			//execution
			const orga = await deleteCommentPost.execute(bodypost.commentId, bodypost.userId, bodypost.postId);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'delete', undefined, 'comment was not deleted');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'delete', undefined, 'comment was deleted');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'delete', undefined, 'comment was not deleted');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/:postId', async (req: Request<{postId: string, sort: string, pageindex: string, pagesize:string, paramvars: string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			let sort: [string, 1 | -1][] | undefined;
			if(req.query.sort)
			{
				sort = JSON.parse(req.query.sort.toString()) as [string, 1 | -1][];
			}

			let params: {[x: string]: unknown} = {};
			if(req.query.paramvars)
			{
				params = JSON.parse(req.query.paramvars.toString()) as {[x: string]: string};
			}
			//execution
			const orga = await getCommentsPost.execute(req.params.postId as string, params, sort, (req.query.pageindex)?parseInt(req.query.pageindex.toString()):undefined,
				(req.query.pagesize)?parseInt(req.query.pagesize.toString()):undefined);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', undefined, 'comment was not getted by post');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', undefined, 'comments getted by post');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', undefined, 'comment was not getted by post');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	return router;
}