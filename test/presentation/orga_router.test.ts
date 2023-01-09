import request from 'supertest';
import { AddOrgaUseCase } from '../../src/domain/usecases/orgas/add_orga';
import { DeleteOrgaUseCase } from '../../src/domain/usecases/orgas/delete_orga';
import { EnableOrgaUseCase } from '../../src/domain/usecases/orgas/enable_orga';
import { GetOrgaUseCase } from '../../src/domain/usecases/orgas/get_orga';
import { GetOrgasUseCase } from '../../src/domain/usecases/orgas/get_orgas';
import { UpdateOrgaUseCase } from '../../src/domain/usecases/orgas/update_orga';


import OrgaRouter from '../../src/presentation/orga_router';
import server from '../../src/server';
import { OrgaModel } from '../../src/data/models/orga_model';
import { ModelContainer } from '../../src/core/model_container';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { Either } from '../../src/core/either';
import { RouterResponse } from '../../src/core/router_response';

class MockAddOrgaUseCase implements AddOrgaUseCase {
	execute(): Promise<Either<Failure,ModelContainer<OrgaModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockDeleteOrgaUseCase implements DeleteOrgaUseCase {
	execute(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}
}

class MockEnableOrgaUseCase implements EnableOrgaUseCase {
	execute(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetOrgaUseCase implements GetOrgaUseCase {
	execute(): Promise<Either<Failure,ModelContainer<OrgaModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetOrgasUseCase implements GetOrgasUseCase {
	execute(): Promise<Either<Failure,ModelContainer<OrgaModel>>> {
		throw new Error('Method not implemented.');
	}
}
class MockUpdateOrgaUseCase implements UpdateOrgaUseCase {
	execute(): Promise<Either<Failure,ModelContainer<OrgaModel>>> {
		throw new Error('Method not implemented.');
	}
}

describe('Orga Router', () => {
	let mockAddOrgaUseCase: AddOrgaUseCase;
	let mockDeleteOrgaUseCase: DeleteOrgaUseCase;
	let mockEnableOrgaUseCase: EnableOrgaUseCase;
	let mockGetOrgaUseCase: GetOrgaUseCase;
	let mockGetOrgasUseCase: GetOrgasUseCase;
	let mockUpdateOrgaUseCase: UpdateOrgaUseCase;

	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];

	beforeAll(() => {
		mockAddOrgaUseCase = new MockAddOrgaUseCase();
		mockDeleteOrgaUseCase = new MockDeleteOrgaUseCase();
		mockEnableOrgaUseCase = new MockEnableOrgaUseCase();
		mockGetOrgaUseCase = new MockGetOrgaUseCase();
		mockGetOrgasUseCase = new MockGetOrgasUseCase();
		mockUpdateOrgaUseCase = new MockUpdateOrgaUseCase();

		server.use('/api/v1/orga', OrgaRouter(mockGetOrgaUseCase, mockGetOrgasUseCase, mockAddOrgaUseCase, mockUpdateOrgaUseCase, mockEnableOrgaUseCase, mockDeleteOrgaUseCase));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	//get de orga por id
	describe('GET /orga:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listOrgas[0];
			jest.spyOn(mockGetOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orga/1');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/orga/1');
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetOrgaUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/orga/1');
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//get orgas all
	describe('GET /', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listOrgas;
			jest.spyOn(mockGetOrgasUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orga/');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetOrgasUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(expectedData.length);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetOrgasUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/orga/');
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetOrgasUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetOrgasUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/orga/');
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetOrgasUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//post de orgas
	describe('POST /orga', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const inputData = listOrgas[0];
			jest.spyOn(mockAddOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).post('/api/v1/orga').send(inputData);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockAddOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			const inputData = listOrgas[0];
			jest.spyOn(mockAddOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/orga').send(inputData);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			const inputData = listOrgas[0];
			jest.spyOn(mockAddOrgaUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/orga').send(inputData);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//put de modificar orgas con especificación de id en ruta
	describe('PUT /orga/:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const inputData = listOrgas[0];
			jest.spyOn(mockUpdateOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).put('/api/v1/orga/1').send(inputData);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockUpdateOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			const inputData = listOrgas[0];
			jest.spyOn(mockUpdateOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/orga/1').send(inputData);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdateOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			const inputData = listOrgas[0];
			jest.spyOn(mockUpdateOrgaUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/orga/1').send(inputData);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdateOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//put de habilitación de orga con id en ruta
	describe('PUT /orga/enable/:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockEnableOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/orga/enable/1?enable=false');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockEnableOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockEnableOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/orga/enable/1?enable=true');
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnableOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockEnableOrgaUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/orga/enable/1?enable=false');
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnableOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//delete de orga por id en ruta
	describe('DELETE /:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockDeleteOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).delete('/api/v1/orga/1');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockDeleteOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockDeleteOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).delete('/api/v1/orga/1');
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockDeleteOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockDeleteOrgaUseCase, 'execute').mockImplementation(() => Promise.reject(new Error()));

			//act
			const response = await request(server).delete('/api/v1/orga/1');
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockDeleteOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});    
});