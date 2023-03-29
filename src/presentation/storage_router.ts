import express, { Request, Response } from 'express';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { UploadCloudFileUseCase } from '../domain/usecases/storage/upload_cloudfile';
import multer from 'multer';
import { GetCloudFileUseCase } from '../domain/usecases/storage/get_cloudfile';
import { RegisterCloudFileUseCase } from '../domain/usecases/storage/register_cloudfile';
import { hasRole } from '../core/presentation/check_role_router';

export default function StorageRouter(
	uploadCloudFile: UploadCloudFileUseCase,
	getCloudFile: GetCloudFileUseCase,
	registerCloudFile: RegisterCloudFileUseCase,
) {
	const router = express.Router();
	const upload = multer();

	router.get('/:cloudFileId', [isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const registered = await getCloudFile.execute(req.params.cloudFileId);
			//evaluate
			registered.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get' + ' not getted');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get' + ' getted');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get' + ' not getted');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.post('/', [isAuth, hasRole(['user'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const data = req.body as {orgaId:string, userId:string};
			//execution
			const registered = await registerCloudFile.execute(data.orgaId, data.userId);
			//evaluate
			registered.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'post' + ' not registered');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post' + ' registered');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post' + ' not registered');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/',upload.single('file'), [isAuth, hasRole(['user'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const received = req.file;
			//execution
			const uploaded = await uploadCloudFile.execute(req.body.cloudFileId, received == undefined ? Buffer.from([]) : received.buffer);
			//evaluate
			uploaded.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'put' + ' not uploaded');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put' + ' uploaded');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put' + ' not uploaded');
		}
		//respond cordially
		res.status(code).send(toSend);
	});


	return router;
}