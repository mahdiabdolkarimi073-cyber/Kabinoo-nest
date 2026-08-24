"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class CatalogHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.catalog;
    }
    getName() {
        return "کاتالوگ";
    }
}
exports.default = CatalogHandler;
//# sourceMappingURL=catalog.js.map