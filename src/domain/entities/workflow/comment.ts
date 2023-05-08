import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';
import { User } from '../user';

export interface Comment extends Entity, BuiltIn, Audit {
    userId: string;
    postId: string;
    text: string;
    users:(User[]);
}