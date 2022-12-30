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
exports.PasswordDataSourceImpl = void 0;
class PasswordDataSourceImpl {
    constructor(dbMongo) {
        this.collection = dbMongo;
    }
    getMany(query, sort, pageIndex, itemsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.getMany(query, sort, pageIndex, itemsPerPage);
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.getOne(id);
        });
    }
    add(password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (password.id == undefined) {
                password.id = crypto.randomUUID();
                password._id = password.id;
            }
            if (yield this.collection.add(password)) {
                return this.getOne(password.id);
            }
            return null;
        });
    }
    update(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.collection.update(id, password)) {
                return this.getOne(id);
            }
            return null;
        });
    }
    enable(id, enableOrDisable) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.enable(id, enableOrDisable);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.delete(id);
        });
    }
}
exports.PasswordDataSourceImpl = PasswordDataSourceImpl;
//# sourceMappingURL=password_data_source.js.map