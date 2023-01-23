import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Orga } from '../entities/orga';


export interface OrgaRepository {
    getOrgas(sort?: [string, 1 | -1][]): Promise<Either<Failure, ModelContainer<Orga>>>;
    getOrga(id: string): Promise<Either<Failure, ModelContainer<Orga>>>;
    addOrga(id: string, name: string, code: string, enabled: boolean, builtin: boolean) : Promise<Either<Failure, ModelContainer<Orga>>>;
    updateOrga(orgaId: string, orga: object): Promise<Either<Failure, ModelContainer<Orga>>>;
    enableOrga(orgaId: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
    deleteOrga(id: string): Promise<Either<Failure, boolean>>;
    existsOrga(orgaId:string, code:string) : Promise<Either<Failure, ModelContainer<Orga>>>;
}