import express from 'express';
import { Request, Response } from 'express';
import { AddOrgaUseCase } from '../domain/usecases/orgas/add_orga';
import { DeleteOrgaUseCase } from '../domain/usecases/orgas/delete_orga';
import { EnableOrgaUseCase } from '../domain/usecases/orgas/enable_orga';
import { GetOrgaUseCase } from '../domain/usecases/orgas/get_orga';
import { GetOrgasUseCase } from '../domain/usecases/orgas/get_orgas';
import { UpdateOrgaUseCase } from '../domain/usecases/orgas/update_orga';
import { RouterResponse } from '../core/router_response';

export default function OrgasRouter(
	getOrga: GetOrgaUseCase,
	getOrgas: GetOrgasUseCase,
	addOrga: AddOrgaUseCase,
	updateOrga: UpdateOrgaUseCase,
	enableOrga: EnableOrgaUseCase,
	deleteOrga: DeleteOrgaUseCase
) {
	const router = express.Router();

	router.get('/', async (req: Request, res: Response) => {
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

	router.get('/:orgaId', async (req: Request<{orgaId:string}>, res: Response) => {
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

	router.post('/', async (req: Request, res: Response) => {
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
	
	router.put('/:id', async (req: Request, res: Response) => {
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

	router.put('/enable/:id', async (req: Request<{id:string, enable:boolean}>, res: Response) => {
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
				toSend = new RouterResponse('1.0', {value}, 'put', {id: req.params.id, enable: req.query.enable}, 'orga ' + text);
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id, enable: req.query.enable}, 'orga was not ' + text);
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.delete('/:id', async (req: Request<{id:string}>, res: Response) => {
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

	return router;
}