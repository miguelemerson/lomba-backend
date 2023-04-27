import express, { Request, Response } from 'express';
import { hasRole } from '../core/presentation/check_role_router';
import { isAuth, isAuthWithoutOrga } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { AddOrgaUseCase } from '../domain/usecases/orgas/add_orga';
import { DeleteOrgaUseCase } from '../domain/usecases/orgas/delete_orga';
import { EnableOrgaUseCase } from '../domain/usecases/orgas/enable_orga';
import { ExistsOrgaUseCase } from '../domain/usecases/orgas/exists_orga';
import { GetOrgaUseCase } from '../domain/usecases/orgas/get_orga';
import { GetOrgasUseCase } from '../domain/usecases/orgas/get_orgas';
import { UpdateOrgaUseCase } from '../domain/usecases/orgas/update_orga';
import { GetOrgasByUserUseCase } from '../domain/usecases/orgas/get_orgas_by_user';

export default function OrgasRouter(
	getOrga: GetOrgaUseCase,
	getOrgas: GetOrgasUseCase,
	addOrga: AddOrgaUseCase,
	updateOrga: UpdateOrgaUseCase,
	enableOrga: EnableOrgaUseCase,
	deleteOrga: DeleteOrgaUseCase,
	existsOrga: ExistsOrgaUseCase,
	getOrgasByUser: GetOrgasByUserUseCase
) {
	const router = express.Router();

	router.get('/',[isAuth, hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orga = await getOrgas.execute(req.params.id);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get' + ' not obtained');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get' + ' geted all orgas');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get' +  ' not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/:orgaId',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{orgaId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orgas = await getOrga.execute(req.params.orgaId);
			//evaluate
			orgas.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {orgaId: req.params.orgaId} as object, 'not obtained by orga id');
			}, value => {
				if(value.currentItemCount > 0)
				{
					code = 200;
					toSend = new RouterResponse('1.0', value, 'get', {orgaId: req.params.orgaId} as object, 'geted by orga id');	
				}
				else
				{
					//no encontrado
					code = 404;
					toSend = new RouterResponse('1.0', new Error('not found'), 'get', {orgaId: req.params.orgaId} as object, 'not obtained by orga id');
				}			
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
			const orga = await addOrga.execute(req.body);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'orga was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'new orga added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'orga was not added');
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
			const orga = await updateOrga.execute(req.params.id, req.body);
			//evaluate
			orga.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id}, 'orga was not edited');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.id}, 'orga edited');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id}, 'orga was not edited');
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
			const result = await enableOrga.execute(req.params.id, (req.query.enable === 'false' ? false : true));
			//evaluate
			result.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id, enable: req.query.enable}, 'orga was not ' + text);	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.id, enable: req.query.enable}, 'orga ' + text);
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id, enable: req.query.enable}, 'orga was not ' + text);
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
			const result = await deleteOrga.execute(req.params.id);
			//evaluate
			result.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'delete', {id: req.params.id}, 'orga was not deleted');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', {value}, 'delete', {id: req.params.id}, 'orga deleted');
			});

		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'delete', {id: req.params.id}, 'orga was not deleted');
		}
		//respond cordially
		res.status(code).send(toSend);
	});   
	
	router.get('/if/exists/',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{orgaId:string,code:string}>, res: Response) => {	
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const users = await existsOrga.execute(
				(req.query.orgaId!=undefined)?req.query.orgaId.toString():'',
				(req.query.code!=undefined)?req.query.code.toString():'');
			//evaluate
			users.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {userId: req.params.orgaId} as object, 'not obtained by code');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {userId: req.params.orgaId} as object, 'geted by code');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {userId: req.params.orgaId} as object, 'not by orga code');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/byuser/:userId',[isAuthWithoutOrga], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orgas = await getOrgasByUser.execute(req.params.userId);
			//evaluate
			orgas.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get by userid' + ' not obtained');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get by userid' + ' geted');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get by userid' +  ' not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	return router;
}