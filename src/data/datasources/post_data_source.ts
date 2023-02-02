import { PostModel } from '../models/flows/post_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';


export interface PostDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>;
    getOne(query: object): Promise<ModelContainer<PostModel>>;
    add(post: PostModel) : Promise<ModelContainer<PostModel>>;
    update(id: string, post: object): Promise<ModelContainer<PostModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: PostModel): PostModel;
    updateDirect(id: string, post: object): Promise<ModelContainer<PostModel>>;

}

export class PostDataSourceImpl implements PostDataSource {
	collection: MongoWrapper<PostModel>;

	constructor(dbMongo: MongoWrapper<PostModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostModel>>{
		return await this.collection.getMany<PostModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.getOne(query);
	}

	async add(post: PostModel) : Promise<ModelContainer<PostModel>>{
		post = this.setId(post);
		return await this.collection.add(post).then(() => this.getOne({'_id':post.id}));
	}
	async update(id: string, post: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.update(id, post).then(() => this.getOne({'_id':id}));
	}
	async updateDirect(id: string, post: object): Promise<ModelContainer<PostModel>>{
		return await this.collection.updateDirect(id, post).then(() => this.getOne({'_id':id}));
	}	
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: PostModel): PostModel
	{
		if(obj.id.trim() == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	} 
}