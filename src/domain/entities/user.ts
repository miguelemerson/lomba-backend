import { Audit } from './audit';
import { BuiltIn } from './builtin';
import { Entity } from './entity';

export interface User extends Entity, BuiltIn, Audit {
  id: string;
  name: string;
  username: string;
  email: string;
  orgas?: ({id:string, code:string}[]);
}