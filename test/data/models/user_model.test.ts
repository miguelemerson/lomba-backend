import { UserModel } from '../../../src/data/models/user_model';


describe('Test de user model', () => {

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listUsers[0];

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual({id: model.id, name: model.name, username: model.username, email: model.email, enabled: model.enabled, builtin: model.builtin, created: model.created, orgas: model.orgas});
	});

});