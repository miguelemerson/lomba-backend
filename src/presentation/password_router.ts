import express from 'express';
import { Request, Response } from 'express';
import { AddPasswordUseCase } from '../domain/usecases/password/add_password';
import { UpdatePasswordUseCase } from '../domain/usecases/password/update_password';
import { RouterResponse } from '../core/router_response';
import { isAuth } from '../core/presentation/valid_token_router';
import { hasRole } from '../core/presentation/check_role_router';

export default function PasswordsRouter(
	addPassword: AddPasswordUseCase,
	updatePassword: UpdatePasswordUseCase,
) {
	const router = express.Router();

	router.post('/add', async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const password = await addPassword.execute(req.params.userId, req.params.password);//
			//evaluate
			password.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'password was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'new password added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'password was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});
	
	router.put('/:userId/:password',[isAuth, hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const password = await updatePassword.execute(req.params.userId, req.params.password);
			//evaluate
			password.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {userId: req.params.userId}, 'password was not edited');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {userId: req.params.userId}, 'password edited');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {userId: req.params.userId}, 'password was not edited');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	return router;
}