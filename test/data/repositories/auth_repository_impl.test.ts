import { MongoError } from 'mongodb';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../../src/core/errors/failures';
import { ModelContainer } from '../../../src/core/model_container';
import { HashPassword } from '../../../src/core/password_hash';
import { OrgaUserDataSource } from '../../../src/data/datasources/orgauser_data_source';
import { OrgaDataSource } from '../../../src/data/datasources/orga_data_source';
import { PasswordDataSource } from '../../../src/data/datasources/password_data_source';
import { RoleDataSource } from '../../../src/data/datasources/role_data_source';
import { UserDataSource } from '../../../src/data/datasources/user_data_source';
import { OrgaUserModel } from '../../../src/data/models/orgauser_model';
import { OrgaModel } from '../../../src/data/models/orga_model';
import { PasswordModel } from '../../../src/data/models/password_model';
import { RoleModel } from '../../../src/data/models/role_model';
import { UserModel } from '../../../src/data/models/user_model';
import { OrgaUserRepositoryImpl } from '../../../src/data/repositories/orgauser_repository_impl';
import { OrgaRepositoryImpl } from '../../../src/data/repositories/orga_repository_impl';
import { AuthRepositoryImpl } from '../../../src/data/repositories/auth_repository_impl';
import { PasswordRepositoryImpl } from '../../../src/data/repositories/password_repository_impl';
import { RoleRepositoryImpl } from '../../../src/data/repositories/role_repository_impl';
import { UserRepositoryImpl } from '../../../src/data/repositories/user_repository_impl';
import { Auth } from '../../../src/domain/entities/auth';

class MockUserDataSource implements UserDataSource {
	getMany(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():UserModel{throw new Error('Method not implemented.');}
}

class MockRoleDataSource implements RoleDataSource {
	getMany(): Promise<ModelContainer<RoleModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():RoleModel{throw new Error('Method not implemented.');}
}

class MockOrgaDataSource implements OrgaDataSource {
	getMany(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():OrgaModel{throw new Error('Method not implemented.');}
}

class MockOrgaUserDataSource implements OrgaUserDataSource {
	getMany(): Promise<ModelContainer<OrgaUserModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():OrgaUserModel{throw new Error('Method not implemented.');}
}
class MockPasswordDataSource implements PasswordDataSource {
	getMany(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<PasswordModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<PasswordModel>>{
		throw new Error('Method not implemented.');
	}
	setId():PasswordModel{throw new Error('Method not implemented.');}
}

describe('Auth Repository Implementation', () => {
	let mockUserDataSource: UserDataSource;
	let userRepository: UserRepositoryImpl;
	let mockRoleDataSource: RoleDataSource;
	let roleRepository: RoleRepositoryImpl;
	let mockOrgaDataSource: OrgaDataSource;
	let orgaRepository: OrgaRepositoryImpl;
	let mockOrgaUserDataSource: OrgaUserDataSource;
	let orgaUserRepository: OrgaUserRepositoryImpl;
	let mockPasswordDataSource: PasswordDataSource;
	let passwordRepository: PasswordRepositoryImpl;
	let authRepository: AuthRepositoryImpl;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];
	const listRoles: RoleModel[] = [
		new RoleModel('fff', true),
		new RoleModel('hhh', true),
	];
	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];
	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];
	const testAuth:Auth = {username:'user', password:'pass'};

	const hashPass1 = HashPassword.createHash('4321');
	const hashPass2 = HashPassword.createHash('1234');

	const listPasswords: PasswordModel[] = [
		new PasswordModel('ppp', hashPass1.hash, hashPass2.salt, true, true),
		new PasswordModel('aaa', hashPass2.hash, hashPass1.salt, true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockUserDataSource = new MockUserDataSource();
		mockRoleDataSource = new MockRoleDataSource();
		mockOrgaDataSource = new MockOrgaDataSource();
		mockOrgaUserDataSource = new MockOrgaUserDataSource();
		userRepository = new UserRepositoryImpl(mockUserDataSource);
		roleRepository = new RoleRepositoryImpl(mockRoleDataSource);
		orgaRepository = new OrgaRepositoryImpl(mockOrgaDataSource);
		orgaUserRepository = new OrgaUserRepositoryImpl(mockOrgaUserDataSource);
		mockPasswordDataSource = new MockPasswordDataSource();
		passwordRepository = new PasswordRepositoryImpl(mockPasswordDataSource);
		authRepository = new AuthRepositoryImpl(mockUserDataSource,mockOrgaDataSource,mockPasswordDataSource,mockOrgaUserDataSource);
	});

	describe('getAuth', () => {
		test('debe entregar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getMany').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			//act
			const result = await authRepository.getAuth(testAuth);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(result.isRight());
			expect(mockUserDataSource.getMany).toBeCalledTimes(1);
			//expect(value).toStrictEqual(ModelContainer.fromOneItem(listUsers[0]));
		});
		/*
		test('deberá generar error de Database al buscar un usuario', async () => {
			//arrange
			jest.spyOn(mockAuthDataSource, 'getOne').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await authRepository.getAuth(testAuth);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al buscar un usuario', async () => {
			//arrange
			jest.spyOn(mockAuthDataSource, 'getOne').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await authRepository.getAuth(testAuth);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al buscar un usuario', async () => {
			//arrange
			jest.spyOn(mockAuthDataSource, 'getOne').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await authRepository.getAuth(testAuth);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	*/

	});

/*
	describe('registerUser', () => {
		test('debe llamar a los métodos de agregar', async () => {
			//arrange
			jest.spyOn(mockAuthDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			//act
			const result = await authRepository.registerUser(listUsers[0], testAuth, 'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});	

			//assert
			expect(result.isRight());
			expect(mockAuthDataSource.add).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listUsers[0]));
		});

		test('deberá generar error de Database al agregar un usuario', async () => {
			//arrange
			jest.spyOn(mockAuthDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await authRepository.registerUser(listUsers[0], testAuth, 'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al agregar un usuario', async () => {
			//arrange
			jest.spyOn(mockAuthDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await authRepository.registerUser(listUsers[0], testAuth, 'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al agregar un usuario', async () => {
			//arrange
			jest.spyOn(mockAuthDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await authRepository.registerUser(listUsers[0], testAuth, 'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	
	});*/
});