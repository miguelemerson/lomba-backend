import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';

export interface Comment extends Entity, BuiltIn, Audit {
    userId: string;
    postId: string;
    text: string;
}