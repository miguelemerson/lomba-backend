import { User } from '../../../domain/entities/user';
import { Bookmark } from '../../../domain/entities/workflow/bookmark';
import { Category } from '../../../domain/entities/workflow/category';
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
		this.users = [];
		this.categories = [];
		this.categoryNames = [];
		this.bookmarks = [];
		this.totalsaves = 0;
		this.totalfavs = 0;
		this.totalreports = 0;
		this.totalcomments = 0;
		this.totaldownloads = 0;
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
	categoryNames:(string[]);
	categories:(Category[]);
	bookmarks: (Bookmark[]);
	users: (User[]);
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;
	totalsaves: number;
	totalfavs: number;
	totalreports: number;
	totalcomments: number;
	totaldownloads: number;

	public toEntity(): Post {
		return {id: this.id, _id:this.id, postitems:this.postitems, title:this.title, orgaId:this.orgaId, userId:this.userId, flowId:this.flowId, stageId:this.stageId, stages:this.stages, totals:this.totals, tracks:this.tracks, votes:this.votes, categoryNames:this.categoryNames, categories:this.categories, bookmarks:this.bookmarks, users:this.users, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires, totalsaves: this.totalsaves, totalfavs: this.totalfavs, totalreports: this.totalreports, totalcomments: this.totalcomments, totaldownloads: this.totaldownloads};
	}
}