import express, { Request, Response } from 'express';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { AddCommentPostUseCase } from '../domain/usecases/posts/add_comment_post';
import { DeleteCommentPostUseCase } from '../domain/usecases/posts/delete_comment_post';

export default function CommentsRouter(
	addCommentPost: AddCommentPostUseCase,
	deleteCommentPost: DeleteCommentPostUseCase,
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
			const bodypost = req.body as {userId: string, postId: string};
			//execution
			const orga = await deleteCommentPost.execute(bodypost.userId, bodypost.postId);
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


	return router;
}