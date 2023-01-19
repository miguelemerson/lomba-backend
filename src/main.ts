import { UpdatePassword } from './domain/usecases/password/update_password';
import { AddPassword } from './domain/usecases/password/add_password';
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
import { RoleModel } from './data/models/role_model';
import { PasswordModel } from './data/models/password_model';
import { OrgaModel } from './data/models/orga_model';
import { OrgaUserModel } from './data/models/orgauser_model';
import { RoleDataSourceImpl } from './data/datasources/role_data_source';
import { PasswordDataSourceImpl } from './data/datasources/password_data_source';
import { OrgaDataSourceImpl } from './data/datasources/orga_data_source';
import { OrgaUserDataSourceImpl } from './data/datasources/orgauser_data_source';
import { RoleRepositoryImpl } from './data/repositories/role_repository_impl';
import { PasswordRepositoryImpl } from './data/repositories/password_repository_impl';
import { OrgaRepositoryImpl } from './data/repositories/orga_repository_impl';
import { OrgaUserRepositoryImpl } from './data/repositories/orgauser_repository_impl';
import RolesRouter from './presentation/role_router';
import { GetRole } from './domain/usecases/roles/get_role';
import { GetRoles } from './domain/usecases/roles/get_roles';
import { EnableRole } from './domain/usecases/roles/enable_role';
import OrgasRouter from './presentation/orga_router';
import { GetOrga } from './domain/usecases/orgas/get_orga';
import { GetOrgas } from './domain/usecases/orgas/get_orgas';
import { AddOrga } from './domain/usecases/orgas/add_orga';
import { UpdateOrga } from './domain/usecases/orgas/update_orga';
import { EnableOrga } from './domain/usecases/orgas/enable_orga';
import { DeleteOrga } from './domain/usecases/orgas/delete_orga';
import AuthRouter from './presentation/auth_router';
import { GetToken } from './domain/usecases/auth/get_token';
import { AuthRepositoryImpl } from './data/repositories/auth_repository_impl';
import { RegisterUser } from './domain/usecases/auth/register_user';
import { checkData01 } from './core/builtindata/load_data_01';
import * as dotenv from 'dotenv';
import { configEnv } from './config_env';
import { ChangeOrga } from './domain/usecases/auth/change_orga';
import OrgaUsersRouter from './presentation/orgauser_router';
import { GetOrgaUser } from './domain/usecases/orgas/get_orgauser';
import { AddOrgaUser } from './domain/usecases/orgas/add_orgauser';
import { DeleteOrgaUser } from './domain/usecases/orgas/delete_orgauser';
import { EnableOrgaUser } from './domain/usecases/orgas/enable_orgauser';
import { UpdateOrgaUser } from './domain/usecases/orgas/update_orgauser';
import { GetOrgaUserByOrga } from './domain/usecases/orgas/get_orgausers_by_orga';
import { GetOrgaUserByUser } from './domain/usecases/orgas/get_orgausers_by_user';
import { GetUsersNotInOrga } from './domain/usecases/users/get_users_notin_orga';
import PasswordsRouter from './presentation/password_router';

(async () => {
	dotenv.config();

	console.log('NODE_ENV: ' + configEnv().NODE_ENV);
	console.log('PORT: ' + configEnv().PORT);
	console.log('DB: ' + configEnv().DB_NAME);

	const uri = configEnv().MONGODB_URL;
	const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
	
	await client.connect();
	const db = client.db(configEnv().DB_NAME);
    
	///wrappers
	const roleMongo = new MongoWrapper<RoleModel>('roles', db);
	const userMongo = new MongoWrapper<UserModel>('users', db);
	const passMongo = new MongoWrapper<PasswordModel>('passes', db);
	const orgaMongo = new MongoWrapper<OrgaModel>('orgas', db);
	const orgaUserMongo = new MongoWrapper<OrgaUserModel>('orgasusers', db);

	//datasources
	const roleDataSource = new RoleDataSourceImpl(roleMongo);
	const userDataSource = new UserDataSourceImpl(userMongo);
	const passDataSource = new PasswordDataSourceImpl(passMongo);
	const orgaDataSource = new OrgaDataSourceImpl(orgaMongo);
	const orgaUserDataSource = new OrgaUserDataSourceImpl(orgaUserMongo);

	//repositorios
	const roleRepo = new RoleRepositoryImpl(roleDataSource);
	const userRepo = new UserRepositoryImpl(userDataSource);
	const passRepo = new PasswordRepositoryImpl(passDataSource);
	const orgaRepo = new OrgaRepositoryImpl(orgaDataSource);
	const orgaUserRepo = new OrgaUserRepositoryImpl(orgaUserDataSource, userDataSource);
	const authRepo = new AuthRepositoryImpl(userDataSource, orgaDataSource, passDataSource, orgaUserDataSource);

	//revisa que los datos estén cargados.
	checkData01(roleDataSource, userDataSource, passDataSource, orgaDataSource, orgaUserDataSource);

	//routers
	const roleMiddleWare = RolesRouter(new GetRole(roleRepo), new GetRoles(roleRepo), new EnableRole(roleRepo));

	const userMiddleWare = UsersRouter(
		new GetUser(userRepo), new GetUsersByOrgaId(userRepo), 
		new AddUser(userRepo), new UpdateUser(userRepo), 
		new EnableUser(userRepo), new DeleteUser(userRepo), new GetUsersNotInOrga(userRepo)
	);

	const orgaMiddleWare = OrgasRouter(new GetOrga(orgaRepo), new GetOrgas(orgaRepo), new AddOrga(orgaRepo), new UpdateOrga(orgaRepo), new EnableOrga(orgaRepo), new DeleteOrga(orgaRepo));

	const orgauserMiddleWare = OrgaUsersRouter(new GetOrgaUserByOrga(orgaUserRepo), new GetOrgaUserByUser(orgaUserRepo), new GetOrgaUser(orgaUserRepo), new AddOrgaUser(orgaUserRepo), new UpdateOrgaUser(orgaUserRepo), new EnableOrgaUser(orgaUserRepo), new DeleteOrgaUser(orgaUserRepo));

	const authMiddleWare = AuthRouter(new GetToken(authRepo), new RegisterUser(authRepo), new ChangeOrga(authRepo));
	const passMiddleWare = PasswordsRouter(new AddPassword(passRepo), new UpdatePassword(passRepo) );

	app.use('/api/v1/user', userMiddleWare);
	app.use('/api/v1/role', roleMiddleWare);
	app.use('/api/v1/orga', orgaMiddleWare);
	app.use('/api/v1/orgauser', orgauserMiddleWare);
	app.use('/api/v1/auth', authMiddleWare);
	app.use('/api/v1/password', passMiddleWare);

	///Fin usuarios
	app.listen(configEnv().PORT, () => console.log('Running on http://localhost:' + configEnv().PORT));

})();
