import express, { Request, Response } from 'express';
import { isAuth } from '../core/presentation/valid_token_router';
import { RouterResponse } from '../core/router_response';
import { AddCategoryUseCase } from '../domain/usecases/category/add_category';
import { GetCategoryByIdUseCase } from '../domain/usecases/category/get_category_by_id';
import { GetCategoryByNameUseCase } from '../domain/usecases/category/get_category_by_name';
import { SearchCategoriesUseCase } from '../domain/usecases/category/search_categories';


export default function CategoriesRouter(
	addCategory: AddCategoryUseCase,
	getCategoryById: GetCategoryByIdUseCase,
	getCategoryByName: GetCategoryByNameUseCase,
	searchCategories: SearchCategoriesUseCase
) {
	const router = express.Router();

	router.post('/',[isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			const bodypost = req.body as {userId: string, name: string, longname:string, description:string};
			//execution
			const orga = await addCategory.execute(bodypost.userId, bodypost.name, bodypost.longname, bodypost.description);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'category was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'category was added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'category was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/:categoryId',[isAuth], async (req: Request<{categoryId: string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orga = await getCategoryById.execute(req.params.categoryId as string);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', undefined, 'category was not getted by id');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', undefined, 'categorys getted by id');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', undefined, 'category was not getted by id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/',[isAuth], async (req: Request<{name: string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const orga = await getCategoryByName.execute(req.query.name as string);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', undefined, 'category was not getted by name');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', undefined, 'categorys getted by name');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', undefined, 'category was not getted by name');
		}
		//respond cordially
		res.status(code).send(toSend);
	});


	router.get('/search/text/',[isAuth], async (req: Request<{searchText: string, pageindex: string, pagesize:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {

			//execution
			const orga = await searchCategories.execute(req.query.searchText as string, (req.query.pageindex)?parseInt(req.query.pageindex.toString()):undefined,
				(req.query.pagesize)?parseInt(req.query.pagesize.toString()):undefined);
			//evaluate
			orga.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', undefined, 'category was not searched by text');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', undefined, 'categorys searched by text');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', undefined, 'category was not searched by text');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	return router;
}