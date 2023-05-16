import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';

export interface Category extends Entity, BuiltIn, Audit {
    name: string;
    longname: string;
    lowercase: string;
    userId: string;
    description: string;
    parentIds: (string[]);
    parents: (Category[]);
}