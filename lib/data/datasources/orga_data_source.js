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
exports.OrgaDataSourceImpl = void 0;
class OrgaDataSourceImpl {
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
    add(orga) {
        return __awaiter(this, void 0, void 0, function* () {
            if (orga.id == undefined) {
                orga.id = crypto.randomUUID();
                orga._id = orga.id;
            }
            if (yield this.collection.add(orga)) {
                return this.getOne(orga.id);
            }
            return null;
        });
    }
    update(id, orga) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.collection.update(id, orga)) {
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
exports.OrgaDataSourceImpl = OrgaDataSourceImpl;
//# sourceMappingURL=orga_data_source.js.map