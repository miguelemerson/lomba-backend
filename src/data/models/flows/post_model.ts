import { Post } from '../../../domain/entities/flows/post';
import { PostItem } from '../../../domain/entities/flows/postitem';
import { Stage } from '../../../domain/entities/flows/stage';
import { Total } from '../../../domain/entities/flows/total';
import { Track } from '../../../domain/entities/flows/track';

export class PostModel implements Post {
	constructor(id:string, postitems:(PostItem[]),
		title:string,
		orgaId:string,
		userId:string,
		flowId:string,
		stageId:string, enabled: boolean, builtIn: boolean){
		this.id = id;
		this._id = id;
		this.postitems = postitems;
		this.title = title;
		this.orgaId = orgaId;
		this.userId = userId;
		this.flowId = flowId;
		this.stageId = stageId;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
		this.stages = [];
		this.totals = [];
		this.tracks = [];
	}
	_id: string;
	id: string;
	postitems:(PostItem[]);
	title:string;
	orgaId:string;
	userId:string;
	flowId:string;
	stageId:string;
	stages:(Stage[]);
	totals:(Total[]);
	tracks:(Track[]);
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): Post {
		return {id: this.id, _id:this.id, postitems:this.postitems, title:this.title, orgaId:this.orgaId, userId:this.userId, flowId:this.flowId, stageId:this.stageId, stages:this.stages, totals:this.totals, tracks:this.tracks, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}
}