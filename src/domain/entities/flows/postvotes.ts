import { Vote } from './vote';

export interface PostVotes {
    _id?: string;
    id: string;
    votes:(Vote[]);
}