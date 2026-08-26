"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../../core/prisma.handler");
const sms_1 = require("../../../utils/sms");
const OrderStatusLabels = {
    PAYMENT: "در انتظار پرداخت",
    PENDING: "در حال آماده‌سازی",
    CANCELED: "لغو شده",
    COMPLETED: "تکمیل شده",
    PAUSED: "تعلیق",
    PAY_CHECK: "بررسی پرداخت",
    SENT: "ارسال شده",
};
class ShopManagerOrderHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.order;
    }
    getName() {
        return "سفارش";
    }
    async beforeEdit(fields) {
        if (fields.status) {
            const id = this.getTargetId();
            if (id) {
                const order = await prisma.order.findUnique({
                    where: { id: id },
                    select: { userId: true, code: true, status: true },
                });
                if (order && order.status !== fields.status) {
                    const label = OrderStatusLabels[fields.status] || fields.status;
                    (0, sms_1.notifyUserSMS)(order.userId, 'order-status', [
                        { name: 'code', value: String(order.code) },
                        { name: 'status', value: label },
                    ]).catch(console.error);
                }
            }
        }
        return fields;
    }
    filter(obj) {
        if (obj?.user?.phone) {
            obj.user.phone = obj.user.phone();
        }
        return obj;
    }
}
exports.default = ShopManagerOrderHandler;
//# sourceMappingURL=index.js.map