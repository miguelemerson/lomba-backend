"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainsMany = void 0;
class ContainsMany {
    constructor(items) {
        this.items = items;
        this.currentItemCount = items.length;
    }
    static fromOneItem(item) {
        return new ContainsMany([item]);
    }
}
exports.ContainsMany = ContainsMany;
//# sourceMappingURL=contains_many.js.map