import { Bookmark } from '../../../domain/entities/workflow/bookmark';

export class BookmarkModel implements Bookmark {
	constructor(id:string, userId:string, postId:string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', enabled: boolean, builtIn: boolean){
		this.id = id;
		this._id = id;
		this.userId = userId;
		this.postId = postId;
		this.markType = markType;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}
	_id: string;
	id: string;
	userId: string;
	postId: string;
	markType: 'save' | 'fav' | 'report' | 'comment' | 'download';
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): Bookmark {
		return {id: this.id, _id:this.id, userId:this.userId, postId:this.postId, markType:this.markType, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}
}