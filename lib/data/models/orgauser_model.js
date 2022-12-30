"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgaUserModel = void 0;
class OrgaUserModel {
    constructor(orgaId, userId, roles, enabled, builtin) {
        this.id = crypto.randomUUID();
        this._id = this.id;
        this.orgaId = orgaId;
        this.userId = userId;
        this.roles = roles;
        this.enabled = enabled;
        this.builtin = builtin;
        this.created = new Date();
    }
}
exports.OrgaUserModel = OrgaUserModel;
//# sourceMappingURL=orgauser_model.js.map