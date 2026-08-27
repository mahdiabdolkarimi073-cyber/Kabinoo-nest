"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class AdminChatHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.userChat;
    }
    getName() {
        return "مشاوره آنلاین";
    }
}
exports.default = AdminChatHandler;
//# sourceMappingURL=chat.js.map