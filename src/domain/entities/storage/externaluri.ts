import { Audit } from '../audit';
import { Entity } from '../entity';
import { Host } from './host';

export interface ExternalUri extends Entity, Audit {
    userId:string;
    uri:string;
    host:string;
    hosts:(Host[]);
    sourceName:string;
    title:string;
    shortUrl:string;
    description:string;
    type:string;
    lastchecked:Date;
    httpstatus:number;
}