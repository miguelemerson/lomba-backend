"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordModel = void 0;
class PasswordModel {
    constructor(userId, hash, salt, enabled, builtin) {
        this.id = crypto.randomUUID();
        this._id = this.id;
        this.userId = userId;
        this.hash = hash;
        this.salt = salt;
        this.enabled = enabled;
        this.builtin = builtin;
        this.created = new Date();
    }
}
exports.PasswordModel = PasswordModel;
//# sourceMappingURL=password_model.js.map