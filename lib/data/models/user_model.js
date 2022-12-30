"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
class UserModel {
    constructor(id, name, username, email, enabled, builtin) {
        this.id = id;
        this._id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.enabled = enabled;
        this.builtin = builtin;
        this.created = new Date();
    }
    toEntity() {
        return { id: this.id, name: this.name,
            username: this.username, email: this.email };
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=user_model.js.map