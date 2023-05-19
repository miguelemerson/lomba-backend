import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { CategoryModel } from '../../data/models/workflow/category_model';

export interface CategoryRepository {
    addCategory(userId: string, name: string, longname: string, description:string): Promise<Either<Failure, ModelContainer<CategoryModel>>>;
    searchCategories(searchText:string, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<CategoryModel>>>;
    getCategoryById(categoryId: string): Promise<Either<Failure, ModelContainer<CategoryModel>>>;
    getCategoryByLowercaseName(lowercasename: string): Promise<Either<Failure, ModelContainer<CategoryModel>>>;
}