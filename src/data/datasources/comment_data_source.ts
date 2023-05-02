import { ModelContainer } from '../../core/model_container';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { CommentModel } from '../models/workflow/comment_model';

export interface CommentDataSource {
    getOne(query: object): Promise<ModelContainer<CommentModel>>;
    add(comment: CommentModel) : Promise<ModelContainer<CommentModel>>;
    update(id: string, comment: object): Promise<ModelContainer<CommentModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: CommentModel): CommentModel;
	getById(commentId:string): Promise<ModelContainer<CommentModel>>;
}

export class CommentDataSourceImpl implements CommentDataSource {
	collection: MongoWrapper<CommentModel>;

	constructor(dbMongo: MongoWrapper<CommentModel>){
		this.collection = dbMongo;
	}
	async getOne(query: object): Promise<ModelContainer<CommentModel>> {
		return await this.collection.getOne(query);
	}
	async add(comment: CommentModel): Promise<ModelContainer<CommentModel>> {
		comment = this.setId(comment);
		return await this.collection.add(comment).then(() => this.getOne({'_id':comment.id}));
	}
	async update(id: string, comment: object): Promise<ModelContainer<CommentModel>> {
		return await this.collection.update(id, comment).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean> {
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean> {
		return await this.collection.delete(id);
	}
	setId(obj: CommentModel): CommentModel {
		if(obj.id == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	}
	async getById(commentId: string): Promise<ModelContainer<CommentModel>> {
		return await this.collection.getOne({_id: commentId});
	}
}