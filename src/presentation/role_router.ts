import express from 'express';
import { Request, Response } from 'express';
import { EnableRoleUseCase } from '../domain/usecases/roles/enable_role';
import { GetRoleUseCase } from '../domain/usecases/roles/get_role';
import { GetRolesUseCase } from '../domain/usecases/roles/get_roles';
import { RouterResponse } from '../core/router_response';

export default function RolesRouter(
	getRole: GetRoleUseCase,
	getRoles: GetRolesUseCase,
	enableRole: EnableRoleUseCase
) {
	const router = express.Router();

	router.get('/', async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const role = await getRoles.execute(req.params.id);
			//evaluate
			role.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get' + ' not obtained');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get' + ' geted all roles');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get' + ' not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/:id', async (req: Request<{id:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const roles = await getRole.execute(req.params.id);
			//evaluate
			roles.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {id: req.params.id} as object, 'not obtained by orga id');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {id: req.params.id} as object, 'geted by orga id');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {id: req.params.id} as object, 'not obtained by orga id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/enable/:id', async (req: Request<{id:string, enable:boolean}>, res: Response) => {
		const text = (req.query.enable === 'false' ? false : true) ? 'enabled' : 'disabled';
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const result = await enableRole.execute(req.params.id, (req.query.enable === 'false' ? false : true));
			//evaluate
			result.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id, enable: req.query.enable}, 'role was not ' + text);	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', {value}, 'put', {id: req.params.id, enable: req.query.enable}, 'role ' + text);
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id, enable: req.query.enable}, 'role was not ' + text);
		}
		//respond cordially
		res.status(code).send(toSend);
	});  

	return router;
}