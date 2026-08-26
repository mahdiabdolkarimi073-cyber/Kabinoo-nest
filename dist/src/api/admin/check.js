"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class AdminCheckListHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.paymentCheck;
    }
    getName() {
        return "چک";
    }
    enablePagination() {
        return true;
    }
    async GET_findFirst(id) {
        const base = await super.GET_findFirst(id);
        if (!id) {
            base.include = {
                ...base.include,
                order: {
                    select: {
                        id: true,
                        code: true,
                        userId: true,
                        user: { select: { id: true, name: true, phone: true } },
                    },
                },
            };
        }
        return base;
    }
    filter(obj) {
        if (obj?.order?.user?.phone) {
            obj.order.user.phone = obj.order.user.phone();
        }
        return obj;
    }
}
exports.default = AdminCheckListHandler;
//# sourceMappingURL=check.js.map