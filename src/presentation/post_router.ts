import express, { Request, Response } from 'express';
import { hasRole } from '../core/presentation/check_role_router';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { TextContent } from '../domain/entities/workflow/textcontent';
import { AddTextPostUseCase } from '../domain/usecases/posts/add_text_post';
import { DeletePostUseCase } from '../domain/usecases/posts/delete_post';
import { GetPostsUseCase } from '../domain/usecases/posts/get_posts';
import { SendVoteUseCase } from '../domain/usecases/posts/send_vote';
import { UpdatePostUseCase } from '../domain/usecases/posts/update_post';
import { EnablePostUseCase } from '../domain/usecases/posts/enable_post';
import { ChangeStagePostUseCase } from '../domain/usecases/posts/change_stage_post';
import { GetAdminViewPostsUseCase } from '../domain/usecases/posts/get_adminview_post';
import { GetPostUseCase } from '../domain/usecases/posts/get_post';

export default function PostsRouter(
	getPosts: GetPostsUseCase,
	addTextPost: AddTextPostUseCase,
	sendVote: SendVoteUseCase,
	updatePost: UpdatePostUseCase,
	deletePost: DeletePostUseCase,
	enablePost: EnablePostUseCase,
	changeStagePost: ChangeStagePostUseCase,
	getAdminViewPosts: GetAdminViewPostsUseCase,
	getPost: GetPostUseCase,
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
				(req.query.pageindex)?parseInt(req.query.pageindex.toString()):undefined,
				(req.query.pagesize)?parseInt(req.query.pagesize.toString()):undefined
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

	router.get('/admin/',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{orgaId: string, userId: string, flowId: string, stageId: string, boxpage: string, searchtext: string, sort: string, pageindex: string, pagesize:string, paramvars: string}>, res: Response) => {
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
			const post = await getAdminViewPosts.execute(
				(req.query.orgaId!=undefined)?req.query.orgaId.toString():'',
				(req.query.userId!=undefined)?req.query.userId.toString():'',
				(req.query.flowId!=undefined)?req.query.flowId.toString():'',
				(req.query.stageId!=undefined)?req.query.stageId.toString():'',
				(req.query.searchtext!=undefined)?req.query.searchtext.toString():'',
				params,
				sort,
				(req.query.pageindex)?parseInt(req.query.pageindex.toString()):undefined,
				(req.query.pagesize)?parseInt(req.query.pagesize.toString()):undefined
			);
			//evaluate
			post.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get', {id: req.params.orgaId} as object, 'not obtained on admin view');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {id: req.params.orgaId} as object, 'geted list on admin view');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {id: req.params.orgaId} as object, 'not obtained on admin view');
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

	router.put('/',[isAuth, hasRole(['user','admin'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const bodypost = req.body as {postId: string, userId: string, title: string, textContent: TextContent};
			//execution
			const post = await updatePost.execute(bodypost.postId, bodypost.userId, bodypost.title, bodypost.textContent);
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

	router.delete('/',[isAuth, hasRole(['user'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const bodypost = req.body as {postId: string, userId: string};
			//execution
			const post = await deletePost.execute(bodypost.postId, bodypost.userId);
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

	router.put('/enable/:id',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{id:string, r_userId:string}>, res: Response) => {
		const text = (req.query.enable === 'false' ? false : true) ? 'enabled' : 'disabled';
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			const userId = req.params.r_userId;
			//execution
			const result = await enablePost.execute(req.params.id, userId, (req.query.enable === 'false' ? false : true));
			//evaluate
			result.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id, enable: req.query.enable}, 'post was not ' + text);	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.id, enable: req.query.enable}, 'post ' + text);
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id, enable: req.query.enable}, 'post was not ' + text);
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/stage/:id',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{id:string, r_userId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let flowId = '';
		let stageId = '';
		let toSend = RouterResponse.emptyResponse();		
		try {

			if(req.query.flowId)
				flowId = req.query.flowId.toString();

			if(req.query.stageId)
				stageId = req.query.stageId.toString();

			const userId = req.params.r_userId;
			//execution
			const result = await changeStagePost.execute(req.params.id, userId, flowId, stageId);
			//evaluate
			result.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id, stageId: stageId}, 'post stage wat not changed');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.id, stageId: stageId}, 'post stage changed ');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id, stageId: stageId}, 'post stage wat not changed');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/:id',[isAuth], async (req: Request<{id:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const post = await getPost.execute(req.params.id as string);
			//evaluate
			post.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get', {id: req.query.id} as object, 'not obtained by id');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {id: req.query.id} as object, 'geted by id');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {id: req.query.id} as object, 'not obtained by id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	return router;
}