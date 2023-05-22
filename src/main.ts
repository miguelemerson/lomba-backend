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
import { SendVote } from './domain/usecases/votes/send_vote';
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
import { RegisterUserPicture } from './domain/usecases/users/register_userpicture';
import { UploadUserPicture } from './domain/usecases/users/upload_userpicture';
import { GetPostWithUser } from './domain/usecases/posts/get_withuser_post';
import BookmarksRouter from './presentation/bookmark_router';
import { GiveMarkPost } from './domain/usecases/posts/give_mark_post';
import { BookmarkRepositoryImpl } from './data/repositories/bookmark_repository_impl';
import { BookmarkDataSourceImpl } from './data/datasources/bookmark_data_source';
import { BookmarkModel } from './data/models/workflow/bookmark_model';
import { CommentModel } from './data/models/workflow/comment_model';
import { CommentDataSourceImpl } from './data/datasources/comment_data_source';
import { CommentRepositoryImpl } from './data/repositories/comment_repository_impl';
import { AddPostComment } from './domain/usecases/comments/add_post_comment';
import { DeletePostComment } from './domain/usecases/comments/delete_post_comment';
import { GetPostComments } from './domain/usecases/comments/get_post_comments';
import CommentsRouter from './presentation/comment_router';
import { VoteModel } from './data/models/workflow/vote_model';
import { VoteDataSourceImpl } from './data/datasources/vote_data_source';
import { VoteRepositoryImpl } from './data/repositories/vote_repository_impl';
import VotesRouter from './presentation/vote_router';
import { CategoryModel } from './data/models/workflow/category_model';
import { CategoryDataSourceImpl } from './data/datasources/category_data_source';
import { CategoryRepositoryImpl } from './data/repositories/category_repository_impl';
import CategoriesRouter from './presentation/category_router';
import { AddCategory } from './domain/usecases/category/add_category';
import { GetCategoryById } from './domain/usecases/category/get_category_by_id';
import { GetCategoryByName } from './domain/usecases/category/get_category_by_name';
import { SearchCategories } from './domain/usecases/category/search_categories';
import { ExternalUriDataSourceImpl } from './data/datasources/externaluri_data_source';
import { ExternalUriModel } from './data/models/storage/externaluri_model';
import { ExternalUriRepositoryImpl } from './data/repositories/externaluri_repository_impl';
import ExternalUrisRouter from './presentation/externaluri_router';
import { AddExternalUri } from './domain/usecases/storage/add_externaluri';
import { GetExternalUriById } from './domain/usecases/storage/get_externaluri_by_id';
import { GetExternalUriByUri } from './domain/usecases/storage/get_externaluri_by_uri';
import { HostDataSourceImpl } from './data/datasources/host_data_source';
import { HostModel } from './data/models/storage/host_model';
import { UploadCloudFileByExternalUri } from './domain/usecases/storage/upload_cloudfile_by_uri';

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
	const bookmarkMongo = new MongoWrapper<BookmarkModel>('bookmarks', db);
	const commentMongo = new MongoWrapper<CommentModel>('comments', db);
	const voteMongo = new MongoWrapper<VoteModel>('votes', db);
	const categoryMongo = new MongoWrapper<CategoryModel>('categories', db);
	const externalUriMongo = new MongoWrapper<ExternalUriModel>('externaluris', db);
	const hostMongo = new MongoWrapper<HostModel>('hosts', db);
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
	const bookmarkDataSource = new BookmarkDataSourceImpl(bookmarkMongo);
	const commentDataSource = new CommentDataSourceImpl(commentMongo);
	const voteDataSource = new VoteDataSourceImpl(voteMongo);
	const categoryDataSource = new CategoryDataSourceImpl(categoryMongo);
	const externalUriDataSource = new ExternalUriDataSourceImpl(externalUriMongo);
	const hostDataSource = new HostDataSourceImpl(hostMongo);

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
	const postRepo = new PostRepositoryImpl(postDataSource, stageDataSource, flowDataSource, voteDataSource);
	const flowRepo = new FlowRepositoryImpl(flowDataSource);
	const stageRepo = new StageRepositoryImpl(stageDataSource);
	const settingRepo = new SettingRepositoryImpl(settingDataSource);
	const storageRepo = new StorageRepositoryImpl(cloudFileDataSource, blobStorageSource, externalUriDataSource);
	const bookmarkRepo = new BookmarkRepositoryImpl(bookmarkDataSource, postDataSource);
	const commentRepo = new CommentRepositoryImpl(commentDataSource, postDataSource);
	const voteRepo = new VoteRepositoryImpl(voteDataSource, postDataSource, flowDataSource, stageDataSource);
	const categoryRepo = new CategoryRepositoryImpl(categoryDataSource);
	const externalUriRepo = new ExternalUriRepositoryImpl(externalUriDataSource, hostDataSource);

	//revisa que los datos estén cargados.
	await checkData01(roleDataSource, userDataSource, passDataSource, orgaDataSource, orgaUserDataSource, userMongo, roleMongo, passMongo, orgaMongo, orgaUserMongo);
	await checkData02(stageDataSource, flowDataSource, postDataSource, voteDataSource, categoryDataSource, postMongo, categoryMongo, voteMongo);
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

	const postMiddleWare = PostsRouter(new GetPosts(postRepo), new AddTextPost(postRepo), new UpdatePost(postRepo), new DeletePost(postRepo), new EnablePost(postRepo), new ChangeStagePost(postRepo), new GetAdminViewPosts(postRepo), new GetPost(postRepo), new AddMultiPost(postRepo), new GetPostWithUser(postRepo));

	const flowMiddleWare = FlowsRouter(new GetFlow(flowRepo), new GetFlows(flowRepo));

	const stageMiddleWare = StagesRouter(new GetStage(stageRepo), new GetStages(stageRepo));

	const settingMiddleWare = SettingsRouter(new GetSuperSettings(settingRepo), new GetOrgaSettings(settingRepo), new UpdateSettings(settingRepo));

	const storageMiddleWare = StorageRouter(new UploadCloudFile(storageRepo), new GetCloudFile(storageRepo), new RegisterCloudFile(storageRepo), new RegisterUserPicture(storageRepo), new UploadUserPicture(storageRepo), new UploadCloudFileByExternalUri(storageRepo));

	const bookmarkMiddleWare = BookmarksRouter(new GiveMarkPost(bookmarkRepo));
	const commentMiddleWare = CommentsRouter(new AddPostComment(commentRepo), new DeletePostComment(commentRepo), new GetPostComments(commentRepo));
	const voteMiddleWare = VotesRouter(new SendVote(voteRepo));

	const categoryMiddleWare = CategoriesRouter(new AddCategory(categoryRepo), new GetCategoryById(categoryRepo), new GetCategoryByName(categoryRepo), new SearchCategories(categoryRepo));

	const externalUriMiddleWare = ExternalUrisRouter(new AddExternalUri(externalUriRepo), new GetExternalUriById(externalUriRepo), new GetExternalUriByUri(externalUriRepo));

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
	app.use('/api/v1/bookmark', bookmarkMiddleWare);
	app.use('/api/v1/comment', commentMiddleWare);
	app.use('/api/v1/vote', voteMiddleWare);
	app.use('/api/v1/category', categoryMiddleWare);
	app.use('/api/v1/externaluri', externalUriMiddleWare);

	///Fin usuarios
	app.listen(configEnv().PORT, async () => console.log('Running on http://localhost:' + configEnv().PORT));

})();
