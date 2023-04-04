import * as dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { configEnv } from './config_env';
import { checkData01 } from './core/builtindata/load_data_01';
import { MongoWrapper } from './core/wrappers/mongo_wrapper';
import { OrgaDataSourceImpl } from './data/datasources/orga_data_source';
import { OrgaUserDataSourceImpl } from './data/datasources/orgauser_data_source';
import { PasswordDataSourceImpl } from './data/datasources/password_data_source';
import { RoleDataSourceImpl } from './data/datasources/role_data_source';
import { UserDataSourceImpl } from './data/datasources/user_data_source';
import { OrgaModel } from './data/models/orga_model';
import { OrgaUserModel } from './data/models/orgauser_model';
import { PasswordModel } from './data/models/password_model';
import { RoleModel } from './data/models/role_model';
import { UserModel } from './data/models/user_model';
import { AuthRepositoryImpl } from './data/repositories/auth_repository_impl';
import { OrgaRepositoryImpl } from './data/repositories/orga_repository_impl';
import { OrgaUserRepositoryImpl } from './data/repositories/orgauser_repository_impl';
import { PasswordRepositoryImpl } from './data/repositories/password_repository_impl';
import { RoleRepositoryImpl } from './data/repositories/role_repository_impl';
import { UserRepositoryImpl } from './data/repositories/user_repository_impl';
import { ChangeOrga } from './domain/usecases/auth/change_orga';
import { GetToken } from './domain/usecases/auth/get_token';
import { GetTokenGoogle } from './domain/usecases/auth/get_token_google';
import { RegisterUser } from './domain/usecases/auth/register_user';
import { AddOrga } from './domain/usecases/orgas/add_orga';
import { AddOrgaUser } from './domain/usecases/orgas/add_orgauser';
import { DeleteOrga } from './domain/usecases/orgas/delete_orga';
import { DeleteOrgaUser } from './domain/usecases/orgas/delete_orgauser';
import { EnableOrga } from './domain/usecases/orgas/enable_orga';
import { EnableOrgaUser } from './domain/usecases/orgas/enable_orgauser';
import { ExistsOrga } from './domain/usecases/orgas/exists_orga';
import { GetOrga } from './domain/usecases/orgas/get_orga';
import { GetOrgas } from './domain/usecases/orgas/get_orgas';
import { GetOrgaUser } from './domain/usecases/orgas/get_orgauser';
import { GetOrgaUserByOrga } from './domain/usecases/orgas/get_orgausers_by_orga';
import { GetOrgaUserByUser } from './domain/usecases/orgas/get_orgausers_by_user';
import { UpdateOrga } from './domain/usecases/orgas/update_orga';
import { UpdateOrgaUser } from './domain/usecases/orgas/update_orgauser';
import { AddPassword } from './domain/usecases/password/add_password';
import { UpdatePassword } from './domain/usecases/password/update_password';
import { EnableRole } from './domain/usecases/roles/enable_role';
import { GetRole } from './domain/usecases/roles/get_role';
import { GetRoles } from './domain/usecases/roles/get_roles';
import { AddUser } from './domain/usecases/users/add_user';
import { DeleteUser } from './domain/usecases/users/delete_user';
import { EnableUser } from './domain/usecases/users/enable_user';
import { ExistsUser } from './domain/usecases/users/exists_user';
import { GetUser } from './domain/usecases/users/get_user';
import { GetUsersByOrgaId } from './domain/usecases/users/get_users_by_orga';
import { GetUsersNotInOrga } from './domain/usecases/users/get_users_notin_orga';
import { UpdateUser } from './domain/usecases/users/update_user';
import AuthRouter from './presentation/auth_router';
import OrgasRouter from './presentation/orga_router';
import OrgaUsersRouter from './presentation/orgauser_router';
import PasswordsRouter from './presentation/password_router';
import PostsRouter from './presentation/post_router';
import RolesRouter from './presentation/role_router';
import UsersRouter from './presentation/user_router';
import app from './server';

