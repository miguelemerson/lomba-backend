import { Orga } from "../../domain/entities/orga";

export class OrgaModel implements Orga {
    constructor(id: string, name: string, code: string, enabled: boolean, builtIn: boolean){
        this.id = id;
        this.name = name;
        this.code = code;
        this.enabled = enabled;
        this.builtIn = builtIn;
    }


    id?: string;
    name: string;
    code: string;
  enabled: boolean;
  builtIn: boolean;

}