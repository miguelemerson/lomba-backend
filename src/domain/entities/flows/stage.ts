import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';

export interface Stage extends Entity, BuiltIn, Audit {
    name: string;
    order: number;
    queryOut: object;
}