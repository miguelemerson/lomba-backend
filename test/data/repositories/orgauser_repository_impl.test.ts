import { MongoError } from 'mongodb';
import { ModelContainer } from '../../../src/core/model_container';
import { OrgaUserDataSource } from '../../../src/data/datasources/orgauser_data_source';
import { OrgaUserModel } from '../../../src/data/models/orgauser_model';
import { OrgaUserRepositoryImpl } from '../../../src/data/repositories/orgauser_repository_impl';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../../src/core/errors/failures';

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

describe('OrgaUser Repository Implementation', () => {
	let mockOrgaUserDataSource: OrgaUserDataSource;
	let orgauserRepository: OrgaUserRepositoryImpl;

	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaUserDataSource = new MockOrgaUserDataSource();
		orgauserRepository = new OrgaUserRepositoryImpl(mockOrgaUserDataSource);
	});

	describe('getOrgaUsersByOrga', () => {
		test('deberá entregar lista de orgausuarios', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await orgauserRepository.getOrgaUsersByOrga('OrgaUser');
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.getOrgaUsersByOrga('OrgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.getOrgaUsersByOrga('OrgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.getOrgaUsersByOrga('OrgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});				
        
	});

	describe('getOrgaUsersByUser', () => {
		test('deberá entregar lista de orgausuarios', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await orgauserRepository.getOrgaUsersByUser('orgaUser');
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.getOrgaUsersByUser('orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.getOrgaUsersByUser('orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.getOrgaUsersByUser('orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});				
        
	});

	describe('getOrgaUser', () => {
		test('debe entregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			//act
			const result = await orgauserRepository.getOrgaUser('OrgaUser','orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(result.isRight());
			expect(mockOrgaUserDataSource.getOne).toHaveBeenCalledWith({'orgaId':'OrgaUser','userId':'orgaUser'});
			expect(value).toStrictEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));
		});

		test('deberá generar error de Database al buscar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.getOrgaUser('OrgaUser','orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al buscar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.getOrgaUser('OrgaUser','orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al buscar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.getOrgaUser('OrgaUser','orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('addOrgaUser', () => {
		test('debe llamar a los métodos de agregar', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			//act
			const result = await orgauserRepository.addOrgaUser('Súper OrgaUser', 'orgaUser', [], true, true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});	

			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));
		});

		test('deberá generar error de Database al agregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.addOrgaUser('Súper OrgaUser', 'orgaUser', [], true, true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al agregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.addOrgaUser('Súper OrgaUser', 'orgaUser', [], true, true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al agregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.addOrgaUser('Súper OrgaUser', 'orgaUser', [], true, true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('updateOrgaUser', () => {
		test('debe llamar a las funciones de actualzar', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});			
			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.update).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));
		});

		test('deberá generar error de Database al actualizar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al actualizar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al actualizar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	


	});

	describe('enableOrgaUser', () => {
		test('debe llamar a las funciones de habilitación', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'enable').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await orgauserRepository.enableOrgaUser('OrgaUser', 'Ouser', true);
			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.enable).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deberá generar error de Database al habilitar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'enable').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.enableOrgaUser('OrgaUser', 'Ouser', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al habilitar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'enable').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.enableOrgaUser('OrgaUser', 'Ouser', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al habilitar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'enable').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.enableOrgaUser('OrgaUser', 'Ouser', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('deleteOrgaUser', () => {
		test('debe llamar a las funciones de elminación', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await orgauserRepository.deleteOrgaUser('OrgaUser');
			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.delete).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deberá generar error de Database al eliminar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.deleteOrgaUser('OrgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al eliminar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.deleteOrgaUser('OrgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al eliminar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.deleteOrgaUser('OrgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});			
	});
});