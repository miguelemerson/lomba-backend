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
exports.MongoWrapper = void 0;
const model_container_1 = require("../model_container");
class MongoWrapper {
    constructor(collectionName, dbMongo) {
        this.collectionName = collectionName;
        this.db = dbMongo;
    }
    runQuery(pageIndex, totalItems, query, sort, result, itemsPerPage, startIndex, totalPages) {
        return __awaiter(this, void 0, void 0, function* () {
            totalItems = yield this.setTotalItems(pageIndex, totalItems, query);
            if (sort == null && pageIndex == null)
                result = yield this.runSimpleQuery(result, query);
            if (sort != null && pageIndex == null)
                result = yield this.runSorterQuery(result, query, sort);
            if (sort != null && pageIndex != null) {
                const limit = (itemsPerPage == null ? 10 : itemsPerPage);
                const skip = (pageIndex - 1) * limit;
                result = yield this.runFullQuery(result, query, sort, skip, limit);
                startIndex = ((pageIndex - 1) * limit) + 1;
                totalPages = parseInt(Math.round((totalItems == null ? 0 : totalPages) / limit).toString());
            }
            return { totalItems, result, startIndex, totalPages };
        });
    }
    runFullQuery(result, query, sort, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            result = yield this.db.collection(this.collectionName)
                .find(query).sort(sort).skip(skip).limit(limit).toArray();
            return result;
        });
    }
    runSorterQuery(result, query, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            result = yield this.db.collection(this.collectionName)
                .find(query).sort(sort).toArray();
            return result;
        });
    }
    runSimpleQuery(result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            result = yield this.db.collection(this.collectionName)
                .find(query).toArray();
            return result;
        });
    }
    setTotalItems(pageIndex, totalItems, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (pageIndex != null) {
                totalItems = (yield this.db.collection(this.collectionName).count(query));
            }
            return totalItems;
        });
    }
    createModelContainer(result, itemsPerPage, pageIndex, startIndex, totalItems, totalPages) {
        const contains_many = new model_container_1.ModelContainer(result);
        contains_many.itemsPerPage = itemsPerPage;
        contains_many.pageIndex = pageIndex;
        contains_many.startIndex = (startIndex == 1 ? undefined : startIndex);
        contains_many.totalItems = totalItems;
        contains_many.totalPages = (totalPages == 0 ? undefined : totalPages);
        return contains_many;
    }
    getMany(query, sort, pageIndex, itemsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            let startIndex = 1;
            let totalPages = 0;
            let totalItems = undefined;
            ({ totalItems, result, startIndex, totalPages } =
                yield this.runQuery(pageIndex, totalItems, query, sort, result, itemsPerPage, startIndex, totalPages));
            if (result == null)
                return null;
            const contains_many = this.createModelContainer(result, itemsPerPage, pageIndex, startIndex, totalItems, totalPages);
            return contains_many;
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection(this.collectionName).findOne({ '_id': id });
            if (result == null)
                return result;
            return model_container_1.ModelContainer.fromOneItem(result);
        });
    }
    add(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection(this.collectionName).insertOne(obj);
            return ((result === null || result === void 0 ? void 0 : result.insertedId) ? true : false);
        });
    }
    update(id, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = obj;
            if (obj != null)
                params['updated'] = new Date();
            const result = yield this.db.collection(this.collectionName).updateOne({ _id: id }, { $set: params });
            return ((result === null || result === void 0 ? void 0 : result.modifiedCount) > 0 ? true : false);
        });
    }
    enable(id, enableOrDisable) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection(this.collectionName)
                .updateOne({ _id: id }, { $set: { enabled: enableOrDisable, updated: new Date() } });
            return ((result === null || result === void 0 ? void 0 : result.modifiedCount) > 0);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rn = yield this.update(id, { 'deleted': new Date() });
            if (rn) {
                const i = yield this.db.collection(this.collectionName).findOne({ '_id': id });
                if (i != null) {
                    yield this.db.collection(this.collectionName + '_deleted').insertOne(i);
                    const result = yield this.db.collection(this.collectionName).deleteOne({ _id: id });
                    return (result.deletedCount > 0);
                }
            }
            return false;
        });
    }
}
exports.MongoWrapper = MongoWrapper;
//# sourceMappingURL=mongo_wrapper.js.map