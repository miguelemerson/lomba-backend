import { ModelContainer } from '../../core/model_container';
import { PasswordModel } from '../../data/models/password_model';
import { Auth } from '../entities/auth';
import { Token } from '../entities/token';

export interface PasswordRepository {
    addPassword(userId:string, auth:Auth): Promise<boolean | null>;
    updatePassword(userId:string, auth:Auth): Promise<boolean | null>;
    getPassword(userId:string): Promise<ModelContainer<PasswordModel> | null>;
    getAuth(auth:Auth):Promise<ModelContainer<Token> | null>;
}