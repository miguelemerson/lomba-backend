import { Stage } from '../../../domain/entities/flows/stage';

export class StageModel implements Stage {
	constructor(id:string, name:string,
		order:number,
		queryOut:object | undefined, enabled: boolean, builtIn: boolean){
		this.id = id;
		this._id = id;
		this.name = name;
		this.order = order;
		this.queryOut = queryOut;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}
	_id: string;
	id: string;
	name: string;
	order: number;
	queryOut: object | undefined;
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): Stage {
		return {id: this.id, _id:this.id, name:this.name, order:this.order, queryOut:this.queryOut, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}
}