import { Role } from './role';

export interface OrgaUser {
    orgaId: string;
    userId: string;
    roles: Role[];
}