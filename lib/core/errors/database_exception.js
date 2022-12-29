"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseException = void 0;
class DatabaseException {
    constructor(name, message, code, error) {
        this.name = name;
        this.message = message;
        this.code = code;
        this.mongoError = error;
    }
}
exports.DatabaseException = DatabaseException;
//# sourceMappingURL=database_exception.js.map