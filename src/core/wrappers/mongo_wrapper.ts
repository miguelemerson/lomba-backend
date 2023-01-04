import { Db, Document } from 'mongodb';
import {  } from '../../domain/entities/entity';
import { ModelContainer } from '../model_container';

export interface NoSQLDatabaseWrapper<T>{
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<T>>;
    getOne(id: string): Promise<ModelContainer<T>>;
    add(obj: T) : Promise<boolean>;
    update(id: string, obj: object): Promise<boolean>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export class MongoWrapper<T> implements NoSQLDatabaseWrapper<T>{
	collectionName:string;
	db:Db;
	constructor(collectionName: string, dbMongo: Db){
		this.collectionName = collectionName;
		this.db = dbMongo;
	}
    
	private async runQuery(pageIndex: number | undefined, totalItems: number | undefined, query: object, 
		sort: [string, 1 | -1][] | undefined, result: unknown, itemsPerPage: number | undefined, startIndex: number, totalPages: number) {
		totalItems = await this.setTotalItems(pageIndex, totalItems, query);
		
		if (sort == null && pageIndex == null)
			result = await this.runSimpleQuery(result, query);
		if (sort != null && pageIndex == null)
			result = await this.runSorterQuery(result, query, sort);
		if (sort != null && pageIndex != null) {
			const limit: number = (itemsPerPage == null ? 10 : itemsPerPage);
			const skip: number = (pageIndex - 1) * limit;
			result = await this.runFullQuery(result, query, sort, skip, limit);

			startIndex = ((pageIndex - 1) * limit) + 1;
			totalPages = parseInt(Math.round((totalItems == null ? 0 : totalPages) / limit).toString());
		}
		return { totalItems, result, startIndex, totalPages };
	}

	private async runFullQuery(result: unknown, query: object, sort: [string, 1 | -1][], skip: number, limit: number) {
		result = await this.db.collection<Document>(this.collectionName)
			.find(query).sort(sort).skip(skip).limit(limit).toArray();
		return result;
	}

	private async runSorterQuery(result: unknown, query: object, sort: [string, 1 | -1][]) {
		result = await this.db.collection<Document>(this.collectionName)
			.find(query).sort(sort).toArray();
		return result;
	}

	private async runSimpleQuery(result: unknown, query: object) {
		result = await this.db.collection<Document>(this.collectionName)
			.find(query).toArray();
		return result;
	}

	private async setTotalItems(pageIndex: number | undefined, totalItems: number | undefined, query: object) {
		if (pageIndex != null) {
			totalItems = (await this.db.collection<Document>(this.collectionName).count(query));
		}
		return totalItems;
	}
	private createModelContainer<T>(result: unknown, itemsPerPage: number | undefined, pageIndex: number | undefined, startIndex: number, totalItems: number | undefined, totalPages: number) {
		const contains_many = new ModelContainer<T>(result as T[]);
		contains_many.itemsPerPage = itemsPerPage;
		contains_many.pageIndex = pageIndex;
		contains_many.startIndex = (startIndex == 1 ? undefined : startIndex);
		contains_many.totalItems = totalItems;
		contains_many.totalPages = (totalPages == 0 ? undefined : totalPages);
		return contains_many;
	}
	async getMany<T>(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<T>>{
		let result = null;
		let startIndex = 1;
		let totalPages = 0;  
		let totalItems:number | undefined = undefined;

		({ totalItems, result, startIndex, totalPages } = 
			await this.runQuery(pageIndex, totalItems, query, 
				sort, result, itemsPerPage, startIndex, totalPages));
	
		if(result == null || result == undefined){
			throw new Error('null value');
		}

		const contains_many = this.createModelContainer<T>(result, itemsPerPage, pageIndex, startIndex, totalItems, totalPages);

		return contains_many;
	}

	async getOne<T>(id: string): Promise<ModelContainer<T>>{
		const result = await this.db.collection<Document>(this.collectionName).findOne({'_id': id});
		if(result == null || result == undefined){
			throw new Error('null value');
		}
		return ModelContainer.fromOneItem(result as T);
	}

	async add<T>(obj: T) : Promise<boolean>{
		const result = await this.db.collection<Document>(this.collectionName).insertOne(obj as Document);
		return (result?.insertedId ? true: false);
	}

	async update(id: string, obj: object): Promise<boolean>{
		const params = (obj as {[x: string]: unknown;});
		if(obj != null)
			params['updated'] = new Date();
		const result = await this.db.collection<Document>(this.collectionName).updateOne({_id: id}, {$set:params});
		return (result?.modifiedCount > 0 ? true : false);

	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		const result = await this.db.collection<Document>(this.collectionName)
			.updateOne({_id: id}, {$set: {enabled: enableOrDisable, updated: new Date()}});
		return (result?.modifiedCount > 0);
	}
	async delete(id: string): Promise<boolean>{
		const rn = await this.update(id, {'deleted': new Date()});
		if(rn){
			const i = await this.db.collection<Document>(this.collectionName).findOne({'_id': id});
			if(i != null)
			{
				await this.db.collection<Document>(this.collectionName + '_deleted').insertOne(i as Document);
				const result = await this.db.collection<Document>(this.collectionName).deleteOne({_id: id});
				return (result.deletedCount > 0);
			}
		}
		return false;
	}    
}