import { User } from "../../domain/entities/user";

export class UserModel implements User {
    constructor(id: string, name: string, username: string, 
        email: string, enabled: boolean, builtIn: boolean){
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.enabled = enabled;
        this.builtIn = builtIn;
    }

    id?: string;
    name: string;
    username: string;
    email: string;
  enabled: boolean;
  builtIn: boolean;
    }