import firebase, { ServiceAccount } from 'firebase-admin';
import { checkData02 } from './core/builtindata/load_data_02';
import { checkData03 } from './core/builtindata/load_data_03';
import { GoogleAuth } from './core/google_auth';
import { BlobStorageSourceImpl } from './data/datasources/blob_storage_source';
import { FlowDataSourceImpl } from './data/datasources/flow_data_source';
import { PostDataSourceImpl } from './data/datasources/post_data_source';
import { SettingDataSourceImpl } from './data/datasources/setting_data_source';
import { StageDataSourceImpl } from './data/datasources/stage_data_source';
import { SettingModel } from './data/models/setting_model';
import { FlowModel } from './data/models/workflow/flow_model';
import { PostModel } from './data/models/workflow/post_model';
import { StageModel } from './data/models/workflow/stage_model';
import { FlowRepositoryImpl } from './data/repositories/flow_repository_impl';
import { PostRepositoryImpl } from './data/repositories/post_repository_impl';
import { StageRepositoryImpl } from './data/repositories/stage_repository_impl';
import { GetFlow } from './domain/usecases/flows/get_flow';
import { GetFlows } from './domain/usecases/flows/get_flows';
import { GetOrgasByUser } from './domain/usecases/orgas/get_orgas_by_user';
import { AddTextPost } from './domain/usecases/posts/add_text_post';
import { ChangeStagePost } from './domain/usecases/posts/change_stage_post';
import { DeletePost } from './domain/usecases/posts/delete_post';
import { EnablePost } from './domain/usecases/posts/enable_post';
import { GetAdminViewPosts } from './domain/usecases/posts/get_adminview_post';
import { GetPost } from './domain/usecases/posts/get_post';
import { GetPosts } from './domain/usecases/posts/get_posts';
import { SendVote } from './domain/usecases/posts/send_vote';
import { UpdatePost } from './domain/usecases/posts/update_post';
import { GetOrgaSettings } from './domain/usecases/settings/get_orga_settings';
import { GetSuperSettings } from './domain/usecases/settings/get_super_settings';
import { GetStage } from './domain/usecases/stages/get_stage';
import { GetStages } from './domain/usecases/stages/get_stages';
import FlowsRouter from './presentation/flow_router';
import SettingsRouter from './presentation/setting_router';
import StagesRouter from './presentation/stage_router';
import { SettingRepositoryImpl } from './data/repositories/setting_repository_impl';
import { UpdateSettings } from './domain/usecases/settings/update_settings';
import { StorageRepositoryImpl } from './data/repositories/storage_repository_impl';
import { CloudFileDataSourceImpl } from './data/datasources/cloudfile_data_source';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { UploadCloudFile } from './domain/usecases/storage/upload_cloudfile';
import StorageRouter from './presentation/storage_router';
import { RegisterCloudFile } from './domain/usecases/storage/register_cloudfile';
import { GetCloudFile } from './domain/usecases/storage/get_cloudfile';
import { AddMultiPost } from './domain/usecases/posts/add_multi_post';

dotenv.config();

export const googleApp = firebase.initializeApp({credential:firebase.credential.cert(JSON.parse(configEnv().FIREBASE_CERT) as ServiceAccount)});

