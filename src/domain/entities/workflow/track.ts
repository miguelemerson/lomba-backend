import { Audit } from '../audit';

export interface Track extends Audit {
    name:string;
    description:string;
    userId:string;
    flowId:string;
    stageIdOld:string;
    stageIdNew:string;
    change:object;
}