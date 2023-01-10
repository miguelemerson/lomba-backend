import {checkData01, data_insert01} from '../../../src/core/builtindata/load_data_01';
import { ModelContainer } from '../../../src/core/model_container';
import { OrgaDataSource } from '../../../src/data/datasources/orga_data_source';
import { OrgaUserDataSource } from '../../../src/data/datasources/orgauser_data_source';
import { PasswordDataSource } from '../../../src/data/datasources/password_data_source';
import { RoleDataSource } from '../../../src/data/datasources/role_data_source';
import { UserDataSource } from '../../../src/data/datasources/user_data_source';
import { OrgaModel } from '../../../src/data/models/orga_model';
import { OrgaUserModel } from '../../../src/data/models/orgauser_model';
import { PasswordModel } from '../../../src/data/models/password_model';
import { RoleModel } from '../../../src/data/models/role_model';
import { UserModel } from '../../../src/data/models/user_model';

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

describe('Test del load data 01', () => {

	let mockUserDataSource: UserDataSource;
	let mockRoleDataSource: RoleDataSource;
	let mockOrgaDataSource: OrgaDataSource;
	let mockOrgaUserDataSource: OrgaUserDataSource;
	let mockPasswordDataSource: PasswordDataSource;

	beforeEach(() => {
		jest.clearAllMocks();

		mockUserDataSource = new MockUserDataSource();
		mockRoleDataSource = new MockRoleDataSource();
		mockOrgaDataSource = new MockOrgaDataSource();
		mockOrgaUserDataSource = new MockOrgaUserDataSource();
		mockPasswordDataSource = new MockPasswordDataSource();

	});

	const test_roleName = 'admin';
	const test_roles = data_insert01.roles;
	const test_users = data_insert01.users;
	const test_orgas = data_insert01.orgas;
	const test_orgausers = data_insert01.orgausers;

	test('Revisión de roles', () => {
		//arrange
		const roles = data_insert01.roles;
		//act

		//assert
		expect(roles.length).toEqual(5);
	});

	test('Revisión de usuarios', () => {
		//arrange
		const users = data_insert01.users;
		//act
		const len = users.length;
		const enables = users.filter(e=>e.enabled == true).length;
		const builtins = users.filter(e=>e.builtin == true).length;

		//assert
		expect(len).toEqual(7);
		expect(enables).toEqual(5);
		expect(builtins).toEqual(2);
	});

	test('Revisión de organizaciones', () => {
		//arrange
		const orgas = data_insert01.orgas;
		//act
		const len = orgas.length;
		const enables = orgas.filter(e=>e.enabled == true).length;
		const builtins = orgas.filter(e=>e.builtin == true).length;

		//assert
		expect(len).toEqual(2);
		expect(enables).toEqual(2);
		expect(builtins).toEqual(2);
	});

	test('Revisión de asociación de orgas con usuarios', () => {
		//arrange
		const users = data_insert01.users;
		const orgas = data_insert01.orgas;
		const orgausers = data_insert01.orgausers;
		//act
		const len = orgausers.length;
		const ascSuper = orgausers.filter(a=>a.orgaId == orgas[0].id);
		const ascAdmin = orgausers.filter(a=>a.orgaId == orgas[1].id);
        
		//assert
		expect(len).toEqual(7);
		expect(ascSuper.length).toEqual(1);
		expect(ascAdmin.length).toEqual(6);
	});

	test('debe agregar roles, usuarios, orgas y orgausers', async () => {
		//arrange
		const model_con_role = ModelContainer.fromOneItem(new RoleModel(test_roles[0].name, test_roles[0].enabled));
		const model_void_role = new ModelContainer<RoleModel>([]);
		const model_con_user = ModelContainer.fromOneItem(new UserModel(test_users[1].id, test_users[1].name, test_users[1].username, test_users[1].email, test_users[1].enabled, test_users[1].builtin));
		const model_void_user = new ModelContainer<UserModel>([]);
		const model_con_pass = ModelContainer.fromOneItem(new PasswordModel(model_con_user.items[0].id, 'hhh', 'sss', true, false));
		const model_void_pass = new ModelContainer<PasswordModel>([]);
		const model_con_orga = ModelContainer.fromOneItem(new OrgaModel(test_orgas[0].id, test_orgas[0].name, test_orgas[0].code, test_orgas[0].enabled, test_orgas[0].builtin));
		const model_void_orga = new ModelContainer<OrgaModel>([]);
		const model_con_orus = ModelContainer.fromOneItem(new OrgaUserModel(model_con_orga.items[0].id, model_con_user.items[0].id, [model_con_role.items[0].toEntity()], true, false));
		const model_void_orus = new ModelContainer<OrgaUserModel>([]);


		jest.spyOn(mockRoleDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_role));

		jest.spyOn(mockRoleDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_role));

		jest.spyOn(mockUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_user));

		jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_user));

		jest.spyOn(mockPasswordDataSource, 'delete').mockImplementation(() => Promise.resolve(true));

		jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_pass));
		
		jest.spyOn(mockOrgaDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_orga));

		jest.spyOn(mockOrgaDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_orga));

		jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_orus));

		jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_orus));


		await checkData01(mockRoleDataSource, mockUserDataSource, mockPasswordDataSource, mockOrgaDataSource, mockOrgaUserDataSource);

		expect(mockRoleDataSource.getOne).toBeCalledTimes(5);
		expect(mockRoleDataSource.add).toBeCalledTimes(5);
		expect(mockUserDataSource.getOne).toBeCalledTimes(7);
		expect(mockUserDataSource.add).toBeCalledTimes(7);

		//expect(mockPasswordDataSource.delete).toBeCalledTimes(7);
		//expect(mockPasswordDataSource.add).toBeCalledTimes(7);

		expect(mockOrgaDataSource.getOne).toBeCalledTimes(2);
		expect(mockOrgaDataSource.add).toBeCalledTimes(2);
		expect(mockOrgaUserDataSource.getOne).toBeCalledTimes(7);
		expect(mockOrgaUserDataSource.add).toBeCalledTimes(7);	
	});

});