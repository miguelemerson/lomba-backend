import { MongoError } from 'mongodb';
import { DatabaseException } from '../../../src/core/errors/database_exception';
import { ModelContainer } from '../../../src/core/model_container';
import { UserDataSource } from '../../../src/data/datasources/user_data_source';
import { UserModel } from '../../../src/data/models/user_model';
import {UserRepositoryImpl} from '../../../src/data/repositories/user_repository_impl';

class MockUserDataSource implements UserDataSource {
	getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<UserModel> | null> {
		throw new Error('Method not implemented.');
	}    

	getOne(id: string): Promise<ModelContainer<UserModel> | null>{
		throw new Error('Method not implemented.');
	}
	add(user: UserModel) : Promise<ModelContainer<UserModel> | null>{
		throw new Error('Method not implemented.');
	}
	update(id: string, user: object): Promise<ModelContainer<UserModel> | null>{
		throw new Error('Method not implemented.');
	}
	enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(id: string): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
}

describe('User Repository Implementation', () => {
	let mockUserDataSource: UserDataSource;
	let userRepository: UserRepositoryImpl;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockUserDataSource = new MockUserDataSource();
		userRepository = new UserRepositoryImpl(mockUserDataSource);
	});

	describe('getUsersByOrgaId', () => {
		test('deberá entregar lista de usuarios', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockUserDataSource, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await userRepository.getUsersByOrgaId('aaa', undefined);
			//assert
			expect(result).toEqual(new ModelContainer(expectedData));
		});
		/*
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getMany').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			//const func = userRepository.getUsersByOrgaId;
			expect(userRepository.getUsersByOrgaId('aaa', undefined)).rejects.toThrow(DatabaseException);
			
			//assert
			//expect(await func('aaa', undefined)).toBeDefined();
		});
        */
	});

	describe('getUser', () => {
		test('debe entregar un usuario', async () => {
			jest.spyOn(mockUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			const result = await userRepository.getUser('aaa');
			expect(mockUserDataSource.getOne).toHaveBeenCalledWith('aaa');
			expect(result).toStrictEqual(ModelContainer.fromOneItem(listUsers[0]));
		});
	});


	describe('addUser', () => {
		test('debe llamar a los métodos de agregar', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			//act
			const result = await userRepository.addUser('aaa', 'admin', 'admin', 'mp@mp.com', true, false);
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(result).toEqual(ModelContainer.fromOneItem(listUsers[0]));
		});
	});

	describe('updateUser', () => {
		test('debe llamar a las funciones de actualzar', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			//act
			const result = await userRepository.updateUser('uuu', listUsers[0]);
			//assert
			expect(mockUserDataSource.update).toBeCalledTimes(1);
			expect(result).toEqual(ModelContainer.fromOneItem(listUsers[0]));
		});
	});

	describe('enableUser', () => {
		test('debe llamar a las funciones de habilitación', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'enable').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await userRepository.enableUser('aaa', true);
			//assert
			expect(mockUserDataSource.enable).toBeCalledTimes(1);
			expect(result).toEqual(true);
		});
	});

	describe('deleteUser', () => {
		test('debe llamar a las funciones de elminación', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'delete').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await userRepository.deleteUser('aaa');
			//assert
			expect(mockUserDataSource.delete).toBeCalledTimes(1);
			expect(result).toEqual(true);
		});
	});




});