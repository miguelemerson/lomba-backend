import { Audit } from '../audit';

export interface Vote extends Audit {
    totalpositive: number;
    totalnegative: number;
    totalcount: number;  
    flowId:string;
    stageId:string;
    userId:string;
    value:number;
}