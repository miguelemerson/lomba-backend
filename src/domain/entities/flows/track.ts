import { Audit } from '../audit';

export interface Track extends Audit {
    userId:string;
    flowId:string;
    stageId:string;
    change:object;
}