"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class SupportChatHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.userChat;
    }
    getName() {
        return "مشاوره آنلاین";
    }
}
exports.default = SupportChatHandler;
//# sourceMappingURL=chat.js.map