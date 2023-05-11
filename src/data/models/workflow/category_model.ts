import { Category } from '../../../domain/entities/workflow/category';

export class CategoryModel implements Category {
	constructor(id:string, name:string, longname:string, lowercase:string, userId:string, description:string, parentIds: (string[]), enabled: boolean, builtIn: boolean) {
		this.id = id;
		this._id = id;
		this.name = name;
		this.longname = longname;
		this.lowercase = lowercase;
		this.userId = userId;
		this.description = description;
		this.parentIds = parentIds;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
		this.parents = [];
	}
	

	_id: string;
	id: string;
	name: string;
	longname: string;
	lowercase: string;
	userId: string;
	description: string;
	parentIds: (string[]);
	parents: Category[];
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): Category {
		return {id: this.id, _id:this.id, name:this.name, longname:this.longname, lowercase:this.lowercase, userId:this.userId, description:this.description, parentIds:this.parentIds, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires, parents: this.parents};
	}
}