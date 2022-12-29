"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResponse = exports.ErrorItem = exports.ErrorResponse = exports.RouterResponse = void 0;
const database_exception_1 = require("./errors/database_exception");
const network_exception_1 = require("./errors/network_exception");
const contains_many_1 = require("./contains_many");
class RouterResponse {
    constructor(apiVersion, response, method, params, context) {
        var _a, _b, _c;
        this.apiVersion = apiVersion;
        this.method = method;
        this.params = params;
        this.context = context;
        this.id = this._id = crypto.randomUUID();
        if (response instanceof database_exception_1.DatabaseException) {
            this.data = undefined;
            this.error = new ErrorResponse(response.code, response.message);
            if (response.mongoError != null) {
                this.error.addErrorItem({ domain: (_a = response.mongoError.code) === null || _a === void 0 ? void 0 : _a.toString(),
                    reason: (_b = response.mongoError.cause) === null || _b === void 0 ? void 0 : _b.message,
                    message: response.mongoError.message,
                    location: response.mongoError.stack,
                    extendedHelp: response.mongoError.errmsg });
                if (response.mongoError.cause != null) {
                    this.error.addErrorItem({ domain: response.mongoError.cause.name,
                        reason: response.mongoError.cause.message,
                        location: response.mongoError.cause.stack });
                }
            }
        }
        else if (response instanceof network_exception_1.NetworkException) {
            this.data = undefined;
            this.error = new ErrorResponse(response.code, response.message);
            if (response.error != null) {
                this.error.addErrorItem({ domain: (_c = response.code) === null || _c === void 0 ? void 0 : _c.toString(),
                    message: response.message,
                    location: response.error.stack, });
            }
        }
        else if (response instanceof Error) {
            this.data = undefined;
            this.error = new ErrorResponse(response.name, response.message);
        }
        else {
            this.error = undefined;
            if (response instanceof contains_many_1.ContainsMany) {
                this.data = { items: response.items,
                    kind: typeof (response.items).toString(),
                    currentItemCount: response.currentItemCount,
                    itemsPerPage: response.itemsPerPage,
                    startIndex: response.startIndex,
                    totalItems: response.totalItems,
                    pageIndex: response.pageIndex,
                    totalPages: response.totalPages,
                };
            }
            else {
                this.data = { items: [response],
                    kind: typeof response.toString(),
                    currentItemCount: 1 };
            }
        }
    }
}
exports.RouterResponse = RouterResponse;
class ErrorResponse {
    constructor(code, message, error) {
        this.code = code;
        this.message = message;
        if (error != null)
            this.errors = [error];
    }
    addErrorItem(error) {
        if (this.errors == null)
            this.errors = [];
        this.errors.push(error);
    }
}
exports.ErrorResponse = ErrorResponse;
class ErrorItem {
}
exports.ErrorItem = ErrorItem;
class DataResponse {
}
exports.DataResponse = DataResponse;
//# sourceMappingURL=router_response.js.map