import { Audit } from '../audit';
import { Entity } from '../entity';

export interface Track extends Audit {
    userId:string;
    flowId:string;
    stageId:string;
    change:object;
}