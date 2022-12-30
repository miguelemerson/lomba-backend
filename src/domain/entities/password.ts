export interface Password {
    userId: string;
    hash: string;
    salt: string;  
    istemp?:boolean;
}