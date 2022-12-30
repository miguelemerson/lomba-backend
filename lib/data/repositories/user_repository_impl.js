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
exports.UserRepositoryImpl = void 0;
const mongodb_1 = require("mongodb");
const user_model_1 = require("../models/user_model");
const database_exception_1 = require("../../core/errors/database_exception");
const network_exception_1 = require("../../core/errors/network_exception");
class UserRepositoryImpl {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    getUsersByOrgaId(orgaId, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dataSource
                    .getMany({ 'orgas.id': orgaId }, sort);
                return result;
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoError) {
                    throw new database_exception_1.DatabaseException(error.name, error.message, error.code, error);
                }
                else if (error instanceof Error)
                    throw new network_exception_1.NetworkException(error.name, error.message, undefined, error);
            }
            return null;
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dataSource.getOne(id);
                return result;
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoError) {
                    throw new database_exception_1.DatabaseException(error.name, error.message, error.code, error);
                }
                else if (error instanceof Error)
                    throw new network_exception_1.NetworkException(error.name, error.message, undefined, error);
            }
            return null;
        });
    }
    addUser(id, name, username, email, enabled, builtIn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_model_1.UserModel(id, name, username, email, enabled, builtIn);
                const result = this.dataSource.add(user);
                return result;
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoError) {
                    throw new database_exception_1.DatabaseException(error.name, error.message, error.code, error);
                }
                else if (error instanceof Error)
                    throw new network_exception_1.NetworkException(error.name, error.message, undefined, error);
            }
            return null;
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.dataSource.update(id, user);
                return result;
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoError) {
                    throw new database_exception_1.DatabaseException(error.name, error.message, error.code, error);
                }
                else if (error instanceof Error)
                    throw new network_exception_1.NetworkException(error.name, error.message, undefined, error);
            }
            return null;
        });
    }
    enableUser(id, enableOrDisable) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.dataSource.enable(id, enableOrDisable);
                return result;
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoError) {
                    throw new database_exception_1.DatabaseException(error.name, error.message, error.code, error);
                }
                else if (error instanceof Error)
                    throw new network_exception_1.NetworkException(error.name, error.message, undefined, error);
            }
            return false;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.dataSource.delete(id);
                return result;
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoError) {
                    throw new database_exception_1.DatabaseException(error.name, error.message, error.code, error);
                }
                else if (error instanceof Error)
                    throw new network_exception_1.NetworkException(error.name, error.message, undefined, error);
            }
            return false;
        });
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
//# sourceMappingURL=user_repository_impl.js.map