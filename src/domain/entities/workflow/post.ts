import { Audit } from '../audit';
import { BuiltIn } from '../builtin';
import { Entity } from '../entity';
import { User } from '../user';
import { Bookmark } from './bookmark';
import { Category } from './category';
import { PostItem } from './postitem';
import { Stage } from './stage';
import { Total } from './total';
import { Track } from './track';
import { Vote } from './vote';

export interface Post extends Entity, BuiltIn, Audit {
    postitems:(PostItem[]);
    title:string;
    orgaId:string;
    userId:string;
    flowId:string;
    stageId:string;
    stages:(Stage[]);
    totals:(Total[]);
    tracks:(Track[]);
    votes:(Vote[]);
    categoryNames:(string[]);
    categories:(Category[]);
    bookmarks:(Bookmark[]);
    users:(User[]);
    totalsaves: number;
    totalfavs: number;
    totalreports: number;
    totalcomments: number;
    totaldownloads: number;
}