"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class SupportUsersHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.user;
    }
    getName() {
        return "کاربر ";
    }
    filter(obj) {
        obj.phone = obj.phone();
        return obj;
    }
    async beforeEdit(fields) {
        delete fields.isAdmin;
        delete fields.isShopManager;
        delete fields.isSupport;
        delete fields.isAuthor;
        delete fields.refCode;
        delete fields.token;
        return fields;
    }
}
exports.default = SupportUsersHandler;
//# sourceMappingURL=users.js.map