import express, { Request, Response } from 'express';
import { hasRole } from '../core/presentation/check_role_router';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { GetStageUseCase } from '../domain/usecases/stages/get_stage';
import { GetStagesUseCase } from '../domain/usecases/stages/get_stages';

export default function StagesRouter(
	getStage: GetStageUseCase,
	getStages: GetStagesUseCase,
) {
	const router = express.Router();

	router.get('/',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{sort: string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			let sort: [string, 1 | -1][] | undefined;
			if(req.query.sort)
			{
				sort = JSON.parse(req.query.sort.toString()) as [string, 1 | -1][];
			}
			//execution
			const stage = await getStages.execute(sort);
			//evaluate
			stage.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get' + ' not obtained');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get' + ' geted all stages');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get' +  ' not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/:stageId',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{stageId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const stages = await getStage.execute(req.params.stageId);
			//evaluate
			stages.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {stageId: req.params.stageId} as object, 'not obtained by stage id');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {stageId: req.params.stageId} as object, 'geted by stage id');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {stageId: req.params.stageId} as object, 'not obtained by stage id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});




	return router;
}