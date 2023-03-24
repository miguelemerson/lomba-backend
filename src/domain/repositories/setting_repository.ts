import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Setting } from '../entities/setting';

export interface SettingRepository {
    getSettingsByOrga(orgaId:string): Promise<Either<Failure, ModelContainer<Setting>>>;
    getSettings(): Promise<Either<Failure, ModelContainer<Setting>>>;
    updateSettings(changes:{id:string, value: string}[], orgaId:string | undefined): Promise<Either<Failure, boolean>>;
}