"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_limited_handler_1 = require("../../core/prisma.limited.handler");
class UserContractHandler extends prisma_limited_handler_1.default {
    async additionalPayload() {
        return {
            userId: (await this.getUser()).id
        };
    }
    getModel() {
        return prisma.contract;
    }
    getName() {
        return "قرارداد";
    }
    async GET() {
        const user = await this.getUser(true);
        const id = this.getTargetId();
        if (id) {
            return await prisma.contract.findFirst({
                where: {
                    id: id,
                    userId: user.id,
                },
            }) || this.throw("قرارداد یافت نشد");
        }
        return await prisma.contract.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }
}
exports.default = UserContractHandler;
//# sourceMappingURL=contract.js.map