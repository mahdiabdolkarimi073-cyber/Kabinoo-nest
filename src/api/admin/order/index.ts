import PrismaFullHandler from "@/core/prisma.handler";
import { notifyUserSMS } from "@/utils/sms";

const OrderStatusLabels: Record<string, string> = {
    PAYMENT: "در انتظار پرداخت",
    PENDING: "در حال آماده‌سازی",
    CANCELED: "لغو شده",
    COMPLETED: "تکمیل شده",
    PAUSED: "تعلیق",
    PAY_CHECK: "بررسی پرداخت",
    SENT: "ارسال شده",
};

export default class AdminOrderHandler extends PrismaFullHandler {

    getModel() {
        return prisma.order;
    }

    getName() {
        return "سفارش"
    }

    async beforeEdit(fields: any) {
        if (fields.status) {
            const id = this.getTargetId();
            if (id) {
                const order = await prisma.order.findUnique({
                    where: { id: id as string },
                    select: { userId: true, code: true, status: true },
                });
                if (order && order.status !== fields.status) {
                    const label = OrderStatusLabels[fields.status] || fields.status;
                    notifyUserSMS(order.userId, 'order-status', [
                        { name: 'code', value: String(order.code) },
                        { name: 'status', value: label },
                    ]).catch(console.error);
                }
            }
        }
        return fields;
    }

    filter(obj: any) {
        if (obj?.user?.phone) {
            obj.user.phone = obj.user.phone() as any;
        }
        return obj;
    }

}