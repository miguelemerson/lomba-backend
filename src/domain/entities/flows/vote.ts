import { Audit } from '../audit';

export interface Vote extends Audit {
    flowId:string;
    stageId:string;
    userId:string;
    value:number;
}