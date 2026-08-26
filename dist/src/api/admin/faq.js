"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class AdminFaqHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.faq;
    }
    getName() {
        return "سوال متداول";
    }
}
exports.default = AdminFaqHandler;
//# sourceMappingURL=faq.js.map