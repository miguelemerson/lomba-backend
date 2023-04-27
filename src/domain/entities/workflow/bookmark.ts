import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';

export interface Bookmark extends Entity, BuiltIn, Audit {
    userId: string;
    postId: string;
    markType: 'save' | 'fav' | 'report';
}