import { PostVotesModel } from '../models/flows/postvotes_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';


export interface PostVoteDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostVotesModel>>;
    getOne(query: object): Promise<ModelContainer<PostVotesModel>>;
    add(vote: PostVotesModel) : Promise<ModelContainer<PostVotesModel>>;
    update(id: string, vote: object): Promise<ModelContainer<PostVotesModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: PostVotesModel): PostVotesModel;
}

export class PostVoteDataSourceImpl implements PostVoteDataSource {
	collection: MongoWrapper<PostVotesModel>;

	constructor(dbMongo: MongoWrapper<PostVotesModel>){
		this.collection = dbMongo;
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PostVotesModel>>{
		return await this.collection.getMany<PostVotesModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<PostVotesModel>>{
		return await this.collection.getOne(query);
	}

	async add(vote: PostVotesModel) : Promise<ModelContainer<PostVotesModel>>{
		vote = this.setId(vote);
		return await this.collection.add(vote).then(() => this.getOne({'_id':vote}));
	}
	async update(id: string, vote: object): Promise<ModelContainer<PostVotesModel>>{
		return await this.collection.update(id, vote).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: PostVotesModel): PostVotesModel
	{
		return obj;
	} 
}