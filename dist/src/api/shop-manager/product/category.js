"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../../core/prisma.handler");
class ShopManagerCategoryHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.category;
    }
    getName() {
        return "دسته بندی";
    }
}
exports.default = ShopManagerCategoryHandler;
//# sourceMappingURL=category.js.map