import crypto from 'crypto';
import { ModelContainer } from '../../core/model_container';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { CommentModel } from '../models/workflow/comment_model';

export interface CommentDataSource {
	getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<CommentModel>>;
    getOne(query: object): Promise<ModelContainer<CommentModel>>;
    add(comment: CommentModel) : Promise<ModelContainer<CommentModel>>;
    update(id: string, comment: object): Promise<ModelContainer<CommentModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(commentId: string, userId:string): Promise<boolean>;
	setId(obj: CommentModel): CommentModel;
	getById(commentId:string): Promise<ModelContainer<CommentModel>>;
	getByPost(postId: string, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<CommentModel>>;
}

export class CommentDataSourceImpl implements CommentDataSource {
	collection: MongoWrapper<CommentModel>;

	constructor(dbMongo: MongoWrapper<CommentModel>){
		this.collection = dbMongo;
	}
	async getByPost(postId: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<CommentModel>> {
		return await this.collection.getMany<CommentModel>({postId:postId}, sort, pageIndex, itemsPerPage);
	}
	async getMany(query: object, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<ModelContainer<CommentModel>> {
		return await this.collection.getMany<CommentModel>(query, sort, pageIndex, itemsPerPage);
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
	async delete(commentId: string, userId:string): Promise<boolean> {
		return await this.collection.delete(commentId);
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