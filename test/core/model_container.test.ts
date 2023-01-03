import { RoleModel } from '../../src/data/models/role_model';
import { ModelContainer } from '../../src/core/model_container';


describe('Test de Model Container', () => {

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('consigue un model container con un elemento', () => {
		//arrange
		const model = new RoleModel('roledemo', true);

		//act
		const result = ModelContainer.fromOneItem(model);

		//assert
		expect(result).toEqual(new ModelContainer<RoleModel>([model]));
	});

});