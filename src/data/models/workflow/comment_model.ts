import { Comment } from '../../../domain/entities/workflow/comment';

export class CommentModel implements Comment {
	constructor(id:string, userId:string, postId:string, text:string, enabled: boolean, builtIn: boolean) {
		this.id = id;
		this._id = id;
		this.userId = userId;
		this.postId = postId;
		this.text = text;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}

	_id: string;
	id: string;
	userId: string;
	postId: string;
	text: string;
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): Comment {
		return {id: this.id, _id:this.id, userId:this.userId, postId:this.postId, text:this.text, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}
}