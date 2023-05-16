import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Category } from '../../entities/workflow/category';
import { CategoryRepository } from '../../repositories/category_repository';

export interface AddCategoryUseCase {
    execute(userId:string, name:string, longname:string, description:string): Promise<Either<Failure, ModelContainer<Category>>>;
}

export class AddCategory implements AddCategoryUseCase {
	repository: CategoryRepository;
	constructor(repository: CategoryRepository) {
		this.repository = repository;
	}

	async execute(userId:string, name:string, longname:string, description:string): Promise<Either<Failure,ModelContainer<Category>>> {
		return await this.repository.addCategory(userId, name, longname, description);
	}
}