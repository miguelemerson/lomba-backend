import { UserModel } from '../../src/data/models/user_model';
import { MongoError } from 'mongodb';
import { ErrorResponse, RouterResponse} from '../../src/core/router_response';
import { ModelContainer } from '../../src/core/model_container';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../src/core/errors/failures';

describe('Test para el router response', () => {

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('Un router response de DatabaseFailure', () => {
		//arrange
		const exc = new DatabaseFailure('errorname', 'message error', '099', new MongoError('mongomessage'));

		//act
		const result = new RouterResponse('1.0', exc, 'test', {}, 'test');

		//assert
		expect(result.data).toBeUndefined();
		expect(result.error).toBeDefined();
		expect(result.error).toBeInstanceOf(ErrorResponse);
		expect(result.error?.errors?.length).toBeGreaterThanOrEqual(1);
	});

	test('Un router response de NetworkFailure', () => {
		//arrange
		const exc = new NetworkFailure('errorname', 'message error', '098', new Error('netmessage'));

		//act
		const result = new RouterResponse('1.0', exc, 'test', {}, 'test');

		//assert
		expect(result.data).toBeUndefined();
		expect(result.error).toBeDefined();
		expect(result.error).toBeInstanceOf(ErrorResponse);
	});

	test('Un router response de GenericFailure', () => {
		//arrange
		const exc = new GenericFailure('errorname', 'message error');

		//act
		const result = new RouterResponse('1.0', exc, 'test', {}, 'test');

		//assert
		expect(result.data).toBeUndefined();
		expect(result.error).toBeDefined();
		expect(result.error).toBeInstanceOf(ErrorResponse);
	});

	test('Un router response de Error', () => {
		//arrange
		const exc = new Error('netmessage');

		//act
		const result = new RouterResponse('1.0', exc, 'test', {}, 'test');

		//assert
		expect(result.data).toBeUndefined();
		expect(result.error).toBeDefined();
		expect(result.error).toBeInstanceOf(ErrorResponse);
	});

	test('Un router response de error de string', () => {
		//arrange
		const exc = 'mensaje string';

		//act
		const result = new RouterResponse('1.0', exc, 'test', {}, 'test');

		//assert
		expect(result.data).toBeUndefined();
		expect(result.error).toBeDefined();
		expect(result.error).toBeInstanceOf(ErrorResponse);
	});

	test('Un router response de ModelContainer', () => {
		//arrange
		const data = new ModelContainer<UserModel>(listUsers);

		//act
		const result = new RouterResponse('1.0', data, 'test', {}, 'test');

		//assert
		expect(result.data).toBeDefined();
		expect(result.error).toBeUndefined();
		
	});

	test('Un router response de otro objeto', () => {
		//arrange
		const data = listUsers[0];

		//act
		const result = new RouterResponse('1.0', data, 'test', {}, 'test');
		
		//assert
		expect(result.data).toBeDefined();
		expect(result.error).toBeUndefined();
		expect(result.data?.items?.length).toBeGreaterThanOrEqual(1);
        
		
	});

});