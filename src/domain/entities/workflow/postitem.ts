import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { ImageContent } from './imagecontent';
import { TextContent } from './textcontent';
import { VideoContent } from './videocontent';

export interface PostItem extends BuiltIn, Audit {
    order: number;
    content: TextContent | ImageContent | VideoContent;
    type: 'text' | 'image' | 'video';
    format: string;
}