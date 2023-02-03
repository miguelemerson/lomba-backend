import { PostVotes } from '../../../domain/entities/flows/postvotes';
import { Vote } from '../../../domain/entities/flows/vote';

export class PostVotesModel implements PostVotes {
	constructor(id:string, votes:(Vote[])){

		this.votes = votes;
		this.id = id;
		this._id =id;
	}
	_id?: string;
	id: string;
	votes:(Vote[]);
	public toEntity(): PostVotes {
		return {_id:this._id, id:this.id, votes:this.votes};
	}
}