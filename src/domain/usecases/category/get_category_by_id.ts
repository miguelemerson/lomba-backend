import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { CategoryModel } from '../../../data/models/workflow/category_model';
import { CategoryRepository } from '../../repositories/category_repository';

export interface GetCategoryByIdUseCase {
    execute(categoryId:string): Promise<Either<Failure,ModelContainer<CategoryModel>>>;
}

export class GetCategoryById implements GetCategoryByIdUseCase {
	repository: CategoryRepository;
	constructor(repository: CategoryRepository) {
		this.repository = repository;
	}

	async execute(categoryId:string): Promise<Either<Failure,ModelContainer<CategoryModel>>> {
		return await this.repository.getCategoryById(categoryId);
	}
}