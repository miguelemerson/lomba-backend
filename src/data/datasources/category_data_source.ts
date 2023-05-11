import crypto from 'crypto';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import { CategoryModel } from '../models/workflow/category_model';

export interface CategoryDataSource {
	setId(obj: CategoryModel): CategoryModel;
    add(category: CategoryModel) : Promise<ModelContainer<CategoryModel>>;
	getById(categoryId:string): Promise<ModelContainer<CategoryModel>>;
	getByName(name:string): Promise<ModelContainer<CategoryModel>>;
    searchCategory(searchText: string, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<CategoryModel>>;

}

export class CategoryDataSourceImpl implements CategoryDataSource {
	collection: MongoWrapper<CategoryModel>;

	constructor(dbMongo: MongoWrapper<CategoryModel>){
		this.collection = dbMongo;
	}
	async getByName(name: string): Promise<ModelContainer<CategoryModel>> {
		return await this.collection.getOne({lowercase: name.toLocaleLowerCase()});
	}
	setId(obj: CategoryModel): CategoryModel {
		if(obj.id == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	}
	async add(category: CategoryModel): Promise<ModelContainer<CategoryModel>> {
		category = this.setId(category);
		return await this.collection.add(category).then(() => this.collection.getOne({'_id':category.id}));
	}
	async getById(categoryId: string): Promise<ModelContainer<CategoryModel>> {
		return await this.collection.getOne({_id: categoryId});
	}
	async searchCategory(searchText: string, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<CategoryModel>> {

		const query = {} as {[x: string]: unknown;};
		query['enabled'] = true;
		if(searchText != '')
		{
			query['$text'] = {$search: searchText};
		}

		return await this.collection.getMany<CategoryModel>(query, undefined, pageIndex, itemsPerPage);
	}
}