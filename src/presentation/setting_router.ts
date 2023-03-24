import express, { Request, Response } from 'express';
import { hasRole } from '../core/presentation/check_role_router';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { GetOrgaSettingsUseCase } from '../domain/usecases/settings/get_orga_settings';
import { GetSuperSettingsUseCase } from '../domain/usecases/settings/get_super_settings';
import { UpdateSettingsUseCase } from '../domain/usecases/settings/update_settings';

export default function SettingsRouter(
	getSuperSettings: GetSuperSettingsUseCase,
	getOrgaSettings: GetOrgaSettingsUseCase,
	updateSettings: UpdateSettingsUseCase,
) {
	const router = express.Router();

	router.get('/byorga/:orgaId',[isAuth, hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const role = await getOrgaSettings.execute(req.params.orgaId);
			//evaluate
			role.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get' + 'settings not obtained');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get' + 'geted all settings');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get' + 'settings not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/',[isAuth, hasRole(['super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const roles = await getSuperSettings.execute();
			//evaluate
			roles.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {id: req.params.id} as object, 'super settings not obtained');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {id: req.params.id} as object, 'super settings geted');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {id: req.params.id} as object, 'super settings not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/byorga/:orgaId',[isAuth, hasRole(['admin'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			const changes = req.body as { id: string; value: string; }[];
			//execution
			const user = await updateSettings.execute(changes, req.params.orgaId);
			//evaluate
			user.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.orgaId}, 'settings was not edited');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.orgaId}, 'settings edited');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.orgaId}, 'settings was not edited');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/',[isAuth, hasRole(['super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			const changes = req.body as { id: string; value: string; }[];
			//execution
			const user = await updateSettings.execute(changes, undefined);
			//evaluate
			user.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.orgaId}, 'settings was not edited');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.orgaId}, 'settings edited');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.orgaId}, 'settings was not edited');
		}
		//respond cordially
		res.status(code).send(toSend);
	});
	return router;
}