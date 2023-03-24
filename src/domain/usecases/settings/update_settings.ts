import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { SettingRepository } from '../../repositories/setting_repository';

export interface UpdateSettingsUseCase {
    execute(changes:{id:string, value: string}[], orgaId:string | undefined): Promise<Either<Failure,boolean>>;
}

export class UpdateSettings implements UpdateSettingsUseCase {
	repository: SettingRepository;
	constructor(repository: SettingRepository) {
		this.repository = repository;
	}

	async execute(changes:{id:string, value: string}[], orgaId:string | undefined): Promise<Either<Failure,boolean>> {
		return await this.repository.updateSettings(changes, orgaId);
	}
}