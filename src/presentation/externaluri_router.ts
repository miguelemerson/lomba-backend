import express, { Request, Response } from 'express';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { AddExternalUriUseCase } from '../domain/usecases/storage/add_externaluri';
import { GetExternalUriByIdUseCase } from '../domain/usecases/storage/get_externaluri_by_id';
import { GetExternalUriByUriUseCase } from '../domain/usecases/storage/get_externaluri_by_uri';


export default function ExternalUrisRouter(
	addExternalUri: AddExternalUriUseCase,
	getExternalUriById: GetExternalUriByIdUseCase,
	getExternalUriByUri: GetExternalUriByUriUseCase
) {
	const router = express.Router();

	router.post('/',[isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const bodypost = req.body as {userId: string, uri: string};
			//execution
			const orga = await addExternalUri.execute(bodypost.userId, bodypost.uri);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'externalUri was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'externalUri was added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'externalUri was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/:externalUriId',[isAuth], async (req: Request<{externalUriId: string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orga = await getExternalUriById.execute(req.params.externalUriId as string);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', undefined, 'externalUri was not getted by id');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', undefined, 'externalUris getted by id');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', undefined, 'externalUri was not getted by id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/',[isAuth], async (req: Request<{uri: string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orga = await getExternalUriByUri.execute(req.query.uri as string);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', undefined, 'externalUri was not getted by uri');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', undefined, 'externalUris getted by uri');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', undefined, 'externalUri was not getted by uri');
		}
		//respond cordially
		res.status(code).send(toSend);
	});



	return router;
}