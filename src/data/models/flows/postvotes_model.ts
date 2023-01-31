import { PostVotes } from '../../../domain/entities/flows/postvotes';
import { Vote } from '../../../domain/entities/flows/vote';

export class PostVotesModel implements PostVotes {
	constructor(votes:(Vote[])){

		this.votes = votes;
	}
	votes:(Vote[]);
	public toEntity(): PostVotes {
		return {votes:this.votes};
	}
}