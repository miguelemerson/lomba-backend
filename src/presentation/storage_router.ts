import express, { Request, Response } from 'express';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { UploadCloudFileUseCase } from '../domain/usecases/storage/upload_cloudfile';
import multer from 'multer';
import { GetCloudFileUseCase } from '../domain/usecases/storage/get_cloudfile';
import { RegisterCloudFileUseCase } from '../domain/usecases/storage/register_cloudfile';
import { hasRole } from '../core/presentation/check_role_router';
import { RegisterUserPictureUseCase } from '../domain/usecases/users/register_userpicture';

export default function StorageRouter(
	uploadCloudFile: UploadCloudFileUseCase,
	getCloudFile: GetCloudFileUseCase,
	registerCloudFile: RegisterCloudFileUseCase,
	registerUserPicture: RegisterUserPictureUseCase,
	uploadUserPicture: UploadCloudFileUseCase
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

	router.post('/userpicture/:userId', [isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			if(req.params.userId !== req.params.r_userId)
			{
				code = 401;
				toSend = new RouterResponse('1.0', new Error('user not allowed'), 'put', {id: req.params.userId}, 'picture not registered');
				res.status(code).send(toSend);
				return;
			}

			const data = req.body as {orgaId:string, userId:string};
			//execution
			const registered = await registerUserPicture.execute(data.userId);
			//evaluate
			registered.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'post', {}, 'picture not registered');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', {}, 'picture registered');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', {}, 'picture not registered');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/userpicture/:userId',upload.single('file'), [isAuth, hasRole(['user'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			if(req.params.userId !== req.params.r_userId)
			{
				code = 401;
				toSend = new RouterResponse('1.0', new Error('user not allowed'), 'put', {id: req.params.userId}, 'user was not uploaded');
				res.status(code).send(toSend);
				return;
			}
			const received = req.file;
			//execution
			const uploaded = await uploadUserPicture.execute(req.body.cloudFileId, received == undefined ? Buffer.from([]) : received.buffer);
			//evaluate
			uploaded.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'put', {}, 'picture not uploaded');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {}, 'picture uploaded');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {}, 'picture not uploaded');
		}
		//respond cordially
		res.status(code).send(toSend);
	});


	return router;
}