"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordModel = void 0;
class PasswordModel {
    constructor(userId, hash, salt, enabled, createdAt) {
        this.userId = userId;
        this.hash = hash;
        this.salt = salt;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }
}
exports.PasswordModel = PasswordModel;
//# sourceMappingURL=password_model.js.map