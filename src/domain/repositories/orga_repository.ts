import { ModelContainer } from '../../core/model_container';
import { OrgaModel } from '../../data/models/orga_model';

export interface OrgaRepository {
    getOrgas(sort?: [string, 1 | -1][]): Promise<ModelContainer<OrgaModel> | null>;
    getOrga(id: string): Promise<ModelContainer<OrgaModel> | null>;
    addOrga(id: string, name: string, code: string, enabled: boolean, builtin: boolean) : Promise<ModelContainer<OrgaModel> | null>;
    updateOrga(orgaId: string, orga: object): Promise<ModelContainer<OrgaModel> | null>;
    enableOrga(orgaId: string, enableOrDisable: boolean): Promise<boolean>;
    deleteOrga(id: string): Promise<boolean>;
}