import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';
import { Stage } from './stage';

export interface Flow extends Entity, BuiltIn, Audit {
    name: string;
    stages: (Stage[]);
}