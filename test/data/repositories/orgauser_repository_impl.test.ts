import { MongoError } from 'mongodb';
import { ModelContainer } from '../../../src/core/model_container';
import { OrgaUserDataSource } from '../../../src/data/datasources/orgauser_data_source';
import { OrgaUserModel } from '../../../src/data/models/orgauser_model';
import { OrgaUserRepositoryImpl } from '../../../src/data/repositories/orgauser_repository_impl';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../../src/core/errors/failures';
import { UserDataSource } from '../../../src/data/datasources/user_data_source';
import { UserModel } from '../../../src/data/models/user_model';
import { OrgaDataSource } from '../../../src/data/datasources/orga_data_source';
import { OrgaModel } from '../../../src/data/models/orga_model';

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

class MockOrgaDataSource implements OrgaDataSource {
	getMany(): Promise<ModelContainer<OrgaModel>>{
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
}

describe('OrgaUser Repository Implementation', () => {
	let mockOrgaUserDataSource: OrgaUserDataSource;
	let mockUserDataSource: UserDataSource;
	let mockOrgaDataSource: OrgaDataSource;
	let orgauserRepository: OrgaUserRepositoryImpl;

	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('S??per OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];
	const listUsers: UserModel[] = [
		new UserModel('sss', 'S??per Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];
	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'S??per Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];
	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaUserDataSource = new MockOrgaUserDataSource();
		mockUserDataSource = new MockUserDataSource();
		mockOrgaDataSource = new MockOrgaDataSource();
		orgauserRepository = new OrgaUserRepositoryImpl(mockOrgaUserDataSource, mockUserDataSource, mockOrgaDataSource);
	});

	describe('getOrgaUsersByOrga', () => {
		test('deber?? entregar lista de orgausuarios', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await orgauserRepository.getOrgaUsersByOrga('OrgaUser');
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deber?? generar error de Database', async () => {
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

		test('deber?? generar error de Network', async () => {
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

		test('deber?? generar error gen??rico', async () => {
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
		test('deber?? entregar lista de orgausuarios', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockOrgaUserDataSource, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await orgauserRepository.getOrgaUsersByUser('orgaUser');
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deber?? generar error de Database', async () => {
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

		test('deber?? generar error de Network', async () => {
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

		test('deber?? generar error gen??rico', async () => {
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

		test('deber?? generar error de Database al buscar un orgausuario', async () => {
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

		test('deber?? generar error de Network al buscar un orgausuario', async () => {
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

		test('deber?? generar error gen??rico al buscar un orgausuario', async () => {
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
		test('debe llamar a los m??todos de agregar', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));

			jest.spyOn(mockOrgaDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));

			jest.spyOn(mockUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));

			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));

			//act
			const result = await orgauserRepository.addOrgaUser(listOrgaUsers[0].orgaId, listOrgaUsers[0].userId, listOrgaUsers[0].roles, listOrgaUsers[0].enabled, listOrgaUsers[0].builtIn);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});	

			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));
		});

		test('deber?? generar error de Database al agregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.addOrgaUser('S??per OrgaUser', 'orgaUser', [], true, true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deber?? generar error de Network al agregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.addOrgaUser('S??per OrgaUser', 'orgaUser', [], true, true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deber?? generar error gen??rico al agregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.addOrgaUser('S??per OrgaUser', 'orgaUser', [], true, true);
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
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));			
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

		test('deber?? generar error de Database al actualizar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));			
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deber?? generar error de Network al actualizar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deber?? generar error gen??rico al actualizar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
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
		test('debe llamar a las funciones de habilitaci??n', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'enable').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await orgauserRepository.enableOrgaUser('OrgaUser', 'Ouser', true);
			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.enable).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deber?? generar error de Database al habilitar un orgausuario', async () => {
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

		test('deber?? generar error de Network al habilitar un orgausuario', async () => {
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

		test('deber?? generar error gen??rico al habilitar un orgausuario', async () => {
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
		test('debe llamar a las funciones de elminaci??n', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.resolve(true));
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			jest.spyOn(mockUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));	
			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));				
			//act
			const result = await orgauserRepository.deleteOrgaUser('orgaId', 'userId');
			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.delete).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deber?? generar error de Database al eliminar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			//act
			const result = await orgauserRepository.deleteOrgaUser('orgaId', 'userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deber?? generar error de Network al eliminar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			//act
			const result = await orgauserRepository.deleteOrgaUser('orgaId', 'userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deber?? generar error gen??rico al eliminar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			//act
			const result = await orgauserRepository.deleteOrgaUser('orgaId', 'userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});			
	});
});