import express from 'express';
import { Request, Response } from 'express';
import { AddUserUseCase } from '../domain/usecases/users/add_user';
import { DeleteUserUseCase } from '../domain/usecases/users/delete_user';
import { EnableUserUseCase } from '../domain/usecases/users/enable_user';
import { GetUserUseCase } from '../domain/usecases/users/get_user';
import { GetUsersByOrgaIdUseCase } from '../domain/usecases/users/get_users_by_orga';
import { UpdateUserUseCase } from '../domain/usecases/users/update_user';
import { RouterResponse } from '../core/router_response';
import { isAuth } from '../core/presentation/valid_token_router';
import { hasRole } from '../core/presentation/check_role_router';
import { ExistsUserUseCase } from '../domain/usecases/users/exists_user';

export default function UsersRouter(
	getUser: GetUserUseCase,
	getUsersByOrgaId: GetUsersByOrgaIdUseCase,
	addUser: AddUserUseCase,
	updateUser: UpdateUserUseCase,
	enableUser: EnableUserUseCase,
	deleteUser: DeleteUserUseCase,
	existsUser: ExistsUserUseCase
) {
	const router = express.Router();

	router.get('/:id',[isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const user = await getUser.execute(req.params.id);
			//evaluate
			user.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get', {id: req.params.id} as object, 'not obtained');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {id: req.params.id} as object, 'geted by id');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {id: req.params.id} as object, 'not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/byorga/:orgaId',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{orgaId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const users = await getUsersByOrgaId.execute(req.params.orgaId);
			//evaluate
			users.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {orgaId: req.params.orgaId} as object, 'not obtained by orga id');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {orgaId: req.params.orgaId} as object, 'geted by orga id');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {orgaId: req.params.orgaId} as object, 'not obtained by orga id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.post('/',[isAuth, hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const user = await addUser.execute(req.body);
			//evaluate
			user.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'user was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'new user added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'user was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});
	
	router.put('/:id',[isAuth, hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const user = await updateUser.execute(req.params.id, req.body);
			//evaluate
			user.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id}, 'user was not edited');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.id}, 'user edited');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id}, 'user was not edited');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/enable/:id',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{id:string}>, res: Response) => {
		const text = (req.query.enable === 'false' ? false : true) ? 'enabled' : 'disabled';
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const result = await enableUser.execute(req.params.id, (req.query.enable === 'false' ? false : true));
			//evaluate
			result.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id, enable: req.query.enable}, 'user was not ' + text);	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.id, enable: req.query.enable}, 'user ' + text);
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id, enable: req.query.enable}, 'user was not ' + text);
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.delete('/:id',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{id:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();			
		try {
			//execution
			const result = await deleteUser.execute(req.params.id);
			//evaluate
			result.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'delete', {id: req.params.id}, 'user was not deleted');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'delete', {id: req.params.id}, 'user deleted');
			});

		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'delete', {id: req.params.id}, 'user was not deleted');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.post('/exists',[isAuth, hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
		
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			let _searchBody:{userId:string, username:string, email:string} = {userId:'', username:'', email:''};
			if(req.body)
			{
				_searchBody = req.body as {userId:string, username:string, email:string};
			}
			//execution
			const users = await existsUser.execute(_searchBody.userId, _searchBody.username, _searchBody.email);
			//evaluate
			users.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {userId: req.params.userId} as object, 'not obtained by orga id');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {userId: req.params.userId} as object, 'geted by orga id');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {userId: req.params.userId} as object, 'not obtained by orga id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	return router;
}