import express, { Request, Response } from 'express';
import { hasRole } from '../core/presentation/check_role_router';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { AddOrgaUserUseCase } from '../domain/usecases/orgas/add_orgauser';
import { DeleteOrgaUserUseCase } from '../domain/usecases/orgas/delete_orgauser';
import { EnableOrgaUserUseCase } from '../domain/usecases/orgas/enable_orgauser';
import { GetOrgaUserUseCase } from '../domain/usecases/orgas/get_orgauser';
import { GetOrgaUserByOrgasUseCase } from '../domain/usecases/orgas/get_orgausers_by_orga';
import { GetOrgaUserByUsersUseCase } from '../domain/usecases/orgas/get_orgausers_by_user';
import { UpdateOrgaUserUseCase } from '../domain/usecases/orgas/update_orgauser';

export default function OrgaUsersRouter(
	getOrgaUsersByOrgaId: GetOrgaUserByOrgasUseCase,
	getOrgaUsersByUserId: GetOrgaUserByUsersUseCase,
	getOrgaUser: GetOrgaUserUseCase,
	addOrgaUser: AddOrgaUserUseCase,
	updateOrgaUser: UpdateOrgaUserUseCase,
	enableOrgaUser: EnableOrgaUserUseCase,
	deleteOrgaUser: DeleteOrgaUserUseCase
) {
	const router = express.Router();

	router.get('/byorga/:orgaId',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{orgaId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orgausers = await getOrgaUsersByOrgaId.execute(req.params.orgaId);
			//evaluate
			orgausers.fold(error => {
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

	router.get('/byuser/:userId',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{userId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orgausers = await getOrgaUsersByUserId.execute(req.params.userId);
			//evaluate
			orgausers.fold(error => {
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

	router.get('/:orgaId/:userId',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{orgaId:string, userId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orgausers = await getOrgaUser.execute(req.params.orgaId, req.params.userId);
			//evaluate
			orgausers.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {orgaId: req.params.orgaId, userId: req.params.userId} as object, 'not obtained by orga id');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {orgaId: req.params.orgaId, userId: req.params.userId} as object, 'geted by orga id');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {orgaId: req.params.orgaId, userId: req.params.userId} as object, 'not obtained by orga id');
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
			const orgauser = await addOrgaUser.execute(req.body);
			//evaluate
			orgauser.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'orgauser was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'new orgauser added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'orgauser was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});
	
	router.put('/:orgaId/:userId',[isAuth, hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const orgauser = await updateOrgaUser.execute(req.params.orgaId, req.params.userId, req.body);
			//evaluate
			orgauser.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.orgaId}, 'orgauser was not edited');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.orgaId}, 'orgauser edited');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.orgaId}, 'orgauser was not edited');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/enable/:orgaId/:userId/',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{orgaId:string, userId:string}>, res: Response) => {
		const text = (req.query.enable === 'false' ? false : true) ? 'enabled' : 'disabled';
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const result = await enableOrgaUser.execute(req.params.orgaId, req.params.userId, (req.query.enable === 'false' ? false : true));
			//evaluate
			result.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {orgaId: req.params.orgaId, userId: req.params.userId, enable: req.query.enable}, 'orgauser was not ' + text);	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', {value}, 'put', {orgaId: req.params.orgaId, userId: req.params.userId, enable: req.query.enable}, 'orgauser ' + text);
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {orgaId: req.params.orgaId, userId: req.params.userId, enable: req.query.enable}, 'orgauser was not ' + text);
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.delete('/:orgaId/:userId',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{orgaId:string, userId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();			
		try {
			//execution
			const result = await deleteOrgaUser.execute(req.params.orgaId, req.params.userId);
			//evaluate
			result.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'delete', {orgaId: req.params.orgaId, userId: req.params.userId}, 'orgauser was not deleted');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', {value}, 'delete', {orgaId: req.params.orgaId, userId: req.params.userId}, 'orgauser deleted');
			});

		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'delete', {orgaId: req.params.orgaId, userId: req.params.userId}, 'orgauser was not deleted');
		}
		//respond cordially
		res.status(code).send(toSend);
	});    

	return router;
}