import express, { Request, Response } from 'express';
import { hasRole } from '../core/presentation/check_role_router';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { TextContent } from '../domain/entities/flows/textcontent';
import { AddTextPostUseCase } from '../domain/usecases/flows/add_text_post';
import { GetPostsUseCase } from '../domain/usecases/flows/get_posts';
import { SendVoteUseCase } from '../domain/usecases/flows/send_vote';

export default function PostsRouter(
	getPosts: GetPostsUseCase,
	addTextPost: AddTextPostUseCase,
	sendVote: SendVoteUseCase,
) {
	const router = express.Router();

	//orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, params: {key:string, value:string}[], textSearch: string,
	router.get('/',[isAuth], async (req: Request<{orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, textSearch: string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const post = await getPosts.execute(req.params.orgaId, req.params.userId, req.params.flowId, req.params.stageId, req.params.boxPage, req.params.params , req.params.textSearch);
			//evaluate
			post.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get', {id: req.params.orgaId} as object, 'not obtained');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {id: req.params.orgaId} as object, 'geted by id');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {id: req.params.orgaId} as object, 'not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	//orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, draft: boolean
	router.post('/',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, draft: boolean}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const post = await addTextPost.execute(req.params.orgaId, req.params.userId, req.params.flowId, req.params.title, req.params.textContent, req.params.draft);
			//evaluate
			post.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'post was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'new post added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'post was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});
	
	//userId: string, flowId: string, stageId: string, postId: string, voteValue: number
	router.put('/:postId',[isAuth], async (req: Request<{userId: string, flowId: string, stageId: string, postId: string, voteValue: string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const post = await sendVote.execute(req.params.userId, req.params.flowId, req.params.stageId, req.params.postId, req.params.voteValue.p);
			//evaluate
			post.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.postId}, 'post was not edited');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.postId}, 'post edited');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.postId}, 'post was not edited');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	return router;
}