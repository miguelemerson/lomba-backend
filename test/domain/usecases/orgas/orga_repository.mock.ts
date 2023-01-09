import { Either } from '../../../../src/core/either';
import { Failure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { OrgaModel } from '../../../../src/data/models/orga_model';
import { OrgaRepository } from '../../../../src/domain/repositories/orga_repository';

export class MockOrgaRepository implements OrgaRepository {

	getOrgas(): Promise<Either<Failure, ModelContainer<OrgaModel>>> {
		throw new Error('Method not implemented.');
	}
	getOrga(): Promise<Either<Failure, ModelContainer<OrgaModel>>> {
		throw new Error('Method not implemented.');
	}
	addOrga() : Promise<Either<Failure, ModelContainer<OrgaModel>>> {
		throw new Error('Method not implemented.');
	}
	updateOrga() : Promise<Either<Failure, ModelContainer<OrgaModel>>> {
		throw new Error('Method not implemented.');
	}
	enableOrga(): Promise<Either<Failure, boolean>> {
		throw new Error('Method not implemented.');
	}
	deleteOrga(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}

}