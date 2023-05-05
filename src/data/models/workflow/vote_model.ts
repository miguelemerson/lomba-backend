import { Vote } from '../../../domain/entities/workflow/vote';

export class VoteModel implements Vote {
	constructor(id:string, userId:string, postId:string, flowId:string, stageId:string, key:string, value:number, enabled: boolean, builtIn: boolean) {
		this.id = id;
		this._id = id;
		this.userId = userId;
		this.postId = postId;
		this.flowId = flowId;
		this.stageId = stageId;
		this.key = key;
		this.value = value;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}

	_id: string;
	id: string;
	userId: string;
	postId: string;
	flowId: string;
	stageId: string;
	key: string;
	value: number;
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): Vote {
		return {id: this.id, _id:this.id, userId:this.userId, postId:this.postId, flowId:this.flowId, stageId:this.stageId, key:this.key, value:this.value, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}
}