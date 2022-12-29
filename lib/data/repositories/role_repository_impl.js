"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleReposutoryImpl = void 0;
class RoleReposutoryImpl {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dataSource.getRoles();
            const roles = [];
            if (result != null && result.length > 0) {
                result.forEach(element => {
                    roles.push(element);
                });
            }
            return roles;
        });
    }
    getRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dataSource.getRole(name);
            return result;
        });
    }
    enableRole(name, enableOrDisable) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dataSource.enableRole(name, enableOrDisable);
            return result;
        });
    }
}
exports.RoleReposutoryImpl = RoleReposutoryImpl;
//# sourceMappingURL=role_repository_impl.js.map