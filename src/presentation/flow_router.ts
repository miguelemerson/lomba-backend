import express, { Request, Response } from 'express';
import { hasRole } from '../core/presentation/check_role_router';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { GetFlowUseCase } from '../domain/usecases/flows/get_flow';
import { GetFlowsUseCase } from '../domain/usecases/flows/get_flows';

export default function FlowsRouter(
	getFlow: GetFlowUseCase,
	getFlows: GetFlowsUseCase,
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
			const flow = await getFlows.execute(sort);
			//evaluate
			flow.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get' + ' not obtained');	
			}, value => {
				//isOK
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get' + ' geted all flows');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get' +  ' not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/:flowId',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{flowId:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const flows = await getFlow.execute(req.params.flowId);
			//evaluate
			flows.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {flowId: req.params.flowId} as object, 'not obtained by flow id');
			}, value => {
				if(value.currentItemCount > 0)
				{
					code = 200;
					toSend = new RouterResponse('1.0', value, 'get', {flowId: req.params.flowId} as object, 'geted by flow id');
				}
				else
				{
					//no encontrado
					code = 404;
					toSend = new RouterResponse('1.0', new Error('not found'), 'get', {flowId: req.params.flowId} as object, 'not obtained by flow id');
				}
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {flowId: req.params.flowId} as object, 'not obtained by flow id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});




	return router;
}