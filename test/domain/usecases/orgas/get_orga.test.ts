import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { OrgaModel } from '../../../../src/data/models/orga_model';
import { OrgaRepository } from '../../../../src/domain/repositories/orga_repository';
import { GetOrga } from '../../../../src/domain/usecases/orgas/get_orga';
import { MockOrgaRepository } from './orga_repository.mock';
describe('Conseguir usuario - Caso de uso', () => {
	
	let mockOrgaRepository: OrgaRepository;

	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaRepository = new MockOrgaRepository();
	});

	test('el usecase de conseguir usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockOrgaRepository, 'getOrga').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(listOrgas[0]))));

		//act
		const useCase = new GetOrga(mockOrgaRepository);
		const result = await useCase.execute(listOrgas[0].id);
		//assert
		expect(mockOrgaRepository.getOrga).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(ModelContainer.fromOneItem(listOrgas[0])));
	});

	test('el usecase de conseguir usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockOrgaRepository, 'getOrga').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new GetOrga(mockOrgaRepository);
		const result = await useCase.execute(listOrgas[0].id);
		//assert
		expect(mockOrgaRepository.getOrga).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});