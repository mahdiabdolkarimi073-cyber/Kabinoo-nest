"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class AdminAdviceHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.userAdvice;
    }
    getName() {
        return "درخواست تماس تلفنی";
    }
}
exports.default = AdminAdviceHandler;
//# sourceMappingURL=advice.js.map