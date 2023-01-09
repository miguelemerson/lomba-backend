import { PasswordDataSourceImpl} from '../../../src/data/datasources/password_data_source';
import { PasswordModel } from '../../../src/data/models/password_model';
import { MongoWrapper } from '../../../src/core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../../src/core/model_container';


describe('Password MongoDB DataSource', () => {

	let dataSource: PasswordDataSourceImpl;
	let mongoWrapper: MongoWrapper<PasswordModel>;

	const listPasswords: PasswordModel[] = [
		new PasswordModel('ppp', '', '', true, true),
		new PasswordModel('aaa', '', '', true, false),
	];

	beforeAll(async () => {
		mongoWrapper = ({
			getMany: jest.fn(),
			getOne: jest.fn(),
			add: jest.fn(),
			update: jest.fn(),
			enable: jest.fn(),
			delete: jest.fn(),
		} as unknown) as MongoWrapper<PasswordModel>;

		dataSource = new PasswordDataSourceImpl(mongoWrapper);

	});

	afterEach(()=> {
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('agregar un usuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'add').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
		//act
		const data = await dataSource.add(listPasswords[0]);

		//assert
		expect(mongoWrapper.add).toBeCalledWith(listPasswords[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listPasswords[0]));

	});

	test('modificar un usuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'update').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
		//act
		const data = await dataSource.update(listPasswords[0].id, listPasswords[0]);

		//assert
		expect(mongoWrapper.update).toBeCalledWith(listPasswords[0].id, listPasswords[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listPasswords[0]));

	});
});