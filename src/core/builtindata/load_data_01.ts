import { OrgaDataSource } from '../../data/datasources/orga_data_source';
import { OrgaUserDataSource } from '../../data/datasources/orgauser_data_source';
import { PasswordDataSource } from '../../data/datasources/password_data_source';
import { RoleDataSource } from '../../data/datasources/role_data_source';
import { UserDataSource } from '../../data/datasources/user_data_source';
import { OrgaModel } from '../../data/models/orga_model';
import { OrgaUserModel } from '../../data/models/orgauser_model';
import { PasswordModel } from '../../data/models/password_model';
import { RoleModel } from '../../data/models/role_model';
import { UserModel } from '../../data/models/user_model';
import { HashPassword } from '../password_hash';

export const checkData01 = async (roleSource: RoleDataSource, userSource: UserDataSource, passSource: PasswordDataSource, orgaSource: OrgaDataSource, orgaUserSource: OrgaUserDataSource) => {
	
	//roles
	data_insert01.roles.forEach(async role => {
		const result = await roleSource.getOne({'name':role.name});
		if(result.currentItemCount < 1)
		{
			await roleSource.add(new RoleModel(role.name, role.enabled));
		}
	});

	//usuarios y password
	data_insert01.users.forEach(async user => {
		const result = await userSource.getOne({'_id':user.id});
		if(result.currentItemCount < 1)
		{
			//filtra los orgauser del usuario y se queda solo con el orgaId
			const orgasu = data_insert01.orgausers.filter(ou=> ou.userId == user.id).map(o => o.orgaId);

			//luego obtiene todos los {id, code} de orgas solo de las
			//orgas cargadas previamente en orgasu (arriba)
			const orgasidcodes = data_insert01.orgas.filter(o=> orgasu.includes(o.id)).map(co => {return {id:co.id, code:co.code};});

			const newUser = new UserModel(user.id, user.name, user.username, user.email, user.enabled, user.builtin);

			//consigue el nuevo usuario insertado para modificarlo
			const insertedUser = await userSource.add(newUser);

			//actualiza el campo de orgas del usuario con {id, code}
			await userSource.update(insertedUser.items[0].id, {orgas:orgasidcodes});
			
			await passSource.delete(user.id);
			const hashPass = HashPassword.createHash(user.password);
			await passSource.add(new PasswordModel(user.id, hashPass.hash, hashPass.salt, true, user.builtin));
		}
	});
	
	//organizaciones
	data_insert01.orgas.forEach(async orga => {
		const result = await orgaSource.getOne({'_id':orga.id});
		if(result.currentItemCount < 1)
		{
			await orgaSource.add(orga as OrgaModel);
		}
	});

	//orgauser relación de organizaciones con usuarios
	data_insert01.orgausers.forEach(async orgaUser => {
		const result = await orgaUserSource.getOne({'_id':orgaUser.id});
		if(result.currentItemCount < 1)
		{
			const ou = new OrgaUserModel(orgaUser.orgaId, orgaUser.userId, orgaUser.roles.map(r=> new RoleModel(r, true).toEntity()), true, orgaUser.builtin);
			ou.id = orgaUser.id;
			ou._id = orgaUser.id;
			await orgaUserSource.add(ou);
		}
	});

};

export const data_insert01 = {
	roles:[
		{name : 'super','enabled':true},
		{name : 'admin','enabled':true},
		{name : 'reviewer','enabled':true},
		{name : 'user','enabled':true},
		{name : 'anonymous','enabled':true}
	],
	users:[
		{id:'00000001-0001-0001-0001-000000000001', name:'Súper', username:'super', email:'super@mp.com', builtin:true, 'enabled':true, password: '1234'},
		{id:'00000002-0002-0002-0002-000000000002', name:'Admin', username:'admin', email:'admin@mp.com', builtin:true, 'enabled':true, password: '1234'},
		{id:'00000003-0003-0003-0003-000000000003', name:'Reviewer 1', username:'rev1', email:'rev1@mp.com', builtin:false, 'enabled':true, password: '1234'},
		{id:'00000004-0004-0004-0004-000000000004', name:'Reviewer 2', username:'rev2', email:'rev2@mp.com', builtin:false, 'enabled':false, password: '1234'},        
		{id:'00000005-0005-0005-0005-000000000005', name:'User 1', username:'user1', email:'user1@mp.com', builtin:false, 'enabled':true, password: '1234'},
		{id:'00000006-0006-0006-0006-000000000006', name:'User 2', username:'user2', email:'user2@mp.com', builtin:false, 'enabled':true, password: '1234'},
		{id:'00000007-0007-0007-0007-000000000007', name:'User 3', username:'user3', email:'user3@mp.com', builtin:false, 'enabled':false, password: '1234'}
	],
	orgas:[
		{id:'00000100-0100-0100-0100-000000000100', name:'System', code:'sys', builtin:true, 'enabled':true},
		{id:'00000200-0200-0200-0200-000000000200', name:'Default', code:'def', builtin:true, 'enabled':true}
	],
	orgausers: [
		{id:'A0000001-0000-0000-1000-000000000000', orgaId:'00000100-0100-0100-0100-000000000100', userId:'00000001-0001-0001-0001-000000000001', roles:['super'], builtin:true},
		{id:'A0000002-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000002-0002-0002-0002-000000000002', roles:['admin'], builtin:true},
		{id:'A0000003-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000003-0003-0003-0003-000000000003', roles:['reviewer'], builtin:false},
		{id:'A0000004-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000004-0004-0004-0004-000000000004', roles:['reviewer'], builtin:false},
		{id:'A0000005-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000005-0005-0005-0005-000000000005', roles:['user'], builtin:false},
		{id:'A0000006-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000006-0006-0006-0006-000000000006', roles:['user'], builtin:false},
		{id:'A0000007-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000007-0007-0007-0007-000000000007', roles:['user'], builtin:false}
	]
};