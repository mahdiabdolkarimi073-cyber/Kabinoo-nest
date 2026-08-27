"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class AdminUsersHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.user;
    }
    getName() {
        return "کاربر ";
    }
}
exports.default = AdminUsersHandler;
//# sourceMappingURL=users.js.map