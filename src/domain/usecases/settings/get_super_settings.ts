import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Setting } from '../../entities/setting';
import { SettingRepository } from '../../repositories/setting_repository';

export interface GetSuperSettingsUseCase {
    execute(): Promise<Either<Failure,ModelContainer<Setting>>>;
}

export class GetSuperSettings implements GetSuperSettingsUseCase {
	repository: SettingRepository;
	constructor(repository: SettingRepository) {
		this.repository = repository;
	}

	async execute(): Promise<Either<Failure,ModelContainer<Setting>>> {
		return await this.repository.getSettings();
	}
}