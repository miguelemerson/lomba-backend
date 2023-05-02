import express, { Request, Response } from 'express';
import { hasRole } from '../core/presentation/check_role_router';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { GiveMarkPostUseCase } from '../domain/usecases/posts/give_mark_post';

export default function BookmarksRouter(
	giveMarkPost: GiveMarkPostUseCase,
) {
	const router = express.Router();

	router.post('/',[isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const bodypost = req.body as {userId: string, postId: string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', giveOrTakeAway: boolean};
			//execution
			const orga = await giveMarkPost.execute(bodypost.userId, bodypost.postId, bodypost.markType, bodypost.giveOrTakeAway);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'bookmark was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'bookmark was added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'bookmark was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});



	return router;
}