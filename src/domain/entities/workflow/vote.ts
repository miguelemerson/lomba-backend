import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';

export interface Vote extends Entity, BuiltIn, Audit {
    postId: string;  
    flowId:string;
    stageId:string;
    userId:string;
    key:string;
    value:number;
}