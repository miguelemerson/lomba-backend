import {data_insert01} from '../../../src/core/builtindata/load_data_01';

describe('Test del load data 01', () => {

	beforeEach(() => {
		jest.clearAllMocks();
	});

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

});