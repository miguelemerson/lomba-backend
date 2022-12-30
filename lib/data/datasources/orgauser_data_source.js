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
exports.OrgaUserDataSourceImpl = void 0;
class OrgaUserDataSourceImpl {
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
    add(orgaOrgaUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (orgaOrgaUser.id == undefined) {
                orgaOrgaUser.id = crypto.randomUUID();
                orgaOrgaUser._id = orgaOrgaUser.id;
            }
            if (yield this.collection.add(orgaOrgaUser)) {
                return this.getOne(orgaOrgaUser.id);
            }
            return null;
        });
    }
    update(id, orgaOrgaUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.collection.update(id, orgaOrgaUser)) {
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
exports.OrgaUserDataSourceImpl = OrgaUserDataSourceImpl;
//# sourceMappingURL=orgauser_data_source.js.map