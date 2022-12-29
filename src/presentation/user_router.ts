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
		try {
			const user = await getUser.execute(req.params.id);
			res.status(200).send(new RouterResponse('1.0', user, 'get', {id: req.params.id} as object, 'geted by id'));
		} catch (err) {
			res.status(500).send(new RouterResponse('1.0', err, 'get', {id: req.params.id} as object, 'not obtained'));
		}
	});

	router.get('/byorga/:orgaId', async (req: Request<{orgaId:string}>, res: Response) => {
		try {
			const users = await getUsersByOrgaId.execute(req.params.orgaId);
			res.status(200).send(new RouterResponse('1.0', users, 'get', {orgaId: req.params.orgaId} as object, 'geted by orga id'));
		} catch (err) {
			res.status(500).send(new RouterResponse('1.0', err, 'get', {orgaId: req.params.orgaId} as object, 'not obtained by orga id'));
		}
	});


	router.post('/', async (req: Request, res: Response) => {
		try {
			const user = await addUser.execute(req.body);
			res.status(201).send(new RouterResponse('1.0', user, 'post', undefined, 'new user added'));
		} catch (err) {
			res.status(500).send(new RouterResponse('1.0', err, 'post', undefined, 'user was not added'));
		}
	});
	
	router.put('/:id', async (req: Request, res: Response) => {
		try {
			const user = await updateUser.execute(req.params.id, req.body);
			res.status(201).send(new RouterResponse('1.0', user, 'put', {id: req.params.id}, 'user edited'));
		} catch (err) {
			res.status(500).send(new RouterResponse('1.0', err, 'put', {id: req.params.id}, 'user was not edited'));
		}
	});

	router.put('/enable/:id', async (req: Request<{id:string, enable:boolean}>, res: Response) => {
		const text = (req.query.enable === 'false' ? false : true) ? 'enabled' : 'disabled';
		try {
			const result = await enableUser.execute(req.params.id, (req.query.enable === 'false' ? false : true));
			res.status(200).send(new RouterResponse('1.0', result, 'put', {id: req.params.id, enable: req.query.enable}, 'user ' + text));
		} catch (err) {
			res.status(500).send(new RouterResponse('1.0', err, 'put', {id: req.params.id, enable: req.query.enable}, 'user was not ' + text));
		}
	});

	router.delete('/:id', async (req: Request<{id:string}>, res: Response) => {
		try {
			const result = await deleteUser.execute(req.params.id);
			res.status(200).send(new RouterResponse('1.0', result, 'delete', {id: req.params.id}, 'user deleted'));
		} catch (err) {
			res.status(500).send(new RouterResponse('1.0', err, 'delete', {id: req.params.id}, 'user was not deleted'));
		}
	});    

	return router;
}