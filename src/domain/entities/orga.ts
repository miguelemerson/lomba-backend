export interface Orga {
    id?: string;
    name: string;
    code: string;
  builtin: boolean;
  enabled: boolean;
  created: Date;
  updated?: Date;
  deleted?: Date;
  expires?: Date;
}