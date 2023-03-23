import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Setting } from '../../entities/setting';
import { SettingRepository } from '../../repositories/setting_repository';

export interface GetOrgaSettingsUseCase {
    execute(orgaId:string): Promise<Either<Failure,ModelContainer<Setting>>>;
}

export class GetOrgaSettings implements GetOrgaSettingsUseCase {
	repository: SettingRepository;
	constructor(repository: SettingRepository) {
		this.repository = repository;
	}

	async execute(orgaId: string): Promise<Either<Failure,ModelContainer<Setting>>> {
		return await this.repository.getSettingsByOrga(orgaId);
	}
}