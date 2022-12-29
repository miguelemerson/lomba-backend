"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgaModel = void 0;
class OrgaModel {
    constructor(id, name, code, enabled, builtin) {
        this.id = id;
        this._id = id;
        this.name = name;
        this.code = code;
        this.enabled = enabled;
        this.builtin = builtin;
        this.created = new Date();
    }
}
exports.OrgaModel = OrgaModel;
//# sourceMappingURL=orga_model.js.map