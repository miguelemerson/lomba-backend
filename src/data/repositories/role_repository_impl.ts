import { Role } from '../../domain/entities/role';
import { RoleRepository } from '../../domain/repositories/role_repository';
import { RoleDataSource } from '../datasources/role_data_source';

export class RoleReposutoryImpl implements RoleRepository {
	dataSource: RoleDataSource;
	constructor(dataSource: RoleDataSource){
		this.dataSource = dataSource;
	}

	async getRoles(): Promise<Role[]>{
		const result = await this.dataSource.getRoles();
		const roles: Role[] = [];
		if(result != null && result.length > 0)
		{
			result.forEach(element => {
				roles.push(element);
			});
		}
		return roles;
	}
	async getRole(name: string): Promise<Role>{
		const result = await this.dataSource.getRole(name);
		return result;
	}
	async enableRole(name: string, enableOrDisable: boolean): Promise<boolean> {
		const result = await this.dataSource.enableRole(name, enableOrDisable);
		return result;
	}
}