export interface Entity {
    _id?: string;
    id: string;
    builtin: boolean;
    enabled: boolean;
    created: Date;
    updated?: Date;
    deleted?: Date;
    expires?: Date;    
  }