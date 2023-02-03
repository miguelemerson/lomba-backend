import request from 'supertest';


import { data_insert01 } from '../../src/core/builtindata/load_data_01';
import { Either } from '../../src/core/either';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { generateJWT } from '../../src/core/jwt';
import { ModelContainer } from '../../src/core/model_container';
import { RouterResponse } from '../../src/core/router_response';
import { UserModel } from '../../src/data/models/user_model';
import { Post } from '../../src/domain/entities/flows/post';
import { AddTextPostUseCase } from '../../src/domain/usecases/flows/add_text_post';
import { GetPostsUseCase } from '../../src/domain/usecases/flows/get_posts';
import { SendVoteUseCase } from '../../src/domain/usecases/flows/send_vote';
import PostsRouter from '../../src/presentation/post_router';
import server from '../../src/server';
import { PostItem } from '../../src/domain/entities/flows/postitem';
import { PostModel } from '../../src/data/models/flows/post_model';

class MockAddTextPostUseCase implements AddTextPostUseCase {
	execute(): Promise<Either<Failure,ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetPostsUseCase implements GetPostsUseCase {
	execute(): Promise<Either<Failure,ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

class MockSendVoteUseCase implements SendVoteUseCase {
	execute(): Promise<Either<Failure,ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

describe('Post Router', () => {
	let mockAddTextPostUseCase: AddTextPostUseCase;
	let mockGetPostsUseCase: GetPostsUseCase;
	let mockSendVoteUseCase: SendVoteUseCase;

	/*const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];*/

	const UrlGetPost = '?orgaId=00000200-0200-0200-0200-000000000200&userId=00000005-0005-0005-0005-000000000005&flowId=00000111-0111-0111-0111-000000000111&stageId=00000AAA-0111-0111-0111-000000000111&boxPage=uploaded';

	const fakeGetPost: PostModel = new PostModel('00001AAA-0119-0111-0111-000000000000',
		[],'primer post del sistema','00000200-0200-0200-0200-000000000200','00000005-0005-0005-0005-000000000005',
		'00000111-0111-0111-0111-000000000111','00000AAA-0111-0111-0111-000000000111',true,true);

	const fakeAddTextPost = {
		orgaId:'00000200-0200-0200-0200-000000000200',
		userId:'00000005-0005-0005-0005-000000000005',
		flowId:'00000111-0111-0111-0111-000000000111',
		title:'cuarto post del sistema',
		textContent:'ok ok',
		draft:'false'
	};

	//carga de identificadores para las pruebas
	const testUserIdAdmin = data_insert01.users[1].id;
	const testUserIdUser1 = data_insert01.users[4].id;
	const testOrgaIdDefault = data_insert01.orgas[1].id;

	const testTokenAdmin = generateJWT({userId:testUserIdAdmin, orgaId: testOrgaIdDefault, roles: 'admin'}, 'lomba', 60*60);
	const testTokenUser1 = generateJWT({userId:testUserIdUser1, orgaId: testOrgaIdDefault, roles: 'user'}, 'lomba', 60*60);


	beforeAll(() => {
		mockAddTextPostUseCase = new MockAddTextPostUseCase();
		mockGetPostsUseCase = new MockGetPostsUseCase();
		mockSendVoteUseCase = new MockSendVoteUseCase();

		server.use('/api/v1/post', PostsRouter(mockGetPostsUseCase, mockAddTextPostUseCase, mockSendVoteUseCase));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	//get de post
	describe('GET /post', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetPostsUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetPostsUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeUndefined();
			expect(roures.error).toBeDefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//post de usuarios
	describe('POST /post/', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const inputData = fakeAddTextPost;
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).post('/api/v1/post/').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const inputData = fakeGetPost;
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/').send(inputData);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			const inputData = fakeGetPost;
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/').send(inputData).set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			const inputData = fakeGetPost;
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			const inputData = fakeGetPost;
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/post/').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//put de modificar usuarios con especificación de id en ruta
	describe('PUT /user/:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const inputData = fakeGetPost;
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).put(`/api/v1/post/box/${UrlGetPost}`).send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
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
			const inputData = fakeGetPost;
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put(`/api/v1/post/box/${UrlGetPost}`).send(inputData);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockUpdateUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no tiene el role', async () => {
			//arrange
			const inputData = fakeGetPost;
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put(`/api/v1/post/box/${UrlGetPost}`).send(inputData).send(inputData).set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockUpdateUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			const inputData = fakeGetPost;
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put(`/api/v1/post/box/${UrlGetPost}`).send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdateUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			const inputData = fakeGetPost;
			jest.spyOn(mockUpdateUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put(`/api/v1/post/box/${UrlGetPost}`).send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
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
			const response = await request(server).put('/api/v1/post/enable/1?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
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
			const response = await request(server).put('/api/v1/post/enable/1?enable=true');
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
			const response = await request(server).put('/api/v1/post/enable/1?enable=true').set({Authorization: 'Bearer ' + testTokenUser1});
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
			const response = await request(server).put('/api/v1/post/enable/1?enable=true').set({Authorization: 'Bearer ' + testTokenAdmin});
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
			const response = await request(server).put('/api/v1/post/enable/1?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
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
			const response = await request(server).delete(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenAdmin});
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
			const response = await request(server).delete(`/api/v1/post/box/${UrlGetPost}`);
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
			const response = await request(server).delete(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenUser1});
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
			const response = await request(server).delete(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenAdmin});
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
			const response = await request(server).delete(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockDeleteUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});   
	
	//get usuarios que no están en una orgaId
	describe('GET /notinorga/:orgaId', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockGetUsersNotInOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/post/notinorga/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetUsersNotInOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(expectedData.length);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 200 y con datos con parámetros', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockGetUsersNotInOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/post/notinorga/1?sort=[["name", 1]]&pageIndex=1&itemsPerPage=10').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetUsersNotInOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(expectedData.length);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no identificado', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockGetUsersNotInOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/post/notinorga/1');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetUsersNotInOrgaUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no tiene el role', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockGetUsersNotInOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/post/notinorga/1').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockGetUsersNotInOrgaUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetUsersNotInOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/post/notinorga/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetUsersNotInOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetUsersNotInOrgaUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/post/notinorga/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetUsersNotInOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//get usuario si existe
	describe('GET /if/exists', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockExistsUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));
	
			//act
			const response = await request(server).get('/api/v1/post/if/exists/').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
	
			//assert
			expect(response.status).toBe(200);
			expect(mockExistsUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(expectedData.length);
			expect(roures.error).toBeUndefined();
	
		});
	
		test('debe retornar 401 porque usuario no identificado', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockExistsUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));
	
			//act
			const response = await request(server).get('/api/v1/post/if/exists/');
			const roures = response.body as RouterResponse;
	
			//assert
			expect(response.status).toBe(401);
			expect(mockExistsUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	
		test('debe retornar 403 porque usuario no tiene el role', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockExistsUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(expectedData))));
	
			//act
			const response = await request(server).get('/api/v1/post/if/exists/').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;
	
			//assert
			expect(response.status).toBe(403);
			expect(mockExistsUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	
		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockExistsUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));
	
			//act
			const response = await request(server).get('/api/v1/post/if/exists/').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
	
			//asserts
			expect(response.status).toBe(500);
			expect(mockExistsUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	
		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockExistsUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));
	
			//act
			const response = await request(server).get('/api/v1/post/if/exists/').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
	
			//asserts
			expect(response.status).toBe(500);
			expect(mockExistsUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});
});