"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class AdminAnnouncementHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.announcement;
    }
    getName() {
        return "اعلان";
    }
    async additionalPayload() {
        const user = await this.getUser();
        return {
            authorId: user?.id,
        };
    }
    canCreate() {
        return true;
    }
    canEdit() {
        return true;
    }
}
exports.default = AdminAnnouncementHandler;
//# sourceMappingURL=announcement.js.map