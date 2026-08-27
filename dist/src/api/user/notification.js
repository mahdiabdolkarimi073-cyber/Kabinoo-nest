"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("../../core/request.handler");
class UserNotificationHandler extends request_handler_1.default {
    async GET() {
        const user = await this.getUser(true);
        const id = this.get("id");
        if (id) {
            return await prisma.userNotification.findFirst({
                where: {
                    id: id,
                    userId: user.id,
                },
            }) || this.throw("اطلاعیه یافت نشد");
        }
        return await prisma.userNotification.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }
    async PUT() {
        const user = await this.getUser(true);
        const id = this.get("id", "شناسه اطلاعیه وارد نشده است");
        const existing = await prisma.userNotification.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });
        if (!existing)
            this.throw("اطلاعیه یافت نشد");
        return await prisma.userNotification.update({
            where: { id: id },
            data: { read: true },
        });
    }
    async DELETE() {
        const user = await this.getUser(true);
        const id = this.get("id", "شناسه اطلاعیه وارد نشده است");
        const existing = await prisma.userNotification.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });
        if (!existing)
            this.throw("اطلاعیه یافت نشد");
        await prisma.userNotification.delete({
            where: { id: id },
        });
        return this.msg("اطلاعیه حذف شد");
    }
}
exports.default = UserNotificationHandler;
//# sourceMappingURL=notification.js.map