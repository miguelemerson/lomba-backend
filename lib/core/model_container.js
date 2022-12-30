"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelContainer = void 0;
class ModelContainer {
    constructor(items) {
        this.items = items;
        this.currentItemCount = items.length;
    }
    static fromOneItem(item) {
        return new ModelContainer([item]);
    }
}
exports.ModelContainer = ModelContainer;
//# sourceMappingURL=model_container.js.map