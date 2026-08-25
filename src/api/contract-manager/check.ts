import RequestHandler from "@/core/request.handler";
import { Put } from "@nestjs/common";
import { notifyUserSMS } from "@/utils/sms";

export default class ContractManagerCheckHandler extends RequestHandler {
    @Put()
    async update() {
        const id = Number(this.json.id);
        const status = this.json.status === "APPROVED" || this.json.status === "REJECTED"
            ? this.json.status
            : this.throw("وضعیت چک نامعتبر است");

        const check = await prisma.paymentCheck.findUnique({
            where: { id },
            include: { order: { select: { userId: true, code: true } } },
        });
        if (!check) this.throw("چک یافت نشد");

        await prisma.paymentCheck.update({
            where: { id },
            data: {
                status,
                adminNote: typeof this.json.adminNote === "string" ? this.json.adminNote.trim() || null : undefined,
            },
        });

        if (check.order?.userId) {
            await notifyUserSMS(check.order.userId, 'order-status', [
                { name: 'code', value: String(check.order.code) },
                { name: 'status', value: status === "APPROVED" ? "تایید چک" : "رد چک" },
            ]);
        }

        return this.msg(status === "APPROVED" ? "چک تایید شد" : "چک رد شد");
    }
}
