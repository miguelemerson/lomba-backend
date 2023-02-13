import { Total } from '../../../domain/entities/flows/total';

export class TotalModel implements Total {
	constructor(totalpositive:number, totalnegative:number,
		totalcount:number,
		flowId:string, stageId: string){
		this.totalpositive = totalpositive;
		this.totalnegative = totalnegative;
		this.totalcount = totalcount;
		this.flowId = flowId;
		this.stageId = stageId;
	}
	totalpositive: number;
	totalnegative: number;
	totalcount: number;  
	flowId:string;
	stageId:string;

	public toEntity(): Total {
		return {totalpositive: this.totalpositive, totalnegative: this.totalnegative, totalcount: this.totalcount, flowId: this.flowId, stageId: this.stageId};
	}
}