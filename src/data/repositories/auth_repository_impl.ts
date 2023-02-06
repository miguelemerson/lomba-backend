import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { generateJWT } from '../../core/jwt';
import { ModelContainer } from '../../core/model_container';
import { HashPassword } from '../../core/password_hash';
import { Auth } from '../../domain/entities/auth';
import { AuthRepository } from '../../domain/repositories/auth_repository';
import { OrgaDataSource } from '../datasources/orga_data_source';
import { OrgaUserDataSource } from '../datasources/orgauser_data_source';
import { PasswordDataSource } from '../datasources/password_data_source';
import { UserDataSource } from '../datasources/user_data_source';
import { OrgaModel } from '../models/orga_model';
import { OrgaUserModel } from '../models/orgauser_model';
import { PasswordModel } from '../models/password_model';
import { RoleModel } from '../models/role_model';
import { TokenModel } from '../models/token_model';
import { UserModel } from '../models/user_model';
import { User } from '../../domain/entities/user';
import { data_insert01 } from '../../core/builtindata/load_data_01';
import { Token } from '../../domain/entities/token';
import firebase, { ServiceAccount } from 'firebase-admin';
import { configEnv } from '../../config_env';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(configEnv().FIREBASE_CERT);

export const googleApp = firebase.initializeApp({credential:firebase.credential.cert(JSON.parse(configEnv().FIREBASE_CERT) as ServiceAccount)});

export class AuthRepositoryImpl implements AuthRepository {
	passwordDataSource: PasswordDataSource;
	userDataSource: UserDataSource;
	orgaDataSource: OrgaDataSource;
	orgaUserDataSource: OrgaUserDataSource;
	constructor(userDataSource: UserDataSource, orgaDataSource: OrgaDataSource, passwordDataSource: PasswordDataSource, orgaUserDataSource: OrgaUserDataSource){
		this.passwordDataSource = passwordDataSource;
		this.userDataSource = userDataSource;
		this.orgaDataSource = orgaDataSource;
		this.orgaUserDataSource = orgaUserDataSource;
	}

