"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkException = void 0;
class NetworkException {
    constructor(name, message, code, error) {
        this.name = name;
        this.message = message;
        this.code = code;
        this.error = error;
    }
}
exports.NetworkException = NetworkException;
//# sourceMappingURL=network_exception.js.map