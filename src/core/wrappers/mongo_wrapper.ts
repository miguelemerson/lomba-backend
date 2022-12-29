import { Db, Document } from 'mongodb';
import {  } from '../../domain/entities/entity';
import { ContainsMany } from '../contains_many';

export interface NoSQLDatabaseWrapper<T>{
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ContainsMany<T> | null>;
    getOne(id: string): Promise<unknown | null>;
    add(obj: T) : Promise<unknown | null>;
    update(id: string, obj: object): Promise<unknown | null>;
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
    
	async getMany<T>(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ContainsMany<T> | null>{
		let result = null;
		let startIndex = 1;
		let totalPages = 0;  

		let totalItems:number | undefined = undefined;
		if(pageIndex != null){
			totalItems = (await this.db.collection<Document>(this.collectionName).count(query));
		}
		if(sort == null && pageIndex == null)
			result = await this.db.collection<Document>(this.collectionName)
				.find(query).toArray();
		if(sort != null && pageIndex == null)
			result = await this.db.collection<Document>(this.collectionName)
				.find(query).sort(sort).toArray();
		if(sort != null && pageIndex != null)
		{
			const limit:number = (itemsPerPage == null ? 10 : itemsPerPage);
			const skip:number = (pageIndex - 1) * limit;
			result = await this.db.collection<Document>(this.collectionName)
				.find(query).sort(sort).skip(skip).limit(limit).toArray();

			startIndex = ((pageIndex - 1) * limit) + 1;
			totalPages = parseInt(Math.round((totalItems==null ? 0 : totalPages) / limit).toString());
		}
	
		if(result == null) return null;

		const contains_many = new ContainsMany<T>(result as T[]);
		contains_many.itemsPerPage = itemsPerPage;
		contains_many.pageIndex = pageIndex;
		contains_many.startIndex = (startIndex == 1 ? undefined : startIndex);
		contains_many.totalItems = totalItems;
		contains_many.totalPages = (totalPages == 0 ? undefined : totalPages);

		return contains_many;
	}

	async getOne<T>(id: string): Promise<T | null>{
		
		const result = await this.db.collection<Document>(this.collectionName).findOne({'_id': id});
		return result as T;
	}

	async add<T>(obj: T) : Promise<T | null>{
		const result = await this.db.collection<Document>(this.collectionName).insertOne(obj as Document);
		const rn = await this.getOne(result.insertedId.toString());
		return rn as T;
	}

	async update<T>(id: string, obj: object): Promise<T | null>{
		const params = (obj as {[x: string]: unknown;});
		if(obj != null)
			params['updated'] = new Date();
		const result = await this.db.collection<Document>(this.collectionName).updateOne({_id: id}, {$set:params});
		if(result.modifiedCount > 0)
		{
			const rn = await this.getOne(id);
			return rn as T;
		} else return null;

	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		const result = await this.db.collection<Document>(this.collectionName)
			.updateOne({_id: id}, {$set: {enabled: enableOrDisable, updated: new Date()}});
		return (result.modifiedCount > 0);
	}
	async delete<T>(id: string): Promise<boolean>{
		const rn = await this.update<T>(id, {'deleted': new Date()});
		if(rn != null){
			await this.db.collection<Document>(this.collectionName + '_deleted').insertOne(rn as Document);
			const result = await this.db.collection<Document>(this.collectionName).deleteOne({_id: id});
			return (result.deletedCount > 0);
		}

		return false;
	}    

}