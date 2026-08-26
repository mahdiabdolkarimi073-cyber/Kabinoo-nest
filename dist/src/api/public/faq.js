"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class PublicFaqHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.faq;
    }
    getName() {
        return "سوال متداول";
    }
    async POST() {
        return this.methodDeny();
    }
    async PUT() {
        return this.methodDeny();
    }
    async DELETE() {
        return this.methodDeny();
    }
}
exports.default = PublicFaqHandler;
//# sourceMappingURL=faq.js.map