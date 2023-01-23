import { Entity } from './entity';
import { Role } from './role';

export interface OrgaUser extends Entity {
    orgaId: string;
    userId: string;
    roles: Role[];
}