"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class ContractManagerOrderHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.order;
    }
    getName() {
        return "سفارش";
    }
    filter(obj) {
        if (obj?.user?.phone) {
            obj.user.phone = obj.user.phone();
        }
        return obj;
    }
}
exports.default = ContractManagerOrderHandler;
//# sourceMappingURL=order.js.map