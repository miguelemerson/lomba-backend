import { Entity } from './entity';

export interface Password extends Entity {
    userId: string;
    hash: string;
    salt: string;  
    istemp?:boolean;
}