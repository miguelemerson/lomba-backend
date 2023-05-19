import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { CategoryModel } from '../../../data/models/workflow/category_model';
import { CategoryRepository } from '../../repositories/category_repository';

export interface SearchCategoriesUseCase {
    execute(searchText:string, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure,ModelContainer<CategoryModel>>>;
}

export class SearchCategories implements SearchCategoriesUseCase {
	repository: CategoryRepository;
	constructor(repository: CategoryRepository) {
		this.repository = repository;
	}

	async execute(searchText:string, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure,ModelContainer<CategoryModel>>> {
		return await this.repository.searchCategories(searchText, pageIndex, itemsPerPage);
	}
}