import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { CategoryRepository } from '../../domain/repositories/category_repository';
import { CategoryDataSource } from '../datasources/category_data_source';
import { CategoryModel } from '../models/workflow/category_model';

export class CategoryRepositoryImpl implements CategoryRepository {
	dataSource: CategoryDataSource;
	constructor(dataSource: CategoryDataSource){
		this.dataSource = dataSource;
	}
	async addCategory(userId: string, name: string, longname: string, description: string): Promise<Either<Failure, ModelContainer<CategoryModel>>> {
		try{
			const category = new CategoryModel('', name, longname, name.toLocaleLowerCase(), userId, description, [], true, false);

			const result = await this.dataSource.getByName(name.toLocaleLowerCase());

			if(result.currentItemCount > 0)
			{
				return Either.right(result);
			}
			else
			{
				const result = await this.dataSource.add(category);
				return Either.right(result);
			}
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
			
		}
	}
	async searchCategories(searchText: string, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<CategoryModel>>> {
		try
		{
			const result = await this.dataSource.searchCategory(searchText, pageIndex, itemsPerPage);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
			
		}
	}
	async getCategoryById(categoryId: string): Promise<Either<Failure, ModelContainer<CategoryModel>>> {
		try
		{
			const result = await this.dataSource.getById(categoryId);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
			
		}
	}
	async getCategoryByLowercaseName(lowercasename: string): Promise<Either<Failure, ModelContainer<CategoryModel>>> {
		try
		{
			const result = await this.dataSource.getByName(lowercasename);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
			
		}
	}
}