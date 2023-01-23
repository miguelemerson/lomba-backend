import { Entity } from './entity';

export interface User extends Entity {
  id: string;
  name: string;
  username: string;
  email: string;
  orgas?: ({id:string, code:string}[]);
}