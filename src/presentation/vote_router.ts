import express, { Request, Response } from 'express';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { SendVoteUseCase } from '../domain/usecases/votes/send_vote';

export default function VotesRouter(
	sendVote: SendVoteUseCase
) {
	const router = express.Router();


	router.post('/vote/',[isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const bodypost = req.body as {userId: string, flowId: string, stageId: string, postId: string, orgaId:string, voteValue: number};
			//execution
			const post = await sendVote.execute(bodypost.orgaId, bodypost.userId, bodypost.flowId, bodypost.stageId, bodypost.postId,bodypost.voteValue);
			//evaluate
			post.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', {id: req.params.postId}, 'vote was not do it');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', {id: req.params.postId}, 'vote do it');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', {id: req.params.postId}, 'vote was not do it');
		}
		//respond cordially
		res.status(code).send(toSend);
	});


	return router;
}