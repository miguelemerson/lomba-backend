import request from 'supertest';


import { data_insert01 } from '../../src/core/builtindata/load_data_01';
import { Either } from '../../src/core/either';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { generateJWT } from '../../src/core/jwt';
import { ModelContainer } from '../../src/core/model_container';
import { RouterResponse } from '../../src/core/router_response';
import { PostModel } from '../../src/data/models/flows/post_model';
import { Post } from '../../src/domain/entities/flows/post';
import { AddTextPostUseCase } from '../../src/domain/usecases/flows/add_text_post';
import { GetPostsUseCase } from '../../src/domain/usecases/flows/get_posts';
import { SendVoteUseCase } from '../../src/domain/usecases/flows/send_vote';
import PostsRouter from '../../src/presentation/post_router';
import server from '../../src/server';

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

	const UrlGetPost = '?orgaId=00000200-0200-0200-0200-000000000200&userId=00000005-0005-0005-0005-000000000005&flowId=00000111-0111-0111-0111-000000000111&stageId=00000AAA-0111-0111-0111-000000000111&boxPage=uploaded&searchText=post';

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

	const fakeSendPost = {
		userId:'00000005-0005-0005-0005-000000000005',
		flowId:'00000111-0111-0111-0111-000000000111',
		stageId:'00000AAA-0111-0111-0111-000000000111',
		postId:'00001AAA-0119-0111-0111-000000000000',
		voteValue:'1'
	};

	//carga de identificadores para las pruebas
	const testUserIdUser = data_insert01.users[4].id;
	const testUserIdRev1 = data_insert01.users[3].id;
	const testOrgaIdDefault = data_insert01.orgas[1].id;

	const testTokenUser = generateJWT({userId:testUserIdUser, orgaId: testOrgaIdDefault, roles: 'user'}, 'lomba', 60*60);
	const testTokenRev1 = generateJWT({userId:testUserIdRev1, orgaId: testOrgaIdDefault, roles: 'reviewer'}, 'lomba', 60*60);


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

		test('debe retornar 200 y sin datos', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get('/api/v1/post/box/').set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetPostsUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 200 y con sort y parámetros', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get('/api/v1/post/box/?sort=%5B%5B%22created%22,1%5D%5D&paramvars=%7B%22isdraft%22:false%7D&boxpage=uploaded&searchtext=&pageindex=1&pagesize=10').set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetPostsUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetPostsUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		/*
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
		*/

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenUser});
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
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenUser});
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
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(fakeGetPost))));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost).set({Authorization: 'Bearer ' + testTokenUser});
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
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost).set({Authorization: 'Bearer ' + testTokenRev1});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//post de usuarios
	describe('SendPost /post/vote/', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			//const inputData = fakeAddTextPost;
			jest.spyOn(mockSendVoteUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(fakeGetPost))));

			//act
			const response = await request(server).post('/api/v1/post/vote/').send(fakeSendPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockSendVoteUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockSendVoteUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/vote/').send(fakeSendPost);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockSendVoteUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockSendVoteUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/vote/').send(fakeSendPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockSendVoteUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockSendVoteUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/post/vote/').send(fakeSendPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockSendVoteUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

});