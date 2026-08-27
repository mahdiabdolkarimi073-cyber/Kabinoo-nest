"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_limited_handler_1 = require("../../core/prisma.limited.handler");
class UserContractFileHandler extends prisma_limited_handler_1.default {
    getModel() {
        return prisma.userFile;
    }
    getName() {
        return "فایل";
    }
    async GET() {
        const user = await this.getUser(true);
        const id = this.getTargetId();
        if (id) {
            return await prisma.userFile.findFirst({
                where: {
                    id: id,
                    userId: user.id,
                },
            }) || this.throw("فایل یافت نشد");
        }
        return await prisma.userFile.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }
}
exports.default = UserContractFileHandler;
//# sourceMappingURL=contractFile.js.map