(async () => {
	console.log('NODE_ENV: ' + configEnv().NODE_ENV);
	console.log('PORT: ' + configEnv().PORT);
	console.log('DB: ' + configEnv().DB_NAME);

	const uri = configEnv().MONGODB_URL;
	const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
	
	await client.connect();
	const db = client.db(configEnv().DB_NAME);

	///storage
	const blobService = BlobStorageSourceImpl.newBlobService(configEnv().AZSTORAGEACCOUNT_NAME, configEnv().AZSTORAGEACCOUNT_KEY);

	const storageFiles = new BlobStorageSourceImpl(blobService, 'files');
	storageFiles.startContainer();
    
	///wrappers
	const roleMongo = new MongoWrapper<RoleModel>('roles', db);
	const userMongo = new MongoWrapper<UserModel>('users', db);
	const passMongo = new MongoWrapper<PasswordModel>('passes', db);
	const orgaMongo = new MongoWrapper<OrgaModel>('orgas', db);
	const orgaUserMongo = new MongoWrapper<OrgaUserModel>('orgasusers', db);
	const stageMongo = new MongoWrapper<StageModel>('stages', db);
	const flowMongo = new MongoWrapper<FlowModel>('flows', db);
	const postMongo = new MongoWrapper<PostModel>('posts', db);
	const settingMongo = new MongoWrapper<SettingModel>('settings', db);
	const cloudFileMongo = new MongoWrapper<SettingModel>('cloudfiles', db);

	//datasources
	const roleDataSource = new RoleDataSourceImpl(roleMongo);
	const userDataSource = new UserDataSourceImpl(userMongo);
	const passDataSource = new PasswordDataSourceImpl(passMongo);
	const orgaDataSource = new OrgaDataSourceImpl(orgaMongo);
	const orgaUserDataSource = new OrgaUserDataSourceImpl(orgaUserMongo);
	const stageDataSource = new StageDataSourceImpl(stageMongo);
	const flowDataSource = new FlowDataSourceImpl(flowMongo);
	const postDataSource = new PostDataSourceImpl(postMongo);
	const settingDataSource = new SettingDataSourceImpl(settingMongo);
	const cloudFileDataSource = new CloudFileDataSourceImpl(cloudFileMongo);


	const account = configEnv().AZSTORAGEACCOUNT_NAME;
	const accountKey = configEnv().AZSTORAGEACCOUNT_KEY;
	const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

	// List containers
	const blobServiceClient = new BlobServiceClient(
		`https://${account}.blob.core.windows.net`,
		sharedKeyCredential
	);

	const blobStorageSource = new BlobStorageSourceImpl(blobServiceClient, 'files');

	//repositorios
	const roleRepo = new RoleRepositoryImpl(roleDataSource);
	const userRepo = new UserRepositoryImpl(userDataSource);
	const passRepo = new PasswordRepositoryImpl(passDataSource);
	const orgaRepo = new OrgaRepositoryImpl(orgaDataSource);
	const orgaUserRepo = new OrgaUserRepositoryImpl(orgaUserDataSource, userDataSource, orgaDataSource);

	const googleAuth = new GoogleAuth(googleApp);

	const authRepo = new AuthRepositoryImpl(userDataSource, orgaDataSource, passDataSource, orgaUserDataSource, googleAuth);
	const postRepo = new PostRepositoryImpl(postDataSource, stageDataSource, flowDataSource);
	const flowRepo = new FlowRepositoryImpl(flowDataSource);
	const stageRepo = new StageRepositoryImpl(stageDataSource);
	const settingRepo = new SettingRepositoryImpl(settingDataSource);
	const storageRepo = new StorageRepositoryImpl(cloudFileDataSource, blobStorageSource);

	//revisa que los datos estén cargados.
	await checkData01(roleDataSource, userDataSource, passDataSource, orgaDataSource, orgaUserDataSource, userMongo);
	await checkData02(stageDataSource, flowDataSource, postDataSource, postMongo);
	await checkData03(settingDataSource);

	//routers
	const roleMiddleWare = RolesRouter(new GetRole(roleRepo), new GetRoles(roleRepo), new EnableRole(roleRepo));

	const userMiddleWare = UsersRouter(
		new GetUser(userRepo), new GetUsersByOrgaId(userRepo), 
		new AddUser(userRepo), new UpdateUser(userRepo), 
		new EnableUser(userRepo), new DeleteUser(userRepo), new GetUsersNotInOrga(userRepo),
		new ExistsUser(userRepo)
	);

	const orgaMiddleWare = OrgasRouter(new GetOrga(orgaRepo), new GetOrgas(orgaRepo), new AddOrga(orgaRepo), new UpdateOrga(orgaRepo), new EnableOrga(orgaRepo), new DeleteOrga(orgaRepo), new ExistsOrga(orgaRepo), new GetOrgasByUser(orgaUserRepo));

	const orgauserMiddleWare = OrgaUsersRouter(new GetOrgaUserByOrga(orgaUserRepo), new GetOrgaUserByUser(orgaUserRepo), new GetOrgaUser(orgaUserRepo), new AddOrgaUser(orgaUserRepo), new UpdateOrgaUser(orgaUserRepo), new EnableOrgaUser(orgaUserRepo), new DeleteOrgaUser(orgaUserRepo));

	const authMiddleWare = AuthRouter(new GetToken(authRepo), new RegisterUser(authRepo), new ChangeOrga(authRepo), new GetTokenGoogle(authRepo));

	const passMiddleWare = PasswordsRouter(new AddPassword(passRepo), new UpdatePassword(passRepo) );

	const postMiddleWare = PostsRouter(new GetPosts(postRepo), new AddTextPost(postRepo), new SendVote(postRepo), new UpdatePost(postRepo), new DeletePost(postRepo), new EnablePost(postRepo), new ChangeStagePost(postRepo), new GetAdminViewPosts(postRepo), new GetPost(postRepo), new AddMultiPost(postRepo));

	const flowMiddleWare = FlowsRouter(new GetFlow(flowRepo), new GetFlows(flowRepo));

	const stageMiddleWare = StagesRouter(new GetStage(stageRepo), new GetStages(stageRepo));

	const settingMiddleWare = SettingsRouter(new GetSuperSettings(settingRepo), new GetOrgaSettings(settingRepo), new UpdateSettings(settingRepo));

	const storageMiddleWare = StorageRouter(new UploadCloudFile(storageRepo), new GetCloudFile(storageRepo), new RegisterCloudFile(storageRepo));

	app.use('/api/v1/user', userMiddleWare);
	app.use('/api/v1/role', roleMiddleWare);
	app.use('/api/v1/orga', orgaMiddleWare);
	app.use('/api/v1/orgauser', orgauserMiddleWare);
	app.use('/api/v1/auth', authMiddleWare);
	app.use('/api/v1/password', passMiddleWare);
	app.use('/api/v1/post', postMiddleWare);
	app.use('/api/v1/flow', flowMiddleWare);
	app.use('/api/v1/stage', stageMiddleWare);
	app.use('/api/v1/setting', settingMiddleWare);
	app.use('/api/v1/storage', storageMiddleWare);

	///Fin usuarios
	app.listen(configEnv().PORT, async () => console.log('Running on http://localhost:' + configEnv().PORT));

})();
