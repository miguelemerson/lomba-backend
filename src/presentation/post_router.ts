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

	router.get('/box/', async (req: Request<{orgaId: string, userId: string, flowId: string, stageId: string, boxpage: string, searchtext: string, sort: string, pageindex: string, pagesize:string, paramvars: string}>, res: Response) => {
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
			const post = await getPosts.execute(
				(req.query.orgaId!=undefined)?req.query.orgaId.toString():'',
				(req.query.userId!=undefined)?req.query.userId.toString():'',
				(req.query.flowId!=undefined)?req.query.flowId.toString():'',
				(req.query.stageId!=undefined)?req.query.stageId.toString():'',
				(req.query.boxpage!=undefined)?req.query.boxpage.toString():'',
				(req.query.searchtext!=undefined)?req.query.searchtext.toString():'',
				params,
				sort, 
				(req.query.pageindex)?parseInt(req.query.pageindex.toString()):undefined, (req.query.pagesize)?parseInt(req.query.pagesize.toString()):undefined
			);
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

	router.post('/',[isAuth, hasRole(['user'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const bodypost = req.body as {orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, isdraft: boolean};
			//execution
			const post = await addTextPost.execute(bodypost.orgaId, bodypost.userId, bodypost.flowId, bodypost.title, bodypost.textContent, bodypost.isdraft);
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