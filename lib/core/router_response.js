"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResponse = exports.ErrorItem = exports.ErrorResponse = exports.RouterResponse = void 0;
const database_exception_1 = require("./errors/database_exception");
const network_exception_1 = require("./errors/network_exception");
const contains_many_1 = require("./contains_many");
const crypto_1 = __importDefault(require("crypto"));
class RouterResponse {
    constructor(apiVersion, response, method, params, context) {
        this.apiVersion = apiVersion;
        this.method = method;
        this.params = params;
        this.context = context;
        this.id = crypto_1.default.randomUUID();
        this._id = this.id;
        setDataError(response, this);
    }
}
exports.RouterResponse = RouterResponse;
function setDataError(response, routerResponse) {
    var _a, _b, _c;
    if (response instanceof database_exception_1.DatabaseException) {
        routerResponse.data = undefined;
        routerResponse.error = new ErrorResponse(response.code, response.message);
        if (response.mongoError != null) {
            routerResponse.error.addErrorItem({
                domain: (_a = response.mongoError.code) === null || _a === void 0 ? void 0 : _a.toString(),
                reason: (_b = response.mongoError.cause) === null || _b === void 0 ? void 0 : _b.message,
                message: response.mongoError.message,
                location: response.mongoError.stack,
                extendedHelp: response.mongoError.errmsg
            });
            if (response.mongoError.cause != null) {
                routerResponse.error.addErrorItem({
                    domain: response.mongoError.cause.name,
                    reason: response.mongoError.cause.message,
                    location: response.mongoError.cause.stack
                });
            }
        }
    }
    else if (response instanceof network_exception_1.NetworkException) {
        routerResponse.data = undefined;
        routerResponse.error = new ErrorResponse(response.code, response.message);
        if (response.error != null) {
            routerResponse.error.addErrorItem({
                domain: (_c = response.code) === null || _c === void 0 ? void 0 : _c.toString(),
                message: response.message,
                location: response.error.stack,
            });
        }
    }
    else if (response instanceof Error) {
        routerResponse.data = undefined;
        routerResponse.error = new ErrorResponse(response.name, response.message);
    }
    else {
        routerResponse.error = undefined;
        if (response instanceof contains_many_1.ContainsMany) {
            routerResponse.data = {
                items: response.items,
                kind: typeof (response.items).toString(),
                currentItemCount: response.currentItemCount,
                itemsPerPage: response.itemsPerPage,
                startIndex: response.startIndex,
                totalItems: response.totalItems,
                pageIndex: response.pageIndex,
                totalPages: response.totalPages,
                updated: new Date(),
            };
        }
        else {
            routerResponse.data = {
                items: [response],
                kind: typeof response.toString(),
                currentItemCount: 1,
                updated: new Date()
            };
        }
    }
}
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