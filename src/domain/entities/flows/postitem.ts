import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { TextContent } from './textcontent';

export interface PostItem extends BuiltIn, Audit {
    order: number;
    title: string;
    content: object | TextContent;
    type: 'text';
    format: string;
}