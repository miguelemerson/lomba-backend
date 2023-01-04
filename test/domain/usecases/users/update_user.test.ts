import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { UserModel } from '../../../../src/data/models/user_model';
import { UserRepository } from '../../../../src/domain/repositories/user_repository';
import {UpdateUser} from '../../../../src/domain/usecases/users/update_user';
import { MockUserRepository } from './user_repository.mock';
describe('Agregar usuario - Caso de uso', () => {
	
	let mockUserRepository: UserRepository;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockUserRepository = new MockUserRepository();
	});

	test('el usecase de actualizar usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'updateUser').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(listUsers[0]))));

		//act
		const useCase = new UpdateUser(mockUserRepository);
		const result = await useCase.execute(listUsers[0].id, listUsers[0]);
		//assert
		expect(mockUserRepository.updateUser).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(ModelContainer.fromOneItem(listUsers[0])));
	});

	test('el usecase de actualizar usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'updateUser').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new UpdateUser(mockUserRepository);
		const result = await useCase.execute(listUsers[0].id, listUsers[0]);
		//assert
		expect(mockUserRepository.updateUser).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});