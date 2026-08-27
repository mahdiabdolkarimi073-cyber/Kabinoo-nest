"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class PublicCounselingHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.userCounseling;
    }
    async additionalPayload() {
        if (this.get('phone') && isNaN(+this.get('phone')))
            return this.throw("شماره تلفن معتبر نیست");
        const user = await this.getUser();
        return {
            userId: user?.id,
        };
    }
    getName() {
        return "درخواست مشاوره";
    }
    async DELETE() {
        return this.methodDeny();
    }
    async GET() {
        return this.msg("");
    }
    async PUT() {
        return this.methodDeny();
    }
}
exports.default = PublicCounselingHandler;
//# sourceMappingURL=counseling.js.map