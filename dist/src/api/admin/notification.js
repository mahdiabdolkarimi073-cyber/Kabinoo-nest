"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class AdminNotificationHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.userNotification;
    }
    getName() {
        return "اطلاعیه";
    }
    isFullAccess() {
        return true;
    }
    async additionalPayload() {
        return {};
    }
    filter(obj) {
        return obj;
    }
}
exports.default = AdminNotificationHandler;
//# sourceMappingURL=notification.js.map