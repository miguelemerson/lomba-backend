import { ModelContainer } from '../../core/model_container';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { BookmarkModel } from '../models/workflow/bookmark_model';

export interface BookmarkDataSource {
    getOne(query: object): Promise<ModelContainer<BookmarkModel>>;
    add(bookmark: BookmarkModel) : Promise<ModelContainer<BookmarkModel>>;
    update(id: string, bookmark: object): Promise<ModelContainer<BookmarkModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	setId(obj: BookmarkModel): BookmarkModel;
	getById(bookmarkId:string): Promise<ModelContainer<BookmarkModel>>;
	getBookmark(postId:string, userId:string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download'): Promise<ModelContainer<BookmarkModel>>;
	upsert(userId: string, postId: string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', giveOrTakeAway: boolean): Promise<ModelContainer<BookmarkModel>>;
}

export class BookmarkDataSourceImpl implements BookmarkDataSource {
	collection: MongoWrapper<BookmarkModel>;

	constructor(dbMongo: MongoWrapper<BookmarkModel>){
		this.collection = dbMongo;
	}
	async upsert(userId: string, postId: string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download', giveOrTakeAway: boolean): Promise<ModelContainer<BookmarkModel>> {
		
		const query = { postId: postId, userId: userId, markType: markType };
		const update = { $set: { postId: postId, userId: userId, markType: markType, enabled: giveOrTakeAway, created: new Date(), updated: new Date() }};
		return await this.collection.upsert(query, update).then(() => this.getOne({postId: postId, userId: userId, markType: markType}));
	}
    
	async getOne(query: object): Promise<ModelContainer<BookmarkModel>> {
		return await this.collection.getOne(query);
	}
	async add(bookmark: BookmarkModel): Promise<ModelContainer<BookmarkModel>> {
		bookmark = this.setId(bookmark);
		return await this.collection.add(bookmark).then(() => this.getOne({'_id':bookmark.id}));
	}
	async update(id: string, bookmark: object): Promise<ModelContainer<BookmarkModel>> {
		return await this.collection.update(id, bookmark).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean> {
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean> {
		return await this.collection.delete(id);
	}
	public setId(obj: BookmarkModel): BookmarkModel {
		if(obj.id == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	}
	async getById(bookmarkId: string): Promise<ModelContainer<BookmarkModel>> {
		return await this.collection.getOne({_id: bookmarkId});
	}
	async getBookmark(postId: string, userId: string, markType: 'save' | 'fav' | 'report' | 'comment' | 'download'): Promise<ModelContainer<BookmarkModel>> {
		return await this.collection.getOne({postId: postId, userId: userId, markType: markType});
	}
}