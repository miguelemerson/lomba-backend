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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongo_wrapper_1 = require("./core/wrappers/mongo_wrapper");
const user_data_source_1 = require("./data/datasources/user_data_source");
const user_repository_impl_1 = require("./data/repositories/user_repository_impl");
const get_user_1 = require("./domain/usecases/users/get_user");
const user_router_1 = __importDefault(require("./presentation/user_router"));
const get_users_by_orga_1 = require("./domain/usecases/users/get_users_by_orga");
const add_user_1 = require("./domain/usecases/users/add_user");
const update_user_1 = require("./domain/usecases/users/update_user");
const enable_user_1 = require("./domain/usecases/users/enable_user");
const delete_user_1 = require("./domain/usecases/users/delete_user");
const server_1 = __importDefault(require("./server"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const uri = 'mongodb+srv://lomba:LVMVSDHqLWunzzdv@cluster0.j0aztjy.mongodb.net/?retryWrites=true&w=majority';
    const client = new mongodb_1.MongoClient(uri, { serverApi: mongodb_1.ServerApiVersion.v1 });
    yield client.connect();
    const db = client.db('LOGIN_DB');
    ///Usuarios
    const userMongo = new mongo_wrapper_1.MongoWrapper('users', db);
    const userDataSource = new user_data_source_1.UserDataSourceImpl(userMongo);
    const userRepo = new user_repository_impl_1.UserRepositoryImpl(userDataSource);
    const userMiddleWare = (0, user_router_1.default)(new get_user_1.GetUser(userRepo), new get_users_by_orga_1.GetUsersByOrgaId(userRepo), new add_user_1.AddUser(userRepo), new update_user_1.UpdateUser(userRepo), new enable_user_1.EnableUser(userRepo), new delete_user_1.DeleteUser(userRepo));
    server_1.default.use('api/v1/user', userMiddleWare);
    ///Fin usuarios
    server_1.default.listen(4000, () => console.log('Running on http://localhost:4000'));
}))();
//# sourceMappingURL=main.js.map