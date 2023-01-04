import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { OrgaModel } from '../../data/models/orga_model';

export interface OrgaRepository {
    getOrgas(sort?: [string, 1 | -1][]): Promise<Either<Failure, ModelContainer<OrgaModel>>>;
    getOrga(id: string): Promise<Either<Failure, ModelContainer<OrgaModel>>>;
    addOrga(id: string, name: string, code: string, enabled: boolean, builtin: boolean) : Promise<Either<Failure, ModelContainer<OrgaModel>>>;
    updateOrga(orgaId: string, orga: object): Promise<Either<Failure, ModelContainer<OrgaModel>>>;
    enableOrga(orgaId: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
    deleteOrga(id: string): Promise<Either<Failure, boolean>>;
}