	async getAuth(auth:Auth):Promise<Either<Failure,ModelContainer<TokenModel>>>
	{
		try{
			//si el password no viene informado, entonces se rechaza la solicitud
			if(!auth.password)
				return Either.left(new GenericFailure('Need password'));

			//busca usuario por username o email, debe estar habilitado.
			const user = await this.findUser(auth.username, auth.username);
			//si no lo encuentra retorna falla
			if(!user)
				return Either.left(new GenericFailure('Not found'));
			
			//tenemos el usuario
			//busca la password que coincida con la especificada
			const pass = await this.findPassword(user._id, auth.password);

			//si no tiene la password entonces rechaza
			if(!pass)
				return Either.left(new GenericFailure('Pass not found'));

			//tenemos la password, tiene un dato que indica que la password es temporal, así se podrá exigir al usuario hacer un cambio de ella.			

			//busca las orgas que coincidan con los id que están en el array de organizaciones de usuario.
			const orgas = await this.findUserOrgas(user.orgas);

			//si el auth especifica orgaId y está contenida en las organizaciones asociadas al usuario entonces:
			const orgaId = this.resolveSpecificOrga(orgas, auth.orgaId);

			//lista de roles del usuario en la organización seleccionada
			//si la organización no está especificada entonces retorna undefined para los roles
			const rolesString = await this.findRoles(user.id, orgaId);

			//nuevo token con el payload que se especifica.
			const newToken = generateJWT({userId:user.id, orgaId: orgaId, roles: rolesString}, 'lomba', 60*60);

			//objeto que finalmente se retorna en el endpoint de autenticación y autorización.
			const tokenModel = new TokenModel(newToken, orgaId ? orgaId : '', orgas, pass.istemp);
			return Either.right(ModelContainer.fromOneItem(tokenModel));
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async registerUser(user:UserModel, auth:Auth, roles:string): Promise<Either<Failure,ModelContainer<User>>>{
		try{

			//debe especificar password caso contrario retorna left
			if(!auth.password)
				return Either.left(new GenericFailure('Need password'));

			//se crea al usuario
			const newUser = await this.newUser(user);
			if(!newUser)
				return Either.left(new GenericFailure('No user added'));

			//se crea nueva password en base de datos
			//la información va encriptada, no se almacena la contraseña plana 
			//sino que se trata de un hash
			const newPassword = await this.newPassword(user._id, auth.password);

			//sólo en caso de existir problema
			if(!newPassword)
				return Either.left(new GenericFailure('No pass added'));			

			//si se especifica organización entonces se crea la asociación
			//de OrgaUser con sus roles
			if(auth.orgaId)
			{
				await this.newOrgaUser(auth.orgaId, newUser._id, roles);

				const orgas = await this.orgaDataSource.getOne({'_id':auth.orgaId});
				if (orgas.currentItemCount > 0) {
					const orgasIdCode = [{id:orgas.items[0].id,code:orgas.items[0].code}];
					await this.userDataSource.update(newUser.id, {orgas:orgasIdCode});
				}
			}

			return Either.right(ModelContainer.fromOneItem(user));
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async changeOrga(auth:Auth):Promise<Either<Failure,ModelContainer<TokenModel>>>
	{
		try
		{
			//si el orgaId no viene informado, entonces se rechaza la solicitud
			if(!auth.orgaId)
				return Either.left(new GenericFailure('Need orgaId'));

			//busca usuario por username o email, debe estar habilitado.
			const user = await this.findUser(auth.username, auth.username);
			//si no lo encuentra retorna falla
			if(!user)
				return Either.left(new GenericFailure('Not found'));
				
			//busca las orgas que coincidan con los id que están en el array de organizaciones de usuario.
			const orgas = await this.findUserOrgas(user.orgas);				
				
			//si el auth especifica orgaId y está contenida en las organizaciones asociadas al usuario entonces:
			const orgaId = this.resolveSpecificOrga(orgas, auth.orgaId);

			//lista de roles del usuario en la organización seleccionada
			//si la organización no está especificada entonces retorna undefined para los roles
			const rolesString = await this.findRoles(user.id, orgaId);

			//nuevo token con el payload que se especifica.
			const newToken = generateJWT({userId:user.id, orgaId: orgaId, roles: rolesString}, 'lomba', 60*60);

			//objeto que finalmente se retorna en el endpoint de autenticación y autorización.
			const tokenModel = new TokenModel(newToken, orgaId ? orgaId : '', orgas);
			return Either.right(ModelContainer.fromOneItem(tokenModel));

		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async getAuthGoogle(userToAuth:User, googleToken:string):Promise<Either<Failure,ModelContainer<Token>>>
	{
		let userAuth = userToAuth;
		try{

			try
			{
				const googleVerify = await googleApp.auth().verifyIdToken(googleToken);

				if(googleVerify.id == '')
					Either.left(new GenericFailure('No valid token'));
				
				//busca usuario por username o email, debe estar habilitado.
				const user = await this.findUser(userToAuth.username, userToAuth.email);
				//si no lo encuentra entonces registramos usuario
				if(!user)
				{
					const defaultOrgaId = data_insert01.orgas[1].id;
					const defaultRole = 'user';

					//id se pasa vacío para que el datasource cree uno nuevo
					const userModel = new UserModel('', userToAuth.name, userToAuth.username, userToAuth.email, true, false);

					const newUser = await this.newUser(userModel);
					if(!newUser)
						return Either.left(new GenericFailure('No user added'));

					await this.newOrgaUser(defaultOrgaId, newUser._id, defaultRole);

					const orgas = await this.orgaDataSource.getOne({'_id':defaultOrgaId});
					if (orgas.currentItemCount > 0) {
						const orgasIdCode = [{id:orgas.items[0].id,code:orgas.items[0].code}];
						const modelContainer = await this.userDataSource.update(newUser.id, {orgas:orgasIdCode});
						if(modelContainer.currentItemCount > 0)
						{
							newUser.orgas = modelContainer.items[0].orgas;
						}
					}				

					userAuth = {id: newUser.id, name: newUser.name, 
						username: newUser.username, email: newUser.email, enabled: newUser.enabled, builtIn: newUser.builtIn, created: newUser.created, orgas: newUser.orgas, updated: newUser.updated, deleted: newUser.deleted, expires: newUser.expires};
				}
				else
					userAuth = {id: user.id, name: user.name, 
						username: user.username, email: user.email, enabled: user.enabled, builtIn: user.builtIn, created: user.created, orgas: user.orgas, updated: user.updated, deleted: user.deleted, expires: user.expires};

				//busca las orgas que coincidan con los id que están en el array de organizaciones de usuario.
				const orgas = await this.findUserOrgas(userAuth.orgas);

				//si el auth especifica orgaId y está contenida en las organizaciones asociadas al usuario entonces:
				const orgaId = this.resolveSpecificOrga(orgas, undefined);

				//lista de roles del usuario en la organización seleccionada
				//si la organización no está especificada entonces retorna undefined para los roles
				const rolesString = await this.findRoles(userAuth.id, orgaId);

				//nuevo token con el payload que se especifica.
				const newToken = generateJWT({userId:userAuth.id, orgaId: orgaId, roles: rolesString}, 'lomba', 60*60);

				//objeto que finalmente se retorna en el endpoint de autenticación y autorización.
				const tokenModel = new TokenModel(newToken, orgaId ? orgaId : '', orgas, false);
				return Either.right(ModelContainer.fromOneItem(tokenModel));


			}catch(e)
			{
				return Either.left(new GenericFailure('No valid google token'));
			}
			
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	private async findUser(username:string, email:string):Promise<UserModel | undefined> {
		const userQuery = { '$and':[{'$or': [{username: username}, {email: email}]}, {enabled: true}] };

		const userResult = await this.userDataSource.getMany(userQuery);
		if(userResult.currentItemCount < 1)
		{
			//si no lo encuentra retorna falla
			return undefined;
		}
		//tenemos el usuario
		return userResult.items[0];
	}
	private async findPassword(userId:string, password:string):Promise<PasswordModel | undefined> {
		//buscamos una o más password habilitadas para el usuario
		//Luego a partir del hash y salt sabemos de alguna coincidencia
		const passQuery = { userId: userId, enabled:true};
		const passResult = await this.passwordDataSource.getMany(passQuery);
		if(passResult.currentItemCount < 1)
			return undefined;
		else
		{
			let passwordModelToReturn:PasswordModel|undefined = undefined;

			passResult.items.forEach(pm => {
				//convierte password en hashsalt
				const passHashed = HashPassword.createHash(password, pm.salt);
				//ya convertido compara con las registradas
				if(pm.hash == passHashed.hash)
					passwordModelToReturn = pm;
			});
			return passwordModelToReturn;
		}
	}
	private async findUserOrgas(orgas?:{id:string,code:string}[]):Promise<OrgaModel[]>
	{
		if(!orgas || orgas.length == 0)
			return [];

		const arrayIdOrgaUser = orgas.map(a => a.id);
		const orgaResult = await this.orgaDataSource.getMany({id: {'$in': arrayIdOrgaUser }});
		//tenemos las orgas
		return orgaResult.items;
	}
	private resolveSpecificOrga(orgas:OrgaModel[], orgaId?:string):string | undefined
	{
		//si especifica orgaId y está contenida en las organizaciones asociadas al usuario entonces:
		if(orgaId != undefined && orgas.find(o=> o._id == orgaId))
		{
			//se confirma que el orgaId es el especificado. La asignación es redundante.
			return orgas.find(o=> o._id = (orgaId == undefined) ? '' : orgaId)?._id;
		} else if (!orgaId)
		{
			//si el auth no especifica orgaId, pero el usuario tiene sólo una organización, pues entonces se le asigna esa organización al auth.
			if(orgas.length == 1)
				return orgas[0]._id;
			//en caso contrario el orgaId de auth queda indefinido y el token no especificará orgaId.
		}
		return undefined;
	}

	private async findRoles(userId:string, orgaId:string | undefined): Promise<string | undefined> {
		if(orgaId)
		{
			//conseguir el orgauser para sacar los roles
			const orgaUserResult = await this.orgaUserDataSource.getMany({userId:userId, orgaId:orgaId});
			//una vez encontrada la relación de orgas con usuario entonces recogemos los roles
			if(orgaUserResult.currentItemCount > 0 && orgaUserResult.items[0].roles.length > 0)
			{
				//se trabaja con el item cero porque se asume
				//que solo es posible una asociacion de user con orga
				//lista de roles separados por coma que irán en el token.
				return orgaUserResult.items[0].roles.map(r=> r.name).join(','); 
			}
		}
		else return undefined;
	}
	private async newUser(user:UserModel):Promise<UserModel | undefined>
	{
		const resultUser = await this.userDataSource.add(user);
		if(resultUser.currentItemCount < 1)
			return undefined;
		else
			return resultUser.items[0];
	}
	private async newPassword(userId:string, password:string):Promise<PasswordModel | undefined>
	{
		const passHashed = HashPassword.createHash(password);
		const newPassword = new PasswordModel(userId, passHashed.hash, passHashed.salt, true, false);

		const resultPassword = await this.passwordDataSource.add(newPassword);
		if(resultPassword.currentItemCount < 1)
			return undefined;
		else
			return resultPassword.items[0];
	}

	private async newOrgaUser(orgaId:string, userId:string, roles:string):Promise<OrgaUserModel | undefined>{
		const arrRoles = roles.split(',').map(r => new RoleModel(r, true).toEntity());
		const newOrgaUser = new OrgaUserModel(orgaId, userId, arrRoles, true, false);

		const resultOrgaUser = await this.orgaUserDataSource.add(newOrgaUser);
		if(resultOrgaUser.currentItemCount < 1)
			return undefined;
		else
			return resultOrgaUser.items[0];
	}
}