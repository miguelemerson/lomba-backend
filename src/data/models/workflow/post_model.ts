import { Post } from '../../../domain/entities/workflow/post';
import { PostItem } from '../../../domain/entities/workflow/postitem';
import { Stage } from '../../../domain/entities/workflow/stage';
import { Total } from '../../../domain/entities/workflow/total';
import { Track } from '../../../domain/entities/workflow/track';
import { Vote } from '../../../domain/entities/workflow/vote';

export class PostModel implements Post {
	constructor(
		id:string, 
		postitems:(PostItem[]),
		title:string,
		orgaId:string,
		userId:string,
		flowId:string,
		stageId:string, 
		enabled: boolean, 
		builtIn: boolean){
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
		this.votes = [];
		this.totalsave = 0;
		this.totalfav = 0;
		this.totalreport = 0;
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
	votes:(Vote[]);
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;
	totalsave: number;
	totalfav: number;
	totalreport: number;

	public toEntity(): Post {
		return {id: this.id, _id:this.id, postitems:this.postitems, title:this.title, orgaId:this.orgaId, userId:this.userId, flowId:this.flowId, stageId:this.stageId, stages:this.stages, totals:this.totals, tracks:this.tracks, votes:this.votes, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires, totalsave: this.totalsave, totalfav: this.totalfav, totalreport: this.totalreport};
	}
}