import request from 'supertest';
import { AddUserUseCase } from '../../src/domain/usecases/users/add_user';
import { DeleteUserUseCase } from '../../src/domain/usecases/users/delete_user';
import { EnableUserUseCase } from '../../src/domain/usecases/users/enable_user';
import { GetUserUseCase } from '../../src/domain/usecases/users/get_user';
import { GetUsersByOrgaIdUseCase } from '../../src/domain/usecases/users/get_users_by_orga';
import { UpdateUserUseCase } from '../../src/domain/usecases/users/update_user';


import UserRouter from '../../src/presentation/user_router';
import server from '../../src/server';
import { UserModel } from '../../src/data/models/user_model';
import { ModelContainer } from '../../src/core/model_container';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { Either } from '../../src/core/either';
import { RouterResponse } from '../../src/core/router_response';
import { generateJWT } from '../../src/core/jwt';
import { data_insert01} from '../../src/core/builtindata/load_data_01';
import { GetUsersNotInOrgaUseCase } from '../../src/domain/usecases/users/get_users_notin_orga';
import { ExistsUserUseCase } from '../../src/domain/usecases/users/exists_user';

class MockAddUserUseCase implements AddUserUseCase {
	execute(): Promise<Either<Failure,ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockDeleteUserUseCase implements DeleteUserUseCase {
	execute(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}
}

class MockEnableUserUseCase implements EnableUserUseCase {
	execute(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetUserUseCase implements GetUserUseCase {
	execute(): Promise<Either<Failure,ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetUsersByOrgaIdUseCase implements GetUsersByOrgaIdUseCase {
	execute(): Promise<Either<Failure,ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
}
class MockUpdateUserUseCase implements UpdateUserUseCase {
	execute(): Promise<Either<Failure,ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetUsersNotInOrgaUseCase implements GetUsersNotInOrgaUseCase {
	execute(): Promise<Either<Failure,ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
}
class MockExistsUserUseCase implements ExistsUserUseCase {
	execute(): Promise<Either<Failure,ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
}

describe('User Router', () => {
	let mockAddUserUseCase: AddUserUseCase;
	let mockDeleteUserUseCase: DeleteUserUseCase;
	let mockEnableUserUseCase: EnableUserUseCase;
	let mockGetUserUseCase: GetUserUseCase;
	let mockGetUsersByOrgaIdUseCase: GetUsersByOrgaIdUseCase;
	let mockUpdateUserUseCase: UpdateUserUseCase;
	let mockGetUsersNotInOrgaUseCase: GetUsersNotInOrgaUseCase;
	let mockExistsUserUseCase: ExistsUserUseCase;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	//carga de identificadores para las pruebas
	const testUserIdAdmin = data_insert01.users[1].id;
	const testUserIdUser1 = data_insert01.users[4].id;
	const testOrgaIdDefault = data_insert01.orgas[1].id;

	const testTokenAdmin = generateJWT({userId:testUserIdAdmin, orgaId: testOrgaIdDefault, roles: 'admin'}, 'lomba', 60*60);
	const testTokenUser1 = generateJWT({userId:testUserIdUser1, orgaId: testOrgaIdDefault, roles: 'user'}, 'lomba', 60*60);


	beforeAll(() => {
		mockAddUserUseCase = new MockAddUserUseCase();
		mockDeleteUserUseCase = new MockDeleteUserUseCase();
		mockEnableUserUseCase = new MockEnableUserUseCase();
		mockGetUserUseCase = new MockGetUserUseCase();
		mockGetUsersByOrgaIdUseCase = new MockGetUsersByOrgaIdUseCase();
		mockUpdateUserUseCase = new MockUpdateUserUseCase();
		mockGetUsersNotInOrgaUseCase = new MockGetUsersNotInOrgaUseCase();
		mockExistsUserUseCase = new MockExistsUserUseCase();

		server.use('/api/v1/user', UserRouter(mockGetUserUseCase, mockGetUsersByOrgaIdUseCase, mockAddUserUseCase, mockUpdateUserUseCase, mockEnableUserUseCase, mockDeleteUserUseCase, mockGetUsersNotInOrgaUseCase, mockExistsUserUseCase));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	//get de usuario por id
	describe('GET /user:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listUsers[0];
			jest.spyOn(mockGetUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get('/api/v1/user/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = listUsers[0];
			jest.spyOn(mockGetUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get('/api/v1/user/1');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeUndefined();
			expect(roures.error).toBeDefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/user/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/user/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//get usuarios por orgaId
	describe('GET /byorga/:orgaId', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockGetUsersByOrgaIdUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/user/byorga/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetUsersByOrgaIdUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(expectedData.length);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no identificado', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockGetUsersByOrgaIdUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/user/byorga/1');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetUsersByOrgaIdUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no tiene el role', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockGetUsersByOrgaIdUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/user/byorga/1').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockGetUsersByOrgaIdUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetUsersByOrgaIdUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/user/byorga/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetUsersByOrgaIdUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetUsersByOrgaIdUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/user/byorga/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetUsersByOrgaIdUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//post de usuarios
	describe('POST /user', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockAddUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).post('/api/v1/user').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockAddUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockAddUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/user').send(inputData);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockAddUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockAddUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/user').send(inputData).set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockAddUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockAddUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/user').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockAddUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/user').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//put de modificar usuarios con especificación de id en ruta
	describe('PUT /user/:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).put('/api/v1/user/1').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockUpdateUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/user/1').send(inputData);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockUpdateUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no tiene el role', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/user/1').send(inputData).send(inputData).set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockUpdateUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/user/1').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdateUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			const inputData = listUsers[0];
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/user/1').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdateUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//put de habilitación de usuario con id en ruta
	describe('PUT /user/enable/:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockEnableUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/user/enable/1?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockEnableUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no identificado', async () => {
			//arrange
			jest.spyOn(mockEnableUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/user/enable/1?enable=true');
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockEnableUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no tiene el role', async () => {
			//arrange
			jest.spyOn(mockEnableUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/user/enable/1?enable=true').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockEnableUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});		

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockEnableUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/user/enable/1?enable=true').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnableUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockEnableUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/user/enable/1?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnableUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//delete de usuario por id en ruta
	describe('DELETE /:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockDeleteUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).delete('/api/v1/user/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockDeleteUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockDeleteUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).delete('/api/v1/user/1');
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockDeleteUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no tiene el role', async () => {
			//arrange
			jest.spyOn(mockDeleteUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).delete('/api/v1/user/1').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockDeleteUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockDeleteUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).delete('/api/v1/user/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockDeleteUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockDeleteUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error()));

			//act
			const response = await request(server).delete('/api/v1/user/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockDeleteUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});    
});