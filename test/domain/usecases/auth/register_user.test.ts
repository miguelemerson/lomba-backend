import { Either } from '../../../../src/core/either';
import { Failure, GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { OrgaModel } from '../../../../src/data/models/orga_model';
import { TokenModel } from '../../../../src/data/models/token_model';
import { UserModel } from '../../../../src/data/models/user_model';
import { Auth } from '../../../../src/domain/entities/auth';
import { AuthRepository } from '../../../../src/domain/repositories/auth_repository';
import { RegisterUser } from '../../../../src/domain/usecases/auth/register_user';

export class MockAuthRepository implements AuthRepository {

	getAuth():Promise<Either<Failure,ModelContainer<TokenModel>>>{
		throw new Error('Method not implemented.');
	}
	registerUser(): Promise<Either<Failure,ModelContainer<UserModel>>>{
		throw new Error('Method not implemented.');
	}
}

describe('Registro de usuario - Caso de uso', () => {
	
	let mockAuthRepository: AuthRepository;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	const tokenModel = new TokenModel('token', 'a');
	const testAuth:Auth = {username:'user', password:'pass'};
	const testOrgaModel = new OrgaModel('ooo', 'orga', 'o1', true, false);
	const testRoles = 'admin';

	beforeEach(() => {
		jest.clearAllMocks();
		mockAuthRepository = new MockAuthRepository();
	});

	test('el usecase de registro debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockAuthRepository, 'registerUser').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(listUsers[0]))));

		//act
		const useCase = new RegisterUser(mockAuthRepository);
		const result = await useCase.execute(listUsers[0], testAuth, testRoles);
		//assert
		expect(mockAuthRepository.registerUser).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(ModelContainer.fromOneItem(listUsers[0])));
	});

	test('el usecase de registro de usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockAuthRepository, 'registerUser').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new RegisterUser(mockAuthRepository);
		const result = await useCase.execute(listUsers[0], testAuth, testRoles);
		//assert
		expect(mockAuthRepository.registerUser).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});