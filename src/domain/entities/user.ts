export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  builtin: boolean;
  enabled: boolean;
  created: Date;
  updated?: Date;
  deleted?: Date;
  expires?: Date;
}