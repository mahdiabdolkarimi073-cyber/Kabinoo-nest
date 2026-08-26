"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("../../core/request.handler");
class PublicAnnouncementHandler extends request_handler_1.default {
    async GET() {
        return prisma.announcement.findMany({
            orderBy: { created_at: "desc" },
        });
    }
}
exports.default = PublicAnnouncementHandler;
//# sourceMappingURL=announcement.js.map