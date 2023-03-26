import express, { Request, Response } from 'express';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { UploadFileCloudUseCase } from '../domain/usecases/storage/upload_filecloud';

export default function StorageRouter(
	uploadFileCloud: UploadFileCloudUseCase
) {
	const router = express.Router();

	router.post('/',[isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			console.log(req.body);
			//execution
			const uploaded = await uploadFileCloud.execute(req.body, 'name');
			//evaluate
			uploaded.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'post' + ' not uploaded');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post' + ' uploaded');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post' + ' not uploaded');
		}
		//respond cordially
		res.status(code).send(toSend);
	});


	return router;
}