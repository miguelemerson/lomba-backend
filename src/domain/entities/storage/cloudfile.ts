import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';

export interface CloudFile extends Entity, BuiltIn, Audit {  
    name:string;
    path:string;
    host:string;
    url:string;
    size:number;
    account:string;
    filetype:string;
    orgaId:string;
    userId:string;
    associated:boolean;
    externalUriId:string | undefined;
}