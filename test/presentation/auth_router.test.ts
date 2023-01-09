import request from 'supertest';
import { GetTokenUseCase } from '../../src/domain/usecases/auth/get_token';
import { RegisterUserUseCase } from '../../src/domain/usecases/auth/register_user';
import AuthRouter from '../../src/presentation/auth_router';
import server from '../../src/server';
import { UserModel } from '../../src/data/models/user_model';
import { ModelContainer } from '../../src/core/model_container';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { Either } from '../../src/core/either';
import { RouterResponse } from '../../src/core/router_response';
import { TokenModel } from '../../src/data/models/token_model';
import { Auth } from '../../src/domain/entities/auth';

class MockGetTokenUseCase implements GetTokenUseCase {
	execute(): Promise<Either<Failure,ModelContainer<TokenModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockRegisterUserUseCase implements RegisterUserUseCase {
	execute(): Promise<Either<Failure,ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
}

describe('Auth Router', () => {

	const tokenModel = new TokenModel('token', 'a');
	const testAuth:Auth = {username:'user', password:'pass'};
	const testUser =new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false);

	let mockGetTokenUseCase: GetTokenUseCase;
	let mockRegisterUserUseCase: RegisterUserUseCase;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeAll(() => {
		mockGetTokenUseCase = new MockGetTokenUseCase();
		mockRegisterUserUseCase = new MockRegisterUserUseCase();

		server.use('/api/v1/auth', AuthRouter(mockGetTokenUseCase, mockRegisterUserUseCase));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	//auth de usuario vía POST
	describe('POST /auth', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockGetTokenUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(tokenModel))));

			//act
			const response = await request(server).post('/api/v1/auth').send(testAuth);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetTokenUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetTokenUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/auth').send(testAuth);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockGetTokenUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetTokenUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/auth').send(testAuth);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockGetTokenUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});
    

	//registro de usuario vía POST
	describe('POST /auth/registration', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockRegisterUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(testUser))));

			//act
			const response = await request(server).post('/api/v1/auth/registration').send({user:testUser, auth:testAuth, roles:'user1'});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockRegisterUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockRegisterUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/auth/registration').send({user:testUser, auth:testAuth, roles:'user1'});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockRegisterUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockRegisterUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/auth/registration').send({user:testUser, auth:testAuth, roles:'user1'});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockRegisterUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

});