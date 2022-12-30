import express from 'express';
import { Request, Response } from 'express';
import { AddUserUseCase } from '../domain/usecases/users/add_user';
import { DeleteUserUseCase } from '../domain/usecases/users/delete_user';
import { EnableUserUseCase } from '../domain/usecases/users/enable_user';
import { GetUserUseCase } from '../domain/usecases/users/get_user';
import { GetUsersByOrgaIdUseCase } from '../domain/usecases/users/get_users_by_orga';
import { UpdateUserUseCase } from '../domain/usecases/users/update_user';
import { RouterResponse } from '../core/router_response';

export default function UsersRouter(
	getUser: GetUserUseCase,
	getUsersByOrgaId: GetUsersByOrgaIdUseCase,
	addUser: AddUserUseCase,
	updateUser: UpdateUserUseCase,
	enableUser: EnableUserUseCase,
	deleteUser: DeleteUserUseCase
) {
	const router = express.Router();

	router.get('/:id', async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend:RouterResponse;
		try {
			//execution
			const user = await getUser.execute(req.params.id);
			//evaluate
			if(user == null)
			{
				code = 404;
				toSend = new RouterResponse('1.0', 'Not found', 'get', {id: req.params.id} as object, 'user not getted');
			} else
			{
				code = 200;
				toSend = new RouterResponse('1.0', user, 'get', {id: req.params.id} as object, 'geted by id');
			}
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {id: req.params.id} as object, 'not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/byorga/:orgaId', async (req: Request<{orgaId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend:RouterResponse;
		try {
			//execution
			const users = await getUsersByOrgaId.execute(req.params.orgaId);
			//evaluate
			if(users == null || users.currentItemCount == 0)
			{
				code = 404;
				toSend = new RouterResponse('1.0', 'Not found', 'get', {orgaId: req.params.orgaId} as object, 'users not getted');
			}
			else
			{
				code = 200;
				toSend = new RouterResponse('1.0', users, 'get', {orgaId: req.params.orgaId} as object, 'geted by orga id');
			}
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {orgaId: req.params.orgaId} as object, 'not obtained by orga id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.post('/', async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend:RouterResponse;
		try {
			//execution
			const user = await addUser.execute(req.body);
			//evaluate
			if(user == null)
			{
				code = 409;
				toSend = new RouterResponse('1.0', 'Conflict', 'post', undefined, 'new user not added');
			}
			else
			{
				code = 200;
				toSend = new RouterResponse('1.0', user, 'post', undefined, 'new user added');
			}
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'user was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});
	
	router.put('/:id', async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend:RouterResponse;		
		try {
			//execution
			const user = await updateUser.execute(req.params.id, req.body);
			//evaluate
			if(user == null)
			{
				code = 409;
				toSend = new RouterResponse('1.0', 'Conflict', 'put', {id: req.params.id}, 'user not edited');
			}
			else
			{
				code = 200;
				toSend = new RouterResponse('1.0', user, 'put', {id: req.params.id}, 'user edited');
			}
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id}, 'user was not edited');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/enable/:id', async (req: Request<{id:string, enable:boolean}>, res: Response) => {
		const text = (req.query.enable === 'false' ? false : true) ? 'enabled' : 'disabled';
		//definitions
		let code = 500;
		let toSend:RouterResponse;		
		try {
			//execution
			const result = await enableUser.execute(req.params.id, (req.query.enable === 'false' ? false : true));
			//evaluate
			if(result == null)
			{
				code = 409;
				toSend = new RouterResponse('1.0', 'Conflict', 'put', {id: req.params.id, enable: req.query.enable}, 'user not ' + text);
			}
			else
			{
				code = 200;
				toSend = new RouterResponse('1.0', {result}, 'put', {id: req.params.id, enable: req.query.enable}, 'user ' + text);
			}
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id, enable: req.query.enable}, 'user was not ' + text);
		}
		//respond cordially
		res.status(code).send(toSend);

	});

	router.delete('/:id', async (req: Request<{id:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend:RouterResponse;			
		try {
			//execution
			const result = await deleteUser.execute(req.params.id);
			//evaluate
			if(result == null)
			{
				code = 409;
				toSend = new RouterResponse('1.0', 'Conflict', 'delete', {id: req.params.id}, 'user not deleted');
			}
			else
			{
				code = 200;
				toSend = new RouterResponse('1.0', {result}, 'delete', {id: req.params.id}, 'user deleted');
			}
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'delete', {id: req.params.id}, 'user was not deleted');
		}
		//respond cordially
		res.status(code).send(toSend);
	});    

	return router;
}