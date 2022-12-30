"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
export class PasswordRepositoryImpl implements PasswordRepository {
    dataSource: PasswordDataSource;
    constructor(dataSource: PasswordDataSource){
        this.dataSource = dataSource;
    }

    async registerPassword(userId:string, auth:Auth): Promise<boolean | null>{
        try{
            const user: PasswordModel = new PasswordModel(id, name, username, email, enabled, builtIn);
            const result = this.dataSource.add(user);
            return result;
        }
        catch(error)
        {
            if(error instanceof MongoError)
            {
                throw new DatabaseException(error.name, error.message, error.code, error);
            } else if(error instanceof Error)
                throw new NetworkException(error.name, error.message, undefined, error);
            
        }
        return null;
    }
    async changePassword(userId:string, auth:Auth): Promise<boolean | null>{
        try{
            const result = this.dataSource.update(id, user);
            return result;
        }
        catch(error)
        {
            if(error instanceof MongoError)
            {
                throw new DatabaseException(error.name, error.message, error.code, error);
            } else if(error instanceof Error)
                throw new NetworkException(error.name, error.message, undefined, error);
            
        }
        return null;
    }

    async getPassword(userId: string): Promise<ModelContainer<PasswordModel> | null> {
        try
        {
            const result = await this.dataSource.getOne(id);
            return result;
        }
        catch(error)
        {
            if(error instanceof MongoError)
            {
                throw new DatabaseException(error.name, error.message, error.code, error);
            } else if(error instanceof Error)
                throw new NetworkException(error.name, error.message, undefined, error);
            
        }
        return null;
    }
}

*/ 
//# sourceMappingURL=password_repository_impl.js.map