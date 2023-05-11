import { Audit } from '../audit';
import { Entity } from '../entity';

export interface Host extends Entity, Audit {
    host:string;
    names:(string[]);
}