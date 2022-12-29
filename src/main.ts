import { MongoClient, ServerApiVersion } from 'mongodb';
import { MongoWrapper } from './core/wrappers/mongo_wrapper';
import { UserDataSourceImpl } from './data/datasources/user_data_source';
import { UserRepositoryImpl } from './data/repositories/user_repository_impl';
import { GetUser } from './domain/usecases/users/get_user';
import UsersRouter from './presentation/user_router';
import { UserModel } from './data/models/user_model';
import { GetUsersByOrgaId } from './domain/usecases/users/get_users_by_orga';
import { AddUser } from './domain/usecases/users/add_user';
import { UpdateUser } from './domain/usecases/users/update_user';
import { EnableUser } from './domain/usecases/users/enable_user';
import { DeleteUser } from './domain/usecases/users/delete_user';
import app from './server';

(async () => {

	const uri = 'mongodb+srv://lomba:LVMVSDHqLWunzzdv@cluster0.j0aztjy.mongodb.net/?retryWrites=true&w=majority';
	const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
	
	await client.connect();
	const db = client.db('LOGIN_DB');
    
	///Usuarios
	const userMongo = new MongoWrapper<UserModel>('users', db);
	const userDataSource = new UserDataSourceImpl(userMongo);
	const userRepo = new UserRepositoryImpl(userDataSource);

	const userMiddleWare = UsersRouter(
		new GetUser(userRepo), new GetUsersByOrgaId(userRepo), 
		new AddUser(userRepo), new UpdateUser(userRepo), 
		new EnableUser(userRepo), new DeleteUser(userRepo)
	);
	app.use('/api/v1/user', userMiddleWare);
	///Fin usuarios
    
	app.listen(4000, () => console.log('Running on http://localhost:4000'));

})();
