import RequestHandler from "@/core/request.handler";
import { Post, Req, Res } from "@nestjs/common";
import { getPaymentLink, onPaymentSuccessful } from "@/core/payment/Payment";
import { notifyUserSMS } from "@/utils/sms";

export default class UserCheckHandler extends RequestHandler {

    @Post("pay")
    async pay(@Req() req: any, @Res() res: any) {
        return this.splitInstance(async function () {
            const user = await this.getUser(true);
            const checkId = Number(this.get("id") || this.json["id"]) || this.throw("شناسه چک وارد نشده است");

            const check = await prisma.paymentCheck.findUnique({
                where: { id: checkId },
                include: { order: true },
            }) || this.throw("چک یافت نشد");

            if (check.order.userId !== user.id) this.throw("این چک متعلق به شما نیست");
            if (check.status === "PAID") this.throw("این چک قبلا پرداخت شده است");
            if (check.status === "REJECTED") this.throw("این چک رد شده است");

            const payment = await prisma.payment.create({
                data: {
                    price: check.amount,
                    userId: user.id,
                    redirect: "/user/order/" + check.order.id,
                },
            });

            const link = await getPaymentLink(payment);

            onPaymentSuccessful(payment, async () => {
                await prisma.paymentCheck.update({
                    where: { id: checkId },
                    data: {
                        status: "PAID",
                        paymentId: payment.id,
                    },
                });
                await notifyUserSMS(user.id, 'check-paid', [
                    { name: 'code', value: String(check.order.code) },
                    { name: 'price', value: check.amount.toLocaleString('fa') },
                ]);
            });

            return { link, payment };
        }, req, res);
    }
}
