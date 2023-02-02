import { Flow } from '../../../domain/entities/flows/flow';
import { Stage } from '../../../domain/entities/flows/stage';

export class FlowModel implements Flow {
	constructor(id:string, name: string, stages: (Stage[]), enabled: boolean, builtIn: boolean){
		this._id = id;
		this.id = id;
		this.name = name;
		this.stages = stages;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}
	_id?: string;
	id: string;
	name: string;
	stages: (Stage[]);
	enabled: boolean;
	builtIn: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date; 


	public toEntity(): Flow {
		return {id: this.id, _id:this._id, name:this.name, stages:this.stages, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}
}