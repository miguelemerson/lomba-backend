import { Role } from "../../domain/entities/role";

export class RoleModel implements Role {
constructor(name: string, enabled: boolean){
    this.name = name;
    this.enabled = enabled;
}
    name: string;
  enabled: boolean;
}