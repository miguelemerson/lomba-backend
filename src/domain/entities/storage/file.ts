import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';

export interface File extends Entity, BuiltIn, Audit {  
    name:string;
    path:string;
    url:string;
    size:number;
    account:string;
    filetype:string